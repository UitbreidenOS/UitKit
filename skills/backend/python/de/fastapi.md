> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../fastapi.md).

# FastAPI Skill

## Wann aktivieren
- Eine Python REST- oder asynchrone API mit FastAPI bauen
- Pydantic-Anfrage-/Antwortmodelle definieren
- Dependency Injection mit `Depends` einrichten
- Asynchrone Route-Handler mit SQLAlchemy oder asynchronen DB-Treibern schreiben
- Middleware hinzufügen (CORS, Auth, Logging, Rate Limiting)
- Hintergrundaufgaben oder Celery-Worker konfigurieren
- OpenAPI-Docs anpassen (Tags, Beschreibungen, Antwort-Schemas)
- Integrationstests mit `TestClient` oder `AsyncClient` schreiben
- Ein Multi-Modul-FastAPI-Projekt strukturieren

## Wann NICHT verwenden
- Django/DRF-Projekte — Django Skill verwenden
- Nur-synchrone Codebasen, bei denen Async-Overhead nicht gerechtfertigt ist
- Einfache Skripte, die kein HTTP benötigen — einfaches Python verwenden
- gRPC- oder GraphQL-APIs — anderer Transport und Schema-Layer

## Anweisungen

### Projektstruktur
```
app/
├── main.py              # FastAPI App-Factory
├── core/
│   ├── config.py        # Einstellungen über pydantic-settings
│   └── security.py      # JWT, Hashing-Utilities
├── api/
│   ├── deps.py          # Gemeinsame Depends()-Funktionen
│   └── v1/
│       ├── router.py    # APIRouter-Aggregator
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # SQLAlchemy ORM-Modelle
├── schemas/             # Pydantic Anfrage-/Antwort-Schemas
├── crud/                # DB-Operationsfunktionen (kein ORM, kein HTTP)
└── db/
    ├── session.py       # AsyncSession-Factory
    └── base.py          # Deklarative Basis-Import
```

### App-Factory
```python
# main.py
from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    )
    app.include_router(api_router, prefix=settings.API_V1_STR)
    return app

app = create_app()
```

### Einstellungen mit pydantic-settings
```python
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyAPI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Asynchrone SQLAlchemy-Session-Abhängigkeit
```python
# db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# api/deps.py
async def get_db() -> AsyncIterator[AsyncSession]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

### Route-Handler
```python
# api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.crud import user as crud_user
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    if await crud_user.get_by_email(db, email=payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud_user.create(db, obj_in=payload)
```

### Dependency Injection für Auth
```python
# api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = await crud_user.get(db, id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### Hintergrundaufgaben
```python
# FastAPI's BackgroundTasks für leichtgewichtiges Fire-and-Forget verwenden (kein Ergebnis benötigt)
@router.post("/send-email")
async def send_email_endpoint(
    payload: EmailPayload,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email, payload.to, payload.subject, payload.body)
    return {"status": "queued"}

# Celery verwenden für: Wiederholungen, Ergebnisverfolgung, Planung, dienstübergreifende Aufgaben
```

### CORS-Middleware
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Niemals ["*"] in der Produktion
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Benutzerdefinierte Exception-Handler
```python
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(exc)})
```

### Tests
```python
# tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

# tests/test_users.py
@pytest.mark.asyncio
async def test_create_user(client: AsyncClient, db_session):
    resp = await client.post("/api/v1/users/", json={"email": "a@b.com", "password": "secret"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "a@b.com"
```

### Häufige Pydantic-Muster
```python
from pydantic import BaseModel, EmailStr, field_validator, model_validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    model_config = {"from_attributes": True}  # ersetzt orm_mode = True
```

## Beispiel

**Benutzer:** Einen FastAPI-Endpunkt zum Erstellen eines Blog-Posts bauen, mit JWT authentifiziert und in PostgreSQL mit asynchronem SQLAlchemy gespeichert.

**Erwartete Struktur:**
- `schemas/post.py` — `PostCreate(BaseModel)`, `PostResponse(BaseModel)` mit `from_attributes=True`
- `models/post.py` — `Post` ORM-Modell mit `id`, `title`, `body`, `author_id` (FK zu User), `created_at`
- `crud/post.py` — `create(db, *, obj_in, author_id)` asynchrone Funktion
- `api/v1/endpoints/posts.py` — `POST /posts/` mit `Depends(get_current_user)` und `Depends(get_db)`
- `api/v1/router.py` — Posts-Router einschließen

---
