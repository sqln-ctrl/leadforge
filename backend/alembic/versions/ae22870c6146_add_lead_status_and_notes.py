from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ae22870c6146"
down_revision = "6c0a670b0391"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create PostgreSQL enum type first
    lead_status = sa.Enum(
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "CLOSED",
        name="leadstatus",
    )

    lead_status.create(op.get_bind(), checkfirst=True)

    # Add status column
    op.add_column(
        "businesses",
        sa.Column(
            "status",
            lead_status,
            nullable=True,
        ),
    )

    # Existing businesses need a status
    op.execute(
        "UPDATE businesses SET status = 'NEW' WHERE status IS NULL"
    )

    # Make status required
    op.alter_column(
        "businesses",
        "status",
        nullable=False,
    )

    # Create notes table
    op.create_table(
        "notes",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "business_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "text",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["business_id"],
            ["businesses.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_notes_business_id",
        "notes",
        ["business_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_notes_business_id",
        table_name="notes",
    )

    op.drop_table("notes")

    op.drop_column("businesses", "status")

    sa.Enum(
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "CLOSED",
        name="leadstatus",
    ).drop(op.get_bind(), checkfirst=True)