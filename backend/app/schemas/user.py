from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    email_verified: bool


    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)


class EmailVerificationRequest(BaseModel):
    token: str = Field(min_length=20, max_length=512)


class EmailVerificationResend(BaseModel):
    email: EmailStr
