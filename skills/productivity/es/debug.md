---
name: debug
description: "Systematic bug isolation: reproduce, hypothesise, narrow, fix, verify — for any language or error type"
---

> 🇪🇸 Versión en español. [Versión en inglés](../debug.md).

# Habilidad de Depuración

## Cuándo activar
- Existe un bug pero no sabe dónde ni por qué
- Un mensaje de error apunta a un síntoma, no a una causa
- Un test falla y la razón no es obvia
- Comportamiento intermitente / inestable que es difícil de reproducir
- Algo funcionaba antes y ahora no (regresión)

## Cuándo NO usar
- Ya conoce la causa — simplemente corrígala
- Problemas de rendimiento — use herramientas de perfilado primero
- Conflictos de dependencias/versiones — revise los changelogs antes de depurar el código

## Instrucciones

### El bucle de depuración

```
1. REPRODUCIR — hacer que el bug ocurra de forma fiable
2. HIPÓTESIS — formular una teoría específica y comprobable
3. ACOTAR — eliminar lo que no puede ser la causa
4. CORREGIR — cambiar una cosa a la vez
5. VERIFICAR — confirmar la corrección y comprobar regresiones
```

Nunca omitir el paso 1. Si no puede reproducirlo, no puede verificar la corrección.

### Paso 1 — Reproducir de forma fiable

```python
# Turn a vague "it crashes sometimes" into a deterministic test case
def test_reproduces_bug():
    # Exact inputs that trigger the bug
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # this should FAIL right now
```

**Preguntas a responder:**
- ¿Qué entrada exacta lo desencadena?
- ¿Ocurre siempre, o solo a veces?
- ¿Ocurre solo en producción, o también localmente?
- ¿Cuándo empezó? (Usar `git bisect` para encontrar el commit)

### Paso 2 — Hipótesis específica

Hipótesis mala: "Algo está mal con la base de datos"
Hipótesis buena: "La consulta devuelve null cuando el usuario no tiene pedidos, y no estamos manejando el caso null en la línea 47"

Una buena hipótesis es:
- Específica (nombra un archivo, función o línea)
- Comprobable (puede probarla o refutarla)
- Falsificable (sabe qué la refutaría)

### Paso 3 — Acotar con búsqueda binaria

```python
# Add temporary print/log statements to find where things go wrong
def process_payment(order):
    print(f"[DEBUG] order: {order}")           # is this right?
    total = calculate_total(order)
    print(f"[DEBUG] total: {total}")           # is this right?
    result = charge_card(order.card, total)
    print(f"[DEBUG] charge result: {result}")  # is this right?
    return result
```

**Enfoque de búsqueda binaria:** si una función tiene 100 líneas y no sabe dónde está el bug:
- Añadir un print en la línea 50
- Si el print muestra el estado correcto, el bug está en las líneas 51–100
- Añadir un print en la línea 75
- Repetir hasta aislar la línea exacta

### Paso 4 — Corregir una cosa a la vez

```python
# Bad: fixing 3 things at once
# - Changed the query
# - Added null check
# - Updated the cache TTL
# Now you don't know which fix worked

# Good: fix one thing, run tests, commit if green, then fix next
```

**La corrección debe ser el cambio mínimo que hace pasar el test.** Si su corrección supera las 10 líneas, considere si está corrigiendo la causa raíz o simplemente enmascarando el síntoma.

### Paso 5 — Verificar y prevenir la recurrencia

```python
# The test that reproduced the bug should now pass
def test_reproduces_bug():
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # now GREEN

# Add this test to the test suite so the bug never regresses
```

### Categorías comunes de bugs y comandos de diagnóstico

**NullPointerException / AttributeError / TypeError:**
```python
# Add type guard before the crash
print(type(obj), repr(obj))  # what is it actually?
assert obj is not None, f"Expected User, got {obj!r}"
```

**Off-by-one (error de uno):**
```python
# Print boundary values
print(f"len={len(items)}, index={index}, range={range(start, end)}")
```

**Race condition / bug async:**
```python
import asyncio
# Add sleep to exaggerate timing
await asyncio.sleep(0.1)  # does this make the bug more or less likely?
```

**"Funciona localmente, falla en CI":**
```bash
# Check for environment differences
env | sort > local-env.txt
# Compare with CI env variables
# Common causes: timezone, locale, file paths, missing env vars
```

**Regresión — funcionaba antes, ahora roto:**
```bash
# Find the commit that broke it
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
# Run your reproducer on each bisect step
# git bisect good / git bisect bad until it finds the culprit commit
```

**Test inestable (pasa a veces, falla a veces):**
```bash
# Run 20 times to force it to fail consistently
for i in {1..20}; do pytest tests/test_flaky.py -x && echo "pass $i" || echo "FAIL $i" && break; done
```

### Prompt de depuración estructurado para Claude

```
/debug

Error: {pegar el mensaje de error completo y el stack trace}
Code: {pegar la función o el archivo, o dar la ruta}
Reproduction: {pasos exactos / entrada que lo desencadena}
What I've tried: {lo que ya ha descartado}
Expected: {lo que debería pasar}
Actual: {lo que realmente pasa}
```

### Leer stack traces

```
Traceback (most recent call last):
  File "app.py", line 42, in process_order      ← llamador más externo
    total = calculate_total(order)
  File "billing.py", line 17, in calculate_total ← intermedio
    return sum(item.price for item in order.items)
  File "billing.py", line 17, in <genexpr>       ← más interno — LEER ESTO PRIMERO
AttributeError: 'NoneType' object has no attribute 'price'
```

**Siempre empiece por el final de un stack trace.** La parte superior es donde comenzó la ejecución; la parte inferior es donde se produjo el fallo.

## Ejemplo

**Error:**
```
KeyError: 'user_id'
  File "api/auth.py", line 34, in get_current_user
    return User.get(session['user_id'])
```

**Sesión de depuración con Claude:**
1. **Reproducir:** añadir `print(session)` antes de la línea 34 → revela `session = {}`
2. **Hipótesis:** la sesión está vacía — o el login no la está configurando, o se está borrando
3. **Acotar:** verificar el manejador de login — `session['user_id'] = user.id` está ahí. Verificar el middleware — `session.clear()` se llama en cada solicitud por un manejador CORS mal configurado
4. **Corregir:** eliminar la llamada errónea a `session.clear()`
5. **Verificar:** el test pasa, se añadió test para la persistencia de sesión entre solicitudes

---
