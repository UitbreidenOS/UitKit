# Métricas de Email

## Cuándo activar

- Diagnosticar secuencias de email en frío con bajo rendimiento (tasa de respuesta < 3%)
- Optimizar tasas de apertura (objetivo: 28-35%)
- Pruebas A/B de campañas de email (validación de cambios, rigor estadístico)
- Comparar tu rendimiento contra estándares verificados de 2026
- Decidir dónde invertir esfuerzo de optimización: capacidad de entrega vs. línea de asunto vs. cuerpo del mensaje

## Cuándo NO usar

- Alcance cálido (las tasas de respuesta son contextualmente más altas; aplican diferentes referencias)
- Email transaccional (secuencias de bienvenida, restablecimiento de contraseña)
- Campañas de boletín (métricas de apertura/respuesta no son comparables)
- Análisis de envío único (se requiere mínimo 100 envíos por variante para validez estadística)
- Preguntas sobre higiene de lista de email (usar herramientas específicas de lista; esto cubre optimización)

## Instrucciones

### Referencias Verificadas de 2026 (Informe de Comparativa de Instantly)

Úsalas como marco de referencia para todo análisis de campaña:

| Métrica | Línea Base | Top 10% | Basado en Señales | Señales Múltiples Apiladas |
|---------|------------|---------|-------------------|---------------------------|
| **Tasa de Respuesta** | 3.43% | 10.7%+ | 5-18% | 12-25% |
| **Tasa de Apertura** | 28-35% | 40%+ | 32-45% | 38-50% |
| **Tasa de Reunión** (de respuestas positivas) | 40-70% | 70%+ | 50-80% | 60-85% |
| **Tasa de Asistencia** | 70-85% | 85%+ | 75-90% | 80-95% |

**Insight clave:** La tasa de apertura *depende de la capacidad de entrega*. Si tu dominio está en lista negra, tu reputación como remitente es pobre, o SPF/DKIM/DMARC está roto, verás 10-15% de aperturas incluso con excelentes líneas de asunto. Este es un problema de plataforma, no de copia.

---

### Los 3 Puntos de Apalancamiento (En Orden de Impacto)

#### 1. Capacidad de Entrega (¿Pueden recibirlo?)
**Prioridad:** Verifica PRIMERO si la tasa de apertura < 20%

**Preguntas de diagnóstico:**
- ¿Está tu dominio en alguna lista negra? (Verificar: MXToolbox, SURBL, Spamhaus)
- ¿Cuál es tu puntuación de reputación de remitente? (Gmail Postmaster Tools, Microsoft SNDS)
- ¿Estás rampando el volumen de envío? (Calentar envío: 50 → 200 → 500 → 2000 emails/día)
- ¿Tienes SPF, DKIM, DMARC configurados? (Los tres son necesarios para confianza del ISP)
- ¿Estás usando IP compartida o dedicada? (IP compartida = fuga de reputación de otros usuarios)

**Acciones correctivas:**
- Solicitar inclusión en lista blanca al dominio receptor (legal/cumplimiento)
- Cambiar a IP dedicada con protocolo de calentamiento (mínimo 3 semanas de rampa)
- Implementar aplicación de DMARC (p=quarantine o p=reject)
- Agregar encabezado List-Unsubscribe (mejora colocación en bandeja de entrada)
- Reducir volumen de envío temporalmente; reconstruir reputación

**Sabrás que se arregló cuando:** La tasa de apertura sube 15-20% sin cambios de copia.

---

#### 2. Tasa de Apertura (¿La abren?)
**Prioridad:** Si la tasa de apertura es 20-30%, optimiza esto después

**Preguntas de diagnóstico:**
- ¿Tu línea de asunto genera curiosidad o urgencia sin ser clickbait?
- ¿Es el nombre del remitente reconocible? (Nombre + empresa, ¿o persona familiar?)
- ¿Envías en las horas pico de zona horaria del receptor? (9-11am y 4-5pm convierten mejor)
- ¿El texto de vista previa se corta? (Los primeros 40 caracteres del cuerpo no deberían repetir el asunto)
- ¿Estás dividiendo pruebas de líneas de asunto? (Mínimo 100 envíos por variante)

