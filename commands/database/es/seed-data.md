---
description: Generar scripts realistas de datos iniciales para entornos de desarrollo o prueba
argument-hint: "[table name(s), schema file, or description]"
---
Generar datos iniciales para: $ARGUMENTS

Si $ARGUMENTS es un nombre de tabla o lista de nombres, localiza definiciones de esquema en el repositorio. Si es un archivo de esquema, léelo. Si es una descripción, infiere el esquema del contexto.

Reglas para la generación de datos iniciales:

1. Detecta el mecanismo de siembra utilizado en este proyecto:
   - Archivos SQL INSERT, seeders de framework (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), o librerías de fábrica (FactoryBot, factory-boy, Faker.js).
   - Coincide exactamente con el formato existente.

2. Genera datos que sean:
   - Realistas: usa valores apropiados para el dominio (nombres con aspecto real, correos válidos, fechas plausibles, valores enum correctos).
   - Variados: al menos 10-20 filas por tabla a menos que la tabla represente un conjunto de búsqueda pequeño.
   - Consistentes entre tablas relacionadas: las claves foráneas hacen referencia a IDs válidos en tablas padre; el orden de siembra respeta las restricciones de FK.
   - Seguros: nunca uses patrones de PII reales — usa datos obviamente falsos (p. ej., `alice@example.com`, no `alice@gmail.com`).

3. Cubre casos límite:
   - Al menos una fila por cada valor enum/estado distinto.
   - Valores nulos para columnas anulables donde la aplicación debe manejarlos.
   - Valores límite (cero montos, cadenas de longitud máxima, fechas muy futuras/pasadas) donde sea relevante para las pruebas.

4. Si el esquema tiene columnas de eliminación suave, incluye registros tanto activos como eliminados.

5. Genera el archivo(s) de semilla con nombres y rutas correctos siguiendo las convenciones del proyecto.

6. Después de los datos iniciales, lista cualquier semilla de requisito previo que deba ejecutarse primero (orden de dependencia) y cualquier paso de configuración manual (p. ej., crear un superusuario antes de sembrar roles de usuario).

No generes más de 50 filas por tabla a menos que se solicite explícitamente.
