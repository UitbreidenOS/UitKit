---
name: dba-in-a-box
description: "Claude Code dba-in-a-box (production query auditor): workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# DBA-in-a-Box (Production Query Auditor)

## When to activate
Activate before writing any database migration, altering schemas, or introducing a complex query (JOINs, aggregations). Invoked via `/dba`. Requires a Postgres/MySQL MCP server connected to a staging or read-replica database.

## When NOT to use
Do not use for simple CRUD queries on single rows. Do not use if an MCP connection to a database is unavailable.

## Instructions
1. **Understand the Goal:** Analyze the query or migration the user wants to execute.
2. **Explain Analyze:** Before finalizing the code, use the database MCP server to run `EXPLAIN ANALYZE <your_proposed_query>`.
3. **Audit the Execution Plan:** Read the database's execution plan closely. Look for:
   - `Seq Scan` (Full table scans on large tables).
   - High cost estimates.
   - Missing indexes on `WHERE` or `JOIN` clauses.
   - Potential locking issues.
4. **Refine:** If the execution plan is poor, rewrite the query or propose adding an index. Run `EXPLAIN ANALYZE` again.
5. **Report:** Present the optimized query to the user along with a summary of the execution plan proving it is safe for production.

## Example
User: `/dba Write a query to find all active users who haven't logged in for 30 days.`
Claude: [Drafts query, runs EXPLAIN ANALYZE via MCP]. The database indicates this will cause a sequential scan taking 4 seconds because `last_login_date` is not indexed. I recommend creating an index first. Here is the optimized migration.