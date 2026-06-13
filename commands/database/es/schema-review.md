---
description: Revisar un esquema de base de datos para detectar defectos de diseño, problemas de normalización y preparación para producción
argument-hint: "[archivo de esquema o nombre(s) de tabla]"
---
Estás realizando una revisión de preparación para producción de un esquema de base de datos. Objetivo de revisión: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, lee el archivo. Si es un nombre de tabla o lista de nombres, busca definiciones de esquema en la base de código (migraciones, modelos ORM, schema.sql, schema.rb, prisma.schema, etc.).

Revisa el esquema en estas dimensiones:

**Normalización e Integridad de Datos**
- Identifica violaciones de 1NF, 2NF, 3NF. Nota denormalizaciones que son intencionales (para rendimiento de lectura) vs. accidentales.
- Detecta columnas que almacenan múltiples valores (listas separadas por comas, arrays JSON utilizados como relaciones).
- Verifica que cada tabla tenga una clave primaria clara.
- Comprueba que las claves externas se declaren y no solo se impliquen por convención de nombres.
- Busca restricciones UNIQUE faltantes en columnas que deberían ser únicas.
- Detecta columnas que aceptan nulos cuando deberían ser NOT NULL según la semántica empresarial.

**Adecuación de Tipos**
- Marca columnas de texto utilizadas para almacenar correos electrónicos, UUIDs, direcciones IP, JSON, montos de dinero o fechas/horas — sugiere tipos apropiados.
- Marca INT utilizado para booleano (usa BOOLEAN), o FLOAT utilizado para moneda (usa DECIMAL/NUMERIC).
- Verifica el manejo de zonas horarias: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Nomenclatura y Consistencia**
- Verifica convenciones de nomenclatura consistentes (snake_case vs camelCase, nombres de tabla plurales vs singulares).
- Identifica patrones de nomenclatura de columnas inconsistentes para campos comunes (created_at vs createdAt vs create_time).

**Preocupaciones de Escalabilidad**
- Tablas sin índice en columnas de claves externas.
- Tablas sin una estrategia de partición obvia que probablemente excedarán 10M filas.
- Patrón de eliminación suave (soft-delete) faltante donde las eliminaciones permanentes romperían requisitos de auditoría.
- VARCHAR sin límite de longitud razonable en columnas que probablemente serán indexadas.

**Seguridad**
- Columnas que parecen almacenar datos sensibles (contraseña, ssn, card_number, secret) sin una convención de nombres que indique que están hasheadas/encriptadas.

Emite un informe estructurado con calificaciones de severidad (CRITICAL / WARNING / SUGGESTION) para cada hallazgo, y una solución concreta para cada uno.
