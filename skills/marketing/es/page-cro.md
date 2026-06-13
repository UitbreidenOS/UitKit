---
name: page-cro
description: "Optimización de tasa de conversión de landing page: auditoría por encima de la línea de flotación, análisis de CTA, señales de confianza, hipótesis de prueba A/B, interpretación de mapas de calor"
---

# Habilidad de CRO de Página

## Cuándo activar
- Auditar una landing page para problemas de tasa de conversión
- Generar hipótesis de prueba A/B para mejorar registros o compras
- Interpretar datos de mapa de calor / grabación de sesión
- Revisar tu página de inicio, página de precios o página de producto
- Entender por qué el tráfico es alto pero las conversiones son bajas

## Cuándo no usar
- Optimización de campaña de correo electrónico — canal diferente
- Texto de anuncio pagado — usar la habilidad campaign-brief
- Investigación de UX desde cero — CRO se basa en datos existentes

## Instrucciones

### Auditoría completa de landing page

```
Audita esta landing page en busca de problemas de conversión.

URL o descripción: [describe o pega secciones clave]
Objetivo: [registro / compra / solicitud de demostración / descarga]
Tasa de conversión actual: [X]% (si se conoce)
Fuente de tráfico: [pagado / orgánico / correo electrónico / referencia]

Evalúa:

ARRIBA DEL PLIEGUE (primera pantalla, sin desplazamiento)
- ¿Es clara la propuesta de valor en < 5 segundos?
- ¿El título aborda el problema o deseo del visitante?
- ¿Hay un CTA único y obvio?
- ¿La imagen/video del héroe respalda el mensaje o distrae?
- ¿Hay fricción (demasiados campos, creación de cuenta forzada)?

CONFIANZA Y CREDIBILIDAD
- ¿Evidencia social presente? (reseñas, testimonios, logotipos, estudios de casos)
- ¿Es la evidencia social específica y creíble (no solo "5 estrellas")?
- ¿Insignias de seguridad / garantías cerca de compra/registro?
- ¿Quién construyó esto? (sección Acerca de/equipo o historia del fundador)

PROPOSICIÓN DE VALOR
- ¿Es claro el beneficio (resultado para el usuario) vs. solo características?
- ¿Hay diferenciación clara de alternativas?
- ¿Se ve el precio o hay ansiedad sobre costos ocultos?
- ¿Hay reversión de riesgo? (prueba gratuita, garantía de devolución de dinero, sin tarjeta)

ANÁLISIS DE CTA
- ¿Cuántos CTA en la página? (1-2 es ideal para landing pages enfocadas)
- Texto de CTA: ¿específico ("Comenzar prueba gratuita") o genérico ("Enviar")?
- Ubicación de CTA: ¿visible sin desplazarse? ¿Repetido en puntos de parada naturales?
- Contraste de CTA: ¿destaca visualmente?

PUNTOS DE FRICCIÓN
- Longitud del formulario: menos campos = conversión más alta (solo preguntar lo esencial)
- Velocidad de carga: páginas lentas matan conversiones (cada segundo = ~7% caída)
- Experiencia móvil: ¿optimizada para desplazamiento con el pulgar?
- Distracciones: ¿enlaces de navegación, feeds sociales desviando a las personas?

Resultado: lista clasificada de problemas con hipótesis de prueba A/B para cada uno.
```

### Generador de hipótesis de prueba A/B

```
Generar hipótesis de prueba A/B para esta página.

Página actual: [describe encabezado, CTA, diseño]
Principales puntos de fricción identificados: [lista]
Tasa de conversión actual: [X]%

Para cada hipótesis:
- Elemento a probar: [qué cambiar]
- Control: [versión actual]
- Variante: [cambio propuesto]
- Impacto esperado: [por qué esto debe mejorar la conversión]
- Cómo medir: [métrica principal, métricas secundarias]
- Tamaño de muestra mínimo necesario: [estimado]
- Prioridad: [Alto / Medio / Bajo]
```

### Interpretación de mapa de calor

```
Interpreta estos hallazgos de mapa de calor / mapa de desplazamiento:

Datos de clic: [describe dónde hacen clic las personas]
Profundidad de desplazamiento: [X]% de visitantes alcanzan [sección], [X]% alcanzan CTA
Rage clicks: [¿elementos con clics repetidos y frustrados?]
Dead clicks: [¿elementos no clicables siendo clicados?]

Diagnosticar:
1. ¿Qué nos dicen los datos de desplazamiento sobre interés/abandono?
2. ¿Están haciendo clic donde queremos que lo hagan?
3. ¿Qué confundió o frustró a los usuarios (rage clicks)?
4. ¿Qué se ignora que no debería?
5. Top 3 cambios basados en estos datos
```

### Auditoría de página de precios

```
Audita esta página de precios:

[describe niveles, precios, características, CTA]

Cliente objetivo: [para quién es esto]
Mayor objeción en esta fase: [precio / valor / riesgo / complejidad]

Verificar:
- ¿Es claro el plan recomendado? (resaltado, insignia, "Más popular")
- ¿Se describen las características en términos de resultados, no solo casillas de verificación?
- ¿Hay prueba gratuita o punto de entrada freemium?
- ¿Se presenta claramente la fijación de precios anual vs. mensual?
- ¿Hay tabla de comparación vs. competidores o alternativas DIY?
- Sección de preguntas frecuentes: ¿aborda las objeciones reales?
- ¿Qué sucede cuando hago clic en el CTA? (¿fricción en el siguiente paso?)
```

## Ejemplo

**Usuario:** Mi página de precios SaaS tiene una tasa de conversión del 2,1%. El 82% de los visitantes se van sin hacer clic en ningún CTA.

**Auditoría CRO de Claude:**

Problemas clave por prioridad:
1. **Hero — sin recomendación clara:** 3 niveles ponderados por igual sin señal "comenzar aquí" → parálisis de decisión. Fix: Agregue insignia "Más popular" al nivel medio, atenúe el nivel Enterprise para tráfico de pymes.
2. **Los CTA dicen "Empezar":** Genérico — sin diferenciación entre niveles. Fix: Prueba "Comenzar prueba gratuita" (Starter) vs. "Programar demostración" (Pro) vs. "Contactar ventas" (Enterprise).
3. **La alternancia anual/mensual por defecto es anual:** Los visitantes ven el precio más alto primero = shock de precio. Fix: Prueba A/B con valor predeterminado de precios mensuales.
4. **Sin reversión de riesgo:** Ninguna mención de prueba arriba de la línea de flotación. Fix: Agrega línea "Prueba gratuita de 14 días, sin tarjeta de crédito" directamente debajo de los CTA.
5. **Las preguntas frecuentes no abordan la objeción del precio:** "¿Vale la pena?" no se responde. Fix: Agrega "¿Cómo se compara esto con [alternativa principal]?" y calculadora de ROI.

**Top prueba A/B para ejecutar primero:** Cambiar texto de CTA de "Empezar" a "Comenzar prueba gratuita — Sin tarjeta de crédito" → aumento estimado de 20-35% basado en datos SaaS similares.

---
