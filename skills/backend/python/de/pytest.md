---
name: pytest
description: "pytest deep dive: fixtures, parametrize, markers, mocking, async tests, coverage, conftest patterns, and CI integration"
---

> 🇩🇪 Deutsche Version. [Englische Version](../pytest.md).

# pytest Skill

## Wann aktivieren
- Schreiben von Python-Tests über einfache `assert`-Anweisungen hinaus
- Einrichten von fixtures für DB-Sitzungen, HTTP-Clients oder externe Dienste
- Parametrierung von Tests, um dieselbe Logik mit mehreren Eingaben auszuführen
- Simulieren externer Dienste oder Umgebungsvariablen
- Ausführen asynchroner Tests (FastAPI, asyncpg, aiohttp)
- Konfigurieren von pytest für ein Projekt (`pyproject.toml`, conftest.py)
- Einrichten von Coverage-Berichten

## Wann NICHT verwenden
- unittest-Stil-Tests in einer bestehenden Codebasis — pytest-Kompatibilitätsmodus für unittest verwenden
- Lasttests — stattdessen Locust oder k6 verwenden
- Property-basiertes Testen — Hypothesis zusammen mit pytest verwenden

## Anweisungen

### Projekteinrichtung

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
asyncio_mode = "auto"          # pytest-asyncio: automatischer Modus
addopts = [
    "--strict-markers",        # bei nicht registrierten markers fehlschlagen
    "-ra",                     # Zusammenfassung von Fehlern und Fehlern anzeigen
    "--tb=short",              # kürzere Tracebacks
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

### Fixtures — das Kernkonzept

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Die Scope-Einstellung bestimmt, wie oft eine fixture erstellt wird:
# function (Standard) | class | module | session

@pytest.fixture(scope="session")
def engine():
    """Ein Engine pro Testsitzung — teuer in der Erstellung."""
    return create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/testdb")

@pytest.fixture(scope="function")
async def db(engine):
    """Frische Transaktion pro Test — wird nach jedem Test zurückgerollt."""
    async with engine.begin() as conn:
        async with AsyncSession(bind=conn) as session:
            yield session
            await session.rollback()  # alle Änderungen nach dem Test rückgängig machen

@pytest.fixture
async def client(db):
    """Asynchroner HTTP-Client für FastAPI mit injizierter Test-DB."""
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
    """Ein Standard-Benutzer für Tests, die einen benötigen."""
    from tests.factories import UserFactory
    return UserFactory(session=db)
```

### Asynchrone Tests

```python
import pytest

# pytest-asyncio mit asyncio_mode = "auto" — kein Dekorator notwendig
async def test_create_user(client: AsyncClient):
    resp = await client.post("/users", json={"email": "alice@example.com", "name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "alice@example.com"

# Oder explizit
@pytest.mark.asyncio
async def test_fetch_user(db: AsyncSession):
    user = await db.get(User, 1)
    assert user is not None
```

### Parametrize — mehrere Fälle sauber testen

```python
import pytest

@pytest.mark.parametrize("email,expected_status", [
    ("valid@example.com", 201),
    ("not-an-email",       422),
    ("",                   422),
    ("a" * 500 + "@b.com", 422),  # zu lang
])
async def test_signup_validates_email(client, email, expected_status):
    resp = await client.post("/auth/signup", json={"email": email, "password": "password123"})
    assert resp.status_code == expected_status

# Parametrize mit IDs für lesbare Testnamen
@pytest.mark.parametrize("discount,total,expected", [
    (0,   100.0, 100.0),
    (10,  100.0, 90.0),
    (100, 100.0, 0.0),
], ids=["no-discount", "10pct", "full"])
def test_apply_discount(discount, total, expected):
    assert apply_discount(total, discount) == expected
```

### Mocking mit pytest-mock

```python
# mocker fixture von pytest-mock
def test_send_email_on_signup(mocker, client):
    mock_send = mocker.patch("app.services.email.send_email")

    client.post("/auth/signup", json={"email": "a@b.com", "password": "pass123"})

    mock_send.assert_called_once_with(
        to="a@b.com",
        subject="Welcome!",
    )

# Umgebungsvariablen simulieren
def test_feature_flag(monkeypatch):
    monkeypatch.setenv("ENABLE_BETA", "true")
    assert is_beta_enabled() is True

# Eine Klassenmethode simulieren
def test_stripe_charge(mocker):
    mock_charge = mocker.patch("stripe.PaymentIntent.create")
    mock_charge.return_value = {"id": "pi_test", "status": "succeeded"}

    result = charge_card("tok_visa", 1000)

    assert result.payment_intent_id == "pi_test"
    mock_charge.assert_called_once_with(amount=1000, currency="usd")

# Asynchrone Funktionen simulieren
async def test_external_api(mocker):
    mocker.patch("app.clients.github.fetch_repo", return_value={"stars": 100})
    result = await get_repo_stats("anthropics/anthropic-sdk-python")
    assert result.stars == 100
```

### Markers und selektive Testausführung

```python
# Tests markieren
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
# Nur Smoke-Tests ausführen
pytest -m smoke

# Langsame Tests ausschließen
pytest -m "not slow"

# Bestimmte Datei oder Test ausführen
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user

# Tests mit einem Schlüsselwort ausführen
pytest -k "email"

# Beim ersten Fehler stoppen
pytest -x

# Die 10 langsamsten Tests anzeigen
pytest --durations=10
```

### Coverage

```bash
# Mit Coverage ausführen
pytest --cov=src --cov-report=html --cov-report=term-missing

# Fehlschlagen, wenn Coverage unter 80 % fällt
pytest --cov=src --cov-fail-under=80

# Coverage für eine bestimmte Datei
pytest --cov=src/services/users tests/test_users.py
```

```python
# Code von Coverage ausschließen
def legacy_function():  # pragma: no cover
    ...

# Einen Branch markieren
if TYPE_CHECKING:  # pragma: no cover
    from mymodule import MyType
```

### conftest.py-Muster

```python
# tests/conftest.py — gemeinsam für die gesamte Testsuite

# Autouse-fixture — wird für jeden Test automatisch ausgeführt
@pytest.fixture(autouse=True)
def reset_redis(redis_client):
    yield
    redis_client.flushdb()  # nach jedem Test bereinigen

# Gemeinsam über mehrere Testdateien hinweg
@pytest.fixture(scope="module")
def seed_data(db):
    """DB einmal pro Modul befüllen — schneller als pro Test."""
    UserFactory.create_batch(10, session=db)
    yield
    db.query(User).delete()

# tests/api/conftest.py — auf den api/-Ordner begrenzte fixtures
@pytest.fixture
def auth_headers(user):
    token = create_token(user.id)
    return {"Authorization": f"Bearer {token}"}
```

### Snapshot-Tests

```python
# pip install syrupy
from syrupy import SnapshotAssertion

def test_user_response(snapshot: SnapshotAssertion, client):
    resp = client.get("/users/1")
    assert resp.json() == snapshot  # erstellt Snapshot beim ersten Durchlauf, vergleicht danach

# Snapshots aktualisieren, wenn die Ausgabe absichtlich geändert wird
# pytest --snapshot-update
```

## Beispiel

**Benutzer:** Tests für einen FastAPI POST /auth/login Endpunkt schreiben: korrekte Anmeldedaten geben 200 + JWT zurück, falsches Passwort gibt 401 zurück, inaktives Konto gibt 403 zurück, Rate-Limiting gibt nach 5 Versuchen 429 zurück.

**Erwartete Ausgabe:**
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
