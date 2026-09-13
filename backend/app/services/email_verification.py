import hashlib
import secrets
import smtplib
import ssl
from email.message import EmailMessage
from urllib.parse import quote

from app.core.config import settings


class EmailDeliveryError(Exception):
    """Raised when a verification email cannot be sent."""


def is_email_delivery_configured() -> bool:
    return bool(
        settings.SMTP_HOST
        and settings.SMTP_FROM_EMAIL
    )


def create_verification_token() -> str:
    return secrets.token_urlsafe(32)


def hash_verification_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def send_verification_email(recipient: str, token: str) -> None:
    if not is_email_delivery_configured():
        raise EmailDeliveryError("Email delivery is not configured")

    verification_url = (
        f"{settings.FRONTEND_URL.rstrip('/')}/verify-email?token={quote(token)}"
    )
    message = EmailMessage()
    message["Subject"] = "Verify your LeadForge email address"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = recipient
    message.set_content(
        "Welcome to LeadForge!\n\n"
        "Verify your email address to activate your account:\n"
        f"{verification_url}\n\n"
        "This link expires in 24 hours. If you did not create this account, you can ignore this email."
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            if settings.SMTP_USE_TLS:
                server.starttls(context=ssl.create_default_context())
            if settings.SMTP_USERNAME:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise EmailDeliveryError("Unable to send verification email") from exc
