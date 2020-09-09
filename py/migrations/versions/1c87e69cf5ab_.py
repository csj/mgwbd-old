"""empty message

Revision ID: 1c87e69cf5ab
Revises: 48cadd862c66
Create Date: 2020-09-08 21:01:05.545274

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1c87e69cf5ab'
down_revision = '48cadd862c66'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('game_instance', sa.Column('gameType', sa.String(length=40), nullable=True))
    op.drop_column('game_instance', 'gameName')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('game_instance', sa.Column('gameName', sa.VARCHAR(length=40), autoincrement=False, nullable=True))
    op.drop_column('game_instance', 'gameType')
    # ### end Alembic commands ###
