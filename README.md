# WashApp

Приложение состоит из фронтенда (`frontend`) и backend-сервиса на Spring Boot (`Spring-back`). Для локальной разработки и тестирования backend взаимодействует с базой PostgreSQL в Docker. Ниже описаны шаги по развертыванию и перезапуску окружения.

## Требования

- Установленный Docker и Docker Compose (входит в состав Docker Desktop).
- Порт `5432` (PostgreSQL) и `8080` (backend) свободны на хостовой машине.

## Первый запуск

1. Перейдите в каталог `database`:
   ```powershell
   cd database
   ```
2. Соберите и запустите контейнеры:
   ```powershell
   docker compose up --build
   ```
   Это создаст:
   - контейнер `washapp-db` с PostgreSQL (порт 5432, база `washappDatabase`, пользователь `washapp`, пароль `washapp123`);
   - контейнер `washapp-backend`, который собирается из `Spring-back/Dockerfile`, прогоняет миграции Flyway и поднимает Spring Boot на порту 8080.
3. Дождитесь сообщения о том, что оба сервиса запущены. Откройте новый терминал (окно/вкладку PowerShell) и убедитесь, что контейнеры активны:
   ```powershell
   docker compose ps
   ```

## Перезапуск после изменений в коде backend

1. Внесите правки в исходники `Spring-back`.
2. Пересоберите и перезапустите backend (остановка не требуется — Docker сам перезапустит сервис):
   ```powershell
   cd database
   docker compose up --build washapp-backend
   ```
   - Флаг `--build` пересоберёт jar-файл.
   - Указание имени сервиса пересобирает только backend, сохраняя БД.
3. Если нужно полностью перезапустить оба сервиса:
   ```powershell
   docker compose down
   docker compose up --build
   ```

## Перезапуск после изменений в миграциях Flyway

Flyway отслеживает хеши миграций. Если изменить уже применённый файл `V1__create_users_table.sql`, необходимо очистить базу, иначе появится ошибка checksum mismatch.

1. Остановите и удалите контейнеры вместе с volume:
   ```powershell
   cd database
   docker compose down -v
   ```
   Ключ `-v` удаляет volume `washapp-db-data`, чтобы база пересоздалась с нуля.
2. Запустите окружение заново:
   ```powershell
   docker compose up --build
   ```

## Полезные команды

- Логи backend:
  ```powershell
  docker compose logs -f washapp-backend
  ```
- Консоль PostgreSQL:
  ```powershell
  docker exec -it washapp-db psql -U washapp washappDatabase
  ```
- Остановка без удаления volume:
  ```powershell
  docker compose down
  ```
- Полная очистка (контейнеры + volume):
  ```powershell
  docker compose down -v
  ```
