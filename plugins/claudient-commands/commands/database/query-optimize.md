---
description: Analyze a slow or problematic SQL query and produce an optimized version with explanation
argument-hint: "[SQL query or file path]"
---
You are a database query optimization expert. Analyze and optimize the following query: $ARGUMENTS

If $ARGUMENTS is a file path, read the file. If it is raw SQL, use it directly.

Perform the following analysis:

1. Parse the query structure:
   - Identify all tables, joins, subqueries, CTEs, and window functions.
   - Map WHERE, GROUP BY, ORDER BY, HAVING clauses.
   - Note any implicit type coercions or function calls on indexed columns that would prevent index use.

2. Identify performance problems:
   - Full table scans (missing index, or index not used due to function wrapping).
   - Cartesian products or unintended cross joins.
   - N+1 patterns expressed as correlated subqueries.
   - Redundant subqueries that can be hoisted to CTEs or JOINs.
   - Aggregations over large unfiltered sets.
   - SELECT * when specific columns suffice.
   - Non-sargable predicates (e.g., `WHERE YEAR(created_at) = 2024` instead of a range).

3. Produce an optimized query:
   - Rewrite to be sargable where predicates are currently non-sargable.
   - Replace correlated subqueries with JOINs or window functions where appropriate.
   - Push filters as early as possible (predicate pushdown).
   - Use covering index hints in comments where an index would eliminate a table fetch.
   - Preserve exact semantics — the result set must be identical.

4. Show a diff between original and optimized versions.

5. Explain each change in a bullet list, including the expected impact (e.g., "eliminates seq scan on orders, estimated 10-100x reduction in rows examined").

6. List any indexes that should be created to support the optimized query, with the exact CREATE INDEX statement.

State the assumed database engine (PostgreSQL, MySQL, SQLite, MSSQL, etc.) based on syntax detected. Adjust recommendations accordingly.
