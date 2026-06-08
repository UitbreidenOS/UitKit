# Documentation Rules

Apply when writing or reviewing README files, API docs, guides, or inline documentation.

## What to document

- Document the *why*, not the *what* — code shows what; docs explain intent, constraints, and tradeoffs
- Every public API surface needs a description, parameter types, return type, and at least one example
- Document non-obvious behaviour explicitly: rate limits, eventual consistency, ordering guarantees, known failure modes
- Architecture Decision Records (ADRs) for any decision that took more than a day to reach — the context gets lost otherwise

## What not to document

- Don't restate what the code already says clearly: `// increments counter by 1` on `counter++` is noise
- Don't document temporary states ("this is a workaround until X is fixed") — that belongs in the issue tracker
- Don't write speculative docs for features that don't exist yet

## READMEs

Every project README must answer these questions in order:

1. What does this project do? (one sentence)
2. How do I run it locally? (exact commands, no assumptions)
3. How do I run the tests?
4. What are the key environment variables?
5. Where do I go for more detail? (links to further docs)

A README that takes more than 5 minutes to get from zero to a running local environment is too long or missing steps.

## API documentation

- Keep API docs adjacent to code — docs that live in a separate repo drift
- Use OpenAPI/Swagger for REST; SDL + descriptions for GraphQL; generate from source where possible
- Every endpoint documents: authentication requirements, request/response schema, error codes, rate limits
- Provide runnable examples (curl, SDK snippets) — abstract descriptions without examples are not useful

## Writing style

- Write for a reader who is competent but unfamiliar with this specific system
- Short sentences, active voice, imperative mood for instructions
- Use concrete examples over abstract descriptions: show a real request/response, not a schema diagram alone
- Tables for reference material; prose for explanations; numbered lists for sequential steps

## Maintenance

- Docs that are wrong are worse than no docs — treat stale documentation as a bug
- Update docs in the same PR as the code change; never leave a "docs PR to follow"
- Add a `last-verified` date to long-form guides so readers can assess freshness
- Link to the canonical source of truth; don't copy-paste content that will drift
