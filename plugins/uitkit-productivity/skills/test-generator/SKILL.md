---
name: "test-generator"
description: "Generate unit and integration tests for existing code: happy path, edge cases, error handling, mocks — for any language or framework"
---

# Test Generator Skill

## When to activate
- Adding tests to untested code (greenfield or legacy)
- A new function was written and needs test coverage
- Code review feedback says "add tests for X"
- Increasing coverage on a specific file or module
- Writing tests before a refactor to establish a safety net

## When NOT to use
- TDD (test-first) — write the tests yourself first, then implement
- E2E tests for UI flows — use the browser skill with Playwright instead
- Load/performance tests — use dedicated tools (k6, Artillery, Locust)
- When the function is so simple that tests add no signal

## Instructions

### What to tell Claude

```
/test-generator

File: {path/to/file.py or paste the function}
Framework: {pytest / jest / vitest / go test / JUnit / RSpec / etc}
Test for: {all exported functions / just `functionName` / the whole module}
Coverage goals: {happy path only / edge cases / error handling / all}
```

Or just:
```
/test-generator

Write tests for the `calculateDiscount()` function in src/billing/discounts.ts.
Include: happy path, zero quantity, negative quantity, max discount cap, rounding edge cases.
```

### Test anatomy Claude follows

```python
# pytest example
def test_{what}_{scenario}():
    # Arrange — set up inputs and expected output
    ...

    # Act — call the function under test
    result = function_under_test(inputs)

    # Assert — verify the outcome
    assert result == expected
```

```typescript
// jest/vitest example
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

### Coverage checklist Claude works through

For every function under test:

- [ ] **Happy path** — typical, valid inputs → expected output
- [ ] **Boundary values** — min/max valid inputs, 0, empty string, empty array
- [ ] **Type coercion** — strings that look like numbers, null vs undefined
- [ ] **Error conditions** — invalid input, missing required arg → throws or returns error
- [ ] **Edge cases** — the unusual-but-valid scenarios specific to the domain
- [ ] **Side effects** — DB writes, API calls, file IO → mock and verify called correctly

### Mocking patterns

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

### Test naming conventions

| Pattern | Example |
|---------|---------|
| `test_{function}_{scenario}` (pytest) | `test_calculate_discount_applies_cap` |
| `it('{does something}')` (jest) | `it('returns null when user not found')` |
| `Test{Function}{Scenario}` (Go) | `TestCalculateDiscountAppliesCap` |
| `{method}_{scenario}__{expected}` (NUnit) | `Calculate_NegativeInput__ThrowsArgumentException` |

### Integration tests

For functions that hit the database or external services:

```python
# pytest with a real test DB
@pytest.mark.integration
def test_create_user_persists_to_db(db_session):
    user = create_user(db_session, email="alice@example.com", password="secret")
    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.id == user.id
```

**Principle:** Integration tests use real dependencies (test DB, in-memory queue). Unit tests mock everything outside the function boundary.

### Snapshot tests (UI / serialization)

```typescript
// For React components or serialized output
it('renders the UserCard correctly', () => {
  const { container } = render(<UserCard name="Alice" role="Admin" />)
  expect(container).toMatchSnapshot()
})
```

Use sparingly — snapshots become noise when they're too large or change too often.

## Example

**Input function:**
```python
def apply_coupon(price: float, coupon_code: str) -> float:
    """Apply a coupon code to a price. Raises ValueError for invalid codes."""
    coupons = {"SAVE10": 0.10, "SAVE25": 0.25, "HALF": 0.50}
    if coupon_code not in coupons:
        raise ValueError(f"Invalid coupon code: {coupon_code}")
    return round(price * (1 - coupons[coupon_code]), 2)
```

**Expected tests:**
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
