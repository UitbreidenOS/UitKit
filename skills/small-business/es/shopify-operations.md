---
name: shopify-operations
description: "Operaciones Shopify: descripciones de productos, alertas de reorden de inventario, pronósticos de demanda, secuencias de carrito abandonado, respuestas de estado de pedido"
---

# Habilidad Shopify Operations

## Cuándo activar
- Escribir o mejorar descripciones de productos en su tienda Shopify
- Determinar cuándo reabastecer stock según la velocidad de ventas
- Crear secuencias de correo electrónico de carrito abandonado
- Responder a preguntas de clientes sobre el estado del pedido
- Analizar qué productos funcionan bien y cuáles no

## Cuándo NO usar
- Construir o codificar su tienda Shopify (use un desarrollador o el editor de tema de Shopify)
- Configurar aplicaciones de Shopify — siga sus guías oficiales
- Procesar reembolsos o disputas — hágalo directamente en Shopify

## Instrucciones

### Escriba descripciones de productos que se conviertan

```
Escriba una descripción de producto para:
Producto: [nombre]
Lo que hace: [descripción breve]
Características clave: [lista]
Para quién: [cliente objetivo]
Punto de precio: $[X]
Tono: [profesional/divertido/premium/casual]
```

Claude escribe descripciones que:
- Comience con el beneficio, no la característica
- Incluir palabras clave naturales para SEO
- Coincida con su voz de marca
- Termina con un llamado a la acción de compra

### Descripciones de productos en masa

```
Necesito descripciones para 10 productos. Aquí están los nombres y notas breves sobre cada uno:
1. [Nombre del producto] — [2-3 puntos]
2. ...

Escríbalos todos en un estilo consistente. Tono: [describe tu marca].
```

### Planificación de reorden de inventario

```
Aquí están mis últimos 3 meses de datos de ventas de Shopify [pegue o describa]:
- Producto A: 45 unidades vendidas, inventario actual: 12
- Producto B: 8 unidades vendidas, inventario actual: 30
- Producto C: 120 unidades vendidas, inventario actual: 5

Mi tiempo de entrega del proveedor es de 3 semanas.
¿Qué productos debo reabastecer ahora? ¿Cuánto de cada uno?
```

### Pronóstico de demanda

```
Mi tienda Shopify vende [tipo de productos].
Ventas del año pasado: [pegue totales mensuales si los tiene]
Eventos/temporadas próximos: [Black Friday, Navidad, etc.]

¿Qué debo abastecer para [próxima temporada/trimestre]?
¿Cuáles son los riesgos de sobre-pedir o bajo-pedir?
```

### Secuencia de carrito abandonado

```
Estoy configurando correos electrónicos de carrito abandonado en Shopify.
Mi tienda vende [tipo de productos], valor promedio de pedido $[X].
Clientes: [describa — local, grupo de edad, etc.]

Escriba una secuencia de correo electrónico de 3 para carrito abandonado:
- Correo 1: 1 hora después del abandono
- Correo 2: 24 horas después
- Correo 3: 72 horas después (con pequeño descuento)
```

### Plantillas de respuesta de cliente

```
Escriba plantillas para estas consultas de cliente comunes para mi tienda Shopify:
1. "¿Dónde está mi pedido?" — enviado, seguimiento adjunto
2. "¿Dónde está mi pedido?" — retrasado
3. "Quiero devolver esto" — dentro de la ventana de devolución
4. "Quiero devolver esto" — fuera de la ventana de devolución
5. "Recibí el artículo incorrecto"

Mi política de devolución es [describa]. Mi tono es [amistoso/profesional].
```

### Análisis de rendimiento de ventas

```
Aquí están mis datos de Shopify del último mes [pegue]:
Más vendidos: ...
Movimientos lentos: ...
Productos nuevos: ...

¿Qué me dice esto sobre mi estrategia de inventario?
¿Qué productos debo promover, descontar o descontinuar?
```

## Ejemplo

**Usted dice:**
```
Producto: Vela de soja hecha a mano, aroma de lavanda + vainilla
Tamaño: 8oz, quema 45 horas
Hecho en: mi cocina, lotes pequeños
Precio: $24
Cliente objetivo: mujeres 25-45, enfocadas en el autocuidado
Tono: cálido, artesano, algo poético
```

**Claude escribe:**
```
Llena tu espacio con el calor suave y reconfortante de la lavanda y la vainilla —
vertida a mano en lotes pequeños con cera de soja 100% natural.

Cada vela de 8oz quema hasta 45 horas, liberando un aroma tranquilo y en capas
que se desarrolla suavemente conforme se derrite la cera. Sin químicos agresivos, sin rellenos sintéticos
— solo ingredientes limpios y una llama que te invita a ir más lentamente.

Hecho en lotes pequeños para que cada vela reciba la atención que merece.

Perfecto para: relajación nocturna, regalos o transformar cualquier espacio en un santuario.
```

---
