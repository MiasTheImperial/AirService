from flask import Blueprint, jsonify, request, url_for

from ..models import Item, Category

catalog_bp = Blueprint('catalog', __name__)


@catalog_bp.route('/catalog')
def catalog():
    """List items available for order.

    ---
    parameters:
      - in: query
        name: category
        schema:
          type: integer
        description: Filter by category id
      - in: query
        name: price_min
        schema:
          type: number
        description: Minimum item price
      - in: query
        name: price_max
        schema:
          type: number
        description: Maximum item price
      - in: query
        name: available
        schema:
          type: integer
          enum: [0, 1]
        description: Filter by availability
      - in: query
        name: service
        schema:
          type: integer
          enum: [0, 1]
        description: Goods or services only
      - in: query
        name: q
        schema:
          type: string
        description: Search string
      - in: query
        name: lang
        schema:
          type: string
          enum: [ru, en]
        description: Localisation language
    responses:
      200:
        description: List of catalog items
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
                  image:
                    type: string
                  price:
                    type: number
                  available:
                    type: boolean
                  service:
                    type: boolean
                  category:
                    type: string
                  category_id:
                    type: integer
    """
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
        qs = qs.filter(
            Item.name_ru.ilike(like) |
            Item.name_en.ilike(like) |
            Item.description_ru.ilike(like) |
            Item.description_en.ilike(like)
        )
    items = qs.all()
    lang = request.args.get('lang') or request.accept_languages.best_match(['ru', 'en']) or 'ru'
    data = []
    for i in items:
        lang_item = 'en' if lang == 'en' else 'ru'
        name = i.name_en if lang_item == 'en' else i.name_ru
        desc = i.description_en if lang_item == 'en' else i.description_ru
        data.append({
            'id': i.id,
            'name': name,
            'description': desc,
            'image': url_for('serve_image', filename=i.image) if i.image else None,
            'price': i.price,
            'available': i.available,
            'service': i.is_service,
            'category': i.category.name_en if lang_item == 'en' else (i.category.name_ru if i.category else None),
            'category_id': i.category.id if i.category else None,
        })
    return jsonify(data)


@catalog_bp.route('/catalog/categories')
def catalog_categories():
    """Return category hierarchy with nested children.

    ---
    responses:
      200:
        description: Category tree
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  image:
                    type: string
                  children:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                        name:
                          type: string
                        image:
                          type: string
                        children:
                          type: array
                          items: {}
    """
    lang = request.args.get('lang') or request.accept_languages.best_match(['ru', 'en']) or 'ru'
    cats = Category.query.order_by(Category.id).all()
    nodes = {
        c.id: {
            'id': c.id,
            'name': c.name_en if lang != 'ru' else c.name_ru,
            'image': url_for('serve_image', filename=c.image) if c.image else None,
            'children': [],
        }
        for c in cats
    }
    roots = []
    for c in cats:
        node = nodes[c.id]
        if c.parent_id and c.parent_id in nodes:
            nodes[c.parent_id]['children'].append(node)
        else:
            roots.append(node)
    return jsonify(roots)
