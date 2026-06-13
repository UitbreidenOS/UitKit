---
name: test-generator
description: "Generate unit and integration tests for existing code: happy path, edge cases, error handling, mocks — for any language or framework"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../test-generator.md).

# Vaardigheid: Testgenerator

## Wanneer activeren
- Tests toevoegen aan ongeteste code (greenfield of legacy)
- Een nieuwe functie is geschreven en heeft testdekking nodig
- Feedback van code review zegt "voeg tests toe voor X"
- Dekking verhogen op een specifiek bestand of module
- Tests schrijven vóór een refactoring om een vangnet te creëren

## Wanneer NIET gebruiken
- TDD (test-first) — schrijf de tests eerst zelf, implementeer dan
- E2E-tests voor UI-flows — gebruik de browservaardigheid met Playwright in plaats daarvan
- Last-/prestatietests — gebruik toegewijde tools (k6, Artillery, Locust)
- Wanneer de functie zo eenvoudig is dat tests geen waarde toevoegen

## Instructies

### Wat u Claude moet vertellen

```
/test-generator

File: {path/to/file.py of plak de functie}
Framework: {pytest / jest / vitest / go test / JUnit / RSpec / etc}
Test for: {all exported functions / just `functionName` / the whole module}
Coverage goals: {happy path only / edge cases / error handling / all}
```

Of gewoon:
```
/test-generator

Write tests for the `calculateDiscount()` function in src/billing/discounts.ts.
Include: happy path, zero quantity, negative quantity, max discount cap, rounding edge cases.
```

### Testanatomie die Claude volgt

```python
# pytest-voorbeeld
def test_{wat}_{scenario}():
    # Arrange — invoer en verwachte uitvoer instellen
    ...

    # Act — de te testen functie aanroepen
    result = function_under_test(inputs)

    # Assert — het resultaat verifiëren
    assert result == expected
```

```typescript
// jest/vitest-voorbeeld
describe('calculateDiscount', () => {
  it('applies percentage discount to base price', () => {
    // Arrange
    const price = 100
    const discountPct = 20

    // Act
    const result = calculateDiscount(price, discountPct)

    // Assert
    expect(result).toBe(80)
  })
})
```

### Dekkings-checklist die Claude doorloopt

Voor elke geteste functie:

- [ ] **Happy path** — typische, geldige invoer → verwachte uitvoer
- [ ] **Grenswaarden** — minimale/maximale geldige invoer, 0, lege string, lege array
- [ ] **Type-omzetting** — strings die op getallen lijken, null vs. undefined
- [ ] **Foutcondities** — ongeldige invoer, ontbrekend verplicht argument → gooit uitzondering of geeft fout terug
- [ ] **Randgevallen** — de ongebruikelijke maar geldige domeinspecifieke scenario's
- [ ] **Neveneffecten** — DB-schrijfacties, API-aanroepen, bestands-I/O → mocken en correct aanroepen verifiëren

### Mocking-patronen

**Python (pytest + unittest.mock):**
```python
from unittest.mock import patch, MagicMock

def test_send_email_calls_smtp(mock_smtp):
    with patch('myapp.email.smtplib.SMTP') as mock_smtp:
        mock_instance = MagicMock()
        mock_smtp.return_value.__enter__ = MagicMock(return_value=mock_instance)

        send_email('user@example.com', 'Hello')

        mock_instance.send_message.assert_called_once()
```

**TypeScript (jest):**
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

**Go:**
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

### Testbenoemingsconventies

| Patroon | Voorbeeld |
|---------|---------|
| `test_{functie}_{scenario}` (pytest) | `test_calculate_discount_applies_cap` |
| `it('{doet iets}')` (jest) | `it('returns null when user not found')` |
| `Test{Functie}{Scenario}` (Go) | `TestCalculateDiscountAppliesCap` |
| `{methode}_{scenario}__{verwacht}` (NUnit) | `Calculate_NegativeInput__ThrowsArgumentException` |

### Integratietests

Voor functies die de database of externe diensten aanspreken:

```python
# pytest met een echte test-DB
@pytest.mark.integration
def test_create_user_persists_to_db(db_session):
    user = create_user(db_session, email="alice@example.com", password="secret")
    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.id == user.id
```

**Principe:** Integratietests gebruiken echte afhankelijkheden (test-DB, in-memory queue). Unit-tests mocken alles buiten de functiegrens.

### Snapshot-tests (UI / serialisatie)

```typescript
// Voor React-componenten of geserialiseerde uitvoer
it('renders the UserCard correctly', () => {
  const { container } = render(<UserCard name="Alice" role="Admin" />)
  expect(container).toMatchSnapshot()
})
```

Gebruik spaarzaam — snapshots worden ruis wanneer ze te groot zijn of te vaak veranderen.

## Voorbeeld

**Invoerfunctie:**
```python
def apply_coupon(price: float, coupon_code: str) -> float:
    """Apply a coupon code to a price. Raises ValueError for invalid codes."""
    coupons = {"SAVE10": 0.10, "SAVE25": 0.25, "HALF": 0.50}
    if coupon_code not in coupons:
        raise ValueError(f"Invalid coupon code: {coupon_code}")
    return round(price * (1 - coupons[coupon_code]), 2)
```

**Verwachte tests:**
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
