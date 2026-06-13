---
description: Detectar patrones de consultas N+1 en código ORM y producir correcciones con carga por lotes
argument-hint: "[ruta de archivo, directorio o nombre de ruta/controlador]"
---
Escanear patrones de consultas N+1 en: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, leerla. Si es un directorio, escanear todos los archivos de código fuente relevantes dentro de él. Si es un nombre de controlador o ruta, ubicar los archivos de código correspondientes.

Enfoque de detección:

1. Identificar el ORM o librería de consultas en uso (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Escanear patrones de N+1:
   - Bucles (for, forEach, map, each, .all.map, etc.) que contienen llamadas ORM dentro del cuerpo del bucle.
   - Asociaciones cargadas perezosamente accedidas dentro de un bucle (ej., `post.comments` llamado por cada publicación en una iteración).
   - Serializadores o plantillas de vista que generan cargas de asociación por registro.
   - Llamadas a `.find()` o `.get()` dentro de bucles que podrían ser procesadas por lotes.
   - Directivas de carga ansiosa faltantes (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Para cada N+1 encontrado, mostrar:
   - Ruta de archivo y número(s) de línea del código infractor.
   - La consulta que se ejecuta N veces.
   - La corrección: código exacto mostrando cómo procesar por lotes o cargar ansiosamente la asociación.
   - El método específico del ORM a usar (ej., `includes(:comments)` para ActiveRecord, `options(selectinload(Post.comments))` para SQLAlchemy, `include: { comments: true }` para Prisma).

4. También marcar:
   - Campos `select` faltantes que causan cargas de fila completa cuando solo se necesita un subconjunto.
   - `.distinct` faltante en conteos de asociación que causan resultados inflados.
   - Consultas idénticas repetidas dentro del mismo ciclo de solicitud que deberían ser memoizadas o cacheadas.

5. Si la base de código tiene registro de consultas o un patrón de aserción de conteo de consultas (ej., `assert_queries`, librería `nplusone`), sugerir agregar guardias para prevenir regresiones.

Mostrar hallazgos como una lista priorizada — ALTO (en una ruta caliente o bucle sobre colecciones sin límite), MEDIO, BAJO — con corrección de código exacta para cada uno.
