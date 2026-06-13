---
name: refactor
description: "Safe code refactoring: extract function/class, rename, split files, simplify conditionals, remove duplication — with test coverage at every step"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../refactor.md).

# Refactor Vaardigheid

## Wanneer activeren
- Een functie is te lang en moet worden opgesplitst in kleinere, benoemde functies
- Code is op 2+ plaatsen gedupliceerd en moet worden geëxtraheerd
- Een variabele- of functienaam weerspiegelt niet meer wat het doet
- Een bestand is te groot geworden en moet worden opgesplitst in modules
- Geneste conditionals zijn moeilijk te lezen en moeten worden vereenvoudigd
- U wilt veilig refactoren waarbij tests regressies opvangen

## Wanneer NIET gebruiken
- Architectonische herschrijvingen (frameworks wijzigen, databases vervangen) — te grote scope
- Refactoring van ongetest code zonder eerst een testharnas toe te voegen — riskant
- Performance-optimalisatie — eerst profileren, dan de perf-vaardigheid gebruiken
- Wijzigingen die het externe gedrag veranderen — dat is een feature, geen refactor

## Instructies

### Kernprincipe: refactor in kleine stappen, test bij elke stap

Het grootste risico bij refactoring is iets kapotmaken dat vroeger werkte. Het veiligste patroon:

```
1. Tests uitvoeren → groen bevestigen
2. Één kleine refactor uitvoeren
3. Tests uitvoeren → bevestigen nog steeds groen
4. Committen
5. Herhalen
```

Voer nooit meerdere refactors uit in dezelfde commit. Elke commit moet een enkele, omkeerbare stap zijn.

### Refactor-typen en wanneer elk te gebruiken

**Functie extraheren** — een codeblok doet één identificeerbaar ding:
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

**Klasse extraheren** — een groep functies deelt toestand en hoort bij elkaar:
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

**Hernoemen** — naam komt niet meer overeen met betekenis:
```python
# Before
def get_data(x): ...     # what data? what is x?

# After
def fetch_user_by_id(user_id: int) -> User: ...
```

**Conditionals vereenvoudigen** — geneste ifs zijn moeilijk te redeneren:
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

**Duplicatie verwijderen** — dezelfde logica verschijnt op 2+ plaatsen:
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

**Groot bestand opsplitsen** — bestand heeft meerdere niet-gerelateerde verantwoordelijkheden:
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

### De vaardigheid aanroepen

```
/refactor

Code: [code plakken of bestandspad opgeven]
Goal: [functie extraheren / hernoemen / vereenvoudigen / opsplitsen / duplicatie verwijderen]
Constraint: [dezelfde publieke API behouden / moet in één bestand blijven / etc.]
```

Of:
```
/refactor

De functie `process_payment()` in src/billing/payments.py heeft 120 regels.
Extraheer de validatielogica en de Stripe API-aanroep in afzonderlijke functies.
Tests staan in tests/test_payments.py — voer ze uit om te verifiëren dat niets kapot gaat.
```

### Uitvoerformaat

Claude produceert:
1. **Refactorplan** — wat er verandert en waarom
2. **Stapsgewijze diffs** — één kleine wijziging tegelijk
3. **Testopdracht** — wat na elke stap uit te voeren
4. **Eindtoestand** — de volledige gerefactorde code

## Voorbeeld

**Voor:**
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

**Refactorplan:**
1. `validateSignupInput()` extraheren → testbaar, herbruikbaar
2. Service-functie `createUser()` extraheren → DB-logica uit de route-handler
3. `generateAuthToken()` extraheren → ook herbruikbaar voor login

**Na:**
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
