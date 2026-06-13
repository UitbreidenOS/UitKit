---
description: Generar un plan de copia de seguridad y recuperación de base de datos adaptado a la pila del proyecto y los requisitos de RTO/RPO
argument-hint: "[tipo de base de datos, entorno de alojamiento, o requisitos RTO/RPO]"
---
Generar un plan de copia de seguridad y recuperación de base de datos para: $ARGUMENTS

Si $ARGUMENTS especifica un tipo de base de datos y/o entorno, úsalo. De lo contrario, detecta el motor de base de datos y el contexto de alojamiento desde los archivos de configuración del proyecto (docker-compose, .env, database.yml, etc.).

Produce un plan de copia de seguridad completo que cubra:

1. Estrategia de respaldo:
   - Frecuencia y calendario de respaldo completo (expresión cron).
   - Respaldo incremental o basado en WAL si el motor lo admite (archivado WAL de PostgreSQL, binlog de MySQL, envío de registro de transacciones MSSQL).
   - Compensaciones entre respaldo lógico y físico para este motor y tamaño de conjunto de datos.
   - Herramientas recomendadas: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, snapshots nativos en la nube (RDS, Cloud SQL, Azure Database).

2. Política de retención:
   - Respaldos diarios retenidos durante N días, semanales durante N semanas, mensuales durante N meses — proporciona una recomendación concreta basada en las necesidades de cumplimiento implícitas.
   - Guía de estimación de costos de almacenamiento (relación de tamaño de respaldo comprimido frente a tamaño de BD bruto).

3. Almacenamiento y seguridad:
   - Requisito de almacenamiento fuera del sitio o entre regiones.
   - Cifrado en reposo (los archivos de respaldo deben estar cifrados — proporciona la bandera/configuración de la herramienta elegida).
   - Control de acceso: las credenciales de respaldo deben ser separadas de las credenciales de la aplicación.

4. Procedimientos de recuperación:
   - Comandos de restauración paso a paso para la herramienta recomendada.
   - Instrucciones de recuperación a un punto en el tiempo (PITR) si está configurado el archivado WAL/binlog.
   - RTO estimado en función del tamaño del respaldo y del método de restauración.

5. Validación de respaldo:
   - Procedimiento semanal de prueba de restauración en un entorno de ensayo.
   - Paso de verificación de suma de comprobación o recuento de filas después de restaurar.
   - Alertas: qué monitorear (código de salida del trabajo de respaldo, antigüedad del respaldo, anomalía de tamaño del respaldo).

6. Plantilla de runbook:
   - Un runbook de incidente breve: "La base de datos se ha ido — ¿qué hago en los próximos 15 minutos?"

Proporciona comandos concretos, no consejos genéricos. Todos los comandos deben ser ejecutables tal cual o con sustitución mínima de variables.
