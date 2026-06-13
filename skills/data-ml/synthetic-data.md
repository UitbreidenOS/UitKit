---
name: synthetic-data
description: "Synthetic data generation: realistic relational datasets for testing, seeding, and ML training — Faker, factory patterns, constraint-aware generation"
updated: 2026-06-13
---

# Synthetic Data Skill

## When to activate
- Generating realistic test data for a new database schema
- Seeding a staging or demo environment with production-like data
- Creating datasets for ML model training or testing without real PII
- Generating data that respects foreign key constraints and business rules
- Stress-testing an application with large volumes of realistic data

## When NOT to use
- Simple unit tests with 2-3 records — just create them inline
- Production data — synthetic data is for dev/test/demo only
- When real anonymised data is available and allowed to be used

## Instructions

### Python — Faker + factory_boy

```python
from faker import Faker
from faker.providers import internet, profile, bank
import random
from datetime import datetime, timedelta

fake = Faker()
fake.add_provider(internet)

# Generate a realistic user
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

# Generate a realistic order with constraints
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

# Generate a complete, constraint-aware dataset
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

### TypeScript — faker-js with relational integrity

```typescript
import { faker } from '@faker-js/faker'

// Seed for reproducible data
faker.seed(12345)  // same seed = same data every run

interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

interface Order {
  id: string
  userId: string   // always references a real user ID
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
    userId,   // always a real user ID — no orphaned records
    amount:   parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    status:   faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  }
}

// Generate relational data — users first, then orders referencing them
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

### Bulk insert patterns

**PostgreSQL with COPY (fastest for large volumes):**
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

**Prisma batch create:**
```typescript
// Generate and insert 10,000 users in batches
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

### Time-series data generation

```python
def generate_daily_metrics(days: int = 365, base_value: float = 1000):
    """Generate realistic time-series with trend, seasonality, and noise."""
    import math, random
    from datetime import date, timedelta

    start = date.today() - timedelta(days=days)
    metrics = []

    for i in range(days):
        current_date = start + timedelta(days=i)

        # Long-term trend (10% growth over the period)
        trend = base_value * (1 + 0.1 * i / days)

        # Weekly seasonality (lower on weekends)
        day_of_week = current_date.weekday()
        seasonality = 1.0 if day_of_week < 5 else 0.6

        # Random noise (±15%)
        noise = random.uniform(0.85, 1.15)

        value = round(trend * seasonality * noise, 2)
        metrics.append({
            "date":  current_date.isoformat(),
            "value": value,
            "day_of_week": current_date.strftime("%A"),
        })

    return metrics
```

### Edge cases and business rule constraints

```python
def generate_subscription_events(user: dict, months: int = 12):
    """Generate realistic subscription lifecycle events for a user."""
    events = []
    current_date = datetime.fromisoformat(user["created_at"])
    plan = "free"

    for month in range(months):
        current_date += timedelta(days=30)

        # 20% chance of upgrade each month if free
        if plan == "free" and random.random() < 0.2:
            plan = random.choice(["pro", "enterprise"])
            events.append({"type": "upgrade", "plan": plan, "date": current_date.isoformat()})

        # 5% monthly churn for paid users
        elif plan != "free" and random.random() < 0.05:
            events.append({"type": "cancel", "date": current_date.isoformat()})
            plan = "free"

        # 10% chance of downgrade for enterprise users
        elif plan == "enterprise" and random.random() < 0.1:
            plan = "pro"
            events.append({"type": "downgrade", "plan": plan, "date": current_date.isoformat()})

    return events
```

### Anonymising real data (when real data exists)

```python
def anonymise_user(real_user: dict) -> dict:
    """Replace PII with fake but realistic values, preserve structure."""
    return {
        **real_user,
        "email":   fake.email(),               # fake email, same domain format
        "name":    fake.name(),                # fake name, same locale
        "phone":   fake.phone_number(),        # fake phone, same country format
        "ip":      fake.ipv4(),               # fake IP
        # Preserve non-PII fields
        "plan":    real_user["plan"],
        "created_at": real_user["created_at"],
    }
```

## Example

**User:** Seed a demo environment with 500 users, 2,000 orders, and 365 days of daily revenue metrics — all with realistic distributions and referential integrity.

**Expected output:**
```python
# scripts/seed_demo.py
def seed():
    users = generate_users(500)           # 60% free, 30% pro, 10% enterprise
    products = generate_products(25)
    orders = generate_orders(users, products, avg_per_user=4)  # ~2,000 total
    metrics = generate_daily_metrics(days=365, base_value=5000)

    # Insert all with FK constraints respected
    db.users.insert_many(users)           # users first
    db.products.insert_many(products)
    db.orders.insert_many(orders)        # orders reference valid user/product IDs
    db.metrics.insert_many(metrics)

    print(f"Seeded: {len(users)} users, {len(orders)} orders, {len(metrics)} daily metrics")
```

---
