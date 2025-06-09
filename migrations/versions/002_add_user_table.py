"""Add user table and seed admin

Revision ID: 002
Revises: 001
Create Date: 2025-06-09 03:10:00.000000
"""

from alembic import op
import sqlalchemy as sa
from werkzeug.security import generate_password_hash

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('seat', sa.String(length=10), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=True, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    # seed admin user
    op.bulk_insert(
        sa.table(
            'user',
            sa.column('email', sa.String),
            sa.column('password_hash', sa.String),
            sa.column('seat', sa.String),
            sa.column('is_admin', sa.Boolean),
        ),
        [
            {
                'email': 'admin@example.com',
                'password_hash': generate_password_hash('password'),
                'seat': '999F',
                'is_admin': True,
            }
        ]
    )


def downgrade():
    op.drop_table('user')

