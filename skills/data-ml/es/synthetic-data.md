---
name: synthetic-data
description: "Synthetic data generation: realistic relational datasets for testing, seeding, and ML training — Faker, factory patterns, constraint-aware generation"
---

> 🇪🇸 Versión en español. [Versión en inglés](../synthetic-data.md).

# Skill Datos Sintéticos

## Cuándo activar
- Generar datos de prueba realistas para un nuevo esquema de base de datos
- Poblar un entorno de staging o demo con datos similares a los de producción
- Crear conjuntos de datos para el entrenamiento o prueba de modelos ML sin datos personales reales
- Generar datos que respeten restricciones de clave foránea y reglas de negocio
- Hacer pruebas de carga de una aplicación con grandes volúmenes de datos realistas

## Cuándo NO usar
- Pruebas unitarias simples con 2–3 registros — simplemente créalos en línea
- Datos de producción — los datos sintéticos son solo para desarrollo, pruebas y demo
- Cuando los datos reales anonimizados están disponibles y se permite su uso

## Instrucciones

### Python — Faker + factory_boy

```python
from faker import Faker
from faker.providers import internet, profile, bank
import random
from datetime import datetime, timedelta

fake = Faker()
fake.add_provider(internet)

# Generar un usuario realista
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

# Generar un pedido realista con restricciones
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

# Generar un conjunto de datos completo con restricciones
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

### TypeScript — faker-js con integridad relacional

```typescript
import { faker } from '@faker-js/faker'

// Semilla para datos reproducibles
faker.seed(12345)  // misma semilla = mismos datos en cada ejecución

interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

interface Order {
  id: string
  userId: string   // siempre hace referencia a un ID de usuario real
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
    userId,   // siempre un ID de usuario real — sin registros huérfanos
    amount:   parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    status:   faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  }
}

// Generar datos relacionales — primero usuarios, luego pedidos que los referencian
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

### Patrones de inserción masiva

**PostgreSQL con COPY (más rápido para grandes volúmenes):**
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

**Creación por lotes con Prisma:**
```typescript
// Generar e insertar 10.000 usuarios en lotes
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

### Generación de datos de series temporales

```python
def generate_daily_metrics(days: int = 365, base_value: float = 1000):
    """Generar series temporales realistas con tendencia, estacionalidad y ruido."""
    import math, random
    from datetime import date, timedelta

    start = date.today() - timedelta(days=days)
    metrics = []

    for i in range(days):
        current_date = start + timedelta(days=i)

        # Tendencia a largo plazo (10% de crecimiento en el período)
        trend = base_value * (1 + 0.1 * i / days)

        # Estacionalidad semanal (menor los fines de semana)
        day_of_week = current_date.weekday()
        seasonality = 1.0 if day_of_week < 5 else 0.6

        # Ruido aleatorio (±15%)
        noise = random.uniform(0.85, 1.15)

        value = round(trend * seasonality * noise, 2)
        metrics.append({
            "date":  current_date.isoformat(),
            "value": value,
            "day_of_week": current_date.strftime("%A"),
        })

    return metrics
```

### Casos extremos y restricciones de reglas de negocio

```python
def generate_subscription_events(user: dict, months: int = 12):
    """Generar eventos realistas del ciclo de vida de suscripción para un usuario."""
    events = []
    current_date = datetime.fromisoformat(user["created_at"])
    plan = "free"

    for month in range(months):
        current_date += timedelta(days=30)

        # 20% de probabilidad de actualización cada mes si es gratuito
        if plan == "free" and random.random() < 0.2:
            plan = random.choice(["pro", "enterprise"])
            events.append({"type": "upgrade", "plan": plan, "date": current_date.isoformat()})

        # 5% de abandono mensual para usuarios de pago
        elif plan != "free" and random.random() < 0.05:
            events.append({"type": "cancel", "date": current_date.isoformat()})
            plan = "free"

        # 10% de probabilidad de degradación para usuarios enterprise
        elif plan == "enterprise" and random.random() < 0.1:
            plan = "pro"
            events.append({"type": "downgrade", "plan": plan, "date": current_date.isoformat()})

    return events
```

### Anonimizar datos reales (cuando existen datos reales)

```python
def anonymise_user(real_user: dict) -> dict:
    """Reemplazar datos personales con valores falsos pero realistas, preservar la estructura."""
    return {
        **real_user,
        "email":   fake.email(),               # correo falso, mismo formato de dominio
        "name":    fake.name(),                # nombre falso, misma configuración regional
        "phone":   fake.phone_number(),        # teléfono falso, mismo formato de país
        "ip":      fake.ipv4(),               # IP falsa
        # Preservar campos no personales
        "plan":    real_user["plan"],
        "created_at": real_user["created_at"],
    }
```

## Ejemplo

**Usuario:** Poblar un entorno demo con 500 usuarios, 2.000 pedidos y 365 días de métricas de ingresos diarios — todos con distribuciones realistas e integridad referencial.

**Salida esperada:**
```python
# scripts/seed_demo.py
def seed():
    users = generate_users(500)           # 60% free, 30% pro, 10% enterprise
    products = generate_products(25)
    orders = generate_orders(users, products, avg_per_user=4)  # ~2.000 en total
    metrics = generate_daily_metrics(days=365, base_value=5000)

    # Insertar todo con restricciones FK respetadas
    db.users.insert_many(users)           # usuarios primero
    db.products.insert_many(products)
    db.orders.insert_many(orders)        # pedidos referencian IDs de usuario/producto válidos
    db.metrics.insert_many(metrics)

    print(f"Seeded: {len(users)} users, {len(orders)} orders, {len(metrics)} daily metrics")
```

---
