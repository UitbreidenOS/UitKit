---
name: app-architecture
description: Design mobile app architecture — navigation patterns, state management, data layer, and module boundaries
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing navigation structure for a new mobile app
- Choosing state management approach (Redux, Zustand, Riverpod, etc.)
- Defining data layer architecture (API clients, caching, persistence)
- Setting up module boundaries and feature-based folder structure
- Migrating from monolithic to modular architecture

## When NOT to use

- For backend API architecture (use API Developer Stack)
- For web app architecture
- For UI component design (framework-specific skills)

## Instructions

1. **Define app complexity tier.** Simple (1-5 screens), Medium (5-20 screens, 2-3 features), Complex (20+ screens, deep linking, offline).
2. **Choose navigation pattern.** Stack (simple), Tab + Stack (medium), Drawer + Tab + Stack (complex). Map user flows.
3. **Select state management.** Local state for UI, global store for shared data, server state for API. Match to framework (Zustand/Redux for RN, Riverpod/Bloc for Flutter, @Observable for SwiftUI).
4. **Design data layer.** Repository pattern: API client → cache (in-memory + persistent) → repository → view model → UI.
5. **Define module boundaries.** Feature-based folders: `features/auth/`, `features/feed/`, `features/profile/`. Shared: `core/`, `shared/ui/`, `shared/utils/`.
6. **Plan deep linking.** Map URL schemes to screens: `app://profile/123` → ProfileScreen(userId: "123").
7. **Document architecture decisions.** ADRs for each major choice with alternatives considered.

## Example

```
Architecture Decision: Medium-complexity e-commerce app

Navigation: Bottom tabs (Home, Search, Cart, Profile) + Stack per tab
State: Zustand (global: cart, auth) + React Query (server: products, orders)
Data: API client (axios) → React Query cache → MMKV persistence
Modules:
  features/auth/     — Login, register, forgot password
  features/catalog/  — Product list, detail, search
  features/cart/     — Cart, checkout, payment
  features/profile/  — Account, orders, settings
  core/              — Navigation, theme, i18n, analytics
  shared/            — UI components, utils, types
```
