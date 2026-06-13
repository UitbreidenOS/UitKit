> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../python.md).

# Reglas de Python

## Aplicar a
Todos los archivos Python (`*.py`) en cualquier proyecto.

## Reglas

1. **Type hints en todas las firmas de funciones** — parámetros y tipos de retorno. Usa `from __future__ import annotations` para referencias hacia adelante. Sin funciones sin tipado en código de producción.

2. **`pathlib.Path` sobre `os.path`** — `Path("dir") / "file.txt"` es más limpio y funciona multiplataforma. `os.path` es legado.

3. **f-strings sobre `.format()` y `%`** — `f"Hello {name}"` en todas partes. `.format()` solo cuando la plantilla se almacena como variable de cadena.

4. **Nunca uses argumentos mutables por defecto** — `def fn(items: list = [])` crea una lista compartida en todas las llamadas. Usa `def fn(items: list | None = None)` y asigna dentro de la función.

5. **`dataclasses` para contenedores de datos, `Pydantic` para datos externos validados** — si cruza un límite del sistema (HTTP, archivo, entorno), usa Pydantic. Si es estado puramente interno, `@dataclass` es más ligero.

6. **Prefiere sentencias `with` para toda la gestión de recursos** — archivos, conexiones a BD, bloqueos, sesiones HTTP. Nunca llames `.close()` manualmente.

7. **Expresiones generadoras sobre comprensiones de lista cuando solo iteras una vez** — `sum(x*x for x in range(1000))` no asigna una lista.

8. **Define `__all__` en cada módulo público** — API pública explícita. Previene la contaminación de `import *` y documenta la intención.

9. **Lanza excepciones específicas, captura excepciones específicas** — `raise ValueError("message")` no `raise Exception`. `except ValueError` no `except Exception` a menos que estés en un límite de error de nivel superior.

10. **Módulo `logging` para código de producción, nunca `print()`** — `import logging; logger = logging.getLogger(__name__)`. `print()` solo en código de salida CLI.

11. **Usa `Enum` para conjuntos fijos de valores** — no constantes de cadena. `class Status(str, Enum): ACTIVE = "active"` proporciona seguridad de tipos y completado en el IDE.

12. **`subprocess.run()` sobre `os.system()`** — captura la salida, lanza en caso de fallo con `check=True`, evita inyección de shell con args de lista: `subprocess.run(["git", "status"], check=True)`.

13. **`dict.get(key, default)` sobre `key in dict` + `dict[key]`** — una búsqueda en lugar de dos.

14. **Clases base abstractas mediante `abc.ABC`** — cuando necesitas contratos de interfaz forzados. `Protocol` para subtipado estructural (duck typing con verificación de tipos).

15. **Siempre entornos virtuales, dependencias en `pyproject.toml`** — `uv` o `poetry` para gestión. Sin `requirements.txt` para nuevos proyectos.


---
