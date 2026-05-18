---
name: test-generator
description: "Generate unit and integration tests for existing code: happy path, edge cases, error handling, mocks — for any language or framework"
---

> 🇪🇸 Versión en español. [Versión en inglés](../test-generator.md).

# Habilidad: Generador de Tests

## Cuándo activar
- Agregar tests a código sin probar (greenfield o legacy)
- Se escribió una nueva función y necesita cobertura de tests
- La retroalimentación de revisión de código dice "agregar tests para X"
- Aumentar la cobertura en un archivo o módulo específico
- Escribir tests antes de un refactoring para establecer una red de seguridad

## Cuándo NO usar
- TDD (test-first) — escribe los tests tú mismo primero, luego implementa
- Tests E2E para flujos de UI — usar la habilidad de navegador con Playwright en su lugar
- Tests de carga/rendimiento — usar herramientas dedicadas (k6, Artillery, Locust)
- Cuando la función es tan simple que los tests no aportan ninguna señal

## Instrucciones

### Qué decirle a Claude

```
/test-generator

File: {path/to/file.py o pegar la función}
Framework: {pytest / jest / vitest / go test / JUnit / RSpec / etc}
Test for: {all exported functions / just `functionName` / the whole module}
Coverage goals: {happy path only / edge cases / error handling / all}
```

O simplemente:
```
/test-generator

Write tests for the `calculateDiscount()` function in src/billing/discounts.ts.
Include: happy path, zero quantity, negative quantity, max discount cap, rounding edge cases.
```

### Anatomía de los tests que Claude sigue

```python
# ejemplo de pytest
def test_{qué}_{escenario}():
    # Arrange — configurar entradas y salida esperada
    ...

    # Act — llamar a la función bajo prueba
    result = function_under_test(inputs)

    # Assert — verificar el resultado
    assert result == expected
```

```typescript
// ejemplo de jest/vitest
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

### Lista de verificación de cobertura que Claude recorre

Para cada función bajo prueba:

- [ ] **Happy path** — entradas típicas y válidas → salida esperada
- [ ] **Valores límite** — entradas mínimas/máximas válidas, 0, cadena vacía, array vacío
- [ ] **Coerción de tipos** — cadenas que parecen números, null vs. undefined
- [ ] **Condiciones de error** — entrada inválida, argumento requerido faltante → lanza excepción o devuelve error
- [ ] **Casos extremos** — los escenarios inusuales pero válidos específicos del dominio
- [ ] **Efectos secundarios** — escrituras en DB, llamadas a API, E/S de archivos → mockear y verificar que se llaman correctamente

### Patrones de mocking

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

### Convenciones de nomenclatura de tests

| Patrón | Ejemplo |
|---------|---------|
| `test_{función}_{escenario}` (pytest) | `test_calculate_discount_applies_cap` |
| `it('{hace algo}')` (jest) | `it('returns null when user not found')` |
| `Test{Función}{Escenario}` (Go) | `TestCalculateDiscountAppliesCap` |
| `{método}_{escenario}__{esperado}` (NUnit) | `Calculate_NegativeInput__ThrowsArgumentException` |

### Tests de integración

Para funciones que acceden a la base de datos o servicios externos:

```python
# pytest con una DB de prueba real
@pytest.mark.integration
def test_create_user_persists_to_db(db_session):
    user = create_user(db_session, email="alice@example.com", password="secret")
    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.id == user.id
```

**Principio:** Los tests de integración usan dependencias reales (DB de prueba, cola en memoria). Los tests unitarios mockean todo lo que está fuera del límite de la función.

### Tests de snapshot (UI / serialización)

```typescript
// Para componentes React o salida serializada
it('renders the UserCard correctly', () => {
  const { container } = render(<UserCard name="Alice" role="Admin" />)
  expect(container).toMatchSnapshot()
})
```

Usar con moderación — los snapshots se convierten en ruido cuando son demasiado grandes o cambian con demasiada frecuencia.

## Ejemplo

**Función de entrada:**
```python
def apply_coupon(price: float, coupon_code: str) -> float:
    """Apply a coupon code to a price. Raises ValueError for invalid codes."""
    coupons = {"SAVE10": 0.10, "SAVE25": 0.25, "HALF": 0.50}
    if coupon_code not in coupons:
        raise ValueError(f"Invalid coupon code: {coupon_code}")
    return round(price * (1 - coupons[coupon_code]), 2)
```

**Tests esperados:**
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

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
