---
description: Generar un plan de copia de seguridad y recuperación de base de datos adaptado a la pila del proyecto y los requisitos de RTO/RPO
argument-hint: "[database type, hosting environment, or RTO/RPO requirements]"
---
Generar un plan de copia de seguridad y recuperación de base de datos para: $ARGUMENTS

Si $ARGUMENTS especifica un tipo de base de datos y/o entorno, utiliza ese. Si no, detecta el motor de base de datos y el contexto de alojamiento a partir de los archivos de configuración del proyecto (docker-compose, .env, database.yml, etc.).

Produce un plan de copia de seguridad completo que cubra:

1. Estrategia de copia de seguridad:
   - Frecuencia y programación de copias de seguridad completas (expresión cron).
   - Copia de seguridad continua incremental o basada en WAL si el motor la admite (archivado de WAL de PostgreSQL, binlog de MySQL, envío de registros de transacciones de MSSQL).
   - Compensaciones de copia de seguridad lógica frente a física para este motor y tamaño de conjunto de datos.
   - Herramientas recomendadas: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, instantáneas nativas de la nube (RDS, Cloud SQL, Azure Database).

2. Política de retención:
   - Copias de seguridad diarias retenidas durante N días, semanales durante N semanas, mensuales durante N meses — proporciona una recomendación concreta basada en las necesidades de cumplimiento implícitas.
   - Guía de estimación de costos de almacenamiento (ratio de tamaño de copia de seguridad comprimida frente a tamaño de BD sin procesar).

3. Almacenamiento y seguridad:
   - Requisito de almacenamiento fuera del sitio o entre regiones.
   - Cifrado en reposo (los archivos de copia de seguridad deben ser cifrados — proporciona la bandera/configuración para la herramienta elegida).
   - Control de acceso: las credenciales de copia de seguridad deben ser separadas de las credenciales de la aplicación.

4. Procedimientos de recuperación:
   - Comandos de restauración paso a paso para la herramienta recomendada.
   - Instrucciones de recuperación en un momento específico (PITR) si el archivado de WAL/binlog está configurado.
   - RTO estimado basado en el tamaño de la copia de seguridad y el método de restauración.

5. Validación de copia de seguridad:
   - Procedimiento semanal de prueba de restauración a un entorno de ensayo.
   - Paso de verificación de suma de verificación o recuento de filas posterior a la restauración.
   - Alertas: qué monitorear (código de salida del trabajo de copia de seguridad, antigüedad de copia de seguridad, anomalía de tamaño de copia de seguridad).

6. Plantilla de manual de consulta:
   - Un breve manual de incidentes: "La base de datos desapareció — ¿qué debo hacer en los próximos 15 minutos?"

Genera comandos concretos, no consejos genéricos. Todos los comandos deben ser ejecutables tal cual o con una sustitución mínima de variables.
