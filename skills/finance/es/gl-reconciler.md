---
name: gl-reconciler
description: "Conciliación del mayor general: procedimientos de conciliación de cuentas, revisión de asientos de diario, lista de verificación de cierre del período, análisis de variaciones y eliminaciones intercompañía — para equipos de finanzas y administradores de fondos"
---

# Habilidad Conciliador GL

## Cuándo activar
- Ejecución de procedimientos de cierre de fin de mes o fin de trimestre
- Conciliación de cuentas de balance (efectivo, cuentas por cobrar, cuentas por pagar, activos fijos, provisiones)
- Revisión de asientos de diario para precisión e integridad
- Investigación de diferencias inexplicadas entre subdiarios y el mayor general
- Construcción de una lista de verificación de cierre de período para el equipo de finanzas
- Eliminaciones intercompañía para reportes de entidades consolidadas

## Cuándo NO utilizar
- Preparación o presentación de impuestos — se requiere habilidad especializada en impuestos
- Trabajo de auditoría de campo — se aplican reglas de independencia del auditor; esta es una herramienta de gestión
- Procesamiento de transacciones en tiempo real — esta es una habilidad de conciliación y revisión
- Reemplazar a un contador calificado para restatements materiales

## Instrucciones

### Lista de verificación de cierre de fin de mes

```
Construir una lista de verificación de cierre de fin de mes para [empresa/entidad].

Tipo de entidad: [startup / PYME / fondo / subsidiaria corporativa]
Sistema contable: [QuickBooks / Xero / NetSuite / Sage / Excel]
Objetivo de tiempo de cierre: [X días hábiles después del cierre del mes]
Equipo: [contador solo / equipo pequeño / equipo de finanzas con controller]
Cuentas clave: [enumerar cuentas materiales — efectivo, cuentas por cobrar, cuentas por pagar, nómina, ingresos diferidos, etc.]

Lista de verificación de cierre de fin de mes:

DÍA 1-2 (después del cierre del mes):
□ Confirmar que todas las transacciones del mes se hayan registrado
□ Descargar y conciliar estados de cuenta bancarios (todas las cuentas)
□ Procesar estados de tarjeta de crédito y codificación
□ Confirmar que los asientos de nómina se registraron correctamente

DÍA 2-3:
□ Conciliar subdiario de cuentas por cobrar al mayor general
   - ¿Coincide el informe de antigüedad con el saldo de cuentas por cobrar?
   - ¿Se resolvió efectivo no aplicado?
□ Conciliar subdiario de cuentas por pagar al mayor general
   - ¿Coincide la antigüedad de cuentas por pagar con el saldo de cuentas por pagar?
   - ¿Se registraron cuentas por pagar acumuladas pero no facturadas?
□ ¿Rodar hacia adelante de activos fijos — adiciones, enajenaciones, depreciación registrada?

DÍA 3-4:
□ Revisar y registrar acumulaciones:
   □ Acumulación de nómina (días trabajados, aún no pagados)
   □ Amortización de gastos pagados por adelantado
   □ Reconocimiento de ingresos diferidos (SaaS: prorrateado durante período de contrato)
   □ Acumulación de intereses (si hay deuda pendiente)
   □ Cuentas por cobrar no facturadas (servicios prestados, factura aún no enviada)
□ Eliminaciones intercompañía (si está consolidado)

DÍA 4-5:
□ Revisión de balance de prueba — ¿hay saldos inusuales?
□ Análisis de flujo P&L — ¿se explican variaciones materiales versus mes anterior?
□ Concordancia del balance — ¿se han conciliado todas las cuentas?
□ Revisión y aprobación del controller
□ Estados financieros preparados y distribuidos

COMPUERTA DE APROBACIÓN:
Antes de finalizar, confirmar: [APROBACIÓN HUMANA REQUERIDA]
El controller / CFO debe aprobar antes de bloquear el período.

Generar una lista de verificación de cierre para mi tipo de entidad y sistema contable.
```

### Plantilla de conciliación de cuenta

