# AirService

Небольшой прототип backend-системы для заказа услуг на борту воздушного судна.

## Запуск

Все приведённые ниже команды следует выполнять из корня репозитория.

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. При необходимости укажите строку подключения к БД через переменную `DATABASE_URL`.
   Пример для PostgreSQL:
   `postgresql://user:password@localhost/airservice`.
3. Укажите приложение и примените существующие миграции:
   ```bash
   export FLASK_APP=run.py   # или используйте "flask --app run.py"
   flask db upgrade
   ```
   Команду `flask db migrate` используйте только при создании новых миграций.

4. Заполните таблицы демонстрационными данными:
   ```bash
   flask seed-data
   ```

If an earlier version of the database already exists (for example from a previous clone), delete `airservice.db` or run `flask db downgrade base` before `flask db upgrade`.
5. Вы можете задать логин администратора через `ADMIN_USERNAME` и пароль
   через `ADMIN_PASSWORD` или готовый `ADMIN_PASSWORD_HASH`.
   По умолчанию используются значения `admin`/`admin`.
6. Можно настроить лимит запросов через переменную `API_RATE_LIMIT`
   (например `"200 per hour"`). По умолчанию действует `"100 per hour"`.
7. Разрешённые origin для CORS можно указать через `FRONTEND_ORIGIN`
   (по умолчанию `*`).
8. Запустите приложение (можно указать `SSL_CERT` и `SSL_KEY` для HTTPS):
   ```bash
   python run.py
   ```
9. Запустите воркер очереди (требуется Redis):
   ```bash
   python run_worker.py
   ```
   Адрес Redis можно задать через переменную `REDIS_URL` (по умолчанию
   используется `redis://localhost:6379/0`).
10. Логи сервера пишутся в файл `airservice.log` в формате JSON и содержат поля
   `timestamp`, `user`, `endpoint` и `message`.
11. При изменении переводов выполните команду
    `pybabel compile -d airservice/translations` для сборки `.mo`‑файлов.

### Troubleshooting

For SQLite, if an earlier version of `airservice.db` exists, delete the file or run `flask db downgrade base` before `flask db upgrade`.

## Использование

- Получить каталог: `GET /catalog` с поддержкой фильтров `category`, `price_min`, `price_max`, `available`, `service`, поиска `q` и параметра `lang=ru|en` для локализации названий
- Создать заказ: `POST /orders` c JSON `{"seat": "12A", "items": [{"item_id": 1, "quantity": 2}]}`
- Получить заказ: `GET /orders/<id>`
- Админ-операции требуют basic-auth (по умолчанию `admin`/`admin`,
  задаётся через `ADMIN_USERNAME` и `ADMIN_PASSWORD`/`ADMIN_PASSWORD_HASH`):
  - Список заказов: `GET /admin/orders`
  - Обновить статус: `PATCH /admin/orders/<id>` с JSON `{"status": "done"}`
  - CRUD товаров и категорий через `/admin/items` и `/admin/categories`
  - Отчёт о продажах: `GET /admin/reports/sales?year=2025`
  - Экспорт отчёта в CSV: `GET /admin/reports/sales?format=csv`
  - Поиск по логам: `GET /admin/logs?user=admin&endpoint=/orders&from=2024-01-01T00:00:00`
- Swagger-документация доступна на `/apidocs/`
- Push-уведомления о заказах доступны через SSE `/notifications`

Данные по умолчанию хранятся в SQLite-файле `airservice.db`. Чтобы использовать PostgreSQL, задайте `DATABASE_URL`.

## Фронтенд

Клиентское приложение находится в каталоге `frontend`. Чтобы установить зависимости и запустить его:

```bash
npm install --prefix frontend
npm run --prefix frontend web-build
```

После сборки статических файлов запустите сервер Flask:
```bash
python run.py
```

Для разработки можно запустить приложение Expo:
```bash
cd frontend
npm install
npm start # или expo start
```

Перед запуском укажите адрес backend-сервера через переменную `EXPO_PUBLIC_API_URL`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:5000 npm start
```

Для полной функциональности (уведомления и фоновые задачи) требуется Redis и запущенный воркер:

```bash
python run_worker.py
```
## Тестирование

Для запуска тестов установите зависимости из `requirements.txt` и выполните:

```bash
pip install -r requirements.txt
pytest -q
```
## Лицензия

Этот проект распространяется под лицензией MIT.
