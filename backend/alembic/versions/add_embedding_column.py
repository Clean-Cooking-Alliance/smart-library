"""add embedding column

Revision ID: add_embedding_column
Revises: initial_migration
Create Date: 2023-11-18 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_embedding_column'
down_revision = 'initial_migration'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add embedding column to document table
    op.add_column('document', sa.Column('embedding', sa.ARRAY(sa.Float()), nullable=True))

def downgrade() -> None:
    # Remove embedding column from document table
    op.drop_column('document', 'embedding')