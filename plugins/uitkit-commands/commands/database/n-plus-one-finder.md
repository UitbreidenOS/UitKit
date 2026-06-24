---
description: Detect N+1 query patterns in ORM code and produce batch-loading fixes
argument-hint: "[file path, directory, or route/controller name]"
---
Scan for N+1 query patterns in: $ARGUMENTS

If $ARGUMENTS is a file path, read it. If it is a directory, scan all relevant source files within it. If it is a controller or route name, locate the corresponding code files.

Detection approach:

1. Identify the ORM or query library in use (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Scan for N+1 patterns:
   - Loops (for, forEach, map, each, .all.map, etc.) that contain ORM calls inside the loop body.
   - Lazy-loaded associations accessed inside a loop (e.g., `post.comments` called per post in an iteration).
   - Serializers or view templates that trigger association loads per record.
   - `.find()` or `.get()` calls inside loops that could be batched.
   - Missing eager-load directives (includes, eager_load, preload, joinedload, selectinload, with, include).

3. For each N+1 found, output:
   - File path and line number(s) of the offending code.
   - The query that fires N times.
   - The fix: exact code showing how to batch/eager-load the association.
   - The ORM-specific method to use (e.g., `includes(:comments)` for ActiveRecord, `options(selectinload(Post.comments))` for SQLAlchemy, `include: { comments: true }` for Prisma).

4. Also flag:
   - Missing `select` fields causing full-row loads when only a subset is needed.
   - Missing `.distinct` on association counts that cause inflated results.
   - Repeated identical queries within the same request cycle that should be memoized or cached.

5. If the codebase has query logging or a query count assertion pattern (e.g., `assert_queries`, `nplusone` library), suggest adding guards to prevent regressions.

Output findings as a prioritized list — HIGH (in a hot path or loop over unbounded collections), MEDIUM, LOW — with exact code fix for each.
