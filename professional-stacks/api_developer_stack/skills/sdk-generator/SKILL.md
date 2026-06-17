---
name: sdk-generator
description: Generate typed client SDKs from OpenAPI specifications for TypeScript, Python, Go, and other languages
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Generating client SDKs from OpenAPI specs
- Creating typed API clients for TypeScript/JavaScript
- Building Python client libraries with type hints
- Setting up auto-generated SDKs in CI/CD pipelines
- Maintaining SDK parity with API changes

## When NOT to use

- For manual API wrapper development
- For GraphQL client generation
- For internal RPC client stubs

## Instructions

1. **Validate OpenAPI spec.** Ensure spec passes spectral linting before generation — garbage in, garbage out.
2. **Select generator.** OpenAPI Generator, Speakeasy, or Fern depending on quality requirements.
3. **Configure generator.** Set package name, version, output directory, and language-specific options.
4. **Generate SDK.** Run generator; review output for completeness and type safety.
5. **Add customizations.** Custom HTTP client configuration, retry logic, timeout overrides, and middleware hooks.
6. **Write usage examples.** 3-5 examples covering common workflows: CRUD operations, pagination, error handling.
7. **Publish SDK.** Configure npm/PyPI/Go module publishing in CI pipeline triggered by spec changes.

## Example

```typescript
// Generated TypeScript SDK usage
import { UsersApi } from '@company/api-sdk';

const api = new UsersApi({ apiKey: process.env.API_KEY });

// List users with pagination
const users = await api.listUsers({ page: 1, limit: 20 });
console.log(users.data); // User[]
console.log(users.meta.total); // number

// Error handling
try {
  await api.createUser({ email: 'invalid' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.details); // FieldError[]
  }
}
```
