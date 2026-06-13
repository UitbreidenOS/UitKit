# Intégration client GraphQL

## Quand activer

- Configuration d'un client GraphQL dans un projet React ou Next.js
- Consommation d'une API GraphQL avec des requêtes typées
- Configuration d'Apollo Client, urql ou Tanstack Query avec GraphQL
- Ajout de GraphQL Code Generator pour la génération de types TypeScript
- Implémentation de mises à jour optimistes, d'abonnements ou de gestion du cache
- L'utilisateur demande comment écrire un hook `useQuery`, `useMutation` ou `useSubscription`

## Quand NE PAS utiliser

- Le projet construit un serveur GraphQL — utiliser une compétence backend à la place
- L'API est REST uniquement — aucun point de terminaison GraphQL n'existe
- Le projet a déjà un client GraphQL configuré et nécessite juste l'écriture d'une requête — aucune configuration nécessaire, écrire la requête directement

## Instructions

### Configuration d'Apollo Client (React / Next.js)

**Installation:**
```bash
npm install @apollo/client graphql
```

**Configuration du client** (`lib/apollo-client.ts`):
```typescript
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`GraphQL error: ${message}`, { locations, path })
    );
  }
  if (networkError) console.error("Network error:", networkError);
});

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URL });

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Exemple : normaliser par champ id
      Product: {
        keyFields: ["id"],
      },
      // Exemple : fusion de champ paginé
      Query: {
        fields: {
          products: {
            keyArgs: ["filter"],
            merge(existing = { items: [] }, incoming) {
              return { ...incoming, items: [...existing.items, ...incoming.items] };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
```

**Fournisseur** (App Router: `app/providers.tsx`):
```typescript
"use client";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### Hooks Requête / Mutation / Abonnement

**useQuery:**
```typescript
import { useQuery, gql } from "@apollo/client";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

function UserProfile({ id }: { id: string }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{data.user.name}</div>;
}
```

**useMutation:**
```typescript
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

function EditUser({ id }: { id: string }) {
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: () => toast.success("Saved"),
    onError: (err) => toast.error(err.message),
  });

  return (
    <button
      onClick={() => updateUser({ variables: { id, input: { name: "New Name" } } })}
      disabled={loading}
    >
      Save
    </button>
  );
}
```

**useSubscription:**
```typescript
import { useSubscription } from "@apollo/client";

const ON_MESSAGE = gql`
  subscription OnMessage($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      content
      author { name }
    }
  }
`;

function ChatRoom({ roomId }: { roomId: string }) {
  const { data } = useSubscription(ON_MESSAGE, { variables: { roomId } });
  // data.messageAdded est le dernier message
}
```

### Mises à jour de cache après mutation

**Préférez `cache.modify` pour les mises à jour ciblées** (évite la refonte complète):
```typescript
const [addItem] = useMutation(ADD_ITEM, {
  update(cache, { data: { addItem } }) {
    cache.modify({
      fields: {
        items(existingRefs = [], { toReference }) {
          return [...existingRefs, toReference(addItem)];
        },
      },
    });
  },
});
```

**Utilisez `refetchQueries` seulement quand la mise à jour du cache est non triviale:**
```typescript
const [deleteItem] = useMutation(DELETE_ITEM, {
  refetchQueries: [{ query: GET_ITEMS }],
  awaitRefetchQueries: true,
});
```

**Mises à jour optimistes** — afficher le résultat immédiatement, revenir en arrière si la mutation échoue:
```typescript
const [likePost] = useMutation(LIKE_POST, {
  optimisticResponse: {
    likePost: {
      __typename: "Post",
      id: postId,
      likeCount: currentLikeCount + 1,
      likedByMe: true,
    },
  },
});
```

### urql comme alternative légère

Utiliser urql quand vous voulez un bundle plus petit et une configuration plus simple:
```bash
npm install urql graphql
```
```typescript
import { createClient, Provider } from "urql";
const client = createClient({ url: "/api/graphql" });

// Dans le composant
const [result] = useQuery({ query: GET_USER, variables: { id } });
const [, executeMutation] = useMutation(UPDATE_USER);
```

urql est le bon choix pour: les applications Next.js où la taille du bundle compte, les projets ne nécessitant pas de politiques de cache complexes, les applications avec principalement des requêtes simples et de lecture intensive.

### GraphQL Code Generator

**Installation:**
```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

**`codegen.ts`:**
```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        skipTypename: false,
      },
    },
  },
};
export default config;
```

**Scripts `package.json`:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

Exécutez `npm run codegen` après des modifications de schéma. Importez les hooks typés de `src/generated/graphql.ts` — aucune déclaration de type manuel nécessaire.

### Colocalisation de fragments

Définir les fragments à côté des composants qui les utilisent:
```typescript
// UserCard.tsx
export const USER_CARD_FRAGMENT = gql`
  fragment UserCard on User {
    id
    name
    avatarUrl
  }
`;

// La requête parent compose les fragments
const GET_TEAM = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
      members {
        ...UserCard
      }
    }
  }
  ${USER_CARD_FRAGMENT}
`;
```

### Erreurs GraphQL vs réseau

Apollo distingue deux types d'erreurs — gérer les deux:
```typescript
const { data, error } = useQuery(GET_USER, { variables: { id } });

if (error?.networkError) {
  // Serveur injoignable, délai d'expiration, HTTP non-2xx
  return <NetworkErrorBanner />;
}

if (error?.graphQLErrors?.length) {
  // Le serveur a renvoyé des erreurs dans le corps de la réponse GraphQL
  const isUnauthorized = error.graphQLErrors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  );
  if (isUnauthorized) redirect("/login");
  return <ErrorMessage errors={error.graphQLErrors} />;
}
```

## Exemple

Configurer Apollo Client dans un projet Next.js App Router, écrire une requête typée avec codegen et implémenter une mise à jour optimiste pour une mutation.

**1. Configurez le client** (`lib/apollo-client.ts`) et enveloppez l'application dans `ApolloProvider` via `app/providers.tsx`.

**2. Écrivez le document de requête** dans `src/queries/products.ts`:
```graphql
query GetProducts($filter: ProductFilter) {
  products(filter: $filter) {
    id
    name
    price
    inStock
  }
}

mutation UpdateStock($id: ID!, $quantity: Int!) {
  updateStock(id: $id, quantity: $quantity) {
    id
    inStock
  }
}
```

**3. Exécutez codegen** — génère `useGetProductsQuery` et `useUpdateStockMutation` avec les types TypeScript complets.

**4. Utilisez dans le composant:**
```typescript
import { useGetProductsQuery, useUpdateStockMutation } from "@/generated/graphql";

export function ProductList() {
  const { data, loading } = useGetProductsQuery({
    variables: { filter: { inStock: true } },
  });

  const [updateStock] = useUpdateStockMutation({
    optimisticResponse: ({ id, quantity }) => ({
      updateStock: { __typename: "Product", id, inStock: quantity > 0 },
    }),
  });

  if (loading) return <Spinner />;
  return (
    <ul>
      {data?.products.map((p) => (
        <li key={p.id}>
          {p.name} — {p.inStock ? "In stock" : "Out of stock"}
          <button onClick={() => updateStock({ variables: { id: p.id, quantity: 10 } })}>
            Restock
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---
