> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../graphql.md).

# GraphQL Skill

## Wanneer te activeren
- Een GraphQL-schema ontwerpen (typen, queries, mutaties, subscriptions)
- Resolvers implementeren in Node.js (Apollo Server, Pothos, GraphQL Yoga)
- Prisma instellen met een GraphQL API
- GraphQL-queries en -fragments schrijven voor een frontend-client
- Cursor-gebaseerde of offset-paginering implementeren in GraphQL
- DataLoader instellen voor N+1-querypreventie
- Authenticatie en autorisatie toevoegen aan een GraphQL API
- GraphQL-prestaties of N+1-problemen debuggen

## Wanneer NIET te gebruiken
- REST API's waar GraphQL complexiteit toevoegt zonder voordeel (eenvoudige CRUD, webhooks, bestandsuploads)
- gRPC of event-driven systemen
- Gevallen waarbij de client altijd de volledige respons nodig heeft (veldkeuze van GraphQL voegt geen waarde toe)

## Instructies

### Schema-ontwerpprincipes
```graphql
# Typenamen: PascalCase enkelvoudige zelfstandige naamwoorden
# Veldnamen: camelCase
# Enums: SCREAMING_SNAKE_CASE-waarden

type Order {
  id: ID!
  status: OrderStatus!
  customer: Customer!       # Genest type — geef altijd het object terug, niet alleen het ID
  items: [OrderItem!]!     # Niet-null lijst van niet-null items
  totalAmount: Float!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

# Queries: retourneer nullable voor enkelvoudig item (niet gevonden = null), niet-null voor lijsten
type Query {
  order(id: ID!): Order       # Nullable — null als niet gevonden
  orders(filter: OrderFilter): [Order!]!  # Niet-null lijst
  me: User                    # Nullable — null als niet geauthenticeerd
}

# Mutaties: geef altijd het gemuteerde object terug plus een errors-array
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type CreateOrderPayload {
  order: Order          # Null als mutatie mislukte
  errors: [UserError!]! # Leeg als geslaagd
}

type UserError {
  field: String
  message: String!
}
```

### N+1-preventie met DataLoader
```typescript
import DataLoader from 'dataloader';

// Maak per request — nooit singleton (aanvraagdata-isolatie)
export function createLoaders() {
  return {
    customerLoader: new DataLoader<string, Customer>(async (ids) => {
      const customers = await db.customer.findMany({
        where: { id: { in: [...ids] } }
      });
      // Moet in dezelfde volgorde worden geretourneerd als ids
      const customerMap = new Map(customers.map(c => [c.id, c]));
      return ids.map(id => customerMap.get(id) ?? new Error(`Customer ${id} not found`));
    }),
  };
}

// Resolver — gebruikt loader, geen directe DB-aanroep
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => loaders.customerLoader.load(order.customerId),
  }
};
```

### Cursor-gebaseerde paginering (voorkeur boven offset)
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

### Autorisatiepatroon
```typescript
// Veldniveau-autorisatie in resolver
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
    // Objectniveau: geef gevoelige velden alleen terug aan de eigenaar van de bestelling
    internalNotes: (order, _, { user }) => {
      if (user?.id !== order.customerId && user?.role !== 'ADMIN') return null;
      return order.internalNotes;
    }
  }
};
```

### Prisma + GraphQL-patroon
```typescript
// Resolver met Prisma — vermijd over-fetching
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
          // Selecteer hier GEEN items — laat de items-resolver dit afhandelen
          // met DataLoader om N+1 te vermijden
        }
      });
      if (!order) return null;
      if (order.customerId !== user?.id) throw new GraphQLError('Forbidden');
      return order;
    }
  }
};
```

## Voorbeeld

**Gebruiker:** Ontwerp een GraphQL-schema en resolvers voor een eenvoudige e-commerce API — producten, bestellingen en klanten. Inclusief paginering, DataLoader voor klanten en afhandeling van mutatiefouten.

**Verwachte output:**
- Schema: typen `Product`, `Order`, `Customer`, `OrderConnection`, `UserError`
- `Query.orders` met cursor-paginering die `OrderConnection` retourneert
- `Mutation.createOrder` die `CreateOrderPayload` retourneert met errors-array
- `Order.customer`-resolver met DataLoader (geen directe DB-query)
- `createLoaders()`-functie per aanvraag, klant-lookups batchen op ID
- Auth-controle: alleen geauthenticeerde gebruikers kunnen hun eigen bestellingen bekijken

---
