---
name: pytest
description: "pytest deep dive: fixtures, parametrize, markers, mocking, async tests, coverage, conftest patterns, and CI integration"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../pytest.md).

# pytest Skill

## Wanneer activeren
- Python-tests schrijven die verder gaan dan eenvoudige `assert`-statements
- fixtures instellen voor DB-sessies, HTTP-clients of externe services
- Tests parametriseren om dezelfde logica over meerdere invoerwaarden uit te voeren
- Externe services of omgevingsvariabelen simuleren
- Asynchrone tests uitvoeren (FastAPI, asyncpg, aiohttp)
- pytest configureren voor een project (`pyproject.toml`, conftest.py)
- Coverage-rapportage instellen

## Wanneer NIET gebruiken
- unittest-stijl tests in een bestaande codebase — gebruik pytest's unittest-compatibiliteitsmodus
- Lasttesten — gebruik Locust of k6 in plaats daarvan
- Property-gebaseerd testen — gebruik Hypothesis naast pytest

## Instructies

### Projectinstellingen

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
asyncio_mode = "auto"          # pytest-asyncio: automatische modus
addopts = [
    "--strict-markers",        # mislukken bij niet-geregistreerde markers
    "-ra",                     # samenvatting van mislukkingen en fouten tonen
    "--tb=short",              # kortere tracebacks
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

### Fixtures — het kernconcepte

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# De scope bepaalt hoe vaak een fixture wordt aangemaakt:
# function (standaard) | class | module | session

@pytest.fixture(scope="session")
def engine():
    """Één engine per testsessie — duur om aan te maken."""
    return create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/testdb")

@pytest.fixture(scope="function")
async def db(engine):
    """Verse transactie per test — wordt na elke test teruggedraaid."""
    async with engine.begin() as conn:
        async with AsyncSession(bind=conn) as session:
            yield session
            await session.rollback()  # alle wijzigingen na de test ongedaan maken

@pytest.fixture
async def client(db):
    """Asynchrone HTTP-client voor FastAPI met geïnjecteerde test-DB."""
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
    """Een standaardgebruiker voor tests die er één nodig hebben."""
    from tests.factories import UserFactory
    return UserFactory(session=db)
```

### Asynchrone tests

```python
import pytest

# pytest-asyncio met asyncio_mode = "auto" — geen decorator nodig
async def test_create_user(client: AsyncClient):
    resp = await client.post("/users", json={"email": "alice@example.com", "name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "alice@example.com"

# Of expliciet
@pytest.mark.asyncio
async def test_fetch_user(db: AsyncSession):
    user = await db.get(User, 1)
    assert user is not None
```

### Parametrize — meerdere gevallen netjes testen

```python
import pytest

@pytest.mark.parametrize("email,expected_status", [
    ("valid@example.com", 201),
    ("not-an-email",       422),
    ("",                   422),
    ("a" * 500 + "@b.com", 422),  # te lang
])
async def test_signup_validates_email(client, email, expected_status):
    resp = await client.post("/auth/signup", json={"email": email, "password": "password123"})
    assert resp.status_code == expected_status

# Parametrize met ids voor leesbare testnamen
@pytest.mark.parametrize("discount,total,expected", [
    (0,   100.0, 100.0),
    (10,  100.0, 90.0),
    (100, 100.0, 0.0),
], ids=["no-discount", "10pct", "full"])
def test_apply_discount(discount, total, expected):
    assert apply_discount(total, discount) == expected
```

### Mocking met pytest-mock

```python
# mocker fixture van pytest-mock
def test_send_email_on_signup(mocker, client):
    mock_send = mocker.patch("app.services.email.send_email")

    client.post("/auth/signup", json={"email": "a@b.com", "password": "pass123"})

    mock_send.assert_called_once_with(
        to="a@b.com",
        subject="Welcome!",
    )

# Omgevingsvariabelen simuleren
def test_feature_flag(monkeypatch):
    monkeypatch.setenv("ENABLE_BETA", "true")
    assert is_beta_enabled() is True

# Een klassemethode simuleren
def test_stripe_charge(mocker):
    mock_charge = mocker.patch("stripe.PaymentIntent.create")
    mock_charge.return_value = {"id": "pi_test", "status": "succeeded"}

    result = charge_card("tok_visa", 1000)

    assert result.payment_intent_id == "pi_test"
    mock_charge.assert_called_once_with(amount=1000, currency="usd")

# Asynchrone functies simuleren
async def test_external_api(mocker):
    mocker.patch("app.clients.github.fetch_repo", return_value={"stars": 100})
    result = await get_repo_stats("anthropics/anthropic-sdk-python")
    assert result.stars == 100
```

### Markers en selectieve testuitvoeringen

```python
# Tests markeren
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
# Alleen smoke tests uitvoeren
pytest -m smoke

# Langzame tests uitsluiten
pytest -m "not slow"

# Specifiek bestand of test uitvoeren
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user

# Tests uitvoeren die overeenkomen met een zoekwoord
pytest -k "email"

# Stoppen bij de eerste mislukking
pytest -x

# De 10 langzaamste tests tonen
pytest --durations=10
```

### Coverage

```bash
# Uitvoeren met coverage
pytest --cov=src --cov-report=html --cov-report=term-missing

# Mislukken als coverage onder 80% daalt
pytest --cov=src --cov-fail-under=80

# Coverage voor een specifiek bestand
pytest --cov=src/services/users tests/test_users.py
```

```python
# Code uitsluiten van coverage
def legacy_function():  # pragma: no cover
    ...

# Een branch markeren
if TYPE_CHECKING:  # pragma: no cover
    from mymodule import MyType
```

### conftest.py-patronen

```python
# tests/conftest.py — gedeeld over de hele testsuite

# Autouse fixture — wordt automatisch voor elke test uitgevoerd
@pytest.fixture(autouse=True)
def reset_redis(redis_client):
    yield
    redis_client.flushdb()  # na elke test opruimen

# Gedeeld over meerdere testbestanden
@pytest.fixture(scope="module")
def seed_data(db):
    """DB één keer per module seeden — sneller dan per test."""
    UserFactory.create_batch(10, session=db)
    yield
    db.query(User).delete()

# tests/api/conftest.py — fixtures beperkt tot de api/-map
@pytest.fixture
def auth_headers(user):
    token = create_token(user.id)
    return {"Authorization": f"Bearer {token}"}
```

### Snapshot-testen

```python
# pip install syrupy
from syrupy import SnapshotAssertion

def test_user_response(snapshot: SnapshotAssertion, client):
    resp = client.get("/users/1")
    assert resp.json() == snapshot  # maakt snapshot aan bij eerste uitvoering, vergelijkt daarna

# Snapshots bijwerken bij opzettelijke wijziging van uitvoer
# pytest --snapshot-update
```

## Voorbeeld

**Gebruiker:** Tests schrijven voor een FastAPI POST /auth/login eindpunt: correcte inloggegevens geven 200 + JWT terug, fout wachtwoord geeft 401 terug, inactief account geeft 403 terug, rate limiting geeft 429 na 5 pogingen.

**Verwachte uitvoer:**
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
