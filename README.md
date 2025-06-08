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
3. Запустите приложение (можно указать `SSL_CERT` и `SSL_KEY` для HTTPS):
   ```bash
   python run.py
   ```

## Использование

- Получить каталог: `GET /catalog` с поддержкой фильтров `category`, `price_min`, `price_max`, `available`, `service`, поиска `q` и параметра `lang=ru|en` для локализации названий
- Создать заказ: `POST /orders` c JSON `{"seat": "12A", "items": [{"item_id": 1, "quantity": 2}]}`
- Получить заказ: `GET /orders/<id>`
- Админ-операции требуют basic-auth (`admin`/`admin`):
  - Список заказов: `GET /admin/orders`
  - Обновить статус: `PATCH /admin/orders/<id>` с JSON `{"status": "done"}`
  - CRUD товаров и категорий через `/admin/items` и `/admin/categories`
  - Отчёт о продажах: `GET /admin/reports/sales?year=2025`
  - Экспорт отчёта в CSV: `GET /admin/reports/sales?format=csv`
  - Поиск по логам: `GET /admin/logs?q=order`
- Swagger-документация доступна на `/apidocs/`
- Push-уведомления о заказах доступны через SSE `/notifications`

Данные по умолчанию хранятся в SQLite-файле `airservice.db`. Чтобы использовать PostgreSQL, задайте `DATABASE_URL`.

## Лицензия

Этот проект распространяется под лицензией MIT.
