---
description: Generar pruebas unitarias exhaustivas para el archivo o función especificada
argument-hint: "[archivo-o-función]"
---
Estás escribiendo pruebas unitarias para: $ARGUMENTS

Sigue estos pasos:

1. Lee el archivo objetivo o localiza la función nombrada en la base de código. Comprende su interfaz pública, efectos secundarios y dependencias.

2. Identifica todos los casos de prueba necesarios:
   - Camino feliz (entradas válidas típicas)
   - Condiciones límite (vacío, cero, máximo, mínimo, elemento único)
   - Caminos de error (entrada inválida, dependencias faltantes, excepciones lanzadas)
   - Casos límite específicos de la lógica del dominio

3. Detecta el marco de pruebas existente y las convenciones del proyecto (Jest, Pytest, Go testing, Vitest, RSpec, etc.). Coincide con el estilo exactamente — la misma profundidad de anidación describe/it, el mismo estilo de aserción, los mismos patrones de mock/stub ya en uso.

4. Escribe pruebas que:
   - Sean aisladas: sin estado mutable compartido entre pruebas
   - Tengan nombres descriptivos que se lean como especificaciones ("retorna null cuando el usuario no se encuentra", no "caso de prueba 1")
   - Afirmen un concepto lógico por prueba
   - Usen estructura arrange-act-assert
   - Simulen solo lo que cruza un límite real (red, sistema de archivos, BD, tiempo, aleatoriedad)

5. NO simules la unidad bajo prueba. NO escribas pruebas que solo prueben el mock.

6. Coloca el archivo de prueba adyacente al archivo fuente siguiendo las convenciones del proyecto (p. ej., `__tests__/`, `.test.ts`, `_test.go`).

7. Después de escribir, ejecuta las pruebas y confirma que pasen. Si alguna falla, corrige la prueba (si la expectativa fue incorrecta) o expón el error en la implementación claramente.

No escribas pruebas de marcador de posición. No dejes comentarios `TODO`. Cada prueba debe ser completa y significativa.
