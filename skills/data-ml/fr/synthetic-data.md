---
name: synthetic-data
description: "Synthetic data generation: realistic relational datasets for testing, seeding, and ML training — Faker, factory patterns, constraint-aware generation"
---

> 🇫🇷 Version française. [English version](../synthetic-data.md).

# Compétence Données Synthétiques

## Quand activer
- Générer des données de test réalistes pour un nouveau schéma de base de données
- Alimenter un environnement de staging ou de démonstration avec des données ressemblant à la production
- Créer des jeux de données pour l'entraînement ou le test de modèles ML sans vraies données personnelles
- Générer des données qui respectent les contraintes de clé étrangère et les règles métier
- Tester en charge une application avec de grands volumes de données réalistes

## Quand NE PAS utiliser
- Tests unitaires simples avec 2 à 3 enregistrements — créez-les directement en ligne
- Données de production — les données synthétiques sont réservées au développement, aux tests et aux démonstrations
- Quand des données réelles anonymisées sont disponibles et autorisées à être utilisées

## Instructions

### Python — Faker + factory_boy

```python
from faker import Faker
from faker.providers import internet, profile, bank
import random
from datetime import datetime, timedelta

fake = Faker()
fake.add_provider(internet)

# Générer un utilisateur réaliste
def make_user():
    created_at = fake.date_time_between(start_date='-2y', end_date='now')
    return {
        "id":           fake.uuid4(),
        "email":        fake.unique.email(),
        "name":         fake.name(),
        "phone":        fake.phone_number(),
        "company":      fake.company(),
        "country":      fake.country_code(),
        "plan":         random.choices(["free", "pro", "enterprise"], weights=[60, 30, 10])[0],
        "is_active":    fake.boolean(chance_of_getting_true=85),
        "created_at":   created_at.isoformat(),
        "last_login":   fake.date_time_between(start_date=created_at, end_date='now').isoformat(),
    }

# Générer une commande réaliste avec contraintes
def make_order(user_id: str, product_ids: list[str]):
    created_at = fake.date_time_between(start_date='-1y', end_date='now')
    status = random.choices(
        ["pending", "processing", "completed", "cancelled", "refunded"],
        weights=[5, 10, 70, 10, 5]
    )[0]
    items = [
        {
            "product_id": random.choice(product_ids),
            "quantity":   random.randint(1, 5),
            "unit_price": round(random.uniform(9.99, 299.99), 2),
        }
        for _ in range(random.randint(1, 4))
    ]
    subtotal = sum(i["quantity"] * i["unit_price"] for i in items)
    return {
        "id":          fake.uuid4(),
        "user_id":     user_id,
        "status":      status,
        "items":       items,
        "subtotal":    round(subtotal, 2),
        "tax":         round(subtotal * 0.08, 2),
        "total":       round(subtotal * 1.08, 2),
        "created_at":  created_at.isoformat(),
        "completed_at": fake.date_time_between(start_date=created_at, end_date='now').isoformat()
                        if status == "completed" else None,
    }

# Générer un jeu de données complet respectant les contraintes
def generate_dataset(n_users=100, orders_per_user=5):
    users = [make_user() for _ in range(n_users)]
    products = [
        {
            "id":       fake.uuid4(),
            "name":     fake.catch_phrase(),
            "sku":      fake.bothify("??-####"),
            "price":    round(random.uniform(9.99, 299.99), 2),
            "category": random.choice(["software", "hardware", "service", "subscription"]),
            "stock":    random.randint(0, 1000),
        }
        for _ in range(20)
    ]
    product_ids = [p["id"] for p in products]
    orders = [
        make_order(user["id"], product_ids)
        for user in users
        for _ in range(random.randint(0, orders_per_user))
    ]
    return {"users": users, "products": products, "orders": orders}
```

### TypeScript — faker-js avec intégrité relationnelle

```typescript
import { faker } from '@faker-js/faker'

// Graine pour des données reproductibles
faker.seed(12345)  // même graine = mêmes données à chaque exécution

interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

interface Order {
  id: string
  userId: string   // fait toujours référence à un vrai ID utilisateur
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
}

function makeUser(): User {
  return {
    id:        faker.string.uuid(),
    email:     faker.internet.email(),
    name:      faker.person.fullName(),
    plan:      faker.helpers.weightedArrayElement([
      { weight: 60, value: 'free' as const },
      { weight: 30, value: 'pro' as const },
      { weight: 10, value: 'enterprise' as const },
    ]),
    createdAt: faker.date.past({ years: 2 }),
  }
}

function makeOrder(userId: string): Order {
  return {
    id:       faker.string.uuid(),
    userId,   // toujours un vrai ID utilisateur — pas d'enregistrements orphelins
    amount:   parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    status:   faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  }
}

// Générer des données relationnelles — utilisateurs en premier, puis commandes les référençant
function generateDataset(userCount = 50) {
  const users = faker.helpers.multiple(makeUser, { count: userCount })
  const orders = users.flatMap(user =>
    faker.helpers.multiple(() => makeOrder(user.id), {
      count: faker.number.int({ min: 0, max: 10 }),
    })
  )
  return { users, orders }
}
```

