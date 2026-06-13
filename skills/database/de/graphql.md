> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../graphql.md).

# GraphQL Skill

## Wann aktivieren
- Ein GraphQL-Schema entwerfen (Types, Queries, Mutations, Subscriptions)
- Resolver in Node.js implementieren (Apollo Server, Pothos, GraphQL Yoga)
- Prisma mit einer GraphQL API einrichten
- GraphQL-Abfragen und Fragments für einen Frontend-Client schreiben
- Cursor-basierte oder Offset-Paginierung in GraphQL implementieren
- DataLoader zur N+1-Abfragevermeidung einrichten
- Authentifizierung und Autorisierung zu einer GraphQL API hinzufügen
- GraphQL-Performance oder N+1-Probleme debuggen

## Wann NICHT verwenden
- REST APIs, bei denen GraphQL Komplexität ohne Vorteil hinzufügt (einfaches CRUD, Webhooks, Datei-Uploads)
- gRPC oder ereignisgesteuerte Systeme
- Fälle, in denen der Client immer die vollständige Antwort benötigt (GraphQL's Feldauswahl fügt keinen Wert hinzu)

## Anweisungen

### Schema-Designprinzipien
```graphql
# Typnamen: PascalCase Substantive im Singular
# Feldnamen: camelCase
# Enums: SCREAMING_SNAKE_CASE-Werte

type Order {
  id: ID!
  status: OrderStatus!
  customer: Customer!       # Verschachtelter Typ — immer das Objekt zurückgeben, nicht nur die ID
  items: [OrderItem!]!     # Nicht-null-Liste von nicht-null-Elementen
  totalAmount: Float!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

# Queries: nullable für einzelnes Element zurückgeben (nicht gefunden = null), nicht-null für Listen
type Query {
  order(id: ID!): Order       # Nullable — null wenn nicht gefunden
  orders(filter: OrderFilter): [Order!]!  # Nicht-null-Liste
  me: User                    # Nullable — null wenn nicht authentifiziert
}

# Mutations: immer das mutierte Objekt plus ein Fehler-Array zurückgeben
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type CreateOrderPayload {
  order: Order          # Null wenn Mutation fehlgeschlagen
  errors: [UserError!]! # Leer wenn erfolgreich
}

type UserError {
  field: String
  message: String!
}
```

### N+1-Vermeidung mit DataLoader
```typescript
import DataLoader from 'dataloader';

// Pro Request erstellen — niemals Singleton (Anfragedaten-Isolation)
export function createLoaders() {
  return {
    customerLoader: new DataLoader<string, Customer>(async (ids) => {
      const customers = await db.customer.findMany({
        where: { id: { in: [...ids] } }
      });
      // Muss in gleicher Reihenfolge wie ids zurückgeben
      const customerMap = new Map(customers.map(c => [c.id, c]));
      return ids.map(id => customerMap.get(id) ?? new Error(`Customer ${id} not found`));
    }),
  };
}

// Resolver — verwendet Loader, nicht direkten DB-Aufruf
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => loaders.customerLoader.load(order.customerId),
  }
};
```

### Cursor-basierte Paginierung (gegenüber Offset bevorzugen)
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

### Autorisierungsmuster
```typescript
// Feldebenen-Autorisierung im Resolver
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
    // Objektebene: sensible Felder nur dem Besitzer der Bestellung zurückgeben
    internalNotes: (order, _, { user }) => {
      if (user?.id !== order.customerId && user?.role !== 'ADMIN') return null;
      return order.internalNotes;
    }
  }
};
```

### Prisma + GraphQL-Muster
```typescript
// Resolver mit Prisma — Über-Fetching vermeiden
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
          // items NICHT hier auswählen — den items-Resolver damit umgehen
          // mit DataLoader, um N+1 zu vermeiden
        }
      });
      if (!order) return null;
      if (order.customerId !== user?.id) throw new GraphQLError('Forbidden');
      return order;
    }
  }
};
```

## Beispiel

**Benutzer:** Ein GraphQL-Schema und Resolver für eine einfache E-Commerce-API entwerfen — Produkte, Bestellungen und Kunden. Paginierung, DataLoader für Kunden und Mutation-Fehlerbehandlung einschließen.

**Erwartete Ausgabe:**
- Schema: `Product`, `Order`, `Customer`, `OrderConnection`, `UserError`-Typen
- `Query.orders` mit Cursor-Paginierung, die `OrderConnection` zurückgibt
- `Mutation.createOrder` gibt `CreateOrderPayload` mit Fehler-Array zurück
- `Order.customer`-Resolver verwendet DataLoader (keine direkte DB-Abfrage)
- `createLoaders()`-Funktion pro Request, batcht Kunden-Lookups nach ID
- Auth-Prüfung: nur authentifizierte Benutzer können ihre eigenen Bestellungen sehen

---
