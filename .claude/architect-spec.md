# Architect Implementation Specification

> Generated for task: "test task"
> Date: 2026-06-22T10:45:50.144Z

## 🗺️ Architectural Constraints & Scope
- Scope of edit: Create a clean standalone helper utility.
- Exclude external library dependencies (must run completely offline/standard library).
- Enforce strict typing/arguments verification.

## 📐 Public Interface Contracts
- **Function**: `encodeBase64(str)` -> Returns base64 encoded string.
- **Function**: `decodeBase64(str)` -> Returns decoded UTF-8 string.

## 🧪 Edge Cases to Validate
1. Empty string inputs -> should return empty string.
2. Special characters/UTF-8 symbols -> should properly encode/decode.
