---
name: hexagonal-architecture
description: "Isolate core domain logic using Hexagonal Architecture (Ports and Adapters) to separate business rules from infrastructure"
updated: 2026-06-23
---

# Hexagonal Architecture Skill

## When to activate

- Building enterprise services that must remain decoupled from specific databases (e.g. Postgres vs MongoDB) or web delivery harnesses (Express vs Fastify).
- Designing easily testable systems (mocking infrastructure via Ports).

## When NOT to use

- Small utilities, serverless functions, or script automations.
- Projects built strictly around an ORM's active-record pattern.

## Instructions

Maintain clear separation of concerns across three structural rings:

### 1. The Core Domain (Inner Ring)
- Contains business rules, Entities, and Value Objects.
- **Rule**: Must have **zero** dependencies on outside frameworks, libraries, databases, or transport layers.

### 2. Ports (Middle Ring)
- Interfaces defining how the outside world communicates with the Domain (Inbound/Primary) and how the Domain talks to infrastructure (Outbound/Secondary).
- **Rule**: Defined as abstract classes or interfaces inside the domain layer.

### 3. Adapters (Outer Ring)
- Concrete implementations of Ports. 
- *Primary Adapters*: REST controllers, CLI controllers, Event consumers.
- *Secondary Adapters*: Postgres DB repo, Stripe payment client, SMTP email adapter.

---

## Example Structure

```
src/
├── domain/                  # Inner Ring (Domain Entities)
│   └── User.ts
├── ports/                   # Middle Ring (Interfaces)
│   ├── UserUseCase.ts       # Inbound Port
│   └── UserRepository.ts    # Outbound Port
└── adapters/                # Outer Ring (Implementations)
    ├── express-user.ts      # Primary Adapter (REST)
    └── postgres-user.ts     # Secondary Adapter (DB)
```
