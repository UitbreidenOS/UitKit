# Validación de Datos

## Cuándo activar

Crear verificaciones de calidad, detección de anomalías o aserciones de nulidad/cardinalidad.

## Cuándo NO usar

No para análisis exploratorio de datos; enfócate en salvaguardas operacionales.

## Instrucciones

1. Definir tipos de aserciones (esquema, cardinalidad, rango, singularidad)
2. Establecer umbrales de alerta
3. Construir reglas de validación reutilizables
4. Integrar en el pipeline

## Ejemplo

Un pipeline de ventas ingiere diariamente 100K registros de clientes. Se configura una validación que verifica:
- Columna `customer_id` no nula (cardinalidad)
- `transaction_amount` > 0 (rango)
- `email` coincide con formato regex (esquema)

Cuando el 5% de registros fallan la validación de rango, una alerta se dispara a Slack. Las filas inválidas se registran en una tabla de rechazo para análisis manual.
