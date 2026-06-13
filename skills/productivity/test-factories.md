---
name: test-factories
description: "Test factories and fixtures: factory_boy (Python), Fishery/faker-js (TypeScript), seeding test databases, avoiding test data duplication"
updated: 2026-06-13
---

# Test Factories Skill

## When to activate
- Tests are slow or brittle because each test manually creates database records
- Copy-pasting model creation code across tests
- Setting up complex object graphs for a test (user → team → project → tasks)
- Seeding a database for development or staging
- Adding faker-based random data to test edge cases

## When NOT to use
- Unit tests testing pure functions with no DB — just pass the data directly
- Very simple tests where one `db.create()` call is clear and sufficient
- When the test data needs to be very specific and explicit (use literal values, not factories)

## Instructions

### Python — factory_boy

```bash
pip install factory-boy faker
```

```python
# tests/factories.py
import factory
from factory.django import DjangoModelFactory  # or SQLAlchemyModelFactory
from faker import Faker

fake = Faker()

class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email    = factory.LazyFunction(fake.email)
    name     = factory.LazyFunction(fake.name)
    role     = "user"
    is_active = True

class TeamFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Team

    name  = factory.LazyFunction(lambda: fake.company())
    owner = factory.SubFactory(UserFactory)  # auto-creates an owner

class ProjectFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Project

    name = factory.Sequence(lambda n: f"Project {n}")  # unique: Project 0, Project 1...
    team = factory.SubFactory(TeamFactory)

class TaskFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Task

    title    = factory.LazyFunction(fake.sentence)
    status   = factory.Iterator(["todo", "in_progress", "done"])
    assignee = factory.SubFactory(UserFactory)
    project  = factory.SubFactory(ProjectFactory)
```

```python
# Usage in tests
def test_active_tasks():
    # Create one task with defaults
    task = TaskFactory(status="in_progress")

    # Override specific fields
    admin = UserFactory(role="admin", email="admin@example.com")

    # Create many at once
    tasks = TaskFactory.create_batch(10, project=project)

    # Build (no DB insert — for unit tests)
    user = UserFactory.build()

    # Traits — named variations
    class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
        class Meta:
            model = User

        class Params:
            admin = factory.Trait(role="admin", is_staff=True)
            inactive = factory.Trait(is_active=False)

    # Usage
    admin = UserFactory(admin=True)
    suspended = UserFactory(inactive=True)
```

### TypeScript — Fishery + faker

```bash
npm install --save-dev fishery @faker-js/faker
```

```typescript
// tests/factories.ts
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

// Factory with TypeScript types
const userFactory = Factory.define<User>(() => ({
  id:        faker.string.uuid(),
  email:     faker.internet.email(),
  name:      faker.person.fullName(),
  role:      'user' as const,
  createdAt: faker.date.past(),
  isActive:  true,
}))

const teamFactory = Factory.define<Team>(({ associations }) => ({
  id:      faker.string.uuid(),
  name:    faker.company.name(),
  ownerId: associations.owner?.id ?? faker.string.uuid(),
}))

const projectFactory = Factory.define<Project>(({ sequence }) => ({
  id:     faker.string.uuid(),
  name:   `Project ${sequence}`,  // unique sequence number
  teamId: faker.string.uuid(),
}))

export { userFactory, teamFactory, projectFactory }
```

```typescript
// Usage in tests
import { userFactory, projectFactory } from './factories'

describe('ProjectService', () => {
  it('lists only active projects', () => {
    const activeProject = projectFactory.build()
    const archivedProject = projectFactory.build({ archived: true })

    // Build multiple
    const projects = projectFactory.buildList(5)

    // Merge params
    const adminUser = userFactory.build({ role: 'admin', email: 'admin@test.com' })
  })
})

// With database (Prisma example)
const taskFactory = Factory.define<Task, { db: PrismaClient }>(
  ({ transientParams }) => ({
    id:      faker.string.uuid(),
    title:   faker.lorem.sentence(),
    status:  'todo',
    userId:  faker.string.uuid(),
  })
).withDecorator(async (task, { transientParams: { db } }) => {
  // Actually insert into DB
  return db.task.create({ data: task })
})

// Insert to DB
const task = await taskFactory.create({ db: prisma })
```

### Pytest fixtures with factories

