---
name: graphql
description: "GraphQL schema design, resolvers, mutations, subscriptions, DataLoader, Prisma integration, N+1 prevention"
---

# GraphQL Skill

## When to activate
- Designing a GraphQL schema (types, queries, mutations, subscriptions)
- Implementing resolvers in Node.js (Apollo Server, Pothos, GraphQL Yoga)
- Setting up Prisma with a GraphQL API
- Writing GraphQL queries and fragments for a frontend client
- Implementing cursor-based or offset pagination in GraphQL
- Setting up DataLoader for N+1 query prevention
- Adding authentication and authorization to a GraphQL API
- Debugging GraphQL performance or N+1 issues

## When NOT to use
- REST APIs where GraphQL adds complexity without benefit (simple CRUD, webhooks, file uploads)
- gRPC or event-driven systems
- Cases where the client always needs the full response (GraphQL's field selection adds no value)

## Instructions

### Schema design principles
```graphql
# Type names: PascalCase singular nouns
# Field names: camelCase
# Enums: SCREAMING_SNAKE_CASE values

type Order {
  id: ID!
  status: OrderStatus!
  customer: Customer!       # Nested type — always return the object, not just the ID
  items: [OrderItem!]!     # Non-null list of non-null items
  totalAmount: Float!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

# Queries: return nullable for single item (not found = null), non-null for lists
type Query {
  order(id: ID!): Order       # Nullable — null if not found
  orders(filter: OrderFilter): [Order!]!  # Non-null list
  me: User                    # Nullable — null if not authenticated
}

# Mutations: always return the mutated object plus an errors array
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type CreateOrderPayload {
  order: Order          # Null if mutation failed
  errors: [UserError!]! # Empty if successful
}

type UserError {
  field: String
  message: String!
}
```

### N+1 prevention with DataLoader
```typescript
import DataLoader from 'dataloader';

// Create per-request — never singleton (request data isolation)
export function createLoaders() {
  return {
    customerLoader: new DataLoader<string, Customer>(async (ids) => {
      const customers = await db.customer.findMany({
        where: { id: { in: [...ids] } }
      });
      // Must return in same order as ids
      const customerMap = new Map(customers.map(c => [c.id, c]));
      return ids.map(id => customerMap.get(id) ?? new Error(`Customer ${id} not found`));
    }),
  };
}

// Resolver — uses loader, not direct DB call
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => loaders.customerLoader.load(order.customerId),
  }
};
```

### Cursor-based pagination (preferred over offset)
```graphql
type OrderConnection {
  edges: [OrderEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type OrderEdge {
  node: Order!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  orders(first: Int, after: String, last: Int, before: String): OrderConnection!
}
```

### Authorization pattern
```typescript
// Field-level authorization in resolver
const resolvers = {
  Query: {
    adminStats: (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' }
        });
      }
      return getAdminStats();
    }
  },
  Order: {
    // Object-level: only return sensitive fields to the order's owner
    internalNotes: (order, _, { user }) => {
      if (user?.id !== order.customerId && user?.role !== 'ADMIN') return null;
      return order.internalNotes;
    }
  }
};
```

### Prisma + GraphQL pattern
```typescript
// Resolver using Prisma — avoid over-fetching
const resolvers = {
  Query: {
    order: async (_, { id }, { prisma, user }) => {
      const order = await prisma.order.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          customerId: true,
          totalAmount: true,
          createdAt: true,
          // Do NOT select items here — let the items resolver handle it
          // with DataLoader to avoid N+1
        }
      });
      if (!order) return null;
      if (order.customerId !== user?.id) throw new GraphQLError('Forbidden');
      return order;
    }
  }
};
```

## Example

**User:** Design a GraphQL schema and resolvers for a simple e-commerce API — products, orders, and customers. Include pagination, DataLoader for customers, and mutation error handling.

**Expected output:**
- Schema: `Product`, `Order`, `Customer`, `OrderConnection`, `UserError` types
- `Query.orders` with cursor pagination returning `OrderConnection`
- `Mutation.createOrder` returning `CreateOrderPayload` with errors array
- `Order.customer` resolver using DataLoader (not direct DB query)
- `createLoaders()` function per request, batching customer lookups by ID
- Auth check: only authenticated users can view their own orders

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. Building GraphQL APIs or AI-powered data layers? [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
