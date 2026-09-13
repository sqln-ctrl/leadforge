from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.user import User
from app.schemas.user import (
    EmailVerificationRequest,
    EmailVerificationResend,
    PasswordChange,
    UserCreate,
    UserProfileUpdate,
    UserResponse,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.services.email_verification import (
    EmailDeliveryError,
    create_verification_token,
    hash_verification_token,
    is_email_delivery_configured,
    send_verification_email,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    if not is_email_delivery_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email verification is not configured. Ask an administrator to configure SMTP.",
        )

    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    verification_token = create_verification_token()
    user = User(
        name=payload.name.strip(),
        email=payload.email,
        hashed_password=hash_password(payload.password),
        email_verified=False,
        email_verification_token_hash=hash_verification_token(verification_token),
        email_verification_expires_at=datetime.utcnow() + timedelta(hours=24),
    )

    db.add(user)
    db.flush()
    try:
        send_verification_email(user.email, verification_token)
    except EmailDeliveryError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We could not send a verification email. Please try again later.",
        )

    db.commit()
    db.refresh(user)

    return user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verify your email address before logging in.",
        )

    access_token = create_access_token(
    subject=str(user.id)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/verify-email")
def verify_email(
    payload: EmailVerificationRequest,
    db: Session = Depends(get_db),
):
    token_hash = hash_verification_token(payload.token)
    user = db.query(User).filter(User.email_verification_token_hash == token_hash).first()

    if not user or not user.email_verification_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link is invalid.",
        )

    if user.email_verification_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link has expired.",
        )

    user.email_verified = True
    user.email_verification_token_hash = None
    user.email_verification_expires_at = None
    db.commit()
    return {"message": "Email verified. You can now log in."}


@router.post("/resend-verification")
def resend_verification_email(
    payload: EmailVerificationResend,
    db: Session = Depends(get_db),
):
    if not is_email_delivery_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email verification is not configured. Ask an administrator to configure SMTP.",
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or user.email_verified:
        return {"message": "If that account needs verification, a new email has been sent."}

    verification_token = create_verification_token()
    user.email_verification_token_hash = hash_verification_token(verification_token)
    user.email_verification_expires_at = datetime.utcnow() + timedelta(hours=24)
    db.flush()
    try:
        send_verification_email(user.email, verification_token)
    except EmailDeliveryError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We could not send a verification email. Please try again later.",
        )

    db.commit()
    return {"message": "If that account needs verification, a new email has been sent."}

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == payload.email, User.id != current_user.id)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    current_user.name = payload.name.strip()
    current_user.email = payload.email
    db.commit()
    db.refresh(current_user)

    return current_user


@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_current_user_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Choose a new password different from your current password",
        )

    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
