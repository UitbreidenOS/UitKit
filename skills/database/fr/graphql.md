> 🇫🇷 This is the French translation. [English version](../graphql.md).

# Compétence GraphQL

## Quand activer
- Concevoir un schéma GraphQL (types, queries, mutations, subscriptions)
- Implémenter des resolvers en Node.js (Apollo Server, Pothos, GraphQL Yoga)
- Configurer Prisma avec une API GraphQL
- Rédiger des queries et fragments GraphQL pour un client frontend
- Implémenter une pagination cursor-based ou offset-based dans GraphQL
- Configurer DataLoader pour la prévention des requêtes N+1
- Ajouter l'authentification et l'autorisation à une API GraphQL
- Déboguer les performances GraphQL ou les problèmes N+1

## Quand NE PAS utiliser
- APIs REST où GraphQL ajoute de la complexité sans bénéfice (CRUD simple, webhooks, upload de fichiers)
- gRPC ou systèmes event-driven
- Cas où le client a toujours besoin de la réponse complète (la sélection de champs de GraphQL n'apporte aucune valeur)

## Instructions

### Principes de conception du schéma
```graphql
# Noms de types : noms singuliers en PascalCase
# Noms de champs : camelCase
# Valeurs d'enum : SCREAMING_SNAKE_CASE

type Order {
  id: ID!
  status: OrderStatus!
  customer: Customer!       # Type imbriqué — toujours retourner l'objet, pas juste l'ID
  items: [OrderItem!]!     # Liste non-null d'éléments non-null
  totalAmount: Float!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

# Queries : retourner nullable pour un seul élément (non trouvé = null), non-null pour les listes
type Query {
  order(id: ID!): Order       # Nullable — null si non trouvé
  orders(filter: OrderFilter): [Order!]!  # Liste non-null
  me: User                    # Nullable — null si non authentifié
}

# Mutations : toujours retourner l'objet muté plus un tableau d'erreurs
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type CreateOrderPayload {
  order: Order          # Null si la mutation a échoué
  errors: [UserError!]! # Vide si succès
}

type UserError {
  field: String
  message: String!
}
```

### Prévention N+1 avec DataLoader
```typescript
import DataLoader from 'dataloader';

// Créer par requête — jamais singleton (isolation des données de requête)
export function createLoaders() {
  return {
    customerLoader: new DataLoader<string, Customer>(async (ids) => {
      const customers = await db.customer.findMany({
        where: { id: { in: [...ids] } }
      });
      // Doit retourner dans le même ordre que ids
      const customerMap = new Map(customers.map(c => [c.id, c]));
      return ids.map(id => customerMap.get(id) ?? new Error(`Customer ${id} not found`));
    }),
  };
}

// Resolver — utilise le loader, pas un appel DB direct
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => loaders.customerLoader.load(order.customerId),
  }
};
```

### Pagination cursor-based (préférée à l'offset)
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

### Pattern d'autorisation
```typescript
// Autorisation au niveau du champ dans le resolver
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
    // Au niveau de l'objet : retourner les champs sensibles uniquement au propriétaire de la commande
    internalNotes: (order, _, { user }) => {
      if (user?.id !== order.customerId && user?.role !== 'ADMIN') return null;
      return order.internalNotes;
    }
  }
};
```

### Pattern Prisma + GraphQL
```typescript
// Resolver utilisant Prisma — éviter le sur-fetch
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
          // Ne PAS sélectionner items ici — laisser le resolver items le gérer
          // avec DataLoader pour éviter N+1
        }
      });
      if (!order) return null;
      if (order.customerId !== user?.id) throw new GraphQLError('Forbidden');
      return order;
    }
  }
};
```

## Exemple

**Utilisateur :** Concevoir un schéma GraphQL et des resolvers pour une API e-commerce simple — produits, commandes et clients. Inclure la pagination, DataLoader pour les clients et la gestion des erreurs de mutation.

**Sortie attendue :**
- Schéma : types `Product`, `Order`, `Customer`, `OrderConnection`, `UserError`
- `Query.orders` avec pagination cursor retournant `OrderConnection`
- `Mutation.createOrder` retournant `CreateOrderPayload` avec tableau d'erreurs
- Resolver `Order.customer` utilisant DataLoader (pas de requête DB directe)
- Fonction `createLoaders()` par requête, regroupant les recherches de clients par ID
- Vérification d'auth : seuls les utilisateurs authentifiés peuvent voir leurs propres commandes

---
