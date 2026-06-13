---
description: Armar un agente Claude de múltiples pasos con uso de herramientas, memoria y una condición de parada definida
argument-hint: "[descripción del objetivo o tarea del agente]"
---
Armar un agente Claude en producción que logre: $ARGUMENTS

**Paso 1 — Especificación de diseño del agente**

Antes de escribir código, define:

- **Objetivo** — la condición de éxito terminal (no un proceso, un estado)
- **Entradas** — lo que el agente recibe al iniciar (cadenas de texto, rutas de archivos, datos estructurados)
- **Salidas** — lo que produce cuando termina (archivos escritos, llamadas a API realizadas, resultado estructurado devuelto)
- **Herramientas necesarias** — enumera cada herramienta: nombre, propósito, esquema de entrada, forma de retorno
- **Modelo de memoria** — elige uno:
  - Sin estado (solo ventana de contexto, apropiado para <20 llamadas de herramientas)
  - Memoria de resumen (comprime el historial con Haiku después de cada N pasos)
  - Memoria externa (escribe hechos clave en un archivo de notas rápidas o almacén de pares clave-valor)
- **Condiciones de parada** — qué desencadena que el agente devuelva la salida final vs. continúa iterando:
  - Éxito: estado objetivo alcanzado
  - Fallo: recuento de errores excedido, estado contradictorio detectado
  - Límite: max_iterations alcanzado (siempre incluye esto)

**Paso 2 — Generar el agente**

Escribe `agent.py` usando el SDK de Python de Anthropic. Requisitos:

- Modelo: `claude-sonnet-4-6` (configurable a través de la variable de entorno `AGENT_MODEL`)
- Implementa el bucle agéntico:
  ```
  while not done and iterations < max_iterations:
      response = client.messages.create(tools=tools, messages=history)
      if response.stop_reason == "tool_use":
          results = execute_tools(response)
          history.append(assistant_turn)
          history.append(tool_results_turn)
      elif response.stop_reason == "end_turn":
          done = True
  ```
- Define cada herramienta como un diccionario con `name`, `description`, `input_schema` (JSON Schema)
- Despacho de herramientas: una función `dispatch(tool_name, tool_input)` que enruta hacia llamables de Python
- Usa `cache_control: {"type": "ephemeral"}` en el mensaje del indicador del sistema
- Salida final estructurada: el agente devuelve una dataclass tipada, no texto sin procesar
- Registra cada iteración: herramienta llamada, resumen de entrada, resumen de resultado (no contenido completo)

**Paso 3 — Manejo de errores**

- Envuelve cada llamada de herramienta en try/except; devuelve `{"error": str(e)}` como resultado de herramienta — nunca levantes una excepción hacia el bucle
- En `max_iterations` excedido: devuelve resultados parciales con una bandera `status: "incomplete"`
- En errores de API (`anthropic.APIStatusError`): reintentos hasta 3 veces con retroceso exponencial

**Paso 4 — Punto de entrada CLI**

Expone a través de `argparse`:
- `--goal` (o posicional): anula el objetivo codificado
- `--max-iterations`: predeterminado 25
- `--dry-run`: imprime el plan (indicador del sistema + herramientas) sin ejecutar

**Salida:** `agent.py` con todas las herramientas implementadas, sin fragmentos. Incluye un ejemplo de uso en un bloque de comentarios en la parte superior del archivo.
