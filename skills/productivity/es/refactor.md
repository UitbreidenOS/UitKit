---
name: refactor
description: "Safe code refactoring: extract function/class, rename, split files, simplify conditionals, remove duplication — with test coverage at every step"
---

> 🇪🇸 Versión en español. [Versión en inglés](../refactor.md).

# Habilidad de Refactoring

## Cuándo activar
- Una función es demasiado larga y debe dividirse en funciones más pequeñas y con nombre
- El código está duplicado en 2+ lugares y debe extraerse
- Un nombre de variable o función ya no refleja lo que hace
- Un archivo se ha vuelto demasiado grande y debe dividirse en módulos
- Los condicionales anidados son difíciles de leer y deben simplificarse
- Quiere refactorizar de forma segura con tests detectando regresiones

## Cuándo NO usar
- Reescrituras arquitectónicas (cambiar frameworks, reemplazar bases de datos) — demasiado alcance
- Refactorizar código sin tests sin antes añadir un arnés de pruebas — arriesgado
- Optimización de rendimiento — primero perfile, luego use la habilidad perf
- Cambios que alteran el comportamiento externo — eso es una funcionalidad, no un refactor

## Instrucciones

### Principio fundamental: refactorizar en pequeños pasos, probar en cada paso

El mayor riesgo en el refactoring es romper algo que antes funcionaba. El patrón más seguro:

```
1. Ejecutar tests → confirmar verde
2. Hacer un pequeño refactor
3. Ejecutar tests → confirmar que siguen verdes
4. Hacer commit
5. Repetir
```

Nunca hacer múltiples refactors en el mismo commit. Cada commit debe ser un paso único y reversible.

### Tipos de refactor y cuándo usar cada uno

**Extraer función** — un bloque de código hace una cosa identificable:
```python
# Before — too much in one place
def process_order(order):
    # 20 lines calculating total
    subtotal = sum(item.price * item.qty for item in order.items)
    tax = subtotal * 0.08
    shipping = 4.99 if subtotal < 50 else 0
    total = subtotal + tax + shipping

    # 15 lines sending confirmation
    msg = f"Order {order.id} confirmed. Total: ${total:.2f}"
    send_email(order.email, "Order Confirmed", msg)

# After — named, testable pieces
def calculate_total(order) -> float:
    subtotal = sum(item.price * item.qty for item in order.items)
    tax = subtotal * 0.08
    shipping = 4.99 if subtotal < 50 else 0
    return subtotal + tax + shipping

def send_order_confirmation(order, total: float) -> None:
    msg = f"Order {order.id} confirmed. Total: ${total:.2f}"
    send_email(order.email, "Order Confirmed", msg)

def process_order(order):
    total = calculate_total(order)
    send_order_confirmation(order, total)
```

**Extraer clase** — un grupo de funciones comparten estado y pertenecen juntas:
```python
# Before — functions operating on the same dict
def get_user_name(user_dict): ...
def get_user_email(user_dict): ...
def update_user_email(user_dict, email): ...

# After — cohesive class
class User:
    def __init__(self, data): self._data = data
    @property
    def name(self): return self._data['name']
    @property
    def email(self): return self._data['email']
    def update_email(self, email): self._data['email'] = email
```

**Renombrar** — el nombre ya no coincide con el significado:
```python
# Before
def get_data(x): ...     # what data? what is x?

# After
def fetch_user_by_id(user_id: int) -> User: ...
```

**Simplificar condicionales** — los ifs anidados son difíciles de razonar:
```python
# Before — pyramid of doom
if user:
    if user.is_active:
        if user.has_permission("read"):
            return get_data()
        else:
            raise PermissionError()
    else:
        raise UserInactiveError()
else:
    raise UserNotFoundError()

# After — guard clauses (fail fast)
if not user:
    raise UserNotFoundError()
if not user.is_active:
    raise UserInactiveError()
if not user.has_permission("read"):
    raise PermissionError()
return get_data()
```

**Eliminar duplicación** — la misma lógica aparece en 2+ lugares:
```python
# Before — discount logic duplicated in two places
def checkout_price(items, user):
    total = sum(i.price for i in items)
    if user.is_premium:
        total *= 0.9
    return total

def cart_preview_price(items, user):
    total = sum(i.price for i in items)
    if user.is_premium:
        total *= 0.9
    return total

# After — single source of truth
def apply_user_discount(price: float, user) -> float:
    return price * 0.9 if user.is_premium else price

def checkout_price(items, user):
    return apply_user_discount(sum(i.price for i in items), user)

def cart_preview_price(items, user):
    return apply_user_discount(sum(i.price for i in items), user)
```

**Dividir archivo grande** — el archivo tiene múltiples responsabilidades no relacionadas:
```
# Before: one 800-line auth.py with models, services, routes, and utils

# After: split into clear modules
auth/
├── __init__.py
├── models.py      # User, Session data models
├── service.py     # Business logic: login, logout, refresh
├── router.py      # HTTP routes and request/response handling
└── utils.py       # JWT encoding/decoding, password hashing
```

### Invocar la habilidad

```
/refactor

Code: [pegar el código o dar la ruta del archivo]
Goal: [extraer función / renombrar / simplificar / dividir / eliminar duplicación]
Constraint: [mantener la misma API pública / debe permanecer en un archivo / etc.]
```

O:
```
/refactor

La función `process_payment()` en src/billing/payments.py tiene 120 líneas.
Extraer la lógica de validación y la llamada a la API de Stripe en funciones separadas.
Los tests están en tests/test_payments.py — ejecutarlos para verificar que nada se rompe.
```

### Formato de salida

Claude produce:
1. **Plan de refactoring** — qué cambiará y por qué
2. **Diffs paso a paso** — un pequeño cambio a la vez
3. **Comando de test** — qué ejecutar después de cada paso
4. **Estado final** — el código refactorizado completo

## Ejemplo

**Antes:**
```typescript
async function handleSignup(req: Request, res: Response) {
  if (!req.body.email || !req.body.password || req.body.password.length < 8) {
    return res.status(400).json({ error: 'Invalid input' })
  }
  const existing = await db.user.findUnique({ where: { email: req.body.email } })
  if (existing) {
    return res.status(409).json({ error: 'Email taken' })
  }
  const hash = await bcrypt.hash(req.body.password, 10)
  const user = await db.user.create({ data: { email: req.body.email, passwordHash: hash } })
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  res.status(201).json({ token })
}
```

**Plan de refactoring:**
1. Extraer `validateSignupInput()` → testeable, reutilizable
2. Extraer la función de servicio `createUser()` → lógica de DB fuera del manejador de rutas
3. Extraer `generateAuthToken()` → también reutilizable para login

**Después:**
```typescript
function validateSignupInput(body: unknown): { email: string; password: string } {
  if (!body.email || !body.password || body.password.length < 8)
    throw new ValidationError('Email and password (min 8 chars) required')
  return { email: body.email, password: body.password }
}

async function createUser(email: string, password: string): Promise<User> {
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) throw new ConflictError('Email already registered')
  const passwordHash = await bcrypt.hash(password, 10)
  return db.user.create({ data: { email, passwordHash } })
}

function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

async function handleSignup(req: Request, res: Response) {
  const { email, password } = validateSignupInput(req.body)
  const user = await createUser(email, password)
  const token = generateAuthToken(user.id)
  res.status(201).json({ token })
}
```

---
