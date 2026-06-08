---
description: Generate type-safe mocks and stubs for a given module or interface
argument-hint: "[module-path-or-interface-name]"
---
Generate mocks and stubs for: $ARGUMENTS

1. Locate the target — find the module file, class, or interface named in $ARGUMENTS. Read it completely to understand the full surface area: all exported functions, class methods, and their type signatures.

2. Detect the project's mocking approach:
   - Jest: `jest.fn()`, `jest.mock()`, manual mocks in `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, `pytest-mock` fixtures
   - Go: interface-based manual mocks or `mockery`-style generated structs
   - TypeScript: preserve all generic types; do not use `any`

3. Generate mocks that:
   - Implement the full interface — no missing methods
   - Are type-safe (no casting, no `any` unless the original uses `any`)
   - Have configurable return values per-call via standard mock APIs
   - Include a default implementation that returns zero values / empty structs so tests compile without extra setup
   - Expose call tracking (call count, arguments received) where the framework supports it

4. Generate a corresponding factory or fixture that returns a pre-configured mock suitable for common test scenarios. Name it `make<Name>Mock` or follow the project's naming convention.

5. Place the mock in the correct location per project conventions (`__mocks__/`, `mocks/`, `testutil/`, etc.). If the project has no convention, place it adjacent to the source file.

6. Write one example test demonstrating how to import and use the mock, including how to assert on calls received.

Output: the mock file and the example test. No placeholder methods.
