# Integración de cliente GraphQL

## Cuándo activar

- Configurar un cliente GraphQL en un proyecto React o Next.js
- Consumir una API GraphQL con consultas tipadas
- Configurar Apollo Client, urql o Tanstack Query con GraphQL
- Agregar GraphQL Code Generator para la generación de tipos TypeScript
- Implementar actualizaciones optimistas, suscripciones o gestión de caché
- El usuario pregunta cómo escribir un hook `useQuery`, `useMutation` o `useSubscription`

## Cuándo NO usar

- El proyecto construye un servidor GraphQL — usar una skill backend en su lugar
- La API es solo REST — no existe un punto final GraphQL
- El proyecto ya tiene un cliente GraphQL configurado y solo necesita una consulta escrita — no se necesita configuración, escribe la consulta directamente

## Instrucciones

### Configuración de Apollo Client (React / Next.js)

**Instalar:**
```bash
npm install @apollo/client graphql
```

**Configuración del cliente** (`lib/apollo-client.ts`):
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
      // Ejemplo: normalizar por campo id
      Product: {
        keyFields: ["id"],
      },
      // Ejemplo: fusión de campo paginado
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

**Proveedor** (App Router: `app/providers.tsx`):
```typescript
"use client";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### Hooks de Consulta / Mutación / Suscripción

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
  // data.messageAdded es el mensaje más reciente
}
```

### Actualizaciones de caché después de mutación

**Prefiere `cache.modify` para actualizaciones dirigidas** (evita recarga completa):
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

**Usa `refetchQueries` solo cuando la actualización del caché no es trivial:**
```typescript
const [deleteItem] = useMutation(DELETE_ITEM, {
  refetchQueries: [{ query: GET_ITEMS }],
  awaitRefetchQueries: true,
});
```

**Actualizaciones optimistas** — mostrar el resultado inmediatamente, revertir si la mutación falla:
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

### urql como alternativa ligera

Usa urql cuando quieras un bundle más pequeño y configuración más simple:
```bash
npm install urql graphql
```
```typescript
import { createClient, Provider } from "urql";
const client = createClient({ url: "/api/graphql" });

// En componente
const [result] = useQuery({ query: GET_USER, variables: { id } });
const [, executeMutation] = useMutation(UPDATE_USER);
```

urql es la opción correcta para: aplicaciones Next.js donde el tamaño del bundle importa, proyectos que no necesitan políticas de caché complejas, aplicaciones con principalmente consultas simples y de lectura intensiva.

### GraphQL Code Generator

**Instalar:**
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

**Scripts en `package.json`:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

Ejecuta `npm run codegen` después de cambios de esquema. Importa hooks tipados de `src/generated/graphql.ts` — no se necesitan declaraciones de tipo manual.

### Colocación de fragmentos

Define fragmentos junto a los componentes que los usan:
```typescript
// UserCard.tsx
export const USER_CARD_FRAGMENT = gql`
  fragment UserCard on User {
    id
    name
    avatarUrl
  }
`;

// La consulta padre compone fragmentos
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

### Errores GraphQL vs de red

Apollo distingue dos tipos de errores — maneja ambos:
```typescript
const { data, error } = useQuery(GET_USER, { variables: { id } });

if (error?.networkError) {
  // Servidor inaccesible, timeout, HTTP no-2xx
  return <NetworkErrorBanner />;
}

if (error?.graphQLErrors?.length) {
  // El servidor devolvió errores en el cuerpo de la respuesta GraphQL
  const isUnauthorized = error.graphQLErrors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  );
  if (isUnauthorized) redirect("/login");
  return <ErrorMessage errors={error.graphQLErrors} />;
}
```

## Ejemplo

Configura Apollo Client en un proyecto Next.js App Router, escribe una consulta tipada con codegen e implementa una actualización optimista para una mutación.

**1. Configura el cliente** (`lib/apollo-client.ts`) y envuelve la aplicación en `ApolloProvider` a través de `app/providers.tsx`.

**2. Escribe el documento de consulta** en `src/queries/products.ts`:
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

**3. Ejecuta codegen** — genera `useGetProductsQuery` y `useUpdateStockMutation` con tipos TypeScript completos.

**4. Usa en el componente:**
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
