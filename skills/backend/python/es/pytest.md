---
name: pytest
description: "pytest deep dive: fixtures, parametrize, markers, mocking, async tests, coverage, conftest patterns, and CI integration"
---

> 🇪🇸 Versión en español. [Versión en inglés](../pytest.md).

# Skill pytest

## Cuándo activar
- Escribir tests de Python más allá de simples sentencias `assert`
- Configurar fixtures para sesiones de DB, clientes HTTP o servicios externos
- Parametrizar tests para ejecutar la misma lógica con múltiples entradas
- Simular servicios externos o variables de entorno
- Ejecutar tests asíncronos (FastAPI, asyncpg, aiohttp)
- Configurar pytest para un proyecto (`pyproject.toml`, conftest.py)
- Configurar reportes de cobertura

## Cuándo NO usar
- Tests al estilo unittest en una base de código existente — usar el modo de compatibilidad unittest de pytest
- Pruebas de carga — usar Locust o k6 en su lugar
- Pruebas basadas en propiedades — usar Hypothesis junto a pytest

## Instrucciones

### Configuración del proyecto

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
asyncio_mode = "auto"          # pytest-asyncio: modo automático
addopts = [
    "--strict-markers",        # fallar con markers no registrados
    "-ra",                     # mostrar resumen de fallos y errores
    "--tb=short",              # tracebacks más cortos
]
markers = [
    "integration: marks tests that require a real database or external service",
    "slow: marks tests that take more than 1 second",
    "smoke: marks critical path tests for quick verification",
]

[tool.coverage.run]
source = ["src"]
omit = ["tests/*", "*/migrations/*"]

[tool.coverage.report]
fail_under = 80
```

```bash
pip install pytest pytest-asyncio pytest-cov pytest-mock httpx
```

### Fixtures — el concepto fundamental

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# El scope controla con qué frecuencia se crea una fixture:
# function (por defecto) | class | module | session

@pytest.fixture(scope="session")
def engine():
    """Un engine por sesión de test — costoso de crear."""
    return create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/testdb")

@pytest.fixture(scope="function")
async def db(engine):
    """Transacción nueva por test — se revierte después de cada test."""
    async with engine.begin() as conn:
        async with AsyncSession(bind=conn) as session:
            yield session
            await session.rollback()  # deshacer todos los cambios después del test

@pytest.fixture
async def client(db):
    """Cliente HTTP asíncrono para FastAPI con DB de test inyectada."""
    from app.main import app
    from app.api.deps import get_db

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def user(db):
    """Un usuario por defecto para los tests que lo necesitan."""
    from tests.factories import UserFactory
    return UserFactory(session=db)
```

### Tests asíncronos

```python
import pytest

# pytest-asyncio con asyncio_mode = "auto" — no se necesita decorador
async def test_create_user(client: AsyncClient):
    resp = await client.post("/users", json={"email": "alice@example.com", "name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "alice@example.com"

# O de forma explícita
@pytest.mark.asyncio
async def test_fetch_user(db: AsyncSession):
    user = await db.get(User, 1)
    assert user is not None
```

### Parametrize — probar múltiples casos de forma limpia

```python
import pytest

@pytest.mark.parametrize("email,expected_status", [
    ("valid@example.com", 201),
    ("not-an-email",       422),
    ("",                   422),
    ("a" * 500 + "@b.com", 422),  # demasiado largo
])
async def test_signup_validates_email(client, email, expected_status):
    resp = await client.post("/auth/signup", json={"email": email, "password": "password123"})
    assert resp.status_code == expected_status

# Parametrize con ids para nombres de test legibles
@pytest.mark.parametrize("discount,total,expected", [
    (0,   100.0, 100.0),
    (10,  100.0, 90.0),
    (100, 100.0, 0.0),
], ids=["no-discount", "10pct", "full"])
def test_apply_discount(discount, total, expected):
    assert apply_discount(total, discount) == expected
```

### Mocking con pytest-mock

