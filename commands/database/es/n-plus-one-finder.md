---
description: Detectar patrones de consultas N+1 en código ORM y producir soluciones de carga por lotes
argument-hint: "[file path, directory, or route/controller name]"
---
Escanear patrones de consultas N+1 en: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, léelo. Si es un directorio, escanea todos los archivos fuente relevantes dentro de él. Si es un nombre de controlador o ruta, localiza los archivos de código correspondientes.

Enfoque de detección:

1. Identifica el ORM o la biblioteca de consultas en uso (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Escanea patrones N+1:
   - Bucles (for, forEach, map, each, .all.map, etc.) que contienen llamadas ORM dentro del cuerpo del bucle.
   - Asociaciones cargadas perezosamente accedidas dentro de un bucle (p. ej., `post.comments` llamado por cada publicación en una iteración).
   - Serializadores o plantillas de vista que disparan cargas de asociación por registro.
   - Llamadas `.find()` o `.get()` dentro de bucles que podrían procesarse por lotes.
   - Directivas de carga ansiosa faltantes (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Para cada N+1 encontrado, genera:
   - Ruta del archivo y número(s) de línea del código ofensivo.
   - La consulta que se ejecuta N veces.
   - La solución: código exacto que muestra cómo procesar por lotes o cargar ávidamente la asociación.
   - El método específico del ORM a usar (p. ej., `includes(:comments)` para ActiveRecord, `options(selectinload(Post.comments))` para SQLAlchemy, `include: { comments: true }` para Prisma).

4. También marca:
   - Campos `select` faltantes que causan cargas de filas completas cuando solo se necesita un subconjunto.
   - `.distinct` faltante en conteos de asociación que causan resultados inflados.
   - Consultas idénticas repetidas dentro del mismo ciclo de solicitud que deberían memorizarse o almacenarse en caché.

5. Si la base de código tiene registro de consultas o un patrón de aserción de conteo de consultas (p. ej., `assert_queries`, biblioteca `nplusone`), sugiere agregar guardias para prevenir regresiones.

Genera hallazgos como una lista priorizada — ALTO (en una ruta activa o bucle sobre colecciones sin límites), MEDIO, BAJO — con una solución de código exacta para cada uno.
