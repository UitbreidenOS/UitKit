---
name: refactor
description: "Safe code refactoring: extract function/class, rename, split files, simplify conditionals, remove duplication — with test coverage at every step"
---

> 🇫🇷 Version française. [English version](../refactor.md).

# Compétence Refactoring

## Quand activer
- Une fonction est trop longue et doit être divisée en fonctions plus petites et nommées
- Du code est dupliqué dans 2+ endroits et doit être extrait
- Un nom de variable ou de fonction ne reflète plus ce qu'il fait
- Un fichier est devenu trop volumineux et doit être divisé en modules
- Des conditionnelles imbriquées sont difficiles à lire et doivent être simplifiées
- Vous souhaitez refactoriser en toute sécurité avec des tests détectant les régressions

## Quand NE PAS utiliser
- Réécritures architecturales (changement de frameworks, remplacement de bases de données) — portée trop large
- Refactorisation de code non testé sans d'abord ajouter un harnais de test — risqué
- Optimisation des performances — profilez d'abord, puis utilisez la compétence perf
- Modifications qui changent le comportement externe — c'est une fonctionnalité, pas un refactoring

## Instructions

### Principe fondamental : refactoriser par petites étapes, tester à chaque étape

Le plus grand risque dans le refactoring est de casser quelque chose qui fonctionnait auparavant. Le schéma le plus sûr :

```
1. Lancer les tests → confirmer qu'ils sont verts
2. Faire un petit refactoring
3. Lancer les tests → confirmer qu'ils sont toujours verts
4. Valider (commit)
5. Répéter
```

Ne jamais faire plusieurs refactorings dans le même commit. Chaque commit doit être une étape unique et réversible.

### Types de refactoring et quand utiliser chacun

**Extraire une fonction** — un bloc de code fait une chose identifiable :
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

**Extraire une classe** — un groupe de fonctions partagent un état et vont ensemble :
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

**Renommer** — le nom ne correspond plus au sens :
```python
# Before
def get_data(x): ...     # what data? what is x?

# After
def fetch_user_by_id(user_id: int) -> User: ...
```

**Simplifier les conditionnelles** — les if imbriqués sont difficiles à raisonner :
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

**Supprimer la duplication** — la même logique apparaît dans 2+ endroits :
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

**Diviser un fichier volumineux** — le fichier a plusieurs préoccupations sans rapport :
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

### Invoquer la compétence

```
/refactor

Code: [coller le code ou donner le chemin du fichier]
Goal: [extraire une fonction / renommer / simplifier / diviser / supprimer la duplication]
Constraint: [garder la même API publique / doit rester dans un seul fichier / etc]
```

Ou :
```
/refactor

La fonction `process_payment()` dans src/billing/payments.py fait 120 lignes.
Extraire la logique de validation et l'appel à l'API Stripe dans des fonctions séparées.
Les tests sont dans tests/test_payments.py — les lancer pour vérifier que rien ne casse.
```

### Format de sortie

Claude produit :
1. **Plan de refactoring** — ce qui va changer et pourquoi
2. **Diffs étape par étape** — un petit changement à la fois
3. **Commande de test** — ce qu'il faut lancer après chaque étape
4. **État final** — le code refactorisé complet

## Exemple

**Avant :**
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

**Plan de refactoring :**
1. Extraire `validateSignupInput()` → testable, réutilisable
2. Extraire la fonction service `createUser()` → logique DB hors du gestionnaire de route
3. Extraire `generateAuthToken()` → réutilisable pour la connexion aussi

**Après :**
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
