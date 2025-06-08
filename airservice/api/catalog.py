from flask import Blueprint, jsonify, request

from ..models import Item, Category

catalog_bp = Blueprint('catalog', __name__)


@catalog_bp.route('/catalog')
def catalog():
    qs = Item.query
    category = request.args.get('category')
    if category:
        qs = qs.join(Category).filter(Category.id == category)
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    if price_min is not None:
        qs = qs.filter(Item.price >= price_min)
    if price_max is not None:
        qs = qs.filter(Item.price <= price_max)
    if request.args.get('available') == '1':
        qs = qs.filter(Item.available.is_(True))
    elif request.args.get('available') == '0':
        qs = qs.filter(Item.available.is_(False))
    if request.args.get('service') == '1':
        qs = qs.filter(Item.is_service.is_(True))
    elif request.args.get('service') == '0':
        qs = qs.filter(Item.is_service.is_(False))
    query = request.args.get('q')
    if query:
        like = f"%{query}%"
        qs = qs.filter(Item.name.ilike(like) | Item.description.ilike(like))
    items = qs.all()
    lang = request.args.get('lang')
    data = []
    for i in items:
        name = i.name
        if lang == 'ru' and i.name_ru:
            name = i.name_ru
        elif lang == 'en' and i.name_en:
            name = i.name_en
        data.append({
            'id': i.id,
            'name': name,
            'description': i.description,
            'price': i.price,
            'available': i.available,
            'service': i.is_service,
            'category': i.category.name if i.category else None,
        })
    return jsonify(data)
