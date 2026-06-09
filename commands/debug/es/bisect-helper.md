---
description: Ejecuta una búsqueda binaria estructurada en git para encontrar el commit que introdujo una regresión
argument-hint: "[failing test, command, or behavior description]"
---
Encuentra el commit que introdujo esta regresión: $ARGUMENTS

Estás ejecutando una búsqueda binaria sobre el historial de git. Sé metódico.

1. **Establece el oráculo de prueba** — antes de tocar git, define exactamente cómo determinar bueno vs malo:
   - Prefiere un comando único que salga con 0 en bueno y diferente de cero en malo
   - Ejemplos: `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Si la regresión es visual o conductual (no una prueba), escribe un script que verifique el síntoma observable
   - El oráculo debe ser rápido (< 30s idealmente) y determinista

2. **Identifica los commits conocidos como buenos y conocidos como malos**
   - Conocido-malo: normalmente HEAD o el primer commit donde se notó la regresión
   - Conocido-bueno: un commit o etiqueta donde el comportamiento era correcto (etiqueta de lanzamiento reciente, último despliegue, etc.)
   - Confirma ambos ejecutando el oráculo contra cada uno antes de iniciar bisect

3. **Ejecuta el bisect**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Luego para cada checkout, ejecuta el oráculo y marca:
   ```
   git bisect good   # si el oráculo pasa
   git bisect bad    # si el oráculo falla
   ```
   O automatízalo: `git bisect run <oracle-command>`

4. **Interpreta el resultado** — cuando bisect termina, git apunta al primer commit malo. Lee:
   - El mensaje del commit y el diff (`git show <sha>`)
   - Las líneas específicas cambiadas que se relacionan con el oráculo fallido
   - El autor y cualquier problema/PR vinculado para contexto

5. **Confirma el hallazgo** — revisa el commit justo anterior al malo, ejecuta el oráculo,
   confirma que pasa. Revisa el commit malo, confirma que falla. Esto descarta un oráculo inestable.

6. **Limpia**
   ```
   git bisect reset
   ```

7. **Reporta** — resume:
   - El SHA del commit ofensivo y su mensaje
   - El hunque de diff específico que introdujo la regresión
   - Si el cambio fue intencional (la solución es una reversión o un parche de seguimiento)

Si la suite de pruebas no existe aún, el paso 1 es escribir el oráculo primero, luego procede.
No saltes el paso de confirmación — un resultado bisect incorrecto desperdicia más tiempo del que ahorra.