```
Conciliar [nombre de cuenta] para [período].

Cuenta: [p. ej., Efectivo, Cuentas por Cobrar, Gastos Acumulados, Ingresos Diferidos]
Saldo GL según balance de prueba: $[X]
Saldo de subdiario o externo: $[X]
Elementos de conciliación (diferencias): [describir o desconocido]

Formato de conciliación:

CUENTA: [Nombre]
PERÍODO: [Mes/Año]
Preparador: [Nombre] | Fecha: [Fecha]
Revisor: [Nombre — REVISIÓN HUMANA REQUERIDA] | Fecha: ___

| | Monto |
|---|---|
| Saldo GL según balance de prueba | $[X] |
| Menos: Elementos en GL no en subdiario | ($[X]) |
| Más: Elementos en subdiario no en GL | $[X] |
| Saldo GL Ajustado | $[X] |
| Saldo de Subdiario / Externo | $[X] |
| **Diferencia Sin Explicar** | **$[X]** |

ELEMENTOS DE CONCILIACIÓN:
| Elemento | Descripción | Monto | Estado |
|---|---|---|---|
| [1] | [p. ej., Cheque pendiente #1234 — aún no compensado] | ($[X]) | Se espera se compense [fecha] |
| [2] | [p. ej., Depósito en tránsito — registrado [fecha], aún no compensado] | $[X] | Se espera se compense [fecha] |
| [3] | [p. ej., Comisión bancaria aún no registrada en GL] | ($[X]) | Registrar asiento |

APROBACIÓN:
□ Todos los elementos de conciliación identificados y explicados
□ Asientos de diario preparados para elementos que requieran registro
□ Sin diferencia sin explicar restante
□ APROBADO POR: ______________ FECHA: ______________

Elementos de conciliación comunes por tipo de cuenta:
- Efectivo: cheques pendientes, depósitos en tránsito, comisiones bancarias, artículos de fondos insuficientes
- Cuentas por cobrar: efectivo no aplicado, notas de crédito no aplicadas, diferencias de tiempo
- Cuentas por pagar: provisiones no facturadas, órdenes de compra sin conciliar, diferencias de tiempo
- Ingresos diferidos: nuevos contratos, ingresos reconocidos, terminaciones anticipadas
- Gastos acumulados: tiempo de nómina, servicios no facturados

Generar la plantilla de conciliación para mi cuenta específica.
```

### Revisión de asientos de diario

```
Revisar estos asientos de diario para precisión e integridad.

Período: [mes/año]
Asientos a revisar: [describir o enumerar — pueden ser descripciones de texto de asientos]
Norma contable: [GAAP / IFRS / base de efectivo]

Lista de verificación de revisión de asientos de diario:

Para cada asiento:
□ Débitos = Créditos (verificación de balance básica)
□ Los códigos de cuenta son correctos para la naturaleza de la transacción
□ La descripción es lo suficientemente clara para que un auditor entienda sin preguntar
□ Documentación de apoyo adjunta o referenciada
□ Período correcto — ¿registrado en el mes correcto?
□ Aprobado por persona autorizada (según matriz de aprobación)
□ Para asientos de reversión — ¿existe la reversión en el período siguiente?

Tipos de asientos de alto riesgo a examinar:
🔴 Asientos registrados directamente por personal financiero senior (omitiendo flujo normal)
🔴 Asientos de montos redondos sin apoyo detallado
🔴 Asientos registrados en el último día del período (riesgo de manipulación de ganancias)
🔴 Asientos entre partes relacionadas o intercompañía
🔴 Asientos que compensen un asiento anterior inusual
🔴 Ajustes grandes con descripción "per mgmt" o "per controller"

Para cada asiento señalado:
Asiento: [número de asiento / descripción]
Problema: [qué es inusual o falta]
Requerido: [apoyo adicional / aprobación / explicación]
Estado: [Aclarado / Escalar a controller / Solicitar al preparador]

Revisar mis asientos de diario y señalar los que requieren escrutinio adicional.
[REVISIÓN HUMANA REQUERIDA antes de bloquear período]
```

### Análisis de variaciones

```
Explicar la variación en [cuenta / línea de P&L] para [período].

Cuenta: [nombre]
Presupuesto / Período anterior: $[X]
Real: $[X]
Variación: $[X] ([X]% desfavorable / favorable)

Marco de análisis de variaciones:

Paso 1 — Cuantificar por factor:
Variación de precio/tasa: [mismo volumen, diferente precio o costo por unidad]
Variación de volumen: [misma tasa, cantidad diferente]
Variación de mix: [cambio en composición — p. ej., más clientes empresariales vs. PYME]
Variación de tiempo: [artículo único o cambio de período]

Paso 2 — Investigar cada factor:
- Extraer detalle de transacción para la cuenta
- Identificar las 3-5 transacciones principales que impulsan la variación
- Clasificar cada una: recurrente / única / error / tiempo

Paso 3 — Redactar explicación de variación:
Formato para reportes de junta/gestión:
„[Cuenta] fue $[X] versus presupuesto de $[X], una variación desfavorable de $[X]. Factores principales:
1. [Factor 1] — impacto de $[X] — [breve explicación]
2. [Factor 2] — impacto de $[X] — [breve explicación]
[X] de la variación se espera que [revierta/persista] en [próximo mes/trimestre]."

Señales de alerta en análisis de variaciones:
- Variación que se "compensa" entre cuentas (errores compensatorios)
- Variación consistentemente en la misma dirección durante 3+ meses (problema estructural, no tiempo)
- Variación sin explicación comercial clara (investigar para errores o fraude)

[VERIFICAR todos los números con datos fuente antes de incluir en reportes de gestión]
Analizar mi variación y redactar la explicación de gestión.
```

