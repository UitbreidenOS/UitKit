---
name: dcf-model
description: "DCF valuation: gather inputs from filings, build WACC, project FCF, terminal value, sensitivity table — patterns from Anthropic financial-services"
---

> 🇪🇸 Versión en español. [Versión en inglés](../dcf-model.md).

# Habilidad de Modelo DCF

## Cuándo activar
- Construyendo una valoración por Flujo de Caja Descontado (DCF) para una empresa
- Calculando la WACC a partir del costo de capital y el costo de deuda
- Proyectando el flujo de caja libre desde la cuenta de resultados y el balance
- Ejecutando análisis de sensibilidad sobre supuestos clave
- Revisando o auditando un modelo DCF existente

## Cuándo NO usar
- Valoraciones rápidas de estimación aproximada (usar comparables EV/EBITDA en su lugar)
- Empresas micro-cap o pre-ingresos (DCF poco fiable sin flujos de caja estables)
- Presentaciones formales a prestamistas o tribunales — estas requieren un profesional de valoración con licencia

## Advertencia importante

Todos los resultados del modelo deben llevar un marcador `[VERIFY]` antes de su uso. Los resultados del DCF son muy sensibles a los supuestos — un cambio de 0,5% en la WACC puede cambiar la valoración en un 20-30%. Siempre declare sus supuestos explícitamente y haga que un analista senior los revise.

## Instrucciones

### Paso 1 — Recopilar datos de entrada

```
Antes de construir el DCF, recopile estas entradas:

CUENTA DE RESULTADOS (últimos 3-5 años + estimaciones de analistas):
- Ingresos
- Margen EBITDA
- D&A (depreciación y amortización)
- Gastos de capital (CapEx)
- Cambios en el capital de trabajo
- Tasa impositiva

BALANCE:
- Deuda total
- Efectivo y equivalentes
- Acciones en circulación

DATOS DE MERCADO:
- Precio actual de la acción
- Capitalización bursátil
- Beta (5 años mensual, vs. S&P 500)
- Tasa libre de riesgo (rendimiento del bono del Tesoro a 10 años)
- Prima de riesgo de renta variable (ERP) (usar estimación actual de Damodaran: ~5,5%)
- Costo de la deuda (tasa de interés promedio ponderada sobre la deuda existente)

Fuentes: declaraciones 10-K/10-Q, Bloomberg, FactSet o relaciones con inversores de la empresa.
```

### Paso 2 — Calcular la WACC

```
Fórmula WACC:
WACC = (E/V × Ke) + (D/V × Kd × (1 - Tasa impositiva))

Donde:
- E = valor de mercado del capital propio
- D = valor de mercado de la deuda
- V = E + D (capital total)
- Ke = costo del capital propio (CAPM: Rf + β × ERP)
- Kd = costo de la deuda antes de impuestos
- Tasa impositiva = tasa impositiva marginal

Cálculo de ejemplo:
- Rf (libre de riesgo): 4,3% (bono del Tesoro a 10 años actual)
- β (beta): 1,2
- ERP (prima de riesgo de renta variable): 5,5%
- Ke = 4,3% + (1,2 × 5,5%) = 10,9%
- Kd (antes de impuestos): 5,2%, Tasa impositiva: 25%
- Kd después de impuestos = 5,2% × (1 - 0,25) = 3,9%
- Estructura de capital: 80% capital propio, 20% deuda
- WACC = (0,80 × 10,9%) + (0,20 × 3,9%) = 9,5%

[VERIFY] la WACC antes de usarla en proyecciones.
```

### Paso 3 — Proyectar el Flujo de Caja Libre (5 años)

```
FCF = EBIT × (1 - Tasa impositiva) + D&A - CapEx - ΔCapital de trabajo

Años 1-3: Caso base (consenso de analistas o guía de la dirección)
Años 4-5: Desaceleración conservadora hacia la tasa de crecimiento a largo plazo

Ejemplo de puente FCF:
Ingresos: $1.000M → $1.080M → $1.160M → $1.230M → $1.290M
Margen EBIT: 18% → 18,5% → 19% → 19% → 19%
EBIT: $180M → $200M → $220M → $234M → $245M
Impuestos (25%): $45M → $50M → $55M → $58,5M → $61M
NOPAT: $135M → $150M → $165M → $175M → $184M
+ D&A: $40M → $42M → $44M → $45M → $46M
- CapEx: $60M → $65M → $70M → $72M → $74M
- ΔCapital de trabajo: $8M → $9M → $10M → $10M → $10M
= FCF: $107M → $118M → $129M → $138M → $146M

[VERIFY] el FCF de cada año antes de continuar.
```

### Paso 4 — Valor terminal

```
Valor Terminal (Modelo de Crecimiento de Gordon):
VT = FCF_año5 × (1 + g) / (WACC - g)

Donde g = tasa de crecimiento a largo plazo (usar crecimiento del PIB: 2-3% para empresas maduras)

Ejemplo:
VT = $146M × (1 + 2,5%) / (9,5% - 2,5%)
VT = $149,65M / 7%
VT = $2.138M

[VERIFY] el valor terminal representa un múltiplo razonable del FCF del año 5
(típicamente 15-25x para empresas maduras).
```

### Paso 5 — Descontar al valor presente

```
VP de cada año de FCF:
Año 1: $107M / (1,095)^1 = $97,7M
Año 2: $118M / (1,095)^2 = $98,4M
Año 3: $129M / (1,095)^3 = $98,1M
Año 4: $138M / (1,095)^4 = $95,6M
Año 5: $146M / (1,095)^5 = $92,2M
VP de FCFs: $482M

VP del Valor Terminal: $2.138M / (1,095)^5 = $1.352M

Valor de Empresa (EV): $482M + $1.352M = $1.834M

Valor del Capital = EV - Deuda Neta (Deuda - Efectivo)
Deuda Neta = $300M - $150M = $150M
Valor del Capital = $1.834M - $150M = $1.684M

Por acción = $1.684M / 85M acciones = $19,81

[VERIFY] múltiplo EV/EBITDA implícito (debe estar dentro del rango de empresas comparables).
```

### Paso 6 — Tabla de sensibilidad

```
Análisis de sensibilidad WACC × tasa de crecimiento terminal:

          g=1,5%  g=2,0%  g=2,5%  g=3,0%  g=3,5%
WACC=8,5% $22,4   $24,1   $26,2   $28,9   $32,6
WACC=9,0% $20,8   $22,3   $24,0   $26,2   $29,2
WACC=9,5% $19,4   $20,7   $21,8*  $23,4   $25,8  ← caso base
WACC=10,0% $18,1  $19,2   $20,4   $21,7   $23,5
WACC=10,5% $17,0  $18,0   $19,0   $20,1   $21,6

[VERIFY] precio actual de la acción vs. rango de valoración implícita.
```

## Ejemplo

**Usuario:** Construir un DCF para una empresa SaaS: $200M ARR, 75% de margen bruto, creciendo al 25% anual, flujo de caja positivo.

**Resultado esperado:**
- Entradas recopiladas: ARR, churn, expansion MRR, margen bruto, S&M como % de ingresos
- Cálculo de WACC: beta ajustada para SaaS (típicamente 1,1-1,4), ERP más alta para etapa de crecimiento
- Proyección FCF: ARR × retención neta de ingresos, verificación de la Regla de 40, trayectoria de expansión del margen FCF
- Valor terminal: crecimiento terminal más bajo (2%) debido a la maduración del mercado
- Sensibilidad: WACC 9-13% × crecimiento 1,5-3,5%
- Resultado claramente marcado con `[VERIFY]` y divulgación de supuestos clave

---
