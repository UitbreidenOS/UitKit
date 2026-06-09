---
description: Generar pruebas unitarias exhaustivas para el archivo o función especificados
argument-hint: "[file-or-function]"
---
Estás escribiendo pruebas unitarias para: $ARGUMENTS

Sigue estos pasos:

1. Lee el archivo de destino o localiza la función nombrada en la base de código. Entiende su interfaz pública, efectos secundarios y dependencias.

2. Identifica todos los casos de prueba necesarios:
   - Ruta feliz (entradas válidas típicas)
   - Condiciones de límite (vacío, cero, máximo, mínimo, elemento único)
   - Rutas de error (entrada inválida, dependencias faltantes, excepciones lanzadas)
   - Casos edge específicos de la lógica de dominio

3. Detecta el marco de prueba existente y las convenciones en este proyecto (Jest, Pytest, Go testing, Vitest, RSpec, etc.). Coincide exactamente con el estilo — mismo nivel de anidamiento describe/it, mismo estilo de afirmación, mismos patrones de mock/stub ya en uso.

4. Escribe pruebas que:
   - Sean aisladas: sin estado mutable compartido entre pruebas
   - Tengan nombres descriptivos que lean como especificaciones ("devuelve null cuando el usuario no se encuentra", no "caso de prueba 1")
   - Afirmen un concepto lógico por prueba
   - Utilicen estructura arrange-act-assert
   - Simule solo lo que cruza un límite real (red, sistema de archivos, BD, tiempo, aleatoriedad)

5. NO simules la unidad bajo prueba. NO escribas pruebas que solo prueben el mock.

6. Coloca el archivo de prueba adyacente al archivo de fuente siguiendo las convenciones del proyecto (p. ej., `__tests__/`, `.test.ts`, `_test.go`).

7. Después de escribir, ejecuta las pruebas y confirma que pasan. Si alguna falla, corrige la prueba (si la expectativa era incorrecta) o expone claramente el error en la implementación.

No escribas pruebas de marcador de posición. No dejes comentarios `TODO`. Cada prueba debe ser completa y significativa.