### Conciliación intercompañía

```
Conciliar cuentas intercompañía para [entidad consolidada].

Entidad matriz: [nombre]
Subsidiarias: [enumerar]
Sistema contable: [igual para todos / sistemas separados]
Período: [mes/año]
Transacciones intercompañía este período: [describir — préstamos, cuotas de gestión, servicios compartidos, ventas]

Proceso de conciliación intercompañía:

Paso 1 — Mapear saldos intercompañía:
Para cada par de entidades, confirmar:
Entidad A → Entidad B: $[X] (Entidad A: ¿cuenta por pagar o por cobrar?)
Entidad B → Entidad A: $[X] (debe ser el reflejo del anterior)

Paso 2 — Identificar discrepancias:
| Entidad A | Entidad B | Saldo A | Saldo B | Diferencia | Razón |
|---|---|---|---|---|---|
| Matriz | Subsidiaria 1 | $[X] | $[X] | $[X] | [tiempo / error / FX] |

Causas comunes de discrepancia:
- Tiempo: una entidad registró en el período, la otra aún no
- FX: entidades en diferentes monedas — anotar qué tasa se utilizó
- Asiento faltante: un lado de la transacción aún no registrado
- Monto disputado: las entidades no están de acuerdo en el monto de la transacción

Paso 3 — Asientos de eliminación:
Para consolidación, eliminar todos los saldos intercompañía:
Dr. Cuentas por Pagar Intercompañía $[X] (en Matriz)
Cr. Cuentas por Cobrar Intercompañía $[X] (en Subsidiaria 1)
[REVISIÓN HUMANA REQUERIDA antes de registrar asientos de eliminación]

Paso 4 — Confirmar integridad de eliminación:
Después de eliminaciones, cuentas por cobrar y por pagar intercompañía deben netearse a cero.
Residual = error o artículo no conciliado → investigar antes del cierre.

Generar la plantilla de conciliación intercompañía para mi estructura de entidades.
```

## Ejemplo

**Usuario:** Nuestro cierre de fin de mes tarda 12 días hábiles, lo que es demasiado lento. Equipo de finanzas: 1 controller, 2 contadores. Sistema contable: NetSuite. ¿Cómo llego a 5 días?

**Plan de aceleración de cierre de Claude:**

12 días → 5 días es alcanzable en NetSuite con cambios de proceso. El culpable es casi siempre las dependencias secuenciales que podrían ejecutarse en paralelo, y las tareas manuales que pueden automatizarse.

**Diagnóstico — a dónde van los días:**
- Días 1-3: esperando estados de cuenta bancarios, descargas de tarjeta de crédito, reportes de nómina (dependencias externas)
- Días 4-6: conciliación manual de cuentas por cobrar y por pagar (sin coincidencia automática)
- Días 7-9: provisiones y asientos de ajuste (cuello de botella de revisión secuencial)
- Días 10-12: revisión del controller y ciclos de revisión

**Plan de cierre de 5 días:**

*Antes del cierre del mes (últimos 2 días del mes):*
- Prealmacenamiento: provisión de nómina, asientos de depreciación, reversión de provisiones del mes anterior — todo automatizado en NetSuite a través de plantillas de asientos recurrentes
- Pre-conciliación de cuentas por cobrar: ejecutar informe de antigüedad de cuentas por cobrar diariamente, marcar artículos abiertos, no espere al día 1

*Día 1:*
- Feeds bancarios importados automáticamente en NetSuite → reglas de coincidencia automática manejan >80% de transacciones
- Transacciones de tarjeta de crédito importadas vía CSV — 1 contador dueño, 2-3 horas
- Asiento de nómina registrado desde exportación de proveedor de nómina

*Día 2:*
- Conciliación del subdiario de cuentas por cobrar (coincidencia automática en NetSuite)
- Artículos abiertos de cuentas por pagar resueltos
- Depreciación de activos fijos confirmada (NetSuite calcula automáticamente)

*Día 3:*
- Todas las provisiones registradas (usar plantillas de asientos — igual cada mes, solo actualizar montos)
- Eliminaciones intercompañía (si aplica)

*Día 4:*
- Revisión de flujo de balance de prueba — controller revisa variaciones >5% y >$5K
- Ajustes registrados

*Día 5:*
- Aprobación final del controller
- Estados financieros distribuidos

**Habilitadores clave:**
1. Feed bancario NetSuite + reglas de coincidencia automática (reduce Día 1 de 2 días a 2 horas)
2. Plantillas de asientos recurrentes para todas las provisiones estándar (sin entrada manual = sin errores que corregir)
3. Pistas paralelas: contador de cuentas por cobrar y contador de cuentas por pagar trabajan simultáneamente en Día 2
4. Cultura de "correcto a la primera": controller revisa durante el mes, no solo en el cierre

---
