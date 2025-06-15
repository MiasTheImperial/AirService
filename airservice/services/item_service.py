import logging
from typing import Any, Dict

from ..models import db, Item


FIELD_MAP = {
    'name_ru': 'name_ru',
    'name_en': 'name_en',
    'description_ru': 'description_ru',
    'description_en': 'description_en',
    'image': 'image',
    'price': 'price',
    'available': 'available',
    'service': 'is_service',
    'category_id': 'category_id',
}


def create_item(data: Dict[str, Any]) -> Item:
    item = Item(
        name_ru=data.get('name_ru'),
        name_en=data.get('name_en'),
        description_ru=data.get('description_ru'),
        description_en=data.get('description_en'),
        image=data.get('image'),
        price=data.get('price'),
        available=data.get('available', True),
        is_service=data.get('service', False),
        category_id=data.get('category_id'),
    )
    db.session.add(item)
    db.session.commit()
    logging.info('item_created %s', item.id)
    return item


def update_item(item: Item, data: Dict[str, Any]) -> Item:
    for key, attr in FIELD_MAP.items():
        if key in data:
            setattr(item, attr, data[key])
    db.session.commit()
    logging.info('item_updated %s', item.id)
    return item


def delete_item(item: Item) -> None:
    db.session.delete(item)
    db.session.commit()
    logging.info('item_deleted %s', item.id)
