---
description: Generar scripts realistas de datos semilla para entornos de desarrollo o prueba
argument-hint: "[nombre(s) de tabla, archivo de esquema, o descripción]"
---
Generar datos semilla para: $ARGUMENTS

Si $ARGUMENTS es un nombre de tabla o lista de nombres, localiza definiciones de esquema en el código. Si es un archivo de esquema, léelo. Si es una descripción, infiere el esquema del contexto.

Reglas para la generación de datos semilla:

1. Detecta el mecanismo de siembra usado en este proyecto:
   - Archivos INSERT de SQL, seeders de framework (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), o librerías de factory (FactoryBot, factory-boy, Faker.js).
   - Coincide exactamente con el formato existente.

2. Genera datos que sean:
   - Realistas: usa valores apropiados para el dominio (nombres que parecen reales, emails válidos, fechas plausibles, valores enum correctos).
   - Variados: al menos 10-20 filas por tabla a menos que la tabla represente un conjunto pequeño de búsqueda.
   - Consistentes entre tablas relacionadas: las claves foráneas hacen referencia a IDs válidos en tablas padre; el orden de siembra respeta restricciones FK.
   - Seguros: nunca uses patrones reales de PII — usa datos claramente falsos (p. ej., `alice@example.com`, no `alice@gmail.com`).

3. Cubre casos edge:
   - Al menos una fila por cada valor distinct de enum/estado.
   - Valores nulos para columnas anulables donde la aplicación debe manejarlos.
   - Valores límite (montos cero, strings de máxima longitud, fechas muy futuras/pasadas) donde sea relevante para pruebas.

4. Si el esquema tiene columnas de eliminación suave, incluye registros activos y eliminados.

5. Genera el/los archivo(s) de semilla con nombres y rutas correctos siguiendo las convenciones del proyecto.

6. Después de los datos semilla, lista cualquier siembra de prerequisito que deba ejecutarse primero (orden de dependencias) y cualquier paso de configuración manual (p. ej., crear un superusuario antes de sembrar roles de usuario).

No generes más de 50 filas por tabla a menos que se solicite explícitamente.
