# AirService

Небольшой прототип backend-системы для заказа услуг на борту воздушного судна.

## Запуск

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. Запустите приложение:
   ```bash
   python run.py
   ```

## Использование

- Получить каталог: `GET /catalog` с поддержкой фильтров `category`, `price_min`, `price_max`, `available` и поиска `q`
- Создать заказ: `POST /orders` c JSON `{"seat": "12A", "items": [{"item_id": 1, "quantity": 2}]}`
- Получить заказ: `GET /orders/<id>`
- Админ-операции требуют basic-auth (`admin`/`admin`):
  - Список заказов: `GET /admin/orders`
  - Обновить статус: `PATCH /admin/orders/<id>` с JSON `{"status": "done"}`
  - CRUD товаров и категорий через `/admin/items` и `/admin/categories`
- Swagger-документация доступна на `/apidocs/`

Данные хранятся в SQLite-файле `airservice.db` в корне проекта.