**Principios de línea de asunto:**
- Brecha de curiosidad: "Este cambio aumentó [métrica] por 40%" (crea asimetría de información)
- Especificidad: "MTTR reducido a 8 horas" supera "Mejora de rendimiento"
- Prueba social: "Usado por Figma, Stripe, Notion" desencadena reconocimiento
- Evitar: MAYÚSCULAS, múltiples ???, "Gratis", "Actúa ahora", "Tiempo limitado" (palabras que gatillan spam)

**Optimización de nombre de remitente:**
- Prueba: Solo nombre ("Sarah") vs. "Sarah Chen @ Salesloft" vs. "Sarah Chen"
- El reconocimiento importa: Si el receptor te conoce, usa solo tu nombre. ¿En frío? Usa contexto de empresa.

**Optimización de hora de envío:**
- Predeterminado: 9-11am en zona horaria del receptor (más aperturas)
- Prueba: 4-5pm para navegación post-trabajo (equipos de finanzas y operaciones muestran mayor compromiso)
- Evitar: Antes de 8am, después de 6pm, domingos (baja intención)

**Sabrás que se arregló cuando:** La tasa de apertura alcanza 30%+ consistentemente entre variantes.

---

#### 3. Tasa de Respuesta (¿Responden?)
**Prioridad:** Si la tasa de apertura > 30% pero respuesta < 3%, optimiza esto

**Preguntas de diagnóstico:**
- ¿Tu copia de email es demasiado larga? (Más de 150 palabras pierde lectores)
- ¿Es específica para su caso de uso? (Genérico supera sin valor, específico supera genérico 3:1)
- ¿Tu CTA requiere compromiso? (p.ej., "Programemos 30 min" falla; "Pregunta rápida sobre tu X" funciona)
- ¿Estás usando tokens de personalización sin investigación? ("Hola [firstName]" no es suficiente)
- ¿El email responde la pregunta implícita del lector: "¿Por qué me envías un email?"

**Estructura del cuerpo del email (probada, plantilla de alta respuesta):**

```
[APERTURA: Referencia su acción reciente o contexto reconocible]
"Noté que acabas de lanzar [producto] el [fecha]..."
"Estás usando [herramienta] para [resultado]..."

[GANCHO: Una oración — por qué esto podría importar]
"La mayoría de empresas usando [herramienta] pierden [X brecha], lo que cuesta [Y]"

[PRUEBA SOCIAL O ESPECIFICIDAD: Un ejemplo]
"Ayudamos a [empresa similar] a reducir [métrica] por X% usando [enfoque]"

[CTA: Bajo fricción, específica, acción única]
"Pregunta rápida: ¿[desafío específico] está en tu roadmap? Feliz de compartir cómo lo hemos resuelto para otros."

[CIERRE: Suave, sin presión]
"Si no, sin problema — solo responde 'pass' y te sacaré de la lista."

[Firma: Nombre + título + enlace de calendario]
"Sarah Chen
Growth Ops @ Salesloft
[Enlace de calendario]"
```

**Regla de longitud:** 80-120 palabras es el punto ideal. Cada oración debe cumplir una función.

**Principios de CTA:**
- Evitar: "Saltemos a una llamada", "Programa 30 min", "Compra ahora"
- Usar: "¿Pregunta rápida sobre [cosa específica]?", "¿Estás explorando [necesidad específica]?", "¿Vale una llamada de 3 min?"
- La tasa de respuesta sube cuando el CTA requiere 5 segundos de pensamiento, no un compromiso de calendario

**Profundidad de personalización (escala tasa de respuesta):**
1. Básica: "Hola [nombre]" — no aumenta respuesta. Omite.
2. Superficial: "Noté que estás en [empresa] en [puesto]" — +10% vs. no personalizado
3. Basada en investigación: "Tus ganancias Q1 mencionaron [objetivo específico]; ayudamos a equipos como el tuyo..." — +25-35% vs. línea base
4. Señales apiladas: Combina datos de empresa + noticias recientes + tecnografía — +40-50% vs. línea base

**Sabrás que se arregló cuando:** La tasa de respuesta alcanza 5%+ con tasas de apertura consistentes > 30%.

---

### Árbol de Decisión Diagnóstico

