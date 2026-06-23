---
name: domain-driven-design
description: "Implement Domain-Driven Design (DDD) patterns: distinguish between Entities, Value Objects, Aggregates, and Repositories"
updated: 2026-06-23
---

# Domain-Driven Design (DDD) Skill

## When to activate

- Modeling complex business logic or enterprise service patterns.
- Decoupling core business rules from databases, frameworks, or delivery mechanisms.
- Defining bounded contexts in microservice systems.

## When NOT to use

- Simple CRUD (Create, Read, Update, Delete) apps where data maps 1:1 to database tables.
- Building stateless helper libraries or data processing scripts.

## Instructions

Structure domain logic around these core tactical patterns:

### 1. Entities
- **Definition**: Objects defined by a unique identity that persists across state changes, rather than their attributes.
- **Guideline**: Ensure they hold an ID, and bundle state mutations with business rules validation.

### 2. Value Objects
- **Definition**: Objects defined strictly by their attributes, with no identity (e.g. Email address, Money value).
- **Guideline**: Treat them as immutable. Any change should instantiate a new Value Object.

### 3. Aggregates
- **Definition**: A cluster of associated objects (Entities and Value Objects) treated as a single unit for data changes.
- **Guideline**: Access children only through the Aggregate Root. Enforce all boundary invariants inside the Root.

### 4. Repositories
- **Definition**: Abstraction layer providing collection-like access to Aggregates (hiding database details).
- **Guideline**: Map database entities to domain entities before returning them.

---

## Example

```typescript
// Value Object (Immutable)
class Money {
  constructor(public readonly amount: number, public readonly currency: string) {
    if (amount < 0) throw new Error("Amount cannot be negative");
  }
}

// Aggregate Root
class Order {
  private items: OrderItem[] = [];
  constructor(public readonly orderId: string, private total: Money) {}
  
  // Enforce boundary invariants
  addItem(item: OrderItem) {
    this.items.push(item);
    this.total = new Money(this.total.amount + item.price.amount, this.total.currency);
  }
}
```
