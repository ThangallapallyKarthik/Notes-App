# Notes Backend (Spring Boot 3.5.x, Java 17)

A production-ready Notes API with JWT authentication and per-user note isolation.
Includes Docker Compose (Postgres) and GitHub Actions CI.

## Quick start (Docker)

```bash
docker compose up --build
# App: http://localhost:8081
```

Demo login (auto-seeded):
- **email:** `demo@user.com`
- **password:** `Demo@123`

## Local dev (H2)

```bash
# Uses H2 in-memory by default (profile: dev)
mvn spring-boot:run
# Open http://localhost:8081
```

## API

- `POST /api/auth/register`  → { name, email, password }
- `POST /api/auth/login`     → { username, password } → returns JWT
- `POST /api/auth/forgot-password` → { email }

- `GET /api/notes`                 → list my notes
- `POST /api/notes`                → { title, content, color }
- `PUT /api/notes/{id}`            → { title?, content?, color? }
- `DELETE /api/notes/{id}`

All `/api/notes/**` require `Authorization: Bearer <token>`

## Build

```bash
mvn -B -DskipTests=false clean verify
mvn -B -DskipTests package
```

## CI (GitHub Actions)

A basic Maven workflow is included at `.github/workflows/maven.yml`.
