---
name: synthetic-data
description: "Synthetic data generation: realistic relational datasets for testing, seeding, and ML training — Faker, factory patterns, constraint-aware generation"
---

> 🇩🇪 Deutsche Version. [Englische Version](../synthetic-data.md).

# Synthetische Daten Skill

## Wann aktivieren
- Realistische Testdaten für ein neues Datenbankschema generieren
- Eine Staging- oder Demo-Umgebung mit produktionsähnlichen Daten befüllen
- Datensätze für ML-Modelltraining oder -tests ohne echte personenbezogene Daten erstellen
- Daten generieren, die Fremdschlüssel-Einschränkungen und Geschäftsregeln respektieren
- Eine Anwendung mit großen Mengen realistischer Daten einem Stresstest unterziehen

## Wann NICHT verwenden
- Einfache Unit-Tests mit 2–3 Datensätzen — direkt inline erstellen
- Produktionsdaten — synthetische Daten sind nur für Entwicklung, Test und Demo
- Wenn echte anonymisierte Daten verfügbar und zur Nutzung freigegeben sind

## Anweisungen

### Python — Faker + factory_boy

```python
from faker import Faker
from faker.providers import internet, profile, bank
import random
from datetime import datetime, timedelta

fake = Faker()
fake.add_provider(internet)

# Einen realistischen Benutzer generieren
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

# Eine realistische Bestellung mit Einschränkungen generieren
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

# Einen vollständigen, einschränkungsbewussten Datensatz generieren
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

### TypeScript — faker-js mit relationaler Integrität

```typescript
import { faker } from '@faker-js/faker'

// Seed für reproduzierbare Daten
faker.seed(12345)  // gleicher Seed = gleiche Daten bei jeder Ausführung

interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

interface Order {
  id: string
  userId: string   // referenziert immer eine echte Benutzer-ID
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
    userId,   // immer eine echte Benutzer-ID — keine verwaisten Datensätze
    amount:   parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    status:   faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  }
}

// Relationale Daten generieren — erst Benutzer, dann Bestellungen die sie referenzieren
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

### Massen-Einfüge-Muster

**PostgreSQL mit COPY (am schnellsten für große Mengen):**
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

**Prisma-Batch-Erstellung:**
```typescript
// 10.000 Benutzer in Batches generieren und einfügen
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

### Zeitreihendaten generieren

```python
def generate_daily_metrics(days: int = 365, base_value: float = 1000):
    """Realistische Zeitreihen mit Trend, Saisonalität und Rauschen generieren."""
    import math, random
    from datetime import date, timedelta

    start = date.today() - timedelta(days=days)
    metrics = []

    for i in range(days):
        current_date = start + timedelta(days=i)

        # Langfristiger Trend (10% Wachstum über den Zeitraum)
        trend = base_value * (1 + 0.1 * i / days)

        # Wöchentliche Saisonalität (am Wochenende niedriger)
        day_of_week = current_date.weekday()
        seasonality = 1.0 if day_of_week < 5 else 0.6

        # Zufälliges Rauschen (±15%)
        noise = random.uniform(0.85, 1.15)

        value = round(trend * seasonality * noise, 2)
        metrics.append({
            "date":  current_date.isoformat(),
            "value": value,
            "day_of_week": current_date.strftime("%A"),
        })

    return metrics
```

### Randfälle und Geschäftsregel-Einschränkungen

```python
def generate_subscription_events(user: dict, months: int = 12):
    """Realistische Abonnement-Lebenszyklus-Ereignisse für einen Benutzer generieren."""
    events = []
    current_date = datetime.fromisoformat(user["created_at"])
    plan = "free"

    for month in range(months):
        current_date += timedelta(days=30)

        # 20% Upgrade-Chance pro Monat bei Free-Plan
        if plan == "free" and random.random() < 0.2:
            plan = random.choice(["pro", "enterprise"])
            events.append({"type": "upgrade", "plan": plan, "date": current_date.isoformat()})

        # 5% monatliche Abwanderung bei bezahlten Nutzern
        elif plan != "free" and random.random() < 0.05:
            events.append({"type": "cancel", "date": current_date.isoformat()})
            plan = "free"

        # 10% Downgrade-Chance für Enterprise-Nutzer
        elif plan == "enterprise" and random.random() < 0.1:
            plan = "pro"
            events.append({"type": "downgrade", "plan": plan, "date": current_date.isoformat()})

    return events
```

### Echte Daten anonymisieren (wenn echte Daten vorhanden)

```python
def anonymise_user(real_user: dict) -> dict:
    """Personenbezogene Daten durch realistische Fake-Werte ersetzen, Struktur bewahren."""
    return {
        **real_user,
        "email":   fake.email(),               # Fake-E-Mail, gleiches Domainformat
        "name":    fake.name(),                # Fake-Name, gleiches Gebietsschema
        "phone":   fake.phone_number(),        # Fake-Telefon, gleiches Länderformat
        "ip":      fake.ipv4(),               # Fake-IP
        # Nicht-personenbezogene Felder bewahren
        "plan":    real_user["plan"],
        "created_at": real_user["created_at"],
    }
```

## Beispiel

**Benutzer:** Eine Demo-Umgebung mit 500 Benutzern, 2.000 Bestellungen und 365 Tagen täglicher Umsatzmetriken befüllen — mit realistischen Verteilungen und referenzieller Integrität.

**Erwartete Ausgabe:**
```python
# scripts/seed_demo.py
def seed():
    users = generate_users(500)           # 60% free, 30% pro, 10% enterprise
    products = generate_products(25)
    orders = generate_orders(users, products, avg_per_user=4)  # ~2.000 insgesamt
    metrics = generate_daily_metrics(days=365, base_value=5000)

    # Alles mit respektierten FK-Einschränkungen einfügen
    db.users.insert_many(users)           # zuerst Benutzer
    db.products.insert_many(products)
    db.orders.insert_many(orders)        # Bestellungen referenzieren gültige Benutzer/Produkt-IDs
    db.metrics.insert_many(metrics)

    print(f"Seeded: {len(users)} users, {len(orders)} orders, {len(metrics)} daily metrics")
```

---
