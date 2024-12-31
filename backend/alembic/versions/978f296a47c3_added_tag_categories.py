"""Added tag categories

Revision ID: 978f296a47c3
Revises: 8f0eb18e9849
Create Date: 2024-12-31 20:43:20.565881

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '978f296a47c3'
down_revision = '8f0eb18e9849'
branch_labels = None
depends_on = None

old_options = ('REGION', 'TOPIC', 'TECHNOLOGY', 'FRAMEWORK', 'COUNTRY')
new_options = ('REGION', 'TOPIC', 'TECHNOLOGY', 'FRAMEWORK', 'COUNTRY', 'PRODUCT_LIFECYCLE', 'CUSTOMER_JOURNEY', 'UNKNOWN')

old_type = postgresql.ENUM(*old_options, name='tagcategory')
new_type = postgresql.ENUM(*new_options, name='tagcategory')
tmp_type = sa.Enum(*new_options, name='_tagcategory')

def upgrade():
    # Create a temporary "_tagcategory" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    # Alter the column to use the temporary type
    op.execute('ALTER TABLE tag ALTER COLUMN category TYPE _tagcategory USING category::text::_tagcategory')
    # Drop the old "tagcategory" type
    old_type.drop(op.get_bind(), checkfirst=False)
    # Create the new "tagcategory" type
    new_type.create(op.get_bind(), checkfirst=False)
    # Alter the column to use the new type
    op.execute('ALTER TABLE tag ALTER COLUMN category TYPE tagcategory USING category::text::tagcategory')
    # Drop the temporary type
    tmp_type.drop(op.get_bind(), checkfirst=False)

def downgrade():
    # Create a temporary "_tagcategory" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    # Alter the column to use the temporary type
    op.execute('ALTER TABLE tag ALTER COLUMN category TYPE _tagcategory USING category::text::_tagcategory')
    # Drop the new "tagcategory" type
    new_type.drop(op.get_bind(), checkfirst=False)
    # Create the old "tagcategory" type
    old_type.create(op.get_bind(), checkfirst=False)
    # Alter the column to use the old type
    op.execute('ALTER TABLE tag ALTER COLUMN category TYPE tagcategory USING category::text::tagcategory')
    # Drop the temporary type
    tmp_type.drop(op.get_bind(), checkfirst=False)