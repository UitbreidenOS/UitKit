> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../fastapi.md).

# Skill de FastAPI

## Cuándo activar
- Construir una API REST o asíncrona en Python con FastAPI
- Definir modelos de solicitud/respuesta con Pydantic
- Configurar inyección de dependencias con `Depends`
- Escribir manejadores de rutas asíncronos con SQLAlchemy o drivers de BD asíncronos
- Agregar middleware (CORS, autenticación, logging, limitación de tasa)
- Configurar tareas en segundo plano o workers de Celery
- Personalizar la documentación OpenAPI (etiquetas, descripciones, esquemas de respuesta)
- Escribir pruebas de integración con `TestClient` o `AsyncClient`
- Estructurar un proyecto FastAPI multi-módulo

## Cuándo NO usar
- Proyectos Django/DRF — usar el skill de Django
- Codebases solo síncronos donde la sobrecarga asíncrona no está justificada
- Scripts simples que no necesitan HTTP — usar Python puro
- APIs gRPC o GraphQL — capa de transporte y esquema diferente

## Instrucciones

### Estructura del proyecto
```
app/
├── main.py              # Factoría de la aplicación FastAPI
├── core/
│   ├── config.py        # Configuración mediante pydantic-settings
│   └── security.py      # Utilidades JWT y hashing
├── api/
│   ├── deps.py          # Funciones Depends() compartidas
│   └── v1/
│       ├── router.py    # Agregador APIRouter
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # Modelos ORM de SQLAlchemy
├── schemas/             # Esquemas de solicitud/respuesta Pydantic
├── crud/                # Funciones de operación en BD (no ORM, no HTTP)
└── db/
    ├── session.py       # Factoría AsyncSession
    └── base.py          # Importación de la base declarativa
```

### Factoría de la aplicación
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

### Configuración con pydantic-settings
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

### Dependencia de sesión SQLAlchemy asíncrona
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

### Manejadores de rutas
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

### Inyección de dependencias para autenticación
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

### Tareas en segundo plano
```python
# Usa BackgroundTasks de FastAPI para tareas ligeras fire-and-forget (sin resultado necesario)
@router.post("/send-email")
async def send_email_endpoint(
    payload: EmailPayload,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email, payload.to, payload.subject, payload.body)
    return {"status": "queued"}

# Usa Celery para: reintentos, seguimiento de resultados, programación, tareas entre servicios
```

### Middleware CORS
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Nunca ["*"] en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Manejadores de excepciones personalizados
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

### Patrones comunes de Pydantic
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

    model_config = {"from_attributes": True}  # reemplaza orm_mode = True
```

## Ejemplo

**Usuario:** Construir un endpoint FastAPI para crear una publicación de blog, autenticada con JWT, guardando en PostgreSQL con SQLAlchemy async.

**Estructura esperada:**
- `schemas/post.py` — `PostCreate(BaseModel)`, `PostResponse(BaseModel)` con `from_attributes=True`
- `models/post.py` — modelo ORM `Post` con `id`, `title`, `body`, `author_id` (FK a User), `created_at`
- `crud/post.py` — función asíncrona `create(db, *, obj_in, author_id)`
- `api/v1/endpoints/posts.py` — `POST /posts/` con `Depends(get_current_user)` y `Depends(get_db)`
- `api/v1/router.py` — incluir router de posts

---
