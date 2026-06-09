---
description: Auditar dependencias del proyecto en busca de CVEs conocidas y riesgos de cadena de suministro
argument-hint: "[package-file or ecosystem]"
---
Audita las dependencias de este proyecto en busca de vulnerabilidades conocidas y riesgos de cadena de suministro.

Objetivo: $ARGUMENTS (auto-detectado si está en blanco — escanea la raíz del repositorio y subdirectorios en busca de archivos de manifiesto).

1. **Detectar ecosistema(s)**: Identifica todos los lockfiles y manifiestos presentes:
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Ejecutar herramientas de auditoría nativas** donde estén disponibles:
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` o `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Captura el resultado y analiza los resultados.

3. **Identificar CVEs**: Para cada reporte de paquete vulnerable:
   - Nombre del paquete y versión actual
   - ID(s) de CVE y puntuación CVSS
   - Descripción de vulnerabilidad (una frase)
   - Versión corregida (si está disponible)
   - Si esta es una dependencia directa o transitiva
   - Si la ruta de código vulnerable es alcanzable desde la aplicación

4. **Señales de cadena de suministro**: Marca cualquier paquete que muestre:
   - Versiones no publicadas o canceladas fijadas en lockfile
   - Paquetes con cero descargas, un único mantenedor, o transferencias de propietario muy recientes
   - Riesgo de confusión de dependencia (nombres de paquetes internos que existen en registros públicos)
   - Paquetes con scripts de instalación (`preinstall`, `postinstall`) que ejecutan código arbitrario
   - Fijaciones de versión comodín (`*`, `>=0.0.0`) que aceptan cualquier versión futura

5. **Priorizar**: Ordena por alcanzabilidad > puntuación CVSS > directo vs transitivo.

6. **Salida**:
   ```
   ## Dependency Audit

   ### Critical / High CVEs
   [package@version] CVE-XXXX-XXXXX (CVSS N.N) — description
   Fix: upgrade to X.Y.Z
   Reachable: yes/no/unknown

   ### Supply-Chain Flags
   - [package]: reason

   ### Upgrade Commands
   Paste-ready commands to fix all critical/high issues.
   ```

Si la herramienta de auditoría no está disponible, realiza referencias cruzadas de versiones contra bases de datos de CVE conocidas de datos de entrenamiento y anota la limitación. No modifiques archivos ni ejecutes comandos de instalación.
