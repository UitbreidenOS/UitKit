# GraphQL-Client-Integration

## Wann zu aktivieren

- Einrichtung eines GraphQL-Clients in einem React- oder Next.js-Projekt
- Verbrauch einer GraphQL-API mit typisierten Abfragen
- Konfiguration von Apollo Client, urql oder Tanstack Query mit GraphQL
- Hinzufügen von GraphQL Code Generator zur TypeScript-Typgenerierung
- Implementierung optimistischer Updates, Abonnements oder Cache-Verwaltung
- Benutzer fragt, wie man einen `useQuery`-, `useMutation`- oder `useSubscription`-Hook schreibt

## Wann NICHT zu verwenden

- Das Projekt erstellt einen GraphQL-Server — verwende stattdessen eine Backend-Kompetenz
- Die API ist nur REST — kein GraphQL-Endpunkt vorhanden
- Das Projekt hat bereits einen konfigurierten GraphQL-Client und benötigt nur eine Abfrage — keine Einrichtung erforderlich, schreibe die Abfrage direkt

## Anweisungen

### Apollo Client-Einrichtung (React / Next.js)

**Installation:**
```bash
npm install @apollo/client graphql
```

**Client-Konfiguration** (`lib/apollo-client.ts`):
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
      // Beispiel: normalisieren nach ID-Feld
      Product: {
        keyFields: ["id"],
      },
      // Beispiel: paginiertes Feld zusammenführen
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

**Provider** (App Router: `app/providers.tsx`):
```typescript
"use client";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### Query / Mutation / Subscription Hooks

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
  // data.messageAdded ist die neueste Nachricht
}
```

### Cache-Updates nach Mutation

**Verwende `cache.modify` für gezielte Updates** (vermeidet vollständiges Neuladen):
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

**Verwende `refetchQueries` nur wenn das Cache-Update nicht trivial ist:**
```typescript
const [deleteItem] = useMutation(DELETE_ITEM, {
  refetchQueries: [{ query: GET_ITEMS }],
  awaitRefetchQueries: true,
});
```

**Optimistische Updates** — zeige das Ergebnis sofort an, reverte wenn die Mutation fehlschlägt:
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

### urql als leichte Alternative

urql verwenden wenn man ein kleineres Bundle und einfacheres Setup möchte:
```bash
npm install urql graphql
```
```typescript
import { createClient, Provider } from "urql";
const client = createClient({ url: "/api/graphql" });

// In Komponente
const [result] = useQuery({ query: GET_USER, variables: { id } });
const [, executeMutation] = useMutation(UPDATE_USER);
```

urql ist die richtige Wahl für: Next.js-Apps wo Bundle-Größe zählt, Projekte ohne komplexe Cache-Richtlinien, Apps mit hauptsächlich einfachen, read-intensiven Abfragen.

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

**`package.json` Scripts:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

Führe `npm run codegen` nach Schema-Änderungen aus. Importiere typisierte Hooks von `src/generated/graphql.ts` — keine manuellen Typdeklarationen erforderlich.

### Fragment-Colocation

Definiere Fragments neben den Komponenten die sie verwenden:
```typescript
// UserCard.tsx
export const USER_CARD_FRAGMENT = gql`
  fragment UserCard on User {
    id
    name
    avatarUrl
  }
`;

// Parent-Abfrage setzt Fragments zusammen
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

### GraphQL vs Netzwerkfehler

Apollo unterscheidet zwei Fehlertypen — behandle beide:
```typescript
const { data, error } = useQuery(GET_USER, { variables: { id } });

if (error?.networkError) {
  // Server unerreichbar, Timeout, non-2xx HTTP
  return <NetworkErrorBanner />;
}

if (error?.graphQLErrors?.length) {
  // Server hat Fehler im GraphQL-Response-Body zurückgegeben
  const isUnauthorized = error.graphQLErrors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  );
  if (isUnauthorized) redirect("/login");
  return <ErrorMessage errors={error.graphQLErrors} />;
}
```

## Beispiel

Apollo Client in einem Next.js App Router-Projekt einrichten, eine typisierte Abfrage mit Codegen schreiben und ein optimistisches Update für eine Mutation implementieren.

**1. Konfiguriere den Client** (`lib/apollo-client.ts`) und wickle die App in `ApolloProvider` via `app/providers.tsx` ein.

**2. Schreibe das Query-Dokument** in `src/queries/products.ts`:
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

**3. Führe Codegen aus** — generiert `useGetProductsQuery` und `useUpdateStockMutation` mit vollständigen TypeScript-Typen.

**4. Nutze in der Komponente:**
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
