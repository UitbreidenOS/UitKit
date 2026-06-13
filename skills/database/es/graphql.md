> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../graphql.md).

# Skill de GraphQL

## Cuándo activar
- Diseñar un esquema de GraphQL (tipos, queries, mutations, subscriptions)
- Implementar resolvers en Node.js (Apollo Server, Pothos, GraphQL Yoga)
- Configurar Prisma con una API de GraphQL
- Escribir queries y fragments de GraphQL para un cliente frontend
- Implementar paginación basada en cursor o por offset en GraphQL
- Configurar DataLoader para prevención de consultas N+1
- Agregar autenticación y autorización a una API de GraphQL
- Depurar rendimiento de GraphQL o problemas N+1

## Cuándo NO usar
- APIs REST donde GraphQL añade complejidad sin beneficio (CRUD simple, webhooks, cargas de archivos)
- gRPC o sistemas orientados a eventos
- Casos donde el cliente siempre necesita la respuesta completa (la selección de campos de GraphQL no aporta valor)

## Instrucciones

### Principios de diseño de esquemas
```graphql
# Nombres de tipos: PascalCase con sustantivos singulares
# Nombres de campos: camelCase
# Enums: valores SCREAMING_SNAKE_CASE

type Order {
  id: ID!
  status: OrderStatus!
  customer: Customer!       # Tipo anidado — siempre devolver el objeto, no solo el ID
  items: [OrderItem!]!     # Lista no nula de elementos no nulos
  totalAmount: Float!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

# Queries: devolver nullable para elemento individual (no encontrado = null), no nulo para listas
type Query {
  order(id: ID!): Order       # Nullable — null si no se encuentra
  orders(filter: OrderFilter): [Order!]!  # Lista no nula
  me: User                    # Nullable — null si no está autenticado
}

# Mutations: siempre devolver el objeto mutado más un array de errores
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type CreateOrderPayload {
  order: Order          # Null si la mutation falló
  errors: [UserError!]! # Vacío si fue exitoso
}

type UserError {
  field: String
  message: String!
}
```

### Prevención de N+1 con DataLoader
```typescript
import DataLoader from 'dataloader';

// Crear por solicitud — nunca singleton (aislamiento de datos de solicitud)
export function createLoaders() {
  return {
    customerLoader: new DataLoader<string, Customer>(async (ids) => {
      const customers = await db.customer.findMany({
        where: { id: { in: [...ids] } }
      });
      // Debe devolver en el mismo orden que ids
      const customerMap = new Map(customers.map(c => [c.id, c]));
      return ids.map(id => customerMap.get(id) ?? new Error(`Customer ${id} not found`));
    }),
  };
}

// Resolver — usa el loader, no llamada directa a la BD
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => loaders.customerLoader.load(order.customerId),
  }
};
```

### Paginación basada en cursor (preferida sobre offset)
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

### Patrón de autorización
```typescript
// Autorización a nivel de campo en el resolver
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
    // A nivel de objeto: solo devolver campos sensibles al propietario del pedido
    internalNotes: (order, _, { user }) => {
      if (user?.id !== order.customerId && user?.role !== 'ADMIN') return null;
      return order.internalNotes;
    }
  }
};
```

### Patrón de Prisma + GraphQL
```typescript
// Resolver usando Prisma — evitar over-fetching
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
          // NO seleccionar items aquí — dejar que el resolver de items lo maneje
          // con DataLoader para evitar N+1
        }
      });
      if (!order) return null;
      if (order.customerId !== user?.id) throw new GraphQLError('Forbidden');
      return order;
    }
  }
};
```

## Ejemplo

**Usuario:** Diseñar un esquema de GraphQL y resolvers para una API de comercio electrónico simple — productos, pedidos y clientes. Incluir paginación, DataLoader para clientes y manejo de errores en mutations.

**Salida esperada:**
- Esquema: tipos `Product`, `Order`, `Customer`, `OrderConnection`, `UserError`
- `Query.orders` con paginación de cursor devolviendo `OrderConnection`
- `Mutation.createOrder` devolviendo `CreateOrderPayload` con array de errores
- Resolver `Order.customer` usando DataLoader (no consulta directa a la BD)
- Función `createLoaders()` por solicitud, agrupando búsquedas de clientes por ID
- Verificación de autenticación: solo los usuarios autenticados pueden ver sus propios pedidos

---