### Patterns d'insertion en masse

**PostgreSQL avec COPY (le plus rapide pour de gros volumes) :**
```python
import psycopg2
import csv
import io
from faker import Faker

fake = Faker()

def bulk_insert_users(conn, count: int = 100_000):
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    for _ in range(count):
        writer.writerow([
            fake.uuid4(),
            fake.unique.email(),
            fake.name(),
            fake.random_element(["free", "pro", "enterprise"]),
            fake.date_time_between(start_date='-2y', end_date='now').isoformat(),
        ])

    buffer.seek(0)
    with conn.cursor() as cur:
        cur.copy_expert(
            "COPY users (id, email, name, plan, created_at) FROM STDIN WITH CSV",
            buffer
        )
    conn.commit()
    print(f"Inserted {count:,} users")
```

**Création en lot avec Prisma :**
```typescript
// Générer et insérer 10 000 utilisateurs par lots
async function seedDatabase(prisma: PrismaClient) {
  const BATCH_SIZE = 1000
  const TOTAL = 10_000

  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const users = faker.helpers.multiple(makeUser, { count: BATCH_SIZE })
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    })
    console.log(`Inserted users ${i + 1}–${Math.min(i + BATCH_SIZE, TOTAL)}`)
  }
}
```

### Génération de données de séries temporelles

```python
def generate_daily_metrics(days: int = 365, base_value: float = 1000):
    """Générer des séries temporelles réalistes avec tendance, saisonnalité et bruit."""
    import math, random
    from datetime import date, timedelta

    start = date.today() - timedelta(days=days)
    metrics = []

    for i in range(days):
        current_date = start + timedelta(days=i)

        # Tendance à long terme (croissance de 10% sur la période)
        trend = base_value * (1 + 0.1 * i / days)

        # Saisonnalité hebdomadaire (plus bas le week-end)
        day_of_week = current_date.weekday()
        seasonality = 1.0 if day_of_week < 5 else 0.6

        # Bruit aléatoire (±15%)
        noise = random.uniform(0.85, 1.15)

        value = round(trend * seasonality * noise, 2)
        metrics.append({
            "date":  current_date.isoformat(),
            "value": value,
            "day_of_week": current_date.strftime("%A"),
        })

    return metrics
```

### Cas limites et contraintes de règles métier

```python
def generate_subscription_events(user: dict, months: int = 12):
    """Générer des événements réalistes du cycle de vie d'abonnement pour un utilisateur."""
    events = []
    current_date = datetime.fromisoformat(user["created_at"])
    plan = "free"

    for month in range(months):
        current_date += timedelta(days=30)

        # 20% de chance de mise à niveau chaque mois si gratuit
        if plan == "free" and random.random() < 0.2:
            plan = random.choice(["pro", "enterprise"])
            events.append({"type": "upgrade", "plan": plan, "date": current_date.isoformat()})

        # 5% de churn mensuel pour les utilisateurs payants
        elif plan != "free" and random.random() < 0.05:
            events.append({"type": "cancel", "date": current_date.isoformat()})
            plan = "free"

        # 10% de chance de déclassement pour les utilisateurs enterprise
        elif plan == "enterprise" and random.random() < 0.1:
            plan = "pro"
            events.append({"type": "downgrade", "plan": plan, "date": current_date.isoformat()})

    return events
```

### Anonymisation des données réelles (quand des données réelles existent)

```python
def anonymise_user(real_user: dict) -> dict:
    """Remplacer les données personnelles par des valeurs fictives mais réalistes, préserver la structure."""
    return {
        **real_user,
        "email":   fake.email(),               # email fictif, même format de domaine
        "name":    fake.name(),                # nom fictif, même locale
        "phone":   fake.phone_number(),        # téléphone fictif, même format national
        "ip":      fake.ipv4(),               # IP fictive
        # Conserver les champs non-personnels
        "plan":    real_user["plan"],
        "created_at": real_user["created_at"],
    }
```

## Exemple

**Utilisateur :** Alimenter un environnement de démonstration avec 500 utilisateurs, 2 000 commandes et 365 jours de métriques de revenus quotidiennes — avec des distributions réalistes et une intégrité référentielle.

**Résultat attendu :**
```python
# scripts/seed_demo.py
def seed():
    users = generate_users(500)           # 60% free, 30% pro, 10% enterprise
    products = generate_products(25)
    orders = generate_orders(users, products, avg_per_user=4)  # ~2 000 au total
    metrics = generate_daily_metrics(days=365, base_value=5000)

    # Insérer tout en respectant les contraintes FK
    db.users.insert_many(users)           # utilisateurs en premier
    db.products.insert_many(products)
    db.orders.insert_many(orders)        # commandes référencent des IDs utilisateur/produit valides
    db.metrics.insert_many(metrics)

    print(f"Seeded: {len(users)} users, {len(orders)} orders, {len(metrics)} daily metrics")
```

---
