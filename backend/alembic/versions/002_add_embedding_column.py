"""add embedding column

Revision ID: 002
Revises: 001
Create Date: 2023-11-18 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add embedding column to document table
    op.add_column('document', sa.Column('embedding', Vector(384), nullable=True))

def downgrade() -> None:
    # Remove embedding column from document table
    op.drop_column('document', 'embedding')