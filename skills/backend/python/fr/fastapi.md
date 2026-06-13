> 🇫🇷 This is the French translation. [English version](../fastapi.md).

# Compétence FastAPI

## Quand activer
- Construire une API Python REST ou async avec FastAPI
- Définir des modèles Pydantic de requête/réponse
- Configurer l'injection de dépendances avec `Depends`
- Rédiger des gestionnaires de routes async avec SQLAlchemy ou des drivers DB async
- Ajouter des middlewares (CORS, auth, logging, rate limiting)
- Configurer des tâches en arrière-plan ou des workers Celery
- Personnaliser les docs OpenAPI (tags, descriptions, schémas de réponse)
- Rédiger des tests d'intégration avec `TestClient` ou `AsyncClient`
- Structurer un projet FastAPI multi-modules

## Quand NE PAS utiliser
- Projets Django/DRF — utiliser la compétence Django
- Bases de code uniquement synchrones où le surcoût async n'est pas justifié
- Scripts simples qui n'ont pas besoin de HTTP — utiliser du Python simple
- APIs gRPC ou GraphQL — transport et couche de schéma différents

## Instructions

### Structure du projet
```
app/
├── main.py              # Fabrique d'application FastAPI
├── core/
│   ├── config.py        # Paramètres via pydantic-settings
│   └── security.py      # JWT, utilitaires de hachage
├── api/
│   ├── deps.py          # Fonctions Depends() partagées
│   └── v1/
│       ├── router.py    # Agrégateur APIRouter
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # Modèles ORM SQLAlchemy
├── schemas/             # Schémas Pydantic de requête/réponse
├── crud/                # Fonctions d'opérations DB (pas ORM, pas HTTP)
└── db/
    ├── session.py       # Fabrique AsyncSession
    └── base.py          # Import de la base déclarative
```

### Fabrique d'application
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

### Paramètres avec pydantic-settings
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

### Dépendance de session SQLAlchemy async
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

### Gestionnaires de routes
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

### Injection de dépendances pour l'auth
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

### Tâches en arrière-plan
```python
# Utiliser BackgroundTasks de FastAPI pour les tâches légères fire-and-forget (pas de résultat nécessaire)
@router.post("/send-email")
async def send_email_endpoint(
    payload: EmailPayload,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email, payload.to, payload.subject, payload.body)
    return {"status": "queued"}

# Utiliser Celery pour : les réessais, le suivi des résultats, la planification, les tâches inter-services
```

### Middleware CORS
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Jamais ["*"] en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Gestionnaires d'exceptions personnalisés
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

### Patterns Pydantic courants
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

    model_config = {"from_attributes": True}  # remplace orm_mode = True
```

## Exemple

**Utilisateur :** Construire un endpoint FastAPI pour créer un article de blog, authentifié avec JWT, sauvegardant dans PostgreSQL avec SQLAlchemy async.

**Structure attendue :**
- `schemas/post.py` — `PostCreate(BaseModel)`, `PostResponse(BaseModel)` avec `from_attributes=True`
- `models/post.py` — modèle ORM `Post` avec `id`, `title`, `body`, `author_id` (FK vers User), `created_at`
- `crud/post.py` — fonction async `create(db, *, obj_in, author_id)`
- `api/v1/endpoints/posts.py` — `POST /posts/` avec `Depends(get_current_user)` et `Depends(get_db)`
- `api/v1/router.py` — inclure le router posts

---
