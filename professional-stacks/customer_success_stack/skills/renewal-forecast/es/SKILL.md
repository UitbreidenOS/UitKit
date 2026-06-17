# Habilidad: Pronóstico de Renovación

## Cuándo activar

Revisiones trimestrales o bajo demanda de la cartera de renovación; marcar cuentas dentro de la ventana de 90 días.

## Cuándo NO usar

No usar para contratos de varios años o cuentas comprometidas (usar metadatos de renovación directamente).

## Instrucciones

1. Consultar fechas de renovación por cohorte
2. Verificar referencias cruzadas con puntuación de salud
3. Predecir probabilidad de renovación basada en participación
4. Generar lista de acciones (bajo riesgo, medio, alto riesgo)

## Ejemplo

```
/renewal-forecast --cohort=2024-q3 --window=90d
→ 12 renovaciones en ventana; 8 verde, 3 amarillo, 1 rojo
```
