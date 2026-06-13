> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../fastapi.md).

# FastAPI Skill

## Wanneer te activeren
- Een Python REST- of async API bouwen met FastAPI
- Pydantic aanvraag/respons-modellen definiëren
- Dependency injection instellen met `Depends`
- Async route-handlers schrijven met SQLAlchemy of async DB-drivers
- Middleware toevoegen (CORS, auth, logging, rate limiting)
- Achtergrondtaken of Celery-workers configureren
- OpenAPI-documentatie aanpassen (tags, beschrijvingen, respons-schema's)
- Integratietests schrijven met `TestClient` of `AsyncClient`
- Een multi-module FastAPI-project structureren

## Wanneer NIET te gebruiken
- Django/DRF-projecten — gebruik de Django skill
- Alleen-synchrone codebases waarbij async overhead niet gerechtvaardigd is
- Eenvoudige scripts die geen HTTP nodig hebben — gebruik gewone Python
- gRPC of GraphQL API's — ander transport en schemalag

## Instructies

### Projectstructuur
```
app/
├── main.py              # FastAPI app factory
├── core/
│   ├── config.py        # Instellingen via pydantic-settings
│   └── security.py      # JWT, hashing-hulpprogramma's
├── api/
│   ├── deps.py          # Gedeelde Depends()-functies
│   └── v1/
│       ├── router.py    # APIRouter-aggregator
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # SQLAlchemy ORM-modellen
├── schemas/             # Pydantic aanvraag/respons-schema's
├── crud/                # DB-operatiefuncties (niet ORM, niet HTTP)
└── db/
    ├── session.py       # AsyncSession-fabriek
    └── base.py          # Declaratieve basisimport
```

### App factory
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

### Instellingen met pydantic-settings
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

### Async SQLAlchemy-sessieafhankelijkheid
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

### Route-handlers
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

### Dependency injection voor auth
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

### Achtergrondtaken
```python
# Gebruik FastAPI's BackgroundTasks voor lichtgewicht fire-and-forget (geen resultaat nodig)
@router.post("/send-email")
async def send_email_endpoint(
    payload: EmailPayload,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email, payload.to, payload.subject, payload.body)
    return {"status": "queued"}

# Gebruik Celery voor: herhaalpogingen, resultaattracking, planning, cross-service taken
```

### CORS-middleware
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Nooit ["*"] in productie
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Aangepaste uitzonderingshandlers
```python
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(exc)})
```

### Testen
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

### Veelvoorkomende Pydantic-patronen
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

    model_config = {"from_attributes": True}  # vervangt orm_mode = True
```

## Voorbeeld

**Gebruiker:** Bouw een FastAPI-endpoint om een blogbericht aan te maken, geauthenticeerd met JWT, opgeslagen in PostgreSQL met SQLAlchemy async.

**Verwachte structuur:**
- `schemas/post.py` — `PostCreate(BaseModel)`, `PostResponse(BaseModel)` met `from_attributes=True`
- `models/post.py` — `Post` ORM-model met `id`, `title`, `body`, `author_id` (FK naar User), `created_at`
- `crud/post.py` — `create(db, *, obj_in, author_id)` async-functie
- `api/v1/endpoints/posts.py` — `POST /posts/` met `Depends(get_current_user)` en `Depends(get_db)`
- `api/v1/router.py` — posts-router opnemen

---
