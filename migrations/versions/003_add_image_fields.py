"""Add image fields to item and category

Revision ID: 003
Revises: 002
Create Date: 2025-06-09 04:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('item', sa.Column('image', sa.String(length=255), nullable=True))
    op.add_column('category', sa.Column('image', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('category', 'image')
    op.drop_column('item', 'image')

