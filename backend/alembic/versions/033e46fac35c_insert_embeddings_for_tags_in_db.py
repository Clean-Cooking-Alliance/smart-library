"""Insert embeddings for tags in db

Revision ID: 033e46fac35c
Revises: bdc2e161d9af
Create Date: 2025-01-08 19:50:53.959308

"""
from alembic import op
import sqlalchemy as sa
import pgvector

# revision identifiers, used by Alembic.
revision = '033e46fac35c'
down_revision = 'bdc2e161d9af'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tag', sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tag', 'embedding')
    # ### end Alembic commands ###