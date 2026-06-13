---
name: cash-flow-forecast
description: "Pronóstico de flujo de caja 30-90 días para pequeños negocios: modelar ingresos y gastos, identificar déficit, duración de nómina y disparadores de alerta temprana"
---

# Habilidad Cash Flow Forecast

## Cuándo activar
- No está seguro de tener suficiente efectivo para cubrir la nómina del próximo mes
- Planificar una compra importante y necesita saber si el tiempo es correcto
- La temporada lenta se aproxima y desea planificar con anticipación
- Desea un pronóstico de flujo de caja simple 30/60/90 días
- Su contador solicitó un pronóstico de flujo de caja

## Cuándo NO usar
- Presentaciones formales a prestamistas — use su contador para esto
- Estados financieros auditados
- Pronósticos multi-año para decks de inversores — requiere modelado profesional

## Instrucciones

### Pronóstico rápido de 30 días

Simplemente describa su situación:

```
Ayúdeme a construir un pronóstico de flujo de caja de 30 días.

Saldo bancario actual: $[X]
Ingresos esperados este mes:
- [Factura/cliente]: $[monto], se espera [fecha]
- [Ingresos recurrentes]: $[monto], llega [fecha]
- Otro: $[monto]

Gastos fijos este mes:
- Alquiler: $[monto], vencimiento [fecha]
- Nómina: $[monto], vencimiento [fecha]
- Suscripciones de software: ~$[monto]

Gastos variables que espero:
- [Pago del proveedor]: $[monto]
- [Otro]: $[monto]

¿Tendré suficiente? ¿Cuál es mi punto más bajo?
```

### Verificación de duración de nómina

```
Tengo $[X] en mi cuenta comercial.
Mi nómina mensual es $[Y] (pagada el [Nth] de cada mes).
Mi ingresos mensual promedio es $[Z] pero es variable.
Mis costos mensuales fijos excluyendo nómina son $[W].

¿Cuántos meses de duración tengo?
¿A qué saldo bancario debería comenzar a preocuparme?
¿Cuál es el mínimo que debo mantener en la cuenta como colchón?
```

### Detectar brechas de flujo de caja

```
Aquí está mi pronóstico para los próximos 3 meses:

Mes 1: Ingresos esperados $[X], gastos $[Y]
Mes 2: Ingresos esperados $[X], gastos $[Y] (incluye seguro anual $Z)
Mes 3: Ingresos esperados $[X], gastos $[Y]

¿Dónde están las brechas? ¿Qué debo hacer antes de que ocurran?
```

### Planificación de escenarios

```
Mi cliente más grande ($8.000/mes) acaba de decirme que hacen una pausa de 3 meses.
Mi saldo bancario actual es $14.000.
Mis costos mensuales fijos son $6.200.

Guíame a través de:
1. ¿Cuánto tiempo puedo operar sin reemplazar ese ingreso?
2. ¿Qué gastos puedo retrasar o reducir?
3. ¿Cuáles opciones de ingresos debo buscar primero?
```

### Planificación de negocio estacional

```
Mi negocio es estacional:
- Meses pico (junio–agosto): ~$25.000/mes de ingresos
- Meses lentos (noviembre–febrero): ~$6.000/mes de ingresos
- Costos mensuales fijos: $8.000

Actualmente estoy en temporada pico con $22.000 en el banco.
¿Cuánto debo apartar cada mes pico para sobrevivir a la temporada lenta?
```

### Señales de alerta temprana

Pídale a Claude que lo ayude a configurar el monitoreo:

```
Basándome en mis finanzas, ¿cuáles son las señales de alerta temprana que debo vigilar
que indican que se aproxima un problema de flujo de caja?
¿Qué números semanales/mensuales debo verificar?
```

## Ejemplo

**Usted dice:**
```
Saldo bancario: $18.000
Próximos 30 días:
- Retención de cliente: $5.000 llega el 5
- Factura de proyecto: $3.200, cliente generalmente paga en 21 días
- Incierto: nueva cotización de $8.000 podría cerrarse

Costos fijos: Alquiler $2.800, nómina $9.500, software/herramientas $400
Variable: pago de proveedor $1.200 vencimiento 15
```

**Claude responde:**
- Efectivo confirmado: $23.000 (saldo + retención)
- Efectivo potencial: $34.200 (si la factura se paga a tiempo + nueva oferta se cierra)
- Peor caso a fin de mes: +$9.100 (si nada adicional entra)
- Bandera de riesgo: nómina cae el 15 — el mismo día que el pago del proveedor también vence. Confirme que la factura de $3.200 se compensará primero.
- Recomendación: Persiga activamente la factura de $3.200. No cuente aún con la cotización de $8.000 en la planificación.

---
