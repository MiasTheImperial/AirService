from marshmallow import Schema, fields, validate

class OrderItemSchema(Schema):
    item_id = fields.Int(required=True)
    quantity = fields.Int(load_default=1)

class OrderSchema(Schema):
    seat = fields.Str()
    items = fields.List(fields.Nested(OrderItemSchema), required=True)
    payment_method = fields.Str()

class ItemSchema(Schema):
    name_ru = fields.Str(required=True)
    name_en = fields.Str(required=True)
    description_ru = fields.Str()
    description_en = fields.Str()
    image = fields.Str()
    price = fields.Float(required=True)
    available = fields.Bool(load_default=True)
    service = fields.Bool(load_default=False)
    category_id = fields.Int()

class CategorySchema(Schema):
    name_ru = fields.Str(required=True)
    name_en = fields.Str(required=True)
    image = fields.Str()
    parent_id = fields.Int()
