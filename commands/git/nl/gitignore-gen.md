---
description: Genereer of breid een .gitignore uit voor de gedetecteerde of opgegeven projectstack
argument-hint: "[stack or language]"
---
Als $ARGUMENTS is opgegeven, behandel het als de stack-specificatie (bijv. "node react", "python fastapi", "rust", "go terraform").

Als $ARGUMENTS leeg is, detecteer de stack door de werkboom te inspecteren:
- Voer `ls -1` uit in de repo-root en scan naar indicator-bestanden: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `pom.xml`, `build.gradle`, `*.sln`, `Dockerfile`, `.terraform/`, enz.
- Controleer op editor/IDE-bestanden: `.vscode/`, `.idea/`, `*.xcodeproj`
- Controleer op OS: detecteer macOS (`.DS_Store` risico) of Windows (`Thumbs.db` risico) uit de omgeving

Als een `.gitignore` al aanwezig is in de repo-root, lees deze eerst. Voeg alleen regels toe die ontbreken — dupliceer geen bestaande inzendingen.

Genereer de `.gitignore`-inhoud ingedeeld in gelabelde secties:

```
# === <Stack> ===
# === Editor / IDE ===
# === OS ===
# === Secrets & local config ===
# === Build output ===
# === Test artifacts ===
```

Regels voor elke sectie:
- **Stack**: taalspecifieke build-mappen, gecompileerde artefacten, package-caches, virtual envs, afhankelijkheidsmappen
- **Editor/IDE**: `.vscode/` (behoud `.vscode/extensions.json` en `settings.json` indien teamgedeeld — opmerking hierover), `.idea/`, `*.swp`, `*.swo`, `.DS_Store`, `Thumbs.db`
- **Secrets**: `.env`, `.env.*` (behalve `.env.example`), `*.pem`, `*.key`, `secrets.*`, `credentials.*`
- **Build output**: `dist/`, `build/`, `out/`, `target/`, `*.o`, `*.a`, `*.so`, `*.dll`
- **Test artifacts**: `coverage/`, `.nyc_output/`, `*.lcov`, `htmlcov/`, `.pytest_cache/`, `__snapshots__/` (alleen indien niet opzettelijk versiebeheersbaar)

Noteer na het inhoudsblok alle patronen die teamdiscussie vereisen voordat u deze toevoegt (bijv. of u `.vscode/settings.json` wilt negeren).

Schrijf het bestand niet naar schijf. Geef de volledige `.gitignore`-inhoud aan de gebruiker voor beoordeling en toepassing.
