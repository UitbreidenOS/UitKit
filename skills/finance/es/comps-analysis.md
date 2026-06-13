---
name: comps-analysis
description: "Análisis de comparables: construir universo de empresas comparables, dispersión EV/EBITDA y P/E, aplicar al objetivo, valoración de referencia"
---

# Habilidad Análisis de Comparables

## Cuándo activar

- Valoración de una empresa usando multiples de mercado (trading comps)
- Benchmarking de valoración contra transacciones M&A recientes (transaction comps)
- Construcción de "campo de fútbol" rango de valoración para pitch o análisis
- Búsqueda de acciones infravaloradas o sobrevaloradas vs. pares

## Cuándo NO usar

- Cuando el universo comparable es demasiado pequeño (< 4 empresas) — DCF es más confiable
- Empresas pre-ingresos o en etapa inicial — los múltiplos no tienen sentido
- Opiniones de justicia formal — requieren profesional de valoración con licencia

## ⚠️ Importante

Todos los resultados de comps deben incluir `[VERIFY]` antes de usar. La selección y ajuste de múltiplos son cuestiones de criterio — siempre documenta explícitamente por qué incluiste o excluiste cada comp.

## Instrucciones

### Paso 1 — Construir universo de comparables

```
Construye universo de empresas comparables para [empresa objetivo].

Descripción objetivo:
- Negocio: [lo que hace la empresa]
- Ingresos: $[X]M, margen EBITDA: [X]%
- Geografía: [mercados primarios]
- Tasa crecimiento: [X]% YoY

Busca comparables usando estos criterios (empezar amplio, luego afinar):
1. Misma industria/subsector (código SIC o sector GICS)
2. Tamaño similar: ingresos dentro 0,5x a 2x del objetivo
3. Modelo comercial similar (SaaS vs. on-premise; B2B vs. B2C)
4. Perfil de crecimiento similar (alto crecimiento vs. maduro)
5. Misma geografía o dinámicas de mercado comparables

Excluir:
- Empresas en procesos M&A (múltiplos distorsionados)
- Conglomerados con mezcla comercial diferente
- Empresas con EBITDA negativo (a menos que objetivo también)

Lista 6-10 empresas comparables con justificación inclusión/exclusión.
[VERIFY] que cada inclusión es defendible ante CFO o comité de inversión.
```

### Paso 2 — Dispersar los múltiplos

```
Para cada empresa comparable, recopila:
- Valor Empresarial (VE) = Capitalización de mercado + Deuda neta
- Ingresos (LTM y NTM)
- EBITDA (LTM y NTM)
- Ingreso neto / EPS (para P/E)
- Tasa de crecimiento de ingresos

Calcula:
- VE / Ingresos (LTM y NTM)
- VE / EBITDA (LTM y NTM)
- P/E (LTM y NTM)

Luego resume:
- Media, mediana, percentil 25, percentil 75 para cada múltiplo
- Marca valores atípicos (> 2 desviaciones estándar de la media)
- Nota cuáles comps son más similares al objetivo

[VERIFY] todos los datos de mercado contra fuente en vivo (Bloomberg, FactSet, o presentaciones de empresa).
```

### Paso 3 — Aplicar al objetivo

```
Aplica múltiplos de comparables a empresa objetivo:

Métricas objetivo: Ingresos $[X]M, EBITDA $[Y]M (LTM)

Rangos de VE implicados:
- Usando mediana VE/Ingresos ([X]x): VE = $[X]M × [X]x = $[resultado]M
- Usando mediana VE/EBITDA ([X]x): VE = $[Y]M × [X]x = $[resultado]M

Valor de capital implicado:
- Resta deuda neta: VE - Deuda neta = Valor capital
- Por acción: Valor capital / Acciones en circulación

[VERIFY] valoración implicada contra DCF y benchmarks de transacciones recientes.
```

### Paso 4 — Comparables transaccionales (Precedentes M&A)

```
Para transacciones M&A recientes en mismo sector (últimos 3-5 años):

Busca deals donde:
- Objetivo estaba en [sector/industria]
- Tamaño deal: $[X]M a $[Y]M VE
- Comprador estratégico o patrocinador financiero

Para cada transacción, recopila:
- Fecha anuncio
- Comprador y objetivo
- Valor deal (VE)
- VE/Ingresos y VE/EBITDA al anuncio
- Razón deal (sinergias estratégicas, patrocinador financiero, angustia)
- Prima de control pagada sobre precio de mercado (si objetivo público)

Múltiplos transaccionales típicamente comercian en 20-40% prima sobre trading comps
(la "prima de control"). Aplica esto para obtener valoración "cambio de control".

[VERIFY] cada transacción es verdaderamente comparable (no en angustia, mezcla comercial similar).
```

### Campo de fútbol (resumen valoración)

```
Consolida todas las metodologías de valoración en rango resumido:

                  Bajo      Medio     Alto
DCF:              $18,5     $21,8     $27,4    ← caso base
Trading comps:    $17,2     $20,3     $24,8
Transaction comps: $22,0    $26,1     $31,5   ← típicamente más alto (prima control)
Rango 52 semanas: $14,2     --        $23,5   ← referencia mercado

Precio acción actual: $19,81 → se sienta cerca medio sobre todas metodologías

[VERIFY] todas entradas antes presentación a comité inversión o cliente.
```

## Ejemplo

**Usuario:** Construir trading comps para empresa B2B SaaS ($80M ARR, 110% NRR, 70% margen bruto).

**Universo comps esperado:** 6-8 empresas B2B SaaS mid-market en escala ARR similar y perfil crecimiento. Tabla múltiplos con EV/ARR (LTM + NTM), EV/Ganancia Bruta, P/E NTM donde aplique. Rango valoración implicada. Nota sobre prima que comps merecen dado 110% NRR.

---
