# WashApp Database

Start a local PostgreSQL instance configured for the app:

```powershell
docker compose up -d
```

Useful commands:
- `docker compose down` — stop the database container.
- `docker compose logs -f washapp-db` — follow database logs.
- `docker exec -it washapp-db psql -U washapp washappDatabase` — open a psql shell.
