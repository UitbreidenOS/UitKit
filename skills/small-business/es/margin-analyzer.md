---
name: margin-analyzer
description: "Calcula el margen bruto por línea de productos, segmento de clientes y canal; marca artículos de margen delgado; encuentra dónde realmente ganas dinero"
---

# Margin Analyzer

## When to activate
- Estás considerando un cambio de precio y quieres saber el impacto antes de comprometerte
- Estás decidiendo qué productos promover en una campaña y quieres impulsar los más rentables
- Revisión comercial trimestral y sospechas que algunos productos o tipos de clientes te están haciendo perder dinero
- Tu ingresos están creciendo pero tu ganancia no — necesitas encontrar la fuga

## When NOT to use
- Análisis completo de P&L incluyendo asignación de gastos generales — usa tu contador para eso
- Proyecciones financieras multiaño para inversores o prestamistas
- Seguimiento automático de márgenes en el tiempo — esta es un análisis puntual, no un tablero en vivo

## Instructions

### What to give Claude

Para cada producto o servicio, proporciona tres números:
1. Precio de venta (lo que cobras al cliente)
2. Costo de entrega (todo lo que se necesita para producir o cumplir esa unidad)
3. Volumen (cuánto vendes por mes)

El costo de entrega debe ser específico para ser útil. Incluye: materiales, empaque, costo de proveedor, costo de trabajo por unidad (horas × tu costo de trabajo por hora), tarifas de plataforma o mercado, tarifas de procesamiento de pagos, envío si lo absorbes. Si vendes un servicio, estima las horas por engagement × tu costo de hora combinado.

Si vendes a través de múltiples canales — tu sitio web, Amazon, una cuenta mayorista — dale a Claude el precio y costo por canal por separado. Las tarifas de plataforma y envío varían tanto que el margen del canal es a menudo muy diferente de tu margen titular.

### What Claude computes

Margen bruto por producto: (precio de venta menos costo de entrega) dividido por precio de venta, expresado como porcentaje.

Claude ordena cada producto de mayor a menor margen e indica cualquier cosa por debajo del piso que hayas establecido. Si no estableces un piso, Claude usa 20% como mínimo predeterminado — por debajo de eso, la mayoría de los negocios no cubren la contribución de gastos generales.

Claude también produce:
- Tu margen promedio ponderado por ingresos (no solo promedio simple — ponderado por cuánto realmente vendes de cada artículo)
- Qué productos generan la mayor ganancia bruta en dólares, no solo en porcentaje (un producto de 70% de margen que vendes 5 veces vale menos que un producto de 35% de margen que vendes 200 veces)
- Dónde la fijación de precios no ha seguido aumentos de costos (si le dices a Claude cuáles eran tus costos hace 12 meses versus ahora)

### Customer segment analysis

Si tienes diferentes tipos de clientes — individual vs. empresa, pequeño vs. empresa, único vs. recurrente — cuéntale a Claude los ingresos y costo de servicio por segmento. El costo de servicio incluye: tiempo dedicado a soporte, incorporación, gestión de cuenta, devoluciones o revisiones.

Los clientes pequeños a menudo cuestan más por dólar de ingresos que los grandes. Claude te mostrará dónde ocurre esto y cuantificará la diferencia.

### Channel analysis

Pega tus números por canal. Claude te muestra lo que neto después de tarifas de plataforma en cada canal:

- Ventas directas (tu sitio web): sin tarifa de mercado, pero pagas por tráfico
- Mercado (Amazon, Etsy, eBay): tarifa de 8-15% más cumplimiento
- Mayoreo: descuento de 40-50% del precio minorista, pero sin costos de servicio al cliente
- Tiendas de aplicaciones: tarifa de plataforma de 15-30%

El canal que genera más ingresos a menudo no es el canal más rentable. Claude lo hace visible.

### Pricing gap check

Cuéntale a Claude tus costos actuales y precio actual. Luego cuéntale a Claude cuáles eran esos costos hace 12 meses. Claude calcula cuánto margen perdiste por inflación de costos y qué aumento de precio lo restauraría — expresado como cantidad en dólares, no solo porcentaje, para que puedas ver si es un cambio de precio defendible.

---

### Prompt template

```
Por favor, analiza mis márgenes. Aquí están mis productos/servicios:

Producto 1: [nombre]
- Precio de venta: $[X]
- Costo de entrega: $[Y] (desglose: materiales $X, trabajo $X, tarifa de plataforma $X)
- Volumen mensual: [unidades]

Producto 2: [nombre]
- Precio de venta: $[X]
- Costo de entrega: $[Y]
- Volumen mensual: [unidades]

[repite para cada producto]

Mi piso de margen es [X]% — indica cualquier cosa por debajo.

También: Vendo a través de [canales]. Aquí están los números específicos del canal: [detalles]

Preguntas:
1. ¿Qué producto debo priorizar en mi próxima campaña de marketing?
2. ¿Qué productos son candidatos para un aumento de precio?
3. ¿Cuál es mi margen promedio ponderado por ingresos?
```

## Example

Ejecutas una tienda Shopify con tres líneas de productos. Das a Claude precios, costos (incluyendo tarifa de pago Shopify de 2,9% + $0,30 por transacción) y volumen de ventas mensual.

Claude produce:

| Producto | Precio de venta | COGS | Margen bruto | Unidades mensuales | Ganancia bruta mensual |
|---|---|---|---|---|---|
| Velas hechas a mano | $42 | $13,50 | 68% | 90 unidades | $2 565 |
| Difusores de marca blanca | $65 | $46,80 | 28% | 140 unidades | $2 548 |
| Guías numéricas de fragancia | $12 | $1,05 | 91% | 55 unidades | $598 |

Margen promedio ponderado por ingresos: 51%

Claude indica: Los difusores de marca blanca están por encima del piso de 20% pero muy por debajo de tu margen de velas hechas a mano. A 140 unidades por mes generan casi la misma ganancia bruta que tu producto de 68% de margen — pero cierren capital de inventario y requieren trabajo de cumplimiento. Si los costos del proveedor aumentan 5%, los difusores caen a 22% de margen y un aumento de costo más los deja por debajo del piso.

Recomendación: Desplaza gasto en anuncios pagados a velas hechas a mano (margen % más alto) y guías numéricas (margen % más alto, sin cumplimiento). Revisa fijación de precios de difusores — un aumento de precio de $7 lleva el margen a 37% e improbablemente reducirá volumen significativamente dada tu posición de precio actual.

---
