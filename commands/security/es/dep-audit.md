---
description: Auditar dependencias del proyecto para CVEs conocidas y riesgos de cadena de suministro
argument-hint: "[archivo-paquete o ecosistema]"
---
Audita las dependencias en este proyecto para identificar vulnerabilidades conocidas y riesgos de cadena de suministro.

Destino: $ARGUMENTS (detección automática si está en blanco — escanea el directorio raíz del repositorio y subdirectorios en busca de archivos de manifiesto).

1. **Detectar ecosistema(s)**: Identifica todos los archivos de bloqueo y manifiestos presentes:
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
   Captura la salida y analiza los resultados.

3. **Identificar CVEs**: Para cada paquete vulnerable, informa:
   - Nombre del paquete y versión actual
   - ID de CVE y puntuación CVSS
   - Descripción de vulnerabilidad (una oración)
   - Versión corregida (si está disponible)
   - Si es una dependencia directa o transitiva
   - Si la ruta de código vulnerable es alcanzable desde la aplicación

4. **Señales de cadena de suministro**: Marca cualquier paquete que muestre:
   - Versiones no publicadas o descartadas fijadas en el archivo de bloqueo
   - Paquetes sin descargas, con un único mantenedor o con transferencias recientes de propietario
   - Riesgo de confusión de dependencias (nombres de paquetes internos que existen en registros públicos)
   - Paquetes con scripts de instalación (`preinstall`, `postinstall`) que ejecutan código arbitrario
   - Pines de versión con comodín (`*`, `>=0.0.0`) que aceptan cualquier versión futura

5. **Priorizar**: Ordena por alcanzabilidad > puntuación CVSS > dependencia directa vs transitiva.

6. **Salida**:
   ```
   ## Auditoría de Dependencias

   ### CVEs Críticas / Altas
   [paquete@versión] CVE-XXXX-XXXXX (CVSS N.N) — descripción
   Corregir: actualizar a X.Y.Z
   Alcanzable: sí/no/desconocido

   ### Banderas de Cadena de Suministro
   - [paquete]: razón

   ### Comandos de Actualización
   Comandos listos para pegar para corregir todos los problemas críticos/altos.
   ```

Si la herramienta de auditoría no está disponible, haz referencias cruzadas de versiones con bases de datos de CVE conocidas de datos de entrenamiento y nota la limitación. No modifiques archivos ni ejecutes comandos de instalación.
