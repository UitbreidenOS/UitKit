---
description: Generate a typed client SDK from an OpenAPI spec or existing API routes
argument-hint: "[language] [spec-file-or-base-url]"
---
Generate a client SDK for: $ARGUMENTS

Parse as: target language (TypeScript, Python, Go, etc.) and either a path to an OpenAPI spec file or a base URL. If no spec file exists, generate one first from the codebase before generating the SDK.

SDK requirements by language:

TypeScript:
- ESM + CommonJS dual output via `package.json` `exports` field
- Full generic types — no `any`, no type assertions without justification
- Use `fetch` natively; accept an optional custom fetch implementation for test mocking
- Zod schemas for runtime response validation (optional but include if the project uses Zod)
- Tree-shakeable: each resource as a named export, not a class with everything on it

Python:
- `httpx` for async, `requests` for sync — provide both or ask which
- Pydantic models for all request/response types
- Type hints throughout, `py.typed` marker for PEP 561 compliance
- Async client as the primary interface, sync as a thin wrapper

Go:
- Idiomatic Go: methods on a `Client` struct, context as first param, `(T, error)` return pattern
- Separate types package for generated models
- No external dependencies beyond `net/http` unless the project already uses one

All languages:
- One client class/struct per resource group (mirrors the OpenAPI `tags`)
- Constructor accepts: base URL, auth token/API key, optional HTTP client
- All methods correspond 1:1 with OpenAPI `operationId` values
- Return typed response objects — never raw strings or untyped maps
- Propagate all HTTP errors as typed error objects with `status`, `code`, and `message`
- README with installation, initialization, and one example per resource

Output the SDK as a directory structure listing, then the full file contents for each file. If the spec has more than 20 operations, generate the core client infrastructure and the first resource group, then list the remaining groups to generate on demand.
