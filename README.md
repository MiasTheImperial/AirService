# AirService

Небольшой прототип backend-системы для заказа услуг на борту воздушного судна.

## Запуск

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. При необходимости укажите строку подключения к БД через переменную `DATABASE_URL`.
   Пример для PostgreSQL:
   `postgresql://user:password@localhost/airservice`.
3. Запустите приложение:
   ```bash
   python run.py
   ```

## Использование

- Получить каталог: `GET /catalog` с поддержкой фильтров `category`, `price_min`, `price_max`, `available`, `service` и поиска `q`
- Создать заказ: `POST /orders` c JSON `{"seat": "12A", "items": [{"item_id": 1, "quantity": 2}]}`
- Получить заказ: `GET /orders/<id>`
- Админ-операции требуют basic-auth (`admin`/`admin`):
  - Список заказов: `GET /admin/orders`
  - Обновить статус: `PATCH /admin/orders/<id>` с JSON `{"status": "done"}`
  - CRUD товаров и категорий через `/admin/items` и `/admin/categories`
  - Отчёт о продажах: `GET /admin/reports/sales?year=2025`
- Swagger-документация доступна на `/apidocs/`

Данные по умолчанию хранятся в SQLite-файле `airservice.db`. Чтобы использовать PostgreSQL, задайте `DATABASE_URL`.
