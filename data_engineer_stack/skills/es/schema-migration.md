# Migración de Esquema

## Cuándo activar

Agregar o alterar columnas, cambiar tipos de datos o gestionar cambios de esquema que generan roturas.

## Cuándo NO usar

No es para correcciones de datos puntuales; enfocarse en cambios estructurales.

## Instrucciones

1. Planificar la ventana de compatibilidad hacia atrás
2. Escribir pruebas de migración
3. Agregar feature flags para nuevas columnas
4. Documentar el procedimiento de reversión

## Ejemplo

Se agregan tres columnas nuevas (`user_segment`, `has_verified_email`, `churn_risk_score`) a una tabla de clientes con 100M registros. El plan incluye:
- Fase 1 (semana 1): Agregar columnas como opcionales (nullable) en prod
- Fase 2 (semana 2-3): Los jobs de transformación comienzan a poblar valores
- Fase 3 (semana 4): Marcar columnas como NOT NULL una vez que el 100% esté completo
- Rollback: Si se detectan errores, caer a la versión anterior durante 48h
- Tests: Validar que las vistas downstream sigan funcionando sin cambios