```python
# conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, ProjectFactory, TaskFactory

@pytest.fixture
def db_session(engine):
    # Set session for all factories
    UserFactory._meta.sqlalchemy_session = session
    ProjectFactory._meta.sqlalchemy_session = session
    yield session
    session.rollback()

# Reusable fixtures that use factories
@pytest.fixture
def user(db_session):
    return UserFactory()

@pytest.fixture
def admin(db_session):
    return UserFactory(role="admin")

@pytest.fixture
def project_with_tasks(db_session, user):
    project = ProjectFactory(owner=user)
    TaskFactory.create_batch(5, project=project, assignee=user)
    return project

# Usage
def test_can_archive_project(project_with_tasks, admin):
    result = archive_project(project_with_tasks.id, by=admin)
    assert result.archived is True
```

### Jest/Vitest fixtures pattern

```typescript
// tests/fixtures.ts
import { PrismaClient } from '@prisma/client'
import { userFactory, projectFactory } from './factories'

export async function createUserWithProjects(
  db: PrismaClient,
  projectCount = 3
) {
  const user = await db.user.create({
    data: {
      ...userFactory.build(),
      projects: {
        create: projectFactory.buildList(projectCount),
      },
    },
    include: { projects: true },
  })
  return user
}

// Fixture for test isolation
export async function withTestUser(
  db: PrismaClient,
  fn: (user: User) => Promise<void>
) {
  const user = await db.user.create({ data: userFactory.build() })
  try {
    await fn(user)
  } finally {
    await db.user.delete({ where: { id: user.id } })
  }
}
```

### Database seeding

```python
# scripts/seed.py — populate dev/staging with realistic data
import asyncio
from tests.factories import UserFactory, TeamFactory, ProjectFactory, TaskFactory

async def seed():
    # Create 10 users
    users = UserFactory.create_batch(10)

    # Create admin
    admin = UserFactory(role="admin", email="admin@example.com", name="Admin User")

    # Create teams with projects and tasks
    for i in range(3):
        team = TeamFactory(owner=users[i])
        for j in range(5):
            project = ProjectFactory(team=team)
            TaskFactory.create_batch(10, project=project)

    print(f"Seeded: {len(users) + 1} users, 3 teams, 15 projects, 150 tasks")

asyncio.run(seed())
```

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { userFactory, projectFactory, taskFactory } from '../tests/factories'

const prisma = new PrismaClient()

async function seed() {
  await prisma.$transaction(async (tx) => {
    // Create users
    const users = await Promise.all(
      userFactory.buildList(10).map(u => tx.user.create({ data: u }))
    )

    // Create projects for each user
    for (const user of users) {
      const projects = await Promise.all(
        projectFactory.buildList(3, { userId: user.id })
          .map(p => tx.project.create({ data: p }))
      )

      // Create tasks for each project
      for (const project of projects) {
        await tx.task.createMany({
          data: taskFactory.buildList(5, { projectId: project.id }),
        })
      }
    }
  })

  console.log('Database seeded')
}

seed().finally(() => prisma.$disconnect())
```

```bash
# Run seed
npx prisma db seed
# or
python scripts/seed.py
```

### Rules for good factories

1. **Sane defaults** — every field should have a sensible value without any override
2. **Unique where required** — use `factory.Sequence` or `faker` for unique fields
3. **No hard-coded IDs** — use generated UUIDs
4. **Build without DB by default** — use `.build()` for unit tests, `.create()` only for integration tests
5. **Traits for named variations** — `UserFactory(admin=True)` not `AdminUserFactory()`
6. **Don't embed business logic** — factories are for data, not behaviour

## Example

**User:** A test for an order service needs: 1 user, 1 cart with 3 items, a discount code, and a payment method on file — all linked correctly.

**Expected setup using factories:**
```python
def test_checkout_applies_discount(db_session):
    user         = UserFactory()
    payment      = PaymentMethodFactory(user=user, type="card")
    coupon       = CouponFactory(code="SAVE20", discount_pct=20, active=True)
    cart         = CartFactory(user=user)
    items        = CartItemFactory.create_batch(3, cart=cart)

    result = checkout(
        user_id=user.id,
        coupon_code="SAVE20",
        payment_method_id=payment.id,
    )

    expected_total = sum(i.price * i.qty for i in items) * 0.8
    assert result.total == pytest.approx(expected_total)
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