```
INICIO: Analiza tu última secuencia de 100 emails

├─ TASA DE APERTURA < 20%
│  ├─ SÍ → PROBLEMA DE CAPACIDAD DE ENTREGA
│  │  ├─ Verificar: Puntuación de spam (< 5), reputación de dominio, estado de lista negra
│  │  ├─ Acción: Implementar SPF/DKIM/DMARC, calentar IP, reducir volumen
│  │  ├─ Reintentar: Esperar 5-7 días, reenviar a 100 contactos en frío
│  │  └─ Métrica de éxito: La tasa de apertura salta a 25%+
│  │
│  └─ NO → PROBLEMA DE LÍNEA DE ASUNTO / HORA DE ENVÍO
│     ├─ Prueba A/B: 3 líneas de asunto (curiosidad vs. urgencia vs. especificidad)
│     ├─ Prueba: Hora de envío (9-11am vs. 4-5pm en zona horaria del receptor)
│     ├─ Requisito mínimo: 100 envíos por variante, ventana de observación de 7 días
│     └─ Métrica de éxito: La mejor variante alcanza 28%+ de tasa de apertura

├─ TASA DE APERTURA 20-30% (Capacidad de entrega aceptable; espacio para optimizar asunto)
│  ├─ Acción: Iterar líneas de asunto (reintentar ganador superior + 2 variantes nuevas)
│  ├─ Ajustar: Reconocimiento de nombre de remitente
│  ├─ Requisito mínimo: 100 envíos, 7 días
│  └─ Objetivo: Tasa de apertura 30-35%

├─ TASA DE APERTURA 30%+ PERO RESPUESTA < 3% (Problema de copia)
│  ├─ Verificación de diagnóstico:
│  │  ├─ ¿Email > 150 palabras? SÍ → Acorta, reduce ideas a UNA
│  │  ├─ ¿CTA bajo fricción? NO → Reemplaza con "Pregunta rápida..."
│  │  ├─ ¿Personalizado más allá de [nombre]? NO → Agrega 1-2 detalles de investigación
│  │  └─ ¿Responde "por qué me envías email?"? NO → Agrega apertura de contexto
│  │
│  ├─ Prueba A/B: Un cambio solo
│  │  ├─ Opción A: Acorta cuerpo (120 palabras) + CTA más apretado
│  │  ├─ Opción B: Agrega detalles específicos de personalización + menor fricción de CTA
│  │  ├─ Opción C: Apertura diferente (basada en noticias vs. basada en caso de uso)
│  │
│  ├─ Requisito mínimo: 100 envíos por variante, 7 días
│  └─ Métrica de éxito: La tasa de respuesta alcanza 4-5%

├─ RESPUESTA > 3% PERO SIN REUNIONES (Problema de descubrimiento)
│  ├─ Diagnóstico:
│  │  ├─ ¿La gente dice "interesante pero no ahora"?
│  │  │  └─ Solución: Agrega señal de urgencia o especificidad de cronograma
│  │  │
│  │  ├─ ¿La gente dice "no estamos buscando"?
│  │  │  └─ Solución: Afina el targeting (usa tecnografía + señales de intención)
│  │  │
│  │  └─ ¿La gente hace preguntas de regreso?
│  │     └─ Solución: Crea una secuencia fuerte email descubrimiento → propuesta
│  │
│  ├─ Optimización de CTA:
│  │  ├─ Evitar: "Hablemos sobre tus necesidades"
│  │  ├─ Usar: "¿Estás explorando [herramienta/enfoque específicos]? Acabamos de ayudar a [empresa similar]"
│  │  └─ Incluir: Propuesta de valor específica antes de pedir tiempo
│  │
│  └─ Métrica de éxito: 40-70% de respuestas positivas convierten a reuniones

└─ RESPUESTA > 5%, REUNIONES > 40% (Estás en top 10%)
   └─ Mantén patrón. Optimiza: Tiempo de respuesta, secuencia de seguimiento de reunión.
```

---

### Reglas de Prueba A/B (Rigor)

**Violación = datos inválidos:**

1. **Una variable solo:** Cambia línea de asunto, mantén cuerpo. O cambia cuerpo, mantén asunto. Nunca cambies segmento + copia + remitente simultáneamente.
2. **Muestra mínima:** 100 envíos por variante (mínimo). 200+ preferido para claridad.
3. **Espera 7 días:** La tasa de respuesta se estabiliza después de 5-7 días. Leer resultados el día 2 es una falsa señal.
4. **Seguimiento:** Hora de apertura, hora de respuesta, calidad de respuesta (positiva vs. objeción vs. negativa).
5. **Confianza estadística:** Si 3 respuestas de 100 aperturas (3%), la varianza es alta. En 10 respuestas (10%), la varianza es aceptable.

