---
name: test-generator
description: "Generate unit and integration tests for existing code: happy path, edge cases, error handling, mocks — for any language or framework"
---

> 🇩🇪 Deutsche Version. [Englische Version](../test-generator.md).

# Skill: Test-Generator

## Wann aktivieren
- Tests zu ungestestetem Code hinzufügen (Greenfield oder Legacy)
- Eine neue Funktion wurde geschrieben und benötigt Testabdeckung
- Code-Review-Feedback sagt "Tests für X hinzufügen"
- Abdeckung in einer bestimmten Datei oder einem Modul erhöhen
- Tests vor einem Refactoring schreiben, um ein Sicherheitsnetz aufzubauen

## Wann NICHT verwenden
- TDD (Test-First) — schreiben Sie die Tests zuerst selbst, dann implementieren Sie
- E2E-Tests für UI-Flows — verwenden Sie den Browser-Skill mit Playwright stattdessen
- Last-/Leistungstests — verwenden Sie dedizierte Tools (k6, Artillery, Locust)
- Wenn die Funktion so einfach ist, dass Tests keinen Mehrwert bringen

## Anweisungen

### Was Claude mitgeteilt werden soll

```
/test-generator

File: {path/to/file.py oder Funktion einfügen}
Framework: {pytest / jest / vitest / go test / JUnit / RSpec / etc}
Test for: {all exported functions / just `functionName` / the whole module}
Coverage goals: {happy path only / edge cases / error handling / all}
```

Oder einfach:
```
/test-generator

Write tests for the `calculateDiscount()` function in src/billing/discounts.ts.
Include: happy path, zero quantity, negative quantity, max discount cap, rounding edge cases.
```

### Test-Anatomie, der Claude folgt

```python
# pytest-Beispiel
def test_{was}_{szenario}():
    # Arrange — Eingaben und erwartete Ausgabe einrichten
    ...

    # Act — die zu testende Funktion aufrufen
    result = function_under_test(inputs)

    # Assert — das Ergebnis überprüfen
    assert result == expected
```

```typescript
// jest/vitest-Beispiel
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

### Abdeckungs-Checkliste, die Claude durcharbeitet

Für jede getestete Funktion:

- [ ] **Happy Path** — typische, gültige Eingaben → erwartete Ausgabe
- [ ] **Grenzwerte** — minimale/maximale gültige Eingaben, 0, leerer String, leeres Array
- [ ] **Typumwandlung** — Strings, die wie Zahlen aussehen, null vs. undefined
- [ ] **Fehlerbedingungen** — ungültige Eingabe, fehlendes Pflichtargument → wirft Ausnahme oder gibt Fehler zurück
- [ ] **Randfälle** — die ungewöhnlichen, aber gültigen domänenspezifischen Szenarien
- [ ] **Nebenwirkungen** — DB-Schreibvorgänge, API-Aufrufe, Datei-I/O → mocken und korrekte Aufrufe überprüfen

### Mocking-Muster

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

### Testbenennungskonventionen

| Muster | Beispiel |
|---------|---------|
| `test_{funktion}_{szenario}` (pytest) | `test_calculate_discount_applies_cap` |
| `it('{macht etwas}')` (jest) | `it('returns null when user not found')` |
| `Test{Funktion}{Szenario}` (Go) | `TestCalculateDiscountAppliesCap` |
| `{methode}_{szenario}__{erwartet}` (NUnit) | `Calculate_NegativeInput__ThrowsArgumentException` |

### Integrationstests

Für Funktionen, die auf die Datenbank oder externe Dienste zugreifen:

```python
# pytest mit einer echten Test-DB
@pytest.mark.integration
def test_create_user_persists_to_db(db_session):
    user = create_user(db_session, email="alice@example.com", password="secret")
    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.id == user.id
```

**Prinzip:** Integrationstests verwenden echte Abhängigkeiten (Test-DB, In-Memory-Queue). Unit-Tests mocken alles außerhalb der Funktionsgrenze.

### Snapshot-Tests (UI / Serialisierung)

```typescript
// Für React-Komponenten oder serialisierte Ausgabe
it('renders the UserCard correctly', () => {
  const { container } = render(<UserCard name="Alice" role="Admin" />)
  expect(container).toMatchSnapshot()
})
```

Sparsam verwenden — Snapshots werden zu Rauschen, wenn sie zu groß sind oder sich zu häufig ändern.

## Beispiel

**Eingabefunktion:**
```python
def apply_coupon(price: float, coupon_code: str) -> float:
    """Apply a coupon code to a price. Raises ValueError for invalid codes."""
    coupons = {"SAVE10": 0.10, "SAVE25": 0.25, "HALF": 0.50}
    if coupon_code not in coupons:
        raise ValueError(f"Invalid coupon code: {coupon_code}")
    return round(price * (1 - coupons[coupon_code]), 2)
```

**Erwartete Tests:**
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

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
