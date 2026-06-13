---
name: 3-statement-model
description: "Modelo financiero de tres estados: estado de resultados, balance general, estado de flujos de efectivo — construir modelos integrados, vincular estados, proyectar finanzas y pruebas de estrés de suposiciones"
---

# Habilidad Modelo de 3 Estados

## Cuándo activar
- Construcción de un modelo financiero que integre estado de resultados, balance general y flujo de efectivo
- Vinculación de estados financieros para que los cambios fluyan automáticamente
- Proyección de 3-5 años de finanzas para planificación o recaudación de fondos
- Construcción de un modelo de capital de trabajo y flujo de efectivo
- Pruebas de estrés de suposiciones financieras (escenarios alcista/bajista/base)

## Cuándo NO usar
- Valoración DCF — usar la habilidad dcf-model (que se basa en esto)
- Resumen financiero del pitch deck — usar la habilidad pitch-deck
- Contabilidad mensual o conciliación — usar la habilidad quickbooks-workflow
- Proyecciones de ingresos simples sin balance general completo — un modelo más simple es suficiente

## Instrucciones

### Arquitectura del modelo

```
Construir un modelo financiero de 3 estados para [empresa].

Tipo de empresa: [SaaS / comercio electrónico / servicios / fabricación]
Período: [proyección de 3 años / 5 años]
Datos históricos disponibles: [X años de datos reales o ninguno]
Propósito: [recaudación de fondos / informes a la junta / planificación interna / M&A]

Estructura del modelo:

PESTAÑA 1 — Suposiciones (todas las entradas aquí, nada codificado en fórmulas):
  Factores de ingresos: [tasa de crecimiento / volumen unitario / precio por unidad / número de clientes]
  Factores de costo: [% COGS, plan de personal, gasto de marketing como % de ingresos]
  Suposiciones del balance: [DSO, DPO, días de inventario, cronograma de capex]
  Tasa fiscal: [X%]

PESTAÑA 2 — Estado de Resultados (P&L):
  Ingresos
    Menos: Costo de bienes vendidos (COGS)
  = Ganancia bruta
    Menos: Gastos operativos
      Ventas y Marketing
      Investigación y Desarrollo
      General y Administrativa
  = EBITDA
    Menos: Depreciación y Amortización
  = EBIT (Ingresos operativos)
    Menos: Gastos de intereses
  = Ingresos antes de impuestos (EBT)
    Menos: Provisión fiscal
  = Ingresos netos

PESTAÑA 3 — Balance General:
  Activos:
    Corriente: Efectivo, Cuentas por cobrar, Inventario, Gastos pagados por adelantado
    No corriente: Propiedad, planta y equipo (neto de depreciación), Intangibles
  Pasivos:
    Corriente: Cuentas por pagar, Gastos acumulados, Ingresos diferidos
    No corriente: Deuda a largo plazo
  Patrimonio: Ganancias retenidas, Capital pagado
  VERIFICACIÓN: Activos = Pasivos + Patrimonio (debe equilibrar)

PESTAÑA 4 — Estado de Flujos de Efectivo:
  Actividades operativas (método indirecto):
    Ingresos netos
    + Depreciación y Amortización
    ± Cambios en el Capital de Trabajo (AR, AP, Inventario)
  = Efectivo de las operaciones
  
  Actividades de inversión:
    - Gastos de capital
    ± Adquisiciones / Disposiciones
  = Efectivo de inversiones
  
  Actividades de financiamiento:
    + Emisión / Reembolso de deuda
    + Emisión de patrimonio
    - Dividendos
  = Efectivo de financiamiento
  
  Cambio neto en efectivo = Operativo + Inversión + Financiamiento
  Efectivo final = Efectivo inicial + Cambio neto (debe coincidir con efectivo del balance)

Construir esta estructura de modelo con mis entradas específicas.
```

### Vínculos de estados

```
Explicar y configurar los vínculos críticos en el modelo de 3 estados.

Los 3 estados se integran — un cambio en uno se propaga a través de los tres.

Vínculos clave a implementar:

P&L → Balance:
  Ingresos netos → Ganancias retenidas (sección de patrimonio)
  Fórmula: Ganancias retenidas (fin) = Ganancias retenidas (inicio) + Ingresos netos - Dividendos
  
  Depreciación (gasto P&L) → Reducción de PP&E (Balance)
  Fórmula: PP&E (fin) = PP&E (inicio) + Capex - Depreciación

P&L → Estado de Flujos de Efectivo:
  El ingreso neto es el punto de partida del efectivo de las operaciones
  Depreciación agregada (gasto que no es en efectivo)
  
Balance → Estado de Flujos de Efectivo (cambios en capital de trabajo):
  Si AR aumenta → usa efectivo (CF operativo disminuye)
  Si AP aumenta → proporciona efectivo (CF operativo aumenta)
  Fórmula: ΔAR = AR(fin) - AR(inicio) → restar del CF operativo
  Fórmula: ΔAP = AP(fin) - AP(inicio) → sumar al CF operativo

Estado de Flujos de Efectivo → Balance:
  Efectivo final en Estado de Flujos de Efectivo = Efectivo en Balance
  Esta es la « verificación circular » — si no coinciden, el modelo está roto

Vínculo de capex:
  Capex en Estado de Flujos de Efectivo → aumenta PP&E en Balance
  Depreciación en P&L → disminuye PP&E en Balance

Fórmula de verificación de equilibrio:
  =SI(Activos = Pasivos + Patrimonio, « EQUILIBRADO », « VERIFICAR ERROR »)
  Agregue esto a cada columna de año — si alguna vez muestra un error, encuentre la ruptura.

Implementar estos vínculos para mi modelo en [Excel / Google Sheets].
```

