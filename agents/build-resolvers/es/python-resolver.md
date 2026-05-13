> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../python-resolver.md).

# Agente Resolvedor de Builds Python

## Propósito
Diagnostica y corrige errores de importación de Python, excepciones en tiempo de ejecución, incompatibilidades de anotaciones de tipos (mypy) y conflictos de dependencias — devolviendo código corregido con una explicación.

## Orientación sobre el modelo
**Haiku 4.5** para errores de un solo archivo (ImportError, AttributeError, NameError, problemas simples de anotaciones de tipos).

**Sonnet 4.6** para errores que abarcan múltiples módulos, importaciones circulares, fallos en modo estricto de mypy o conflictos de versión de dependencias.

## Herramientas
- `Read` — leer el archivo fallido y los módulos relacionados
- `Edit` — aplicar correcciones específicas
- `Bash` — ejecutar `python -m mypy file.py 2>&1`, `python -c "import module"`, `pip show package` para diagnosticar

## Cuándo delegar aquí
- `ImportError` o `ModuleNotFoundError` al inicio o en la ejecución de pruebas
- Fallos de verificación de tipos `mypy` en un codebase estrictamente tipado
- `AttributeError: module 'x' has no attribute 'y'` (API cambió al actualizar un paquete)
- Errores de importación circular
- Conflictos de versión de dependencias (`pip install` falla o produce versiones incompatibles)

## Cuándo NO delegar aquí
- Bugs lógicos que no son errores de importación/tipo
- Problemas de rendimiento
- Errores en tiempo de ejecución causados por lógica de negocio incorrecta (no errores estructurales de Python)

## Plantilla de prompt
```
You are a Python error resolver. Fix the error — minimal changes only. Do not refactor.

Error:
[paste full traceback or mypy output]

Relevant files:
[paste file contents where errors occur]

Python version: [e.g., 3.12]
Package versions: [paste pip freeze output if relevant]

For each error:
1. Explain why the error occurs in one sentence
2. Apply the minimal fix
3. If a dependency version conflict: specify the exact version constraint to add/change

Do not change logic. Do not refactor. Fix the error only.
```

## Caso de uso de ejemplo
**Error:**
```
ImportError: cannot import name 'AsyncClient' from 'httpx' (0.23.0)
```

**Lo que devuelve el Resolvedor:**
- Causa: `AsyncClient` fue agregado en `httpx 0.18.0` pero el uso requiere `httpx>=0.23.0` para la API específica usada
- Corrección: actualizar `requirements.txt` a `httpx>=0.23.0,<1.0.0` y ejecutar `pip install -r requirements.txt`
- Si no se puede actualizar: mostrar el código equivalente para la versión instalada

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
