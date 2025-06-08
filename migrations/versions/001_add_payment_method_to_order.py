"""Add payment_method column to order

Revision ID: 001
Revises: None
Create Date: 2024-04-25
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('order', sa.Column('payment_method', sa.String(length=20), nullable=True))


def downgrade():
    op.drop_column('order', 'payment_method')
