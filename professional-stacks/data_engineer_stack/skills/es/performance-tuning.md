# Ajuste de Rendimiento

## Cuándo activar

Reducir CPU, memoria, I/O de disco o sobrecarga de red en trabajos de datos.

## Cuándo NO usar

No para problemas de corrección algorítmica; enfocarse en eficiencia de recursos.

## Instrucciones

1. Perfilar uso de recursos
2. Identificar cuellos de botella (cómputo, I/O, red)
3. Recomendar paralelización o procesamiento por lotes
4. Validar mejoras

## Ejemplo

Un trabajo Spark que filtra y une 10 tablas tarda 45 minutos. Se perfilan métricas y se descubre que:
- Una unión interna en `dim_user` genera 200K tareas innecesarias (sin particionamiento)
- El shuffle de datos ocupa 80% del tiempo

Se reparticiona el segundo flujo de entrada, se añaden hints de broadcast para dimensiones pequeñas, y se reduce el tiempo de ejecución a 8 minutos.
