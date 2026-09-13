"""add email verification to users

Revision ID: c1b5f71d2a43
Revises: bee8573a8cf8
Create Date: 2026-09-13
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c1b5f71d2a43"
down_revision: Union[str, Sequence[str], None] = "bee8573a8cf8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Existing accounts remain usable. New registrations use the false default.
    op.add_column(
        "users",
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.alter_column("users", "email_verified", server_default=sa.false())
    op.add_column(
        "users",
        sa.Column("email_verification_token_hash", sa.String(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("email_verification_expires_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "email_verification_expires_at")
    op.drop_column("users", "email_verification_token_hash")
    op.drop_column("users", "email_verified")
