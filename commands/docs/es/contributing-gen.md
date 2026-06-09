---
description: Genera un CONTRIBUTING.md adaptado al flujo de trabajo actual de este repositorio
argument-hint: "[output-path]"
---
Genera un CONTRIBUTING.md para este repositorio.

Antes de escribir nada:
1. Lee el README existente, cualquier configuración de CI (`.github/workflows/`, `Makefile`, `justfile`),
   configuración de linting/formato (`.eslintrc`, `pyproject.toml`, `.prettierrc`, etc.), y configuración del test runner
   (`jest.config.*`, `pytest.ini`, `vitest.config.*`).
2. Verifica si hay documentación de contribución existente — si `CONTRIBUTING.md` ya existe, léelo
   antes de sobrescribirlo. Preserva secciones precisas; reemplaza las desactualizadas o faltantes.
3. Identifica los comandos reales utilizados: instalar, compilar, probar, linting, formato. Usa lo que
   el repositorio define, no valores por defecto genéricos.

Escribe CONTRIBUTING.md con estas secciones:

### Prerequisites
Versiones exactas de runtime/herramientas requeridas (Node, Python, Go, etc.), obtenidas de `.nvmrc`,
`.python-version`, `go.mod`, o equivalente. Si no se encuentran, indícalo.

### Getting Started
Clonar → instalar → primera ejecución. Solo comandos exactos. Sin cobertura "podría ser necesario".

### Development Workflow
Cómo ejecutar el servidor de desarrollo / watcher / REPL. Cómo ejecutar pruebas y lints. Comandos exactos.

### Making Changes
Convención de nomenclatura de ramas (deducida de nombres de ramas existentes o reglas de CI si están presentes).
Formato de mensaje de commit (deducido de git log o configuración de commitlint).
Proceso de PR: quién revisa, qué verificaciones deben pasar, cómo solicitar revisión.

### Code Style
Resume las reglas impuestas por la configuración del linter/formateador. No enumeres cada regla —
solo decisiones que un colaborador tendría que tomar activamente (nomenclatura, estructura de archivos, coubicación de pruebas).

### Testing Requirements
Qué cobertura de pruebas se espera. Dónde colocar nuevas pruebas. Cómo ejecutar solo un subconjunto.

### Submitting a PR
Lista de verificación: pruebas pasan, linting pasa, documentación actualizada si es necesario, entrada de changelog si aplica.
Vincula a CI si GitHub Actions están presentes.

Reglas de precisión:
- Cada comando debe provenir de la configuración real del repositorio. No inventes scripts.
- Si una sección no tiene evidencia en el repositorio, omítela en lugar de escribir un placeholder genérico.
- Salida a: $ARGUMENTS (por defecto: `CONTRIBUTING.md` en la raíz del repositorio).
- Después de escribir, imprime la lista de archivos fuente que leíste para producir la salida.
