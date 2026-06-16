# Cross-Talk (Agent Federation Protocol)

## When to activate
Activate when you encounter a highly specific, proprietary error or pattern that is not in your training data, and the user invokes `/cross-talk`.

## When NOT to use
Do not use for general programming questions (e.g., "How does React useState work?").

## Instructions
1. **Identify the Knowledge Gap:** Clearly articulate the proprietary problem you cannot solve (e.g., "I don't know how to authenticate with the internal AcmeCorp microservice").
2. **Federated Query:** Ask the user to provide the endpoint URL of a federated team knowledge base, a shared `MEMORY_BANK.md` network drive, or a custom MCP server connected to the team's central Claude instance.
3. **Query the Hive:** Use `Bash` (via `curl`) or MCP tools to send your specific query to the shared repository.
4. **Ingest & Apply:** Read the returned context from the federated system, apply it to the current local problem, and explain to the user how the cross-team knowledge solved the issue.

## Example
User: `/cross-talk How do we bypass the staging firewall?`
Claude: [Queries internal MCP server]. The platform team's agent responded. We need to add the `X-Acme-Staging-Bypass` header. I will add that to the API call now.