---
description: Find and eliminate duplicated logic, data, or structure
argument-hint: "[file or directory]"
---
Deduplicate code in $ARGUMENTS.

1. Scan the scope for duplication:
   - Identical or near-identical function bodies (>5 lines with trivial variation)
   - Copy-pasted data structures or configuration blocks with minor differences
   - Repeated inline logic that could be extracted once (e.g., the same validation, the same sort comparator, the same transformation)
   - Duplicate type definitions or interface declarations
   - Multiple functions that differ only by a single parameter value — candidates for parameterization

2. For each duplicate cluster found:
   - Identify the canonical version to keep (prefer the most complete, best-named, or most recently modified)
   - Determine whether the copies differ by data (→ parameterize) or by behavior (→ keep separate, they are not duplicates)
   - Produce a single shared implementation: extract a function, constant, or type as appropriate

3. Replace all duplicate sites with calls to the shared implementation. Do not leave the old copies in place.

4. After replacement, remove any imports or helpers that existed solely to support the removed copies.

5. Output: for each deduplication, list the shared symbol created, how many sites were replaced, and where each was located.

Constraints:
- "Similar" is not "duplicate." Only merge code that has the same intent and semantics — do not force unrelated code into a shared abstraction because it looks alike.
- Do not introduce a new abstraction layer (class, module, mixin) just to deduplicate a single pair of two functions. A plain function extraction is sufficient.
- Preserve all existing behavior. If collapsing duplicates requires subtle changes to any call site, flag those explicitly.
- Do not deduplicate tests — test redundancy is often intentional.
