---
name: "pytest"
description: "pytest deep dive: fixtures, parametrize, markers, mocking, async tests, coverage, conftest patterns, and CI integration"
---

# pytest Skill

## When to activate
- Writing Python tests beyond basic `assert` statements
- Setting up fixtures for DB sessions, HTTP clients, or external services
- Parametrising tests to run the same logic across multiple inputs
- Mocking external services or environment variables
- Running async tests (FastAPI, asyncpg, aiohttp)
- Configuring pytest for a project (`pyproject.toml`, conftest.py)
- Setting up coverage reporting

## When NOT to use
- unittest-style tests in an existing codebase — use pytest's unittest compatibility mode
- Load testing — use Locust or k6 instead
- Property-based testing — use Hypothesis alongside pytest

## Instructions

### Project setup

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
asyncio_mode = "auto"          # pytest-asyncio: auto mode
addopts = [
    "--strict-markers",        # fail on unregistered markers
    "-ra",                     # show summary of failures and errors
    "--tb=short",              # shorter tracebacks
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

### Fixtures — the core concept

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Scope controls how often a fixture is created:
# function (default) | class | module | session

@pytest.fixture(scope="session")
def engine():
    """One engine per test session — expensive to create."""
    return create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/testdb")

@pytest.fixture(scope="function")
async def db(engine):
    """Fresh transaction per test — rolls back after each test."""
    async with engine.begin() as conn:
        async with AsyncSession(bind=conn) as session:
            yield session
            await session.rollback()  # undo all changes after the test

@pytest.fixture
async def client(db):
    """Async HTTP client for FastAPI with test DB injected."""
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
    """A default user for tests that need one."""
    from tests.factories import UserFactory
    return UserFactory(session=db)
```

### Async tests

```python
import pytest

# pytest-asyncio with asyncio_mode = "auto" — no decorator needed
async def test_create_user(client: AsyncClient):
    resp = await client.post("/users", json={"email": "alice@example.com", "name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "alice@example.com"

# Or explicitly
@pytest.mark.asyncio
async def test_fetch_user(db: AsyncSession):
    user = await db.get(User, 1)
    assert user is not None
```

### Parametrize — test multiple cases cleanly

```python
import pytest

@pytest.mark.parametrize("email,expected_status", [
    ("valid@example.com", 201),
    ("not-an-email",       422),
    ("",                   422),
    ("a" * 500 + "@b.com", 422),  # too long
])
async def test_signup_validates_email(client, email, expected_status):
    resp = await client.post("/auth/signup", json={"email": email, "password": "password123"})
    assert resp.status_code == expected_status

# Parametrize with ids for readable test names
@pytest.mark.parametrize("discount,total,expected", [
    (0,   100.0, 100.0),
    (10,  100.0, 90.0),
    (100, 100.0, 0.0),
], ids=["no-discount", "10pct", "full"])
def test_apply_discount(discount, total, expected):
    assert apply_discount(total, discount) == expected
```

### Mocking with pytest-mock

```python
# mocker fixture from pytest-mock
def test_send_email_on_signup(mocker, client):
    mock_send = mocker.patch("app.services.email.send_email")

    client.post("/auth/signup", json={"email": "a@b.com", "password": "pass123"})

    mock_send.assert_called_once_with(
        to="a@b.com",
        subject="Welcome!",
    )

# Mock environment variables
def test_feature_flag(monkeypatch):
    monkeypatch.setenv("ENABLE_BETA", "true")
    assert is_beta_enabled() is True

# Mock a class method
def test_stripe_charge(mocker):
    mock_charge = mocker.patch("stripe.PaymentIntent.create")
    mock_charge.return_value = {"id": "pi_test", "status": "succeeded"}

    result = charge_card("tok_visa", 1000)

    assert result.payment_intent_id == "pi_test"
    mock_charge.assert_called_once_with(amount=1000, currency="usd")

# Mock async functions
async def test_external_api(mocker):
    mocker.patch("app.clients.github.fetch_repo", return_value={"stars": 100})
    result = await get_repo_stats("anthropics/anthropic-sdk-python")
    assert result.stars == 100
```

### Markers and selective test runs

```python
# Mark tests
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
# Run only smoke tests
pytest -m smoke

# Exclude slow tests
pytest -m "not slow"

# Run specific file or test
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user

# Run tests matching a keyword
pytest -k "email"

# Stop on first failure
pytest -x

# Show 10 slowest tests
pytest --durations=10
```

### Coverage

```bash
# Run with coverage
pytest --cov=src --cov-report=html --cov-report=term-missing

# Fail if coverage drops below 80%
pytest --cov=src --cov-fail-under=80

# Coverage for a specific file
pytest --cov=src/services/users tests/test_users.py
```

```python
# Exclude code from coverage
def legacy_function():  # pragma: no cover
    ...

# Mark a branch
if TYPE_CHECKING:  # pragma: no cover
    from mymodule import MyType
```

### conftest.py patterns

```python
# tests/conftest.py — shared across the whole test suite

# Autouse fixture — runs for every test automatically
@pytest.fixture(autouse=True)
def reset_redis(redis_client):
    yield
    redis_client.flushdb()  # clean up after every test

# Shared across multiple test files
@pytest.fixture(scope="module")
def seed_data(db):
    """Seed DB once per module — faster than per-test."""
    UserFactory.create_batch(10, session=db)
    yield
    db.query(User).delete()

# tests/api/conftest.py — fixtures scoped to the api/ folder
@pytest.fixture
def auth_headers(user):
    token = create_token(user.id)
    return {"Authorization": f"Bearer {token}"}
```

### Snapshot testing

```python
# pip install syrupy
from syrupy import SnapshotAssertion

def test_user_response(snapshot: SnapshotAssertion, client):
    resp = client.get("/users/1")
    assert resp.json() == snapshot  # creates snapshot on first run, compares after

# Update snapshots when intentionally changing output
# pytest --snapshot-update
```

## Example

**User:** Write tests for a FastAPI POST /auth/login endpoint: correct credentials return 200 + JWT, wrong password returns 401, inactive account returns 403, rate limiting returns 429 after 5 attempts.

**Expected output:**
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
