"""fix foreign key issues in trip

Revision ID: 9522af365d29
Revises: f9c0b533370c
Create Date: 2025-02-28 19:01:54.836502

"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography

# revision identifiers, used by Alembic.
revision = '9522af365d29'
down_revision = 'f9c0b533370c'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_table('spatial_ref_sys')
    op.alter_column('trip', 'rider_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('trip', 'driver_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.create_foreign_key(None, 'trip', 'rider', ['rider_id'], ['rider_id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'trip', 'driver', ['driver_id'], ['driver_id'], ondelete='CASCADE')
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'trip', type_='foreignkey')
    op.drop_constraint(None, 'trip', type_='foreignkey')
    op.alter_column('trip', 'driver_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('trip', 'rider_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.create_table('spatial_ref_sys',
    sa.Column('srid', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('auth_name', sa.VARCHAR(length=256), autoincrement=False, nullable=True),
    sa.Column('auth_srid', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('srtext', sa.VARCHAR(length=2048), autoincrement=False, nullable=True),
    sa.Column('proj4text', sa.VARCHAR(length=2048), autoincrement=False, nullable=True),
    sa.CheckConstraint('srid > 0 AND srid <= 998999', name='spatial_ref_sys_srid_check'),
    sa.PrimaryKeyConstraint('srid', name='spatial_ref_sys_pkey')
    )
    # ### end Alembic commands ###