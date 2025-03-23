"""Make composite key for engageddriver table

Revision ID: 52c16ebe0118
Revises: 2e3c0b1700f4
Create Date: 2025-03-16 01:23:59.070211

"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography

# revision identifiers, used by Alembic.
revision = '52c16ebe0118'
down_revision = '2e3c0b1700f4'
branch_labels = None
depends_on = None

def upgrade():
    # Drop existing primary key constraint
    op.drop_constraint('engageddriver_pkey', 'engageddriver', type_='primary')
    
    # Create new composite primary key
    op.create_primary_key('engageddriver_pkey', 'engageddriver', ['req_id', 'driver_id'])

def downgrade():
    # Drop the composite primary key
    op.drop_constraint('engageddriver_pkey', 'engageddriver', type_='primary')
    
    # Recreate the original primary key on req_id
    op.create_primary_key('engageddriver_pkey', 'engageddriver', ['req_id'])