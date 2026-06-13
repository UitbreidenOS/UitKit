---
name: test-generator
description: "Generate unit and integration tests for existing code: happy path, edge cases, error handling, mocks — for any language or framework"
---

> 🇫🇷 Version française. [English version](../test-generator.md).

# Compétence : Générateur de Tests

## Quand activer
- Ajout de tests à du code non testé (nouveau projet ou code hérité)
- Une nouvelle fonction a été écrite et nécessite une couverture de tests
- Le retour de révision de code indique "ajouter des tests pour X"
- Augmentation de la couverture sur un fichier ou module spécifique
- Écriture de tests avant un refactoring pour établir un filet de sécurité

## Quand NE PAS utiliser
- TDD (test-first) — écrivez d'abord les tests vous-même, puis implémentez
- Tests E2E pour les flux d'interface utilisateur — utilisez la compétence navigateur avec Playwright
- Tests de charge/performance — utilisez des outils dédiés (k6, Artillery, Locust)
- Quand la fonction est si simple que les tests n'apportent aucune valeur

## Instructions

### Ce qu'il faut indiquer à Claude

```
/test-generator

File: {path/to/file.py ou collez la fonction}
Framework: {pytest / jest / vitest / go test / JUnit / RSpec / etc}
Test for: {all exported functions / just `functionName` / the whole module}
Coverage goals: {happy path only / edge cases / error handling / all}
```

Ou simplement :
```
/test-generator

Write tests for the `calculateDiscount()` function in src/billing/discounts.ts.
Include: happy path, zero quantity, negative quantity, max discount cap, rounding edge cases.
```

### Structure des tests suivie par Claude

```python
# exemple pytest
def test_{quoi}_{scenario}():
    # Arrangement — configurer les entrées et la sortie attendue
    ...

    # Action — appeler la fonction testée
    result = function_under_test(inputs)

    # Assertion — vérifier le résultat
    assert result == expected
```

```typescript
// exemple jest/vitest
describe('calculateDiscount', () => {
  it('applies percentage discount to base price', () => {
    // Arrangement
    const price = 100
    const discountPct = 20

    // Action
    const result = calculateDiscount(price, discountPct)

    // Assertion
    expect(result).toBe(80)
  })
})
```

### Liste de vérification de la couverture utilisée par Claude

Pour chaque fonction testée :

- [ ] **Chemin nominal** — entrées typiques et valides → résultat attendu
- [ ] **Valeurs limites** — valeurs min/max valides, 0, chaîne vide, tableau vide
- [ ] **Coercition de type** — chaînes ressemblant à des nombres, null vs undefined
- [ ] **Conditions d'erreur** — entrée invalide, argument requis manquant → lève une exception ou retourne une erreur
- [ ] **Cas limites** — les scénarios inhabituels mais valides spécifiques au domaine
- [ ] **Effets de bord** — écritures en base de données, appels API, E/S fichier → simuler et vérifier les appels corrects

### Modèles de simulation (mocking)

**Python (pytest + unittest.mock) :**
```python
from unittest.mock import patch, MagicMock

def test_send_email_calls_smtp(mock_smtp):
    with patch('myapp.email.smtplib.SMTP') as mock_smtp:
        mock_instance = MagicMock()
        mock_smtp.return_value.__enter__ = MagicMock(return_value=mock_instance)

        send_email('user@example.com', 'Hello')

        mock_instance.send_message.assert_called_once()
```

**TypeScript (jest) :**
```typescript
jest.mock('../db/userRepository')
import { findUser } from '../db/userRepository'
const mockFindUser = findUser as jest.MockedFunction<typeof findUser>

it('returns 404 when user not found', async () => {
  mockFindUser.mockResolvedValue(null)
  const res = await request(app).get('/users/999')
  expect(res.status).toBe(404)
})
```

**Go :**
```go
type MockEmailer struct{ called bool }
func (m *MockEmailer) Send(to, body string) error {
    m.called = true
    return nil
}

func TestNotifyUser_CallsEmailer(t *testing.T) {
    mock := &MockEmailer{}
    NotifyUser("user@example.com", mock)
    assert.True(t, mock.called)
}
```

### Conventions de nommage des tests

| Modèle | Exemple |
|---------|---------|
| `test_{fonction}_{scenario}` (pytest) | `test_calculate_discount_applies_cap` |
| `it('{fait quelque chose}')` (jest) | `it('returns null when user not found')` |
| `Test{Fonction}{Scenario}` (Go) | `TestCalculateDiscountAppliesCap` |
| `{methode}_{scenario}__{attendu}` (NUnit) | `Calculate_NegativeInput__ThrowsArgumentException` |

### Tests d'intégration

Pour les fonctions qui accèdent à la base de données ou à des services externes :

```python
# pytest avec une vraie base de données de test
@pytest.mark.integration
def test_create_user_persists_to_db(db_session):
    user = create_user(db_session, email="alice@example.com", password="secret")
    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.id == user.id
```

**Principe :** Les tests d'intégration utilisent de vraies dépendances (base de données de test, file d'attente en mémoire). Les tests unitaires simulent tout ce qui est en dehors des limites de la fonction.

### Tests de snapshot (UI / sérialisation)

```typescript
// Pour les composants React ou la sortie sérialisée
it('renders the UserCard correctly', () => {
  const { container } = render(<UserCard name="Alice" role="Admin" />)
  expect(container).toMatchSnapshot()
})
```

À utiliser avec parcimonie — les snapshots deviennent du bruit quand ils sont trop volumineux ou changent trop souvent.

## Exemple

**Fonction d'entrée :**
```python
def apply_coupon(price: float, coupon_code: str) -> float:
    """Apply a coupon code to a price. Raises ValueError for invalid codes."""
    coupons = {"SAVE10": 0.10, "SAVE25": 0.25, "HALF": 0.50}
    if coupon_code not in coupons:
        raise ValueError(f"Invalid coupon code: {coupon_code}")
    return round(price * (1 - coupons[coupon_code]), 2)
```

**Tests attendus :**
```python
import pytest
from billing.coupons import apply_coupon

def test_apply_coupon_ten_percent():
    assert apply_coupon(100.0, "SAVE10") == 90.0

def test_apply_coupon_twenty_five_percent():
    assert apply_coupon(100.0, "SAVE25") == 75.0

def test_apply_coupon_half_price():
    assert apply_coupon(100.0, "HALF") == 50.0

def test_apply_coupon_rounds_to_two_decimal_places():
    assert apply_coupon(10.0, "SAVE10") == 9.0

def test_apply_coupon_raises_on_invalid_code():
    with pytest.raises(ValueError, match="Invalid coupon code: BOGUS"):
        apply_coupon(100.0, "BOGUS")

def test_apply_coupon_raises_on_empty_code():
    with pytest.raises(ValueError):
        apply_coupon(100.0, "")

def test_apply_coupon_with_decimal_price():
    assert apply_coupon(99.99, "SAVE10") == 89.99
```

---
