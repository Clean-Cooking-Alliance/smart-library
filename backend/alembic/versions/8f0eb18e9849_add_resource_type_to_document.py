"""Add resource_type to Document

Revision ID: 8f0eb18e9849
Revises: add_embedding_column
Create Date: 2024-12-30 00:36:32.036099

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f0eb18e9849'
down_revision = 'add_embedding_column'
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