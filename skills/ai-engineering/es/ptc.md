# Llamadas Programáticas de Herramientas (PTC)

## Cuándo activar
El usuario quiere reducir el uso de tokens de API para flujos de trabajo pesados en herramientas, menciona llamadas programáticas de herramientas, o tiene un patrón donde la misma herramienta se llama más de 3 veces en una sola pasada de inferencia.

## Cuándo NO usar
- Herramientas con efectos secundarios que necesitan revisión humana entre llamadas (escribir, eliminar, desplegar)
- Herramientas que requieren re-autenticación por llamada o con avisos de autorización por llamada
- Llamadas de herramienta única — el gasto general de PTC no vale la pena por debajo de ~3 llamadas
- Entornos de ejecución que no sean Python — el sandbox de PTC es solo Python

## Instrucciones

### Qué Hace PTC
Uso estándar de herramientas: Claude llama una herramienta → resultado retornado → Claude llama la siguiente herramienta. Cada viaje redondo es una pasada de inferencia de API.

Con PTC: Claude escribe código de orquestación Python que llama múltiples herramientas en un bucle, se ejecuta en un sandbox, y solo el stdout final entra en el contexto. Tres herramientas = 1 pasada de inferencia en lugar de 3.

**Reducción de tokens medida: ~37% menos tokens para flujos de trabajo multi-herramientas.**

### Habilitación de PTC
Agregar `code_execution_20250825` como llamador permitido en la definición de tu herramienta:
```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the filesystem",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path to read"},
            },
            "required": ["path"],
        },
        "allowed_callers": ["code_execution_20250825"],  # Enable PTC for this tool
    }
]
```

Cuando PTC está habilitado, Claude puede elegir escribir código de orquestación en lugar de llamar la herramienta directamente.

### Sandbox de Ejecución
- Solo Python
- Sin acceso al sistema de archivos por defecto (a menos que la herramienta misma lo proporcione)
- Biblioteca estándar limitada — sin llamadas de red desde código sandbox
- Los resultados de las herramientas se retornan como objetos Python al código sandbox
- Solo stdout del sandbox entra en el contexto de la conversación

### Cuándo Claude Usa PTC Automáticamente
Claude selecciona PTC cuando detecta un patrón que se beneficia del agrupamiento:
- Lectura de N archivos y extracción de un campo de cada uno
- Ejecutar la misma transformación en una lista de entradas
- Agregar resultados de múltiples llamadas de herramientas antes de responder
- Cualquier bucle donde una herramienta se llama con parámetros diferentes cada iteración

### Cuándo Forzar PTC (Ingeniería de Prompts)
Si Claude no está usando PTC para un patrón que claramente se beneficia de él, agregar al aviso del sistema:
```
When you need to call the same tool multiple times with different inputs, write Python orchestration code using code_execution_20250825 to batch the calls rather than calling the tool individually each time.
```

### Diseño de Herramientas para Compatibilidad PTC
Las herramientas usadas con PTC deben:
- Aceptar entradas simples y serializables (strings, números, listas)
- Retornar salida limpia y analizable (preferir JSON sobre texto libre)
- Ser idempotentes (lecturas, búsquedas) en lugar de con estado (escrituras, mutaciones)
- No requerir confirmación interactiva

### Combinación de PTC con Almacenamiento en Caché de Prompts
Para máxima eficiencia de tokens: cachear las definiciones de herramientas (que pueden ser grandes) con `cache_control`, y habilitar PTC para reducir el número de viajes redondos:
```python
tools = [
    # ... your tools ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"],
        "cache_control": {"type": "ephemeral"},  # Cache all tools up to here
    }
]
```

### Limitaciones
- PTC no puede llamar herramientas que requieren aprobación interactiva de humanos a mitad de ejecución
- El sandbox tiene un tiempo de espera — bucles muy largos pueden ser cortados
- Las herramientas que retornan datos binarios (imágenes, archivos) no son adecuadas para orquestación PTC
- La depuración es más difícil — el código y los resultados intermedios no son visibles en el contexto principal

## Ejemplo

Extracción de firmas de funciones de 20 archivos de origen sin PTC: 20 llamadas de herramienta `read_file`, 20 viajes redondos, ~40,000 tokens de gasto general de llamada de herramienta + resultado.

Con PTC habilitado en `read_file`:

Claude escribe (internamente, en sandbox):
```python
files = [
    "src/api/users.ts", "src/api/orders.ts", "src/api/products.ts",
    # ... 17 more
]
signatures = []
for f in files:
    content = read_file(path=f)
    # Extract export function lines
    sigs = [line.strip() for line in content.split("\n") if line.startswith("export function")]
    signatures.extend(sigs)
print("\n".join(signatures))
```

Una pasada de inferencia. Solo las firmas extraídas (no contenidos completos de archivos) entran en contexto. Reducción de tokens: 37% en este flujo de trabajo.

---
