---
description: Generate or extend a .gitignore for the detected or specified project stack
argument-hint: "[stack or language]"
---
If $ARGUMENTS is provided, treat it as the stack specification (e.g., "node react", "python fastapi", "rust", "go terraform").

If $ARGUMENTS is empty, detect the stack by inspecting the working tree:
- Run `ls -1` at the repo root and scan for indicator files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `pom.xml`, `build.gradle`, `*.sln`, `Dockerfile`, `.terraform/`, etc.
- Check for editor/IDE files: `.vscode/`, `.idea/`, `*.xcodeproj`
- Check for OS: detect macOS (`.DS_Store` risk) or Windows (`Thumbs.db` risk) from the environment

If a `.gitignore` already exists at the repo root, read it first. Add only rules that are missing — do not duplicate existing entries.

Generate the `.gitignore` content organized into labeled sections:

```
# === <Stack> ===
# === Editor / IDE ===
# === OS ===
# === Secrets & local config ===
# === Build output ===
# === Test artifacts ===
```

Rules for each section:
- **Stack**: language-specific build dirs, compiled artifacts, package caches, virtual envs, dependency dirs
- **Editor/IDE**: `.vscode/` (keep `.vscode/extensions.json` and `settings.json` if team-shared — note this), `.idea/`, `*.swp`, `*.swo`, `.DS_Store`, `Thumbs.db`
- **Secrets**: `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, `secrets.*`, `credentials.*`
- **Build output**: `dist/`, `build/`, `out/`, `target/`, `*.o`, `*.a`, `*.so`, `*.dll`
- **Test artifacts**: `coverage/`, `.nyc_output/`, `*.lcov`, `htmlcov/`, `.pytest_cache/`, `__snapshots__/` (only if not version-controlled intentionally)

After the content block, note any patterns that require team discussion before adding (e.g., whether to ignore `.vscode/settings.json`).

Do not write the file to disk. Output the full `.gitignore` content for the user to review and apply.
