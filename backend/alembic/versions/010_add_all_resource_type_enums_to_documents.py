"""Add all resource type enums to Documents

Revision ID: 010
Revises: 009
Create Date: 2025-01-16 15:07:16.087951

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '010'
down_revision = '009'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create a temporary "_resourcetype" type with all values
    tmp_resource_type_enum = sa.Enum(
        'ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', 'JOURNEY_MAP', 'DISCUSSION_BRIEF', 'STORIES', 'WEBINAR', 
        'CASE_STUDY', 'FACTSHEET', 'COUNTRY_ACTION_PLAN', 'RESEARCH_REPORT', 'TOOLKIT', 'JOURNAL_ARTICLE', 
        'FIELD_RESEARCH', 'MARKET_ASSESSMENTS', 'PROGRESS_REPORT', 'PERSONA', 'STRATEGY_DOCUMENT', 'POLICY_BRIEF', 
        'BLOG', name='_resourcetype'
    )
    tmp_resource_type_enum.create(op.get_bind(), checkfirst=False)

    # Alter the column to use the temporary type
    op.execute('ALTER TABLE document ALTER COLUMN resource_type TYPE _resourcetype USING resource_type::text::_resourcetype')

    # Drop the old "resourcetype" type
    old_resource_type_enum = sa.Enum('ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', name='resourcetype')
    old_resource_type_enum.drop(op.get_bind(), checkfirst=False)

    # Create the new "resourcetype" type with all values
    new_resource_type_enum = sa.Enum(
        'ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', 'JOURNEY_MAP', 'DISCUSSION_BRIEF', 'STORIES', 'WEBINAR', 
        'CASE_STUDY', 'FACTSHEET', 'COUNTRY_ACTION_PLAN', 'RESEARCH_REPORT', 'TOOLKIT', 'JOURNAL_ARTICLE', 
        'FIELD_RESEARCH', 'MARKET_ASSESSMENTS', 'PROGRESS_REPORT', 'PERSONA', 'STRATEGY_DOCUMENT', 'POLICY_BRIEF', 
        'BLOG', name='resourcetype'
    )
    new_resource_type_enum.create(op.get_bind(), checkfirst=False)

    # Alter the column to use the new type
    op.execute('ALTER TABLE document ALTER COLUMN resource_type TYPE resourcetype USING resource_type::text::resourcetype')

    # Drop the temporary type
    tmp_resource_type_enum.drop(op.get_bind(), checkfirst=False)


def downgrade() -> None:
    # Create a temporary "_resourcetype" type with the original values
    tmp_resource_type_enum = sa.Enum('ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', name='_resourcetype')
    tmp_resource_type_enum.create(op.get_bind(), checkfirst=False)

    # Alter the column to use the temporary type
    op.execute('ALTER TABLE document ALTER COLUMN resource_type TYPE _resourcetype USING resource_type::text::_resourcetype')

    # Drop the new "resourcetype" type
    new_resource_type_enum = sa.Enum(
        'ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', 'JOURNEY_MAP', 'DISCUSSION_BRIEF', 'STORIES', 'WEBINAR', 
        'CASE_STUDY', 'FACTSHEET', 'COUNTRY_ACTION_PLAN', 'RESEARCH_REPORT', 'TOOLKIT', 'JOURNAL_ARTICLE', 
        'FIELD_RESEARCH', 'MARKET_ASSESSMENTS', 'PROGRESS_REPORT', 'PERSONA', 'STRATEGY_DOCUMENT', 'POLICY_BRIEF', 
        'BLOG', name='resourcetype'
    )
    new_resource_type_enum.drop(op.get_bind(), checkfirst=False)

    # Create the old "resourcetype" type with the original values
    old_resource_type_enum = sa.Enum('ACADEMIC_ARTICLE', 'NEWS', 'VIDEO', 'PODCAST', name='resourcetype')
    old_resource_type_enum.create(op.get_bind(), checkfirst=False)

    # Alter the column to use the old type
    op.execute('ALTER TABLE document ALTER COLUMN resource_type TYPE resourcetype USING resource_type::text::resourcetype')

    # Drop the temporary type
    tmp_resource_type_enum.drop(op.get_bind(), checkfirst=False)