```python
# fixture mocker de pytest-mock
def test_send_email_on_signup(mocker, client):
    mock_send = mocker.patch("app.services.email.send_email")

    client.post("/auth/signup", json={"email": "a@b.com", "password": "pass123"})

    mock_send.assert_called_once_with(
        to="a@b.com",
        subject="Welcome!",
    )

# Simular variables de entorno
def test_feature_flag(monkeypatch):
    monkeypatch.setenv("ENABLE_BETA", "true")
    assert is_beta_enabled() is True

# Simular un método de clase
def test_stripe_charge(mocker):
    mock_charge = mocker.patch("stripe.PaymentIntent.create")
    mock_charge.return_value = {"id": "pi_test", "status": "succeeded"}

    result = charge_card("tok_visa", 1000)

    assert result.payment_intent_id == "pi_test"
    mock_charge.assert_called_once_with(amount=1000, currency="usd")

# Simular funciones asíncronas
async def test_external_api(mocker):
    mocker.patch("app.clients.github.fetch_repo", return_value={"stars": 100})
    result = await get_repo_stats("anthropics/anthropic-sdk-python")
    assert result.stars == 100
```

### Markers y ejecuciones selectivas de tests

```python
# Marcar tests
@pytest.mark.integration
async def test_real_database_operation(db):
    ...

@pytest.mark.slow
def test_complex_algorithm():
    ...

@pytest.mark.smoke
async def test_health_check(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
```

```bash
# Ejecutar solo smoke tests
pytest -m smoke

# Excluir tests lentos
pytest -m "not slow"

# Ejecutar un archivo o test específico
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user

# Ejecutar tests que coincidan con una palabra clave
pytest -k "email"

# Detener en el primer fallo
pytest -x

# Mostrar los 10 tests más lentos
pytest --durations=10
```

### Cobertura

```bash
# Ejecutar con cobertura
pytest --cov=src --cov-report=html --cov-report=term-missing

# Fallar si la cobertura cae por debajo del 80%
pytest --cov=src --cov-fail-under=80

# Cobertura para un archivo específico
pytest --cov=src/services/users tests/test_users.py
```

```python
# Excluir código de la cobertura
def legacy_function():  # pragma: no cover
    ...

# Marcar una rama
if TYPE_CHECKING:  # pragma: no cover
    from mymodule import MyType
```

### Patrones de conftest.py

```python
# tests/conftest.py — compartido en toda la suite de tests

# Fixture autouse — se ejecuta para cada test automáticamente
@pytest.fixture(autouse=True)
def reset_redis(redis_client):
    yield
    redis_client.flushdb()  # limpiar después de cada test

# Compartido entre múltiples archivos de test
@pytest.fixture(scope="module")
def seed_data(db):
    """Poblar la DB una vez por módulo — más rápido que por test."""
    UserFactory.create_batch(10, session=db)
    yield
    db.query(User).delete()

# tests/api/conftest.py — fixtures limitadas a la carpeta api/
@pytest.fixture
def auth_headers(user):
    token = create_token(user.id)
    return {"Authorization": f"Bearer {token}"}
```

### Tests de snapshot

```python
# pip install syrupy
from syrupy import SnapshotAssertion

def test_user_response(snapshot: SnapshotAssertion, client):
    resp = client.get("/users/1")
    assert resp.json() == snapshot  # crea snapshot en la primera ejecución, compara después

# Actualizar snapshots al cambiar intencionalmente la salida
# pytest --snapshot-update
```

## Ejemplo

**Usuario:** Escribir tests para un endpoint FastAPI POST /auth/login: las credenciales correctas devuelven 200 + JWT, la contraseña incorrecta devuelve 401, la cuenta inactiva devuelve 403, el rate limiting devuelve 429 después de 5 intentos.

**Resultado esperado:**
```python
# tests/api/test_auth.py
@pytest.mark.parametrize("password,expected_status,expected_code", [
    ("correctpassword", 200, None),
    ("wrongpassword",   401, "INVALID_CREDENTIALS"),
])
async def test_login(client, user, password, expected_status, expected_code):
    ...

async def test_login_inactive_account(client, inactive_user):
    ...

async def test_login_rate_limit(client, user):
    for _ in range(5):
        await client.post("/auth/login", json={...})
    resp = await client.post("/auth/login", json={...})
    assert resp.status_code == 429
```

---
