"""Add latitude and longitude column in driverlocation table

Revision ID: f13b2ebbbaf3
Revises: 52c16ebe0118
Create Date: 2025-03-27 14:18:01.248260

"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography

# revision identifiers, used by Alembic.
revision = 'f13b2ebbbaf3'
down_revision = '52c16ebe0118'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('driverlocation', sa.Column('latitude', sa.Float(), nullable=False))
    op.add_column('driverlocation', sa.Column('longitude', sa.Float(), nullable=False))
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('driverlocation', 'longitude')
    op.drop_column('driverlocation', 'latitude')
    # ### end Alembic commands ###