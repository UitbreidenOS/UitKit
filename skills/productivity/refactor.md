---
name: refactor
description: "Safe code refactoring: extract function/class, rename, split files, simplify conditionals, remove duplication — with test coverage at every step"
updated: 2026-06-13
---

# Refactor Skill

## When to activate
- A function is too long and should be split into smaller, named functions
- Code is duplicated across 2+ places and should be extracted
- A variable or function name no longer reflects what it does
- A file has grown too large and should be split into modules
- Nested conditionals are hard to read and should be simplified
- You want to refactor safely with tests catching regressions

## When NOT to use
- Architectural rewrites (changing frameworks, replacing DBs) — too much scope
- Refactoring untested code without first adding a test harness — risky
- Performance optimisation — profile first, then use the perf skill
- Changes that alter external behaviour — that's a feature, not a refactor

## Instructions

### Core principle: refactor in small steps, test at each step

The biggest risk in refactoring is breaking something that used to work. The safest pattern:

```
1. Run tests → confirm green
2. Make one small refactor
3. Run tests → confirm still green
4. Commit
5. Repeat
```

Never do multiple refactors in the same commit. Each commit should be a single, reversible step.

### Refactor types and when to use each

**Extract function** — a block of code does one identifiable thing:
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

**Extract class** — a group of functions share state and belong together:
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

**Rename** — name no longer matches meaning:
```python
# Before
def get_data(x): ...     # what data? what is x?

# After
def fetch_user_by_id(user_id: int) -> User: ...
```

**Simplify conditionals** — nested ifs are hard to reason about:
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

**Remove duplication** — same logic appears in 2+ places:
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

**Split large file** — file has multiple unrelated concerns:
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

### Invoking the skill

```
/refactor

Code: [paste code or give file path]
Goal: [extract function / rename / simplify / split / remove duplication]
Constraint: [keep the public API the same / must stay in one file / etc]
```

Or:
```
/refactor

The `process_payment()` function in src/billing/payments.py is 120 lines.
Extract the validation logic and the Stripe API call into separate functions.
Tests are in tests/test_payments.py — run them to verify nothing breaks.
```

### Output format

Claude produces:
1. **Refactor plan** — what will change and why
2. **Step-by-step diffs** — one small change at a time
3. **Test command** — what to run after each step
4. **Final state** — the complete refactored code

## Example

**Before:**
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

**Refactor plan:**
1. Extract `validateSignupInput()` → testable, reusable
2. Extract `createUser()` service function → DB logic out of route handler
3. Extract `generateAuthToken()` → reusable for login too

**After:**
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

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