### Modelo de capital de trabajo

```
Construir la sección de capital de trabajo para [empresa].

Capital de trabajo = Activos corrientes - Pasivos corrientes
Factores clave: DSO (cuentas por cobrar), DIO (inventario), DPO (cuentas por pagar)

Métricas de capital de trabajo:
DSO (Días de ventas en circulación):
  Fórmula: (Cuentas por cobrar / Ingresos) × 365
  Referencia: SaaS: 30-45 días / Servicios B2B: 45-60 días / Empresa: 60-90 días
  Modelo: AR = (DSO / 365) × Ingresos

DIO (Días de inventario en circulación) — solo fabricación/comercio electrónico:
  Fórmula: (Inventario / COGS) × 365
  Modelo: Inventario = (DIO / 365) × COGS

DPO (Días a pagar en circulación):
  Fórmula: (Cuentas por pagar / COGS) × 365
  Mayor DPO = mejor conversión de efectivo (pagar a proveedores más tarde)
  Modelo: AP = (DPO / 365) × COGS

Ciclo de conversión de efectivo = DSO + DIO - DPO
  Positivo = efectivo atado en operaciones (necesita financiamiento de capital de trabajo)
  Negativo = proveedores financian sus operaciones (estilo Amazon, CCC negativo)

Cambio en capital de trabajo (para estado de flujos de efectivo):
  ΔCapital de trabajo = CT(fin) - CT(inicio)
  Aumento en CT = salida de efectivo (usa efectivo)
  Disminución en CT = entrada de efectivo (proporciona efectivo)

Construir el cronograma de capital de trabajo con mis entradas de la industria.
```

### Análisis de escenario

```
Construir análisis de escenario para [modelo financiero].

Suposiciones base: [modelo actual]
Escenarios para modelar: [alcista / base / bajista] o [alza / baja / estrés]

Principios de diseño de escenario:
- Cambiar 1-3 suposiciones clave por escenario (no todo)
- Anclar a eventos reales: « caso bajista = recesión + 20% presión de precios »
- Cada escenario debe ser internamente consistente (no solo cortar ingresos)

Para una empresa SaaS:
Caso alcista: Crecimiento de 40% YoY, NRR de 120%, CAC se mantiene igual
  → Ingresos: $Xm (alcista) vs $Xm (base)

Caso base: Crecimiento de 25% YoY, NRR de 110%
  → Ingresos: $Xm

Caso bajista: Crecimiento de 15% YoY, NRR de 100%, CAC aumenta 20%
  → Ingresos: $Xm, punto de equilibrio de efectivo retrasado X meses

Prueba de estrés: Crecimiento del 0% durante 12 meses (choque estilo COVID)
  → ¿Cuántos meses de pista al consumo actual?
  → ¿Qué reducciones de personal se requieren para sobrevivir 18 meses?

Estructura del modelo usando alternancia de escenario INDEX/MATCH:
  Celda A1: Selector de escenario [Alcista / Base / Bajista]
  Fórmula de ingresos: =INDEX(tabla_escenario, MATCH(A1, nombres_escenario, 0), MATCH(año, fila_año, 0))
  
O use rangos nombrados en pestañas de escenario separadas y vincule a la pestaña de salida.

Construir la estructura de análisis de escenario para mi modelo.
```

## Ejemplo

**Usuario:** Estoy construyendo un modelo de 3 años para una empresa SaaS B2B. ARR del año 1: $800K, crecimiento del 80% YoY. Margen bruto: 72%. Quemadura: $200K/mes. ¿Cómo configuro el P&L?

**Estructura de P&L de Claude:**

```
                    Año 1       Año 2       Año 3
Ingresos (ARR)      $800K      $1,440K     $2,592K     [+80% cada año]
  MRR promedio      $667K      $1,200K     $2,160K     [ARR ÷ 12, simplificado]

Ingresos            $800K      $1,440K     $2,592K

COGS
  Infraestructura   $96K       $158K       $259K       [12% de ingresos]
  Éxito del cliente $128K      $202K       $311K       [16% de ingresos]
Total COGS          $224K      $360K       $570K       [28% de ingresos]

Ganancia bruta      $576K      $1,080K     $2,022K     [margen bruto 72%]

OpEx
  Ventas y Mktg     $600K      $900K       $1,200K     [declinante como % de ingresos]
  I+D               $480K      $600K       $720K       [basado en personal]
  G&A               $240K      $288K       $346K       [crecimiento 30%, más lento]
Total OpEx          $1,320K    $1,788K     $2,266K

EBITDA              ($744K)    ($708K)     ($244K)     [aproximándose al punto de equilibrio año 3]

Quemadura mensual implícita: $62K/mes (Año 1), $59K/mes (Año 2), $20K/mes (Año 3)
Agotamiento de efectivo al ritmo actual: [calcular en función del saldo de efectivo actual]

Observaciones clave:
- Alcanza el punto de equilibrio EBITDA entre el año 3 y 4 a estas tasas de crecimiento
- El gasto en Ventas y Marketing es su palanca más importante — modelar escenarios del 50% y 75% de ingresos
- Construcción de tabla de personal → impulsa I+D y G&A más precisamente que % de ingresos
```

---
