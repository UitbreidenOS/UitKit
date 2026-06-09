---
description: Analiza un seguimiento de pila para identificar la causa raíz, la cadena de llamadas y la solución práctica
argument-hint: "[paste stack trace]"
---
Analiza el siguiente seguimiento de pila y produce un diagnóstico preciso y práctico.

Seguimiento de pila:
$ARGUMENTS

Trabaja a través de esto sistemáticamente:

1. **Analiza el seguimiento** — identifica el lenguaje y el tiempo de ejecución (Python, JVM, Go, Node, Rust, .NET, etc.). Ten en cuenta el tipo de excepción/error y el mensaje en la parte superior del seguimiento.

2. **Recorre la cadena de llamadas** — comenzando desde el punto de lanzamiento de origen (marco más profundo relevante), traza hacia arriba a través de cada marco:
   - Identifica qué marcos son código de aplicación frente a marco/biblioteca frente a elementos internos del tiempo de ejecución
   - Enfoca el análisis en los marcos de la aplicación — aquí es donde vive el error
   - Para cada marco de la aplicación, describe qué es responsable esa función y por qué está en esta cadena de llamadas

3. **Identifica el origen** — identifica el único marco donde el control debería haber divergido de la ruta correcta. Este no siempre es el marco más profundo; es el marco donde se introdujo una suposición incorrecta, una verificación faltante o un estado inválido.

4. **Lee el código fuente** — si las rutas de archivo en el seguimiento existen en este repositorio, lee las líneas relevantes. Haz referencias cruzadas de los números de línea en el seguimiento con el código real. No confíes solo en el seguimiento.

5. **Diagnostica la causa raíz** — describe exactamente qué condición activó este seguimiento. Sé específico acerca de los valores de variables, estados de objetos o temporización que condujeron aquí si son inferibles.

6. **Descarta falsos positivos** — si algún marco es ruido (contenedores asincronos, middleware, bucles de reintentos), indícalo explícitamente para que el lector no los persiga.

7. **Soluciona** — proporciona el cambio de código concreto que elimina esta ruta de fallo. Muestra la ubicación exacta (archivo, función, rango de líneas) y el cambio antes/después. Si la solución requiere entender el estado externo, describe qué verificar y cómo.

8. **Protección contra regresiones** — sugiere la prueba mínima que habría detectado esto antes de llegar a producción.
