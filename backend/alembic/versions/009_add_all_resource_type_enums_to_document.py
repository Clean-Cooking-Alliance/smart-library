"""Add all resource type enums to Document

Revision ID: 009
Revises: 008
Create Date: 2025-01-16 14:54:54.282056

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '009'
down_revision = '008'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create the enum type with all values
    resource_type_enum = sa.Enum(
        'ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', 'JOURNEY_MAP', 'DISCUSSION_BRIEF', 'STORIES', 'WEBINAR', 
        'CASE_STUDY', 'FACTSHEET', 'COUNTRY_ACTION_PLAN', 'RESEARCH_REPORT', 'TOOLKIT', 'JOURNAL_ARTICLE', 
        'FIELD_RESEARCH', 'MARKET_ASSESSMENTS', 'PROGRESS_REPORT', 'PERSONA', 'STRATEGY_DOCUMENT', 'POLICY_BRIEF', 
        'BLOG', name='resourcetype'
    )
    resource_type_enum.create(op.get_bind(), checkfirst=True)

    # Alter the existing column to use the enum type
    op.alter_column('document', 'resource_type', type_=resource_type_enum, existing_nullable=True)

def downgrade() -> None:
    # Revert the column to a generic string type if needed
    op.alter_column('document', 'resource_type', type_=sa.String(), existing_nullable=True)

    # Drop the enum type
    resource_type_enum = sa.Enum(
        'ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', 'JOURNEY_MAP', 'DISCUSSION_BRIEF', 'STORIES', 'WEBINAR', 
        'CASE_STUDY', 'FACTSHEET', 'COUNTRY_ACTION_PLAN', 'RESEARCH_REPORT', 'TOOLKIT', 'JOURNAL_ARTICLE', 
        'FIELD_RESEARCH', 'MARKET_ASSESSMENTS', 'PROGRESS_REPORT', 'PERSONA', 'STRATEGY_DOCUMENT', 'POLICY_BRIEF', 
        'BLOG', name='resourcetype'
    )
    resource_type_enum.drop(op.get_bind(), checkfirst=True)
