---
name: fastapi
description: "FastAPI app structure, async routes, Pydantic models, SQLAlchemy, dependency injection, background tasks, TestClient"
updated: 2026-06-13
---

# FastAPI Skill

## When to activate
- Building a Python REST or async API with FastAPI
- Defining Pydantic request/response models
- Setting up dependency injection with `Depends`
- Writing async route handlers with SQLAlchemy or async DB drivers
- Adding middleware (CORS, auth, logging, rate limiting)
- Configuring background tasks or Celery workers
- Customizing OpenAPI docs (tags, descriptions, response schemas)
- Writing integration tests with `TestClient` or `AsyncClient`
- Structuring a multi-module FastAPI project

## When NOT to use
- Django/DRF projects — use the Django skill
- Synchronous-only codebases where async overhead is not justified
- Simple scripts that don't need HTTP — use plain Python
- gRPC or GraphQL APIs — different transport and schema layer

## Instructions

### Project structure
```
app/
├── main.py              # FastAPI app factory
├── core/
│   ├── config.py        # Settings via pydantic-settings
│   └── security.py      # JWT, hashing utilities
├── api/
│   ├── deps.py          # Shared Depends() functions
│   └── v1/
│       ├── router.py    # APIRouter aggregator
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic request/response schemas
├── crud/                # DB operation functions (not ORM, not HTTP)
└── db/
    ├── session.py       # AsyncSession factory
    └── base.py          # Declarative base import
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

### Settings with pydantic-settings
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

### Async SQLAlchemy session dependency
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

### Route handlers
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

### Dependency injection for auth
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

### Background tasks
```python
# Use FastAPI's BackgroundTasks for lightweight fire-and-forget (no result needed)
@router.post("/send-email")
async def send_email_endpoint(
    payload: EmailPayload,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email, payload.to, payload.subject, payload.body)
    return {"status": "queued"}

# Use Celery for: retries, result tracking, scheduling, cross-service tasks
```

### CORS middleware
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Never ["*"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Custom exception handlers
```python
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(exc)})
```

### Testing
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

### Common Pydantic patterns
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

    model_config = {"from_attributes": True}  # replaces orm_mode = True
```

## Example

**User:** Build a FastAPI endpoint to create a blog post, authenticated with JWT, saving to PostgreSQL with SQLAlchemy async.

**Expected structure:**
- `schemas/post.py` — `PostCreate(BaseModel)`, `PostResponse(BaseModel)` with `from_attributes=True`
- `models/post.py` — `Post` ORM model with `id`, `title`, `body`, `author_id` (FK to User), `created_at`
- `crud/post.py` — `create(db, *, obj_in, author_id)` async function
- `api/v1/endpoints/posts.py` — `POST /posts/` with `Depends(get_current_user)` and `Depends(get_db)`
- `api/v1/router.py` — include posts router

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
