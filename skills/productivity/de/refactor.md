---
name: refactor
description: "Safe code refactoring: extract function/class, rename, split files, simplify conditionals, remove duplication — with test coverage at every step"
---

> 🇩🇪 Deutsche Version. [Englische Version](../refactor.md).

# Refactoring-Kompetenz

## Wann aktivieren
- Eine Funktion ist zu lang und sollte in kleinere, benannte Funktionen aufgeteilt werden
- Code ist an 2+ Stellen dupliziert und sollte extrahiert werden
- Ein Variablen- oder Funktionsname spiegelt nicht mehr wider, was er tut
- Eine Datei ist zu groß geworden und sollte in Module aufgeteilt werden
- Verschachtelte Conditionals sind schwer zu lesen und sollten vereinfacht werden
- Sie möchten sicher refactoren, wobei Tests Regressionen abfangen

## Wann NICHT verwenden
- Architektonische Umschreibungen (Framework-Wechsel, DB-Austausch) — zu viel Umfang
- Refactoring von ungetestetem Code ohne vorherigen Testrahmen — riskant
- Performance-Optimierung — zuerst profilen, dann die perf-Kompetenz nutzen
- Änderungen, die das externe Verhalten verändern — das ist ein Feature, kein Refactoring

## Anweisungen

### Grundprinzip: in kleinen Schritten refactoren, bei jedem Schritt testen

Das größte Risiko beim Refactoring ist, etwas zu brechen, das vorher funktioniert hat. Das sicherste Muster:

```
1. Tests ausführen → grün bestätigen
2. Ein kleines Refactoring durchführen
3. Tests ausführen → immer noch grün bestätigen
4. Committen
5. Wiederholen
```

Niemals mehrere Refactorings in demselben Commit durchführen. Jeder Commit sollte ein einzelner, reversibler Schritt sein.

### Refactoring-Typen und wann welchen verwenden

**Funktion extrahieren** — ein Codeblock macht eine identifizierbare Sache:
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

**Klasse extrahieren** — eine Gruppe von Funktionen teilt Zustand und gehört zusammen:
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

**Umbenennen** — Name entspricht nicht mehr der Bedeutung:
```python
# Before
def get_data(x): ...     # what data? what is x?

# After
def fetch_user_by_id(user_id: int) -> User: ...
```

**Conditionals vereinfachen** — verschachtelte ifs sind schwer nachzuvollziehen:
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

**Duplikation entfernen** — dieselbe Logik erscheint an 2+ Stellen:
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

**Große Datei aufteilen** — die Datei hat mehrere unzusammenhängende Belange:
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

### Die Kompetenz aufrufen

```
/refactor

Code: [Code einfügen oder Dateipfad angeben]
Goal: [Funktion extrahieren / umbenennen / vereinfachen / aufteilen / Duplikation entfernen]
Constraint: [dieselbe öffentliche API behalten / muss in einer Datei bleiben / usw.]
```

Oder:
```
/refactor

Die Funktion `process_payment()` in src/billing/payments.py hat 120 Zeilen.
Die Validierungslogik und den Stripe-API-Aufruf in separate Funktionen extrahieren.
Tests befinden sich in tests/test_payments.py — ausführen, um zu verifizieren, dass nichts bricht.
```

### Ausgabeformat

Claude produziert:
1. **Refactoring-Plan** — was sich ändert und warum
2. **Schrittweise Diffs** — eine kleine Änderung auf einmal
3. **Test-Befehl** — was nach jedem Schritt auszuführen ist
4. **Endzustand** — der vollständige refactorte Code

## Beispiel

**Vorher:**
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

**Refactoring-Plan:**
1. `validateSignupInput()` extrahieren → testbar, wiederverwendbar
2. Service-Funktion `createUser()` extrahieren → DB-Logik aus dem Route-Handler heraus
3. `generateAuthToken()` extrahieren → auch für Login wiederverwendbar

**Nachher:**
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

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
