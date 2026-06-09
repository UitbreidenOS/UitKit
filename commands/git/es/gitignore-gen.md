---
description: Generar o extender un .gitignore para el stack de proyecto detectado o especificado
argument-hint: "[stack or language]"
---
Si se proporciona $ARGUMENTS, trata como especificación del stack (p. ej., "node react", "python fastapi", "rust", "go terraform").

Si $ARGUMENTS está vacío, detecta el stack inspeccionando el árbol de trabajo:
- Ejecuta `ls -1` en la raíz del repositorio y escanea archivos indicadores: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `pom.xml`, `build.gradle`, `*.sln`, `Dockerfile`, `.terraform/`, etc.
- Comprueba archivos de editor/IDE: `.vscode/`, `.idea/`, `*.xcodeproj`
- Comprueba el SO: detecta macOS (riesgo `.DS_Store`) o Windows (riesgo `Thumbs.db`) desde el entorno

Si ya existe un `.gitignore` en la raíz del repositorio, léelo primero. Añade solo reglas que falten — no dupliques entradas existentes.

Genera el contenido de `.gitignore` organizado en secciones etiquetadas:

```
# === <Stack> ===
# === Editor / IDE ===
# === OS ===
# === Secrets & local config ===
# === Build output ===
# === Test artifacts ===
```

Reglas para cada sección:
- **Stack**: directorios de compilación específicos del lenguaje, artefactos compilados, cachés de paquetes, entornos virtuales, directorios de dependencias
- **Editor/IDE**: `.vscode/` (mantén `.vscode/extensions.json` y `settings.json` si son compartidos por el equipo — anótalo), `.idea/`, `*.swp`, `*.swo`, `.DS_Store`, `Thumbs.db`
- **Secretos**: `.env`, `.env.*` (excepto `.env.example`), `*.pem`, `*.key`, `secrets.*`, `credentials.*`
- **Salida de compilación**: `dist/`, `build/`, `out/`, `target/`, `*.o`, `*.a`, `*.so`, `*.dll`
- **Artefactos de prueba**: `coverage/`, `.nyc_output/`, `*.lcov`, `htmlcov/`, `.pytest_cache/`, `__snapshots__/` (solo si no se controlan intencionalmente)

Después del bloque de contenido, anota patrones que requieren discusión del equipo antes de añadir (p. ej., si ignorar `.vscode/settings.json`).

No escribas el archivo en disco. Muestra el contenido completo de `.gitignore` para que el usuario lo revise y aplique.
