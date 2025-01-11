"""Add resource_type to Document

Revision ID: 003
Revises: 002
Create Date: 2024-12-30 00:36:32.036099

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create the enum type
    resource_type_enum = sa.Enum('ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', name='resourcetype')
    resource_type_enum.create(op.get_bind())

    # Add the column using the enum type
    op.add_column('document', sa.Column('resource_type', resource_type_enum, nullable=True))


def downgrade() -> None:
    # Drop the column
    op.drop_column('document', 'resource_type')

    # Drop the enum type
    resource_type_enum = sa.Enum('ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', name='resourcetype')
    resource_type_enum.drop(op.get_bind())