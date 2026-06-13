> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../fastapi-project.md).

# Projekt-Starter: FastAPI

Diesen Prompt verwenden, um ein neues FastAPI-Projekt mit Claude Code zu starten.

---

## Kickoff-Prompt

```
Bootstrap a new FastAPI project with production-ready defaults.

Project: [name and one-sentence description]
Database: PostgreSQL with SQLAlchemy async + Alembic migrations
Auth: JWT (python-jose) with refresh tokens
Testing: pytest + httpx async client

Create the following structure:
app/
├── api/
│   └── v1/
│       ├── routes/       ← One file per resource (users.py, items.py, etc.)
│       └── deps.py       ← Shared dependencies (get_db, get_current_user)
├── core/
│   ├── config.py         ← Settings via pydantic-settings
│   ├── security.py       ← JWT creation and validation
│   └── database.py       ← Async engine and session factory
├── models/               ← SQLAlchemy ORM models
├── schemas/              ← Pydantic request/response schemas
├── services/             ← Business logic (no HTTP, no ORM)
├── tests/
│   ├── conftest.py       ← Test database, async client, fixtures
│   └── test_[resource].py
├── alembic/              ← Migration files
├── main.py               ← App factory
└── requirements.txt      ← Pinned versions

Start with:
1. Show the full directory structure
2. Create requirements.txt with pinned versions
3. Create main.py with app factory pattern
4. Create core/config.py with Settings class
5. Create core/database.py with async session
6. Verify it starts with: uvicorn main:app --reload

Do not add business logic yet — skeleton only.
```

---

## Was als nächstes tun

Nachdem das Skeleton läuft:

1. Erste Ressource hinzufügen: "Ein User-Modell, CRUD-Endpunkte (GET /users, POST /users, GET /users/{id}) und Tests hinzufügen"
2. Auth hinzufügen: "JWT-Login und Refresh-Token-Endpunkte implementieren, die mit der eingerichteten security.py arbeiten"
3. Das erste Business-Feature mit dem Feature-Entwicklungs-Workflow hinzufügen

---