**Nunca ejecutes:**
- "Prueba todo en un email" (confunde todas las variables)
- "Lee resultados después de 2 días" (las respuestas tempranas sesgan la muestra)
- "Prueba con tu lista cálida" (las referencias son para alcance en frío solo)
- "Combina cambio de segmento + cambio de copia" (no puedes aislar el factor determinante)

---

### Prompt para Revisión Diagnóstica

Úsalo cuando estés atascado analizando una campaña:

```
Campaña: [nombre]
Envíos: [cantidad]
Tasa de apertura: [%]
Tasa de respuesta: [%]
Tasa de reunión: [%]

Comparación de referencias:
- Aperturas vs. línea base 28-35%: [+/- brecha]
- Respuestas vs. línea base 3.43%: [+/- brecha]

Problema probable: [capacidad de entrega / asunto / copia / targeting / descubrimiento]

Prueba recomendada:
- Cambio: [una variable solo]
- Variante A: [cambio específico]
- Variante B: [control o enfoque alterno]
- Tamaño de muestra: [100+ por variante]
- Cronograma: [observación de 7 días]
- Métrica de éxito: [objetivo de referencia]
```

---

## Ejemplo

**Escenario:** Equipo de ventas SaaS, 200 emails en frío/mes, tasa de respuesta atascada en 1.8% (por debajo de línea base 3.43%)

**Proceso de diagnóstico:**

1. **Verificar tasa de apertura:** 22% (por debajo de línea base 28-35%)
   - Capacidad de entrega: SPF/DKIM presentes, puntuación de reputación de dominio es 6/10 (débil)
   - **Acción:** Verificar calentamiento de IP. El equipo estaba enviando 500 emails/día en una IP de 2 semanas de antigüedad. Se redujo a 100/día.

2. **Reintentar después de 7 días:** La tasa de apertura mejoró a 29% (capacidad de entrega arreglada)
   - Pero respuestas aún en 2.1%
   - **Diagnóstico:** Problema de copia de cuerpo, no capacidad de entrega

3. **Auditoría de copia:**
   - Email original: 240 palabras (demasiado largo)
   - CTA: "Me encantaría programar una llamada de 20 min para discutir cómo podríamos apoyar tus objetivos"
   - Personalización: Solo token "[Nombre de empresa]"
   - **Problemas identificados:** Longitud, CTA de alta fricción, personalización débil

4. **Prueba A/B (100 envíos cada una, 7 días):**
   - **Variante A (Control):** Email original de 240 palabras
   - **Variante B (Optimizada):**
     ```
     Hola [Nombre],

     Vi que estás contratando 3 nuevos roles de datos en [Empresa]. Construir un org de datos es difícil—la mayoría de empresas con las que trabajamos gastan 4 meses consiguiendo su proceso de onboarding correcto.

     Ayudamos a [competidor] a reducir esto a 6 semanas usando [framework específico]. ¿Vale la pena charlar?

     Sarah
     Salesloft
     [Calendario]
     ```
     - 95 palabras, apertura específica, CTA bajo fricción, prueba social

5. **Resultados (día 7):**
   - Variante A: 3 respuestas de 100 (3%)
   - Variante B: 7 respuestas de 100 (7%)
   - **Decisión:** Lanzar Variante B; mejora de tasa de respuesta: +4 puntos (hasta 5.2% en todo el libro)

6. **Optimización de seguimiento:**
   - Variante B ahora el control; prueba 2 líneas de asunto nuevas para empujar tasa de apertura de 29% a 32%
   - Prueba secuencia de descubrimiento: "¿Cuál de estos 3 enfoques se ajusta a tu cronograma?"

**Resultado:** En 3 meses, la campaña pasó de 1.8% respuesta / 22% apertura a 5.2% respuesta / 31% apertura (ahora en top 25% de performers para este segmento).

**Conclusión clave:** El problema no era el mensaje, era la plataforma. Una vez que se arregló la capacidad de entrega, la optimización de copia podía funcionar realmente.
