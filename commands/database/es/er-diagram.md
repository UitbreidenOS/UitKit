---
description: Generar un diagrama ER en Mermaid o PlantUML a partir del esquema de base de datos del proyecto
argument-hint: "[schema file, table names, or directory]"
---
Generar un diagrama de relaciones de entidades para: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, léelo. Si es un nombre de tabla o una lista separada por comas, localiza sus definiciones en migraciones, modelos ORM o archivos de esquema. Si es un directorio, escanea todas las definiciones de esquema dentro de él.

Pasos:

1. Extrae información del esquema:
   - Nombres de tablas y sus columnas (nombre, tipo, nulabilidad, valor predeterminado).
   - Claves principales (simples y compuestas).
   - Claves externas y las relaciones que representan (uno a uno, uno a muchos, muchos a muchos mediante tablas de unión).
   - Restricciones únicas que implican cardinalidad.

2. Detecta la preferencia de formato de diagrama:
   - Si el proyecto ya contiene archivos `.mmd`, `mermaid` o PlantUML, coincide con ese formato.
   - Por defecto, usa la sintaxis Mermaid `erDiagram` (se renderiza en GitHub, Notion, la mayoría de herramientas de documentación).
   - Si el usuario especificó PlantUML, usa `@startuml` / `@enduml` con bloques de entidad.

3. Produce el diagrama:
   - Incluye todas las columnas con sus tipos en los bloques de entidad.
   - Muestra líneas de relación con la notación de cardinalidad correcta de Mermaid:
     - `||--o{` uno a muchos
     - `||--||` uno a uno
     - `}o--o{` muchos a muchos
   - Etiqueta cada línea de relación con el nombre de la clave externa o una etiqueta semántica breve.
   - Agrupa tablas de unión/asociación visualmente distintas si es posible mediante comentarios.

4. Si el esquema es grande (>15 tablas), produce dos diagramas:
   - Una descripción general de alto nivel que muestre solo tablas y relaciones (sin detalles de columnas).
   - Un diagrama detallado para el subconjunto de tablas en $ARGUMENTS o las tablas de dominio principal.

5. Después del diagrama, emite:
   - Una breve leyenda que explique cualquier abreviatura no obvia utilizada en tipos de columnas.
   - Una lista de cualquier relación implícita encontrada en el código pero no declarada como restricción FK.
   - Cualquier tabla de unión que represente conceptos de dominio que valga la pena renombrar por claridad.

Emite el diagrama en un bloque de código cercado con la etiqueta de idioma correcta (`mermaid` o `plantuml`).
