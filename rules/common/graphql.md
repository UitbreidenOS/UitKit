# GraphQL Rules

Apply when designing schemas, resolvers, or client queries.

## Schema design

- Model the domain, not the database — types should reflect business entities, not table rows
- Use non-null (`!`) aggressively; nullable fields are a promise to clients that the value may be absent
- Prefer descriptive field names over abbreviated ones: `createdAt` not `cAt`
- Input types for mutations must be separate from query return types — never reuse the same type
- Use enums for fields with a bounded set of values; document each enum value

## Queries and mutations

- Queries must be side-effect free; mutations are the only entry point for writes
- Name mutations as `<verb><Noun>`: `createOrder`, `cancelSubscription`
- Return the mutated object from every mutation — clients need it to update their cache
- Mutations that can partially fail must return a union type: `CreateOrderResult = Order | ValidationError`
- Implement cursor-based pagination (`first`/`after`) for any list that can grow unboundedly

## Resolvers

- Batch N+1 queries with a DataLoader — never issue one DB query per list item
- Keep resolver logic thin: validate input, call a service, return the result
- Resolve only what is requested — don't fetch joins for fields not in the selection set
- Set per-field complexity cost; reject queries that exceed a total budget
- Never expose internal error messages to the client; log them server-side

## Security

- Authenticate at the gateway before any resolver executes
- Authorise at the resolver level — check ownership before returning or mutating data
- Disable introspection in production for external-facing APIs
- Enforce query depth limits and query complexity limits
- Never expose stack traces in `errors[].extensions`

## Subscriptions

- Use subscriptions only for genuinely real-time data; polling is simpler for most cases
- Always filter subscription events by the authenticated user's scope
- Implement backpressure handling — don't push faster than the client can consume

## Versioning and evolution

- Deprecate fields with `@deprecated(reason: "…")` before removing them
- Never remove or rename a field in a single release — mark deprecated, wait one release cycle
- Additive changes (new fields, new types) are non-breaking and safe to ship at any time
