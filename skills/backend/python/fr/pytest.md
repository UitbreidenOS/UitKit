---
name: pytest
description: "pytest deep dive: fixtures, parametrize, markers, mocking, async tests, coverage, conftest patterns, and CI integration"
---

> 🇫🇷 Version française. [English version](../pytest.md).

# Compétence pytest

## Quand activer
- Écriture de tests Python au-delà des simples instructions `assert`
- Mise en place de fixtures pour les sessions DB, clients HTTP ou services externes
- Paramétrisation de tests pour exécuter la même logique sur plusieurs entrées
- Simulation de services externes ou de variables d'environnement
- Exécution de tests asynchrones (FastAPI, asyncpg, aiohttp)
- Configuration de pytest pour un projet (`pyproject.toml`, conftest.py)
- Mise en place de rapports de couverture

## Quand NE PAS utiliser
- Tests de style unittest dans une base de code existante — utiliser le mode de compatibilité unittest de pytest
- Tests de charge — utiliser Locust ou k6 à la place
- Tests basés sur les propriétés — utiliser Hypothesis en complément de pytest

## Instructions

### Configuration du projet

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
asyncio_mode = "auto"          # pytest-asyncio : mode automatique
addopts = [
    "--strict-markers",        # échouer sur les markers non enregistrés
    "-ra",                     # afficher le résumé des échecs et erreurs
    "--tb=short",              # tracebacks plus courts
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

### Fixtures — le concept fondamental

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# La portée contrôle la fréquence de création d'une fixture :
# function (par défaut) | class | module | session

@pytest.fixture(scope="session")
def engine():
    """Un seul engine par session de test — coûteux à créer."""
    return create_async_engine("postgresql+asyncpg://postgres:postgres@localhost/testdb")

@pytest.fixture(scope="function")
async def db(engine):
    """Transaction fraîche par test — annulée après chaque test."""
    async with engine.begin() as conn:
        async with AsyncSession(bind=conn) as session:
            yield session
            await session.rollback()  # annuler toutes les modifications après le test

@pytest.fixture
async def client(db):
    """Client HTTP asynchrone pour FastAPI avec DB de test injectée."""
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
    """Un utilisateur par défaut pour les tests qui en ont besoin."""
    from tests.factories import UserFactory
    return UserFactory(session=db)
```

### Tests asynchrones

```python
import pytest

# pytest-asyncio avec asyncio_mode = "auto" — pas de décorateur nécessaire
async def test_create_user(client: AsyncClient):
    resp = await client.post("/users", json={"email": "alice@example.com", "name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "alice@example.com"

# Ou explicitement
@pytest.mark.asyncio
async def test_fetch_user(db: AsyncSession):
    user = await db.get(User, 1)
    assert user is not None
```

### Parametrize — tester plusieurs cas proprement

```python
import pytest

@pytest.mark.parametrize("email,expected_status", [
    ("valid@example.com", 201),
    ("not-an-email",       422),
    ("",                   422),
    ("a" * 500 + "@b.com", 422),  # trop long
])
async def test_signup_validates_email(client, email, expected_status):
    resp = await client.post("/auth/signup", json={"email": email, "password": "password123"})
    assert resp.status_code == expected_status

# Parametrize avec des ids pour des noms de tests lisibles
@pytest.mark.parametrize("discount,total,expected", [
    (0,   100.0, 100.0),
    (10,  100.0, 90.0),
    (100, 100.0, 0.0),
], ids=["no-discount", "10pct", "full"])
def test_apply_discount(discount, total, expected):
    assert apply_discount(total, discount) == expected
```

### Simulation avec pytest-mock

```python
# fixture mocker de pytest-mock
def test_send_email_on_signup(mocker, client):
    mock_send = mocker.patch("app.services.email.send_email")

    client.post("/auth/signup", json={"email": "a@b.com", "password": "pass123"})

    mock_send.assert_called_once_with(
        to="a@b.com",
        subject="Welcome!",
    )

# Simuler des variables d'environnement
def test_feature_flag(monkeypatch):
    monkeypatch.setenv("ENABLE_BETA", "true")
    assert is_beta_enabled() is True

# Simuler une méthode de classe
def test_stripe_charge(mocker):
    mock_charge = mocker.patch("stripe.PaymentIntent.create")
    mock_charge.return_value = {"id": "pi_test", "status": "succeeded"}

    result = charge_card("tok_visa", 1000)

    assert result.payment_intent_id == "pi_test"
    mock_charge.assert_called_once_with(amount=1000, currency="usd")

# Simuler des fonctions asynchrones
async def test_external_api(mocker):
    mocker.patch("app.clients.github.fetch_repo", return_value={"stars": 100})
    result = await get_repo_stats("anthropics/anthropic-sdk-python")
    assert result.stars == 100
```

### Markers et exécutions sélectives

```python
# Marquer les tests
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
# Exécuter uniquement les smoke tests
pytest -m smoke

# Exclure les tests lents
pytest -m "not slow"

# Exécuter un fichier ou un test spécifique
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user

# Exécuter les tests correspondant à un mot-clé
pytest -k "email"

# S'arrêter au premier échec
pytest -x

# Afficher les 10 tests les plus lents
pytest --durations=10
```

### Couverture

```bash
# Exécuter avec couverture
pytest --cov=src --cov-report=html --cov-report=term-missing

# Échouer si la couverture descend en dessous de 80 %
pytest --cov=src --cov-fail-under=80

# Couverture pour un fichier spécifique
pytest --cov=src/services/users tests/test_users.py
```

```python
# Exclure du code de la couverture
def legacy_function():  # pragma: no cover
    ...

# Marquer une branche
if TYPE_CHECKING:  # pragma: no cover
    from mymodule import MyType
```

### Modèles conftest.py

```python
# tests/conftest.py — partagé dans toute la suite de tests

# Fixture autouse — s'exécute pour chaque test automatiquement
@pytest.fixture(autouse=True)
def reset_redis(redis_client):
    yield
    redis_client.flushdb()  # nettoyer après chaque test

# Partagé entre plusieurs fichiers de test
@pytest.fixture(scope="module")
def seed_data(db):
    """Initialiser la DB une fois par module — plus rapide qu'une initialisation par test."""
    UserFactory.create_batch(10, session=db)
    yield
    db.query(User).delete()

# tests/api/conftest.py — fixtures limitées au dossier api/
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
    assert resp.json() == snapshot  # crée le snapshot à la première exécution, compare ensuite

# Mettre à jour les snapshots lors d'un changement intentionnel de la sortie
# pytest --snapshot-update
```

## Exemple

**Utilisateur :** Écrire des tests pour un endpoint FastAPI POST /auth/login : les identifiants corrects retournent 200 + JWT, le mauvais mot de passe retourne 401, un compte inactif retourne 403, le rate limiting retourne 429 après 5 tentatives.

**Résultat attendu :**
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
