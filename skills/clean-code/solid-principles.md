---
name: solid-principles
description: "Apply SOLID design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) during refactoring"
updated: 2026-06-23
---

# SOLID Principles Skill

## When to activate

- Designing class hierarchies, modules, or services in object-oriented and functional systems.
- Reviewing code for tight coupling, oversized classes, or hard-to-test components.
- Refactoring legacy codebases to improve extensibility.

## When NOT to use

- Writing small utility scripts, configurations, or single-use shell automations.
- Designing purely relational database schemas (use database-specific skills instead).

## Instructions

Analyze code structures against the five SOLID guidelines:

### 1. Single Responsibility Principle (SRP)
- **Rule**: A class or module should have one, and only one, reason to change.
- **Action**: Extract secondary responsibilities (e.g. logging, network calling, formatting) into separate services.

### 2. Open/Closed Principle (OCP)
- **Rule**: Software entities should be open for extension, but closed for modification.
- **Action**: Use polymorphism, interfaces, or dependency injection instead of hardcoded switch-cases.

### 3. Liskov Substitution Principle (LSP)
- **Rule**: Subtypes must be substitutable for their base types without altering correctness.
- **Action**: Do not throw `NotImplementedException` in subclass overrides. Keep interface contracts consistent.

### 4. Interface Segregation Principle (ISP)
- **Rule**: Clients should not be forced to depend on methods they do not use.
- **Action**: Split large, multi-purpose interfaces into smaller, cohesive contracts.

### 5. Dependency Inversion Principle (DIP)
- **Rule**: Depend on abstractions, not concretions.
- **Action**: Inject interfaces or abstract classes into components rather than instantiating dependencies directly (`new Class()`).

---

## Example (Refactoring tight coupling)

```typescript
// BAD: Violates SRP & DIP
class Invoice {
  saveToDB() { /* ... */ }
  printInvoice() { /* ... */ }
}

// GOOD: Adheres to SRP & DIP
interface InvoiceRepository {
  save(invoice: Invoice): void;
}
class DatabaseInvoiceRepository implements InvoiceRepository {
  save(invoice: Invoice) { /* ... */ }
}
class InvoicePrinter {
  print(invoice: Invoice) { /* ... */ }
}
```
