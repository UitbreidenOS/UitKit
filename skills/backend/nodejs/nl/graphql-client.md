# GraphQL-clientintegratie

## Wanneer activeren

- Instellen van een GraphQL-client in een React- of Next.js-project
- Consumptie van een GraphQL API met getypte query's
- Configuratie van Apollo Client, urql of Tanstack Query met GraphQL
- Toevoegen van GraphQL Code Generator voor TypeScript-typegeneratie
- Implementatie van optimistische updates, abonnementen of cache-beheer
- Gebruiker vraagt hoe je een `useQuery`-, `useMutation`- of `useSubscription`-hook schrijft

## Wanneer NIET te gebruiken

- Het project bouwt een GraphQL-server — gebruik in plaats daarvan een backend-skill
- De API is alleen REST — er bestaat geen GraphQL-endpoint
- Het project heeft al een geconfigureerde GraphQL-client en heeft alleen een query nodig — geen setup nodig, schrijf de query direct

## Instructies

### Apollo Client Setup (React / Next.js)

**Installatie:**
```bash
npm install @apollo/client graphql
```

**Clientconfiguratie** (`lib/apollo-client.ts`):
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
      // Voorbeeld: normaliseer op id-veld
      Product: {
        keyFields: ["id"],
      },
      // Voorbeeld: samengevoegd gepagineerd veld
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
  // data.messageAdded is het meest recente bericht
}
```

### Cache-updates na mutation

**Gebruik `cache.modify` voor gerichte updates** (vermijdt volledige herlaading):
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

**Gebruik `refetchQueries` alleen als de cache-update niet triviaal is:**
```typescript
const [deleteItem] = useMutation(DELETE_ITEM, {
  refetchQueries: [{ query: GET_ITEMS }],
  awaitRefetchQueries: true,
});
```

**Optimistische updates** — toon het resultaat onmiddellijk, ga terug als de mutation mislukt:
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

### urql als licht alternatief

Gebruik urql als je een kleiner bundle en eenvoudigere setup wilt:
```bash
npm install urql graphql
```
```typescript
import { createClient, Provider } from "urql";
const client = createClient({ url: "/api/graphql" });

// In component
const [result] = useQuery({ query: GET_USER, variables: { id } });
const [, executeMutation] = useMutation(UPDATE_USER);
```

urql is de juiste keuze voor: Next.js-apps waar bundelgrootte uitmaakt, projecten zonder complexe cache-beleid, apps met voornamelijk eenvoudige, read-intensieve query's.

### GraphQL Code Generator

**Installatie:**
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

**`package.json` scripts:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

Voer `npm run codegen` uit na schemawijzigingen. Importeer getypte hooks van `src/generated/graphql.ts` — geen handmatige typedeclaraties nodig.

### Fragment-colocatie

Definieer fragments naast de componenten die ze gebruiken:
```typescript
// UserCard.tsx
export const USER_CARD_FRAGMENT = gql`
  fragment UserCard on User {
    id
    name
    avatarUrl
  }
`;

// Parent query stelt fragments samen
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

### GraphQL vs netwerkfouten

Apollo onderscheidt twee fouttypen — behandel beide:
```typescript
const { data, error } = useQuery(GET_USER, { variables: { id } });

if (error?.networkError) {
  // Server onbereikbaar, timeout, non-2xx HTTP
  return <NetworkErrorBanner />;
}

if (error?.graphQLErrors?.length) {
  // Server heeft fouten in GraphQL-responsebody geretourneerd
  const isUnauthorized = error.graphQLErrors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  );
  if (isUnauthorized) redirect("/login");
  return <ErrorMessage errors={error.graphQLErrors} />;
}
```

## Voorbeeld

Stel Apollo Client in een Next.js App Router-project in, schrijf een getypte query met codegen en implementeer een optimistische update voor een mutation.

**1. Configureer de client** (`lib/apollo-client.ts`) en wrap de app in `ApolloProvider` via `app/providers.tsx`.

**2. Schrijf het querydocument** in `src/queries/products.ts`:
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

**3. Voer codegen uit** — genereert `useGetProductsQuery` en `useUpdateStockMutation` met volledige TypeScript-typen.

**4. Gebruik in de component:**
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
