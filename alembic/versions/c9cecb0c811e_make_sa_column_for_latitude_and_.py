from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision = 'c9cecb0c811e'
down_revision = 'f13b2ebbbaf3'
branch_labels = None
depends_on = None

def column_exists(table_name, column_name):
    # Get the current columns in the table
    inspector = Inspector.from_engine(op.get_bind())
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def upgrade():
    # Add latitude column if it does not exist
    if not column_exists('driverlocation', 'latitude'):
        op.add_column('driverlocation', sa.Column(
            'latitude', 
            sa.Float(), 
            nullable=False, 
        ))
    
    # Add longitude column if it does not exist
    if not column_exists('driverlocation', 'longitude'):
        op.add_column('driverlocation', sa.Column(
            'longitude', 
            sa.Float(), 
            nullable=False, 
        ))

def downgrade():
    # Remove added columns
    if column_exists('driverlocation', 'longitude'):
        op.drop_column('driverlocation', 'longitude')
    
    if column_exists('driverlocation', 'latitude'):
        op.drop_column('driverlocation', 'latitude')
