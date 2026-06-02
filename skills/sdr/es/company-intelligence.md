# Inteligencia de Empresa

## Cuándo activar

- El usuario proporciona un nombre de empresa y URL de LinkedIn y pide "investigar esta cuenta", "construir un expediente", "encontrar tomadores de decisiones" o "extraer señales de dolor"
- El usuario necesita entender quién controla el presupuesto, quién influye y quién bloquea en una empresa específica
- El usuario quiere identificar ganchos de divulgación antes de prospección en frío o mapeo de cuentas
- El usuario se está preparando para una llamada de descubrimiento y necesita inteligencia previa
- El usuario tiene una lista de cuentas objetivo y necesita priorizar la profundidad de investigación por niveles

## Cuándo NO usar

- El usuario hace preguntas generales de investigación B2B no vinculadas a una cuenta específica (usar una herramienta de investigación web en su lugar)
- El usuario quiere generar copia de correo electrónico en frío (Company Intelligence alimenta la divulgación, pero no la escribe)
- El usuario está investigando una empresa para evaluarla como *proveedor* o *candidato de trabajo* (modelo de investigación diferente)
- El usuario ya ha completado su propia investigación profunda y solo quiere validación (usar revisión de código o verificación en su lugar)
- El usuario quiere datos de precios en tiempo real o métricas financieras (esta habilidad se enfoca en toma de decisiones y señales de dolor, no finanzas)

## Instrucciones

### El Modelo de Inteligencia de Cuenta de 5 Capas

Cada expediente de empresa se construye apilando estas capas. Los niveles más altos requieren las cinco; los niveles más bajos requieren tres.

#### Capa 1: Estructura Organizacional (Mapa de Tomadores de Decisiones)

**Objetivo:** Identificar tres tipos de rol en la empresa:
- **Comprador Económico** — controla el presupuesto, tiene responsabilidad P&L, veto final. (CFO, VP Finance, CRO, VPE, VP Ops)
- **Campeón** — usa tu solución diariamente, tiene incentivo personal para comprar. (Líder de equipo, IC, gerente de la función que resuelves)
- **Influyente** — forma la percepción y puede bloquear o acelerar. (CTO, Chief Product Officer, líder de pares, función de auditoría)

**Fuentes a verificar:**
- Página de LinkedIn de la empresa: Sección de liderazgo ejecutivo, contrataciones recientes en roles C-suite/VP
- LinkedIn: Busca "[Empresa] [Título]" para cada rol, verifica actividad reciente (dentro de 30 días es activo)
- G2/Capterra: Los autores de reseñas a menudo listan su título y antigüedad
- Ofertas de trabajo: Nuevas contrataciones/roles revelan en qué función se está expandiendo (señala prioridad)

**Lógica de decisión:**
- Si empresa <100 empleados: El comprador económico es a menudo fundador/CEO; El campeón es el líder de equipo directamente impactado
- Si empresa 100–1000: El comprador económico es VP/CFO de la función; El campeón es gerente o IC principal; El influyente es CTO o Chief de esa función
- Si empresa >1000: Agrega una capa más — encuentra patrocinador (director que puede presentarte al Comprador Económico)

#### Capa 2: Eventos Recientes (Señales de Impulso)

**Objetivo:** Encontrar los últimos 90 días de actividad de la empresa que crean urgencia o contexto.

**Fuentes a verificar (en orden):**
1. LinkedIn de la empresa: Publicaciones, contrataciones anunciadas, hitos (financiamiento, IPO, adquisición, apertura de oficina)
2. Actividad en LinkedIn de CEO/VP: Retweets, comparticiones, comentarios en artículos — revela qué les preocupa
3. Comunicados de prensa: Crunchbase, sitio web de la empresa, Medium, feeds de noticias
4. Anuncios de financiamiento: Crunchbase, TechCrunch, VentureBeat (revela capital, objetivos de crecimiento, nuevos problemas a resolver)
5. Lanzamientos de productos: G2 nuevas características, anuncios de características en newsletter o blog de la empresa
6. Cambios de liderazgo: CEO, CRO, CTO, VP de la función en que vendes (revela prioridades, apetito por cambio)

**Puntuación:**
- Financiamiento reciente (dentro de últimos 90 días) = máxima urgencia (dinero para gastar, presión para desplegarlo)
- Lanzamiento de producto o expansión de mercado = urgencia media (construyendo nuevo flujo de ingresos, puede necesitar herramientas)
- Cambio de liderazgo en tu función = urgencia media (nuevo líder quiere tener impacto)
- Noticias/prensa = baja urgencia (contexto, no un disparador)

#### Capa 3: Tech Stack y Brechas (Evaluación de Capacidad)

**Objetivo:** Identificar qué usan, qué no usan y qué está roto.

**Fuentes a verificar (en orden):**
1. BuiltWith: Revela tech de marketing, analytics, CRM, infraestructura, herramientas de seguridad
2. Ofertas de trabajo de LinkedIn: "Buscamos experto en [herramienta]" o "requerido: experiencia con [herramienta]" = stack actual; "nice to have: [herramienta]" = aspiracional/brecha
3. Reseñas G2: Filtra por tamaño de empresa e industria, lee comentarios de revisores para dolor (lentitud, brechas de integración, costo)
4. Crunchbase: Integraciones tecnológicas de la empresa si figuran
5. Blog/podcast de la empresa: Posts de tech, estudios de caso, decisiones arquitectónicas revelan elecciones de infraestructura
6. Presentaciones SEC (si pública): Los desgloses de gastos de software a veces se revelan

**Lógica de decisión:**
- Si usan [Herramienta A] + [Herramienta B] pero *no* [Herramienta C] = probable brecha o decisión consciente
- Si múltiples reseñas dicen "[Herramienta] es lenta de integrar" = proxy de dolor
- Si oferta de trabajo dice "debe conocer [Herramienta]" pero no ves uso en otro lugar = nueva iniciativa que están construyendo
- Si usan [Herramienta Competidora] = objeción de referencia a preparar

#### Capa 4: Proxies de Dolor (Minería de Ofertas de Trabajo + Reseñas)

**Objetivo:** Extraer problemas implícitos de ofertas de trabajo y reseñas de usuarios.

**Metodología:**

Coincidencia de Patrones en Ofertas de Trabajo:
- "Buscamos [rol] para poseer/construir/mejorar [función]" → Están invirtiendo en esa área
- "5+ años de experiencia con [habilidad dura específica]" → Es un cuello de botella hoy
- "Debe tener experiencia con escala/crecimiento/automatización" → Están golpeando fricción
- "Buscamos a alguien para agilizar [X]" → El proceso actual es lento o manual
- "Ayúdanos a migrar de [Sistema Antiguo] a [Sistema Nuevo]" → Deuda heredada, evaluación de vendedor en marcha
- "Construir dashboards/reporting para [departamento]" → Sin visibilidad hoy

Coincidencia de Patrones en Reseñas G2 (filtra por tamaño de empresa/industria):
- "Lento de implementar" → Duración del ciclo de ventas + fricción de despliegue
- "Falta [característica]" → Brecha de característica que podrías llenar
- "Caro" → Objeción de costo, sensibilidad presupuestaria
- "Pobre integración con [herramienta]" → Pesadilla de integración = gancho de ventas
- "Me encanta pero no puedo escalar más allá de X" → Dolor de crecimiento, oportunidad de adquisición

**Puntuación:** Cuenta señales de dolor. 3+ señales distintas en reseñas + ofertas de trabajo = calificación fuerte.

#### Capa 5: Huella Social (Compromiso y Liderazgo de Pensamiento)

**Objetivo:** Entender qué tan visible y activos son los tomadores de decisiones; qué les importa.

**Fuentes a verificar:**
1. Actividad en LinkedIn de CEO/VP: Publicaciones (no solo comparticiones), compromiso, lecturas de artículos, comentarios sobre tendencias de la industria
2. LinkedIn de la empresa: Tasa de compromiso orgánico (comentarios, comparticiones, reacciones); temas de la industria que defienden
3. Twitter/X del CEO: Si está activo, revela prioridades en tiempo real, filosofía, toma de decisiones
4. Newsletter de la empresa: Si publican una, muestra en qué están invirtiendo
5. Apariciones en podcast/webinar: Los compromisos de habla revelan posicionamiento y audiencia

**Puntuación:**
- Activo (publica 2–4x por semana, se compromete con comentarios) = líder visible, receptivo a entrada, puede leer divulgación en frío
- Inactivo (<1 publicación por mes, sin compromiso) = menos probable ver divulgación en frío, puede necesitar introducción cálida
- Liderazgo de pensamiento (hablar, escribir, citado como experto) = líder creíble, más fácil gancho basado en halago

---

### Profundidad de Investigación por Nivel

Todos los niveles usan el modelo de 5 capas, pero la intensidad de investigación y detalle de salida difieren.

#### Nivel 1 — Expediente Completo (20 minutos)
**Cuándo usar:** Cuenta de alto valor (trato nombrado, empresa ACV >$100k, objetivo C-list, asociación estratégica)
**Profundidad de investigación:**
- Capa 1: Encuentra 3 tomadores de decisiones por nombre, título, actividad actual en LinkedIn, fecha última publicación
- Capa 2: Extrae 3–5 eventos recientes con fechas, enlace a cada uno (financiamiento, contrataciones, lanzamientos, cambios de liderazgo)
- Capa 3: Lista 10+ herramientas en su stack, identifica 2–3 brechas, cita fuente para cada herramienta
- Capa 4: Mina 5+ ofertas de trabajo + 8–10 reseñas G2, extrae 5+ señales de dolor con ejemplos
- Capa 5: Perfil CEO + 2 VPs — frecuencia de actividad, fecha última publicación, estilo de compromiso

**Salida:** Expediente de Cuenta Completo (plantilla abajo)
**Estimación de tiempo:** 18–22 minutos (4–5 min por capa + 2 min síntesis)

#### Nivel 2 — Resumen Medio (10 minutos)
**Cuándo usar:** Cuenta de mercado medio (ACV $20k–$100k), lista de cuentas, prospección temprana
**Profundidad de investigación:**
- Capa 1: Encuentra 2 tomadores de decisiones (comprador económico + campeón), solo nombres + títulos
- Capa 2: Extrae 2–3 eventos recientes (solo más reciente)
- Capa 3: Lista 5–7 herramientas clave, 1–2 brechas
- Capa 4: Mina 3–4 ofertas de trabajo + 4–5 reseñas, extrae 3–4 señales de dolor con ejemplos ligeros
- Capa 5: Solo nivel de actividad del CEO (activo/inactivo/líder de pensamiento)

**Salida:** Expediente abreviado (1 página)
**Estimación de tiempo:** 8–11 minutos

#### Nivel 3 — Perfil Mínimo (3 minutos)
**Cuándo usar:** Investigación de lista de alto volumen, calificación rápida, venta social
**Profundidad de investigación:**
- Capa 1: Encuentra solo nombre del CEO + título
- Capa 2: Una señal reciente (financiamiento, noticias, o contratación reciente)
- Capa 3: Una herramienta notable o brecha
- Capa 4: Una señal de dolor (de oferta o reseña)
- Capa 5: Omitida

**Salida:** Snapshot de empresa de un párrafo
**Estimación de tiempo:** 2–4 minutos

---

### Plantilla de Salida de Expediente de Cuenta

Usa este formato exacto para investigación de Nivel 1. Adapta para Nivel 2/3 omitiendo secciones marcadas [Solo T1].

```
## [NOMBRE DE EMPRESA] — Expediente de Inteligencia de Cuenta

### Descripción General de la Empresa (2 oraciones)
[1 oración en qué hacen + mercado]
[1 oración sobre impulso reciente o contexto que importa para tu pitch]

### Mapa de Tomador de Decisiones
[Formato: Nombre (Título, Última Actividad en LinkedIn) — Rol e Influencia]

**Comprador Económico:** [Nombre], [Título]
- Propietario P&L: [función específica: Ventas, Ingeniería, Finanzas, Ops]
- Última actividad en LinkedIn: [fecha]
- Señal: [contexto breve, ej. "Publicó sobre contratar para expansión del equipo" o "Sin actividad en 60 días"]

**Campeón:** [Nombre], [Título]
- Usa tu categoría de solución diariamente
- Última actividad en LinkedIn: [fecha]
- Señal: [evidencia de oferta de trabajo o reseña donde este rol describió el dolor]

**Influyente:** [Nombre], [Título]
- Puede bloquear/acelerar: [por qué: CTO, Chief Product Officer, líder de pares en su función]
- Última actividad en LinkedIn: [fecha]
- Señal: [actividad reciente que prueba relevancia: publicación sobre elecciones tech, contratación, M&A]

[Solo T1] **Patrocinador (opcional):** [Nombre], [Título]
- Puente al comprador económico (si empresa >1000 empleados)

### Capa 2: Eventos Recientes (Señales de Impulso)
[3–5 eventos, más recientes primero, con fechas y enlaces]

- **[Fecha, Tipo de Evento]:** [Qué sucedió] → Implicación para tu pitch
  - Fuente: [Enlace]

### Capa 3: Tech Stack y Brechas
[Lista herramientas actuales; identifica brechas y aspiraciones]

**Stack Actual (verificado):**
- [Categoría]: [Herramienta 1], [Herramienta 2]
- [Categoría]: [Herramienta]

**Brechas Identificadas:**
- [Brecha 1]: Usando [Herramienta Antigua], ofertas de trabajo muestran interés en [Nueva Categoría] → Oportunidad de migración
- [Brecha 2]: [Problema], no resuelto por stack actual → Dolor directo

**Fricción de Integración:**
- [Herramienta A] + [Herramienta B] notado como "difícil de sincronizar" en 3 reseñas → Punto de venta de integración

### Capa 4: Señales de Dolor (Top 3)
[Ordena por solidez de evidencia: ofertas de trabajo > múltiples reseñas > reseña única > inferencia]

**Señal #1: [Enunciado de problema]**
- Evidencia: [2–3 ofertas de trabajo o citas de reseña]
- Frecuencia: Mencionado en [X] ofertas / [X] reseñas
- Urgencia: [Alta/Media/Baja — inferida de recencia y nivel de oferta de trabajo]
- Tu gancho: [Cómo tu producto resuelve esto en una oración]

**Señal #2: [Enunciado de problema]**
- Evidencia: [2–3 ofertas de trabajo o citas de reseña]
- Frecuencia: Mencionado en [X] ofertas / [X] reseñas
- Urgencia: [Alta/Media/Baja]
- Tu gancho: [Una oración]

**Señal #3: [Enunciado de problema]**
- Evidencia: [Oferta de trabajo o cita de reseña]
- Frecuencia: Mencionado en [X] ofertas / [X] reseñas
- Urgencia: [Alta/Media/Baja]
- Tu gancho: [Una oración]

### Gancho Mejor de Personalización
[Un ángulo específico y creíble para liderar. Formato: "Usa [Señal/Evento/Persona] como el gancho. Ejemplo de apertura: '...'" ]

Formatos de ejemplo:
- Gancho de noticias: "La publicación de [Nombre del CEO] sobre [tema] en [fecha] sugiere que están priorizando X. Ayudamos a empresas como [empresa similar] a resolver eso mediante..."
- Gancho de dolor: "Noté que 5 de tus ofertas de trabajo recientes mencionan [habilidad]. Eso normalmente significa..."
- Gancho de tech: "Estás usando [Herramienta A] pero ofertas de trabajo muestran que estás contratando para [nueva área]. Nos especializamos en..."
- Gancho de liderazgo: "[Nombre de Nueva Contratación] acaba de unirse como [rol]. Basado en su antecedente en [área], probablemente dueño de..."

### Canal Recomendado Primero
[Elige uno; explica por qué]

- **LinkedIn InMail al [Comprador Económico]?** — Si está activo, <5 contactos en rol, señal de confianza alta
- **Mensaje en LinkedIn al [Campeón]?** — Si es visible, menos amenazante que directo al comprador, más fácil de calentar
- **Email (introducción cálida)?** — Si tienes conexión mutua (verifica LinkedIn "Gente que conoces")
- **Email (frío)?** — Si el dolor es agudo, empresa está contratando (visible en LinkedIn)
- **Divulgación en LinkedIn al [Influyente]?** — Si están altamente activos y líder de pensamiento (más fácil obtener reunión)

**Por qué:** [Justifica basado en nivel de actividad, tamaño de org, urgencia de dolor]

### Marco Recomendado
[Elige uno; explica por qué]

- **Marco "By the way"** — Mejor si: El dolor es obvio, el campeón es receptivo, el objetivo es introducción cálida
- **Calificación MEDDIC / BANT** — Mejor si: Trato empresarial, proceso de compra complejo, múltiples tomadores de decisiones
- **Gancho ROI/eficiencia** — Mejor si: El comprador de finanzas es objetivo, el dolor es costo o trabajo manual, tienes benchmarks
- **Disparado por evento** — Mejor si: Financiamiento o contratación reciente sugiere receptividad; usa noticias como prueba de apetito por cambio
- **Prueba social de pares** — Mejor si: [Competidor o empresa similar] es cliente; suelta nombre contextualmente

**Por qué:** [Explica el ajuste]

### Puntuación de Calidad de Datos y Confianza
[Solo T1]

- **Actualidad de datos:** Última actualización de investigación [fecha]
- **Confianza en precisión de tomador de decisiones:** [Alta/Media/Baja — basada en confirmación de 2+ fuentes]
- **Solidez de señal de dolor:** [Alta/Media/Baja — basada en frecuencia de menciones + recencia]
- **Siguiente paso recomendado:** [Divulgación directa / Introducción cálida necesaria / Muy ruidoso, investigar más / Listo para pitch]
```

---

### Plantilla de Prompt

**Prompt a usar cuando comienzas investigación:**

```
Actúa como especialista en inteligencia de cuenta B2B. Estoy investigando [NOMBRE DE EMPRESA] para prepararme para la divulgación.

Profundidad: [Nivel 1 / Nivel 2 / Nivel 3]

Información de Empresa:
- Empresa: [NOMBRE DE EMPRESA]
- URL de LinkedIn: [URL_LINKEDIN]
- Industria: [Si se conoce — opcional]
- Tamaño de Empresa: [Si se conoce — opcional]
- Tu producto: [Descripción breve de 1 oración de qué vendes]

Para Nivel 1: Usa todas las 5 capas (estructura organizacional, eventos recientes, tech stack, señales de dolor, huella social). Encuentra 3 tomadores de decisiones nombrados con actividad actual en LinkedIn. Extrae 3–5 señales de dolor de ofertas de trabajo y reseñas G2. Proporciona un Expediente de Cuenta Completo usando la plantilla.

Para Nivel 2: Enfócate en capas 1–4. Encuentra 2 tomadores de decisiones clave. Extrae 3–4 señales de dolor. Proporciona un expediente abreviado de 1 página.

Para Nivel 3: Solo snapshot rápido. Nombre de CEO, una señal reciente, una señal de dolor, una herramienta/brecha.

Lista de verificación de investigación:
- [ ] Página de LinkedIn de la empresa revisada (liderazgo, actividad reciente, cantidad de empleados)
- [ ] Actividad en LinkedIn de CEO/VP verificada (últimos 30 días)
- [ ] 3+ ofertas de trabajo analizadas (si disponibles)
- [ ] Reseñas G2/Capterra minadas (filtro de industria/tamaño aplicado)
- [ ] Tech stack de BuiltWith verificado
- [ ] Prensa/noticias recientes verificadas (financiamiento, contrataciones, lanzamientos de productos)

Formato de salida: Usa la plantilla de Expediente de Cuenta proporcionada. Sé específico — cita fuentes, fechas y nombres. Sin afirmaciones vagas.
```

---

### Árboles de Decisión y Lógica

#### ¿Debo investigar esta cuenta?

```
¿Tienes un nombre de empresa + URL de LinkedIn?
├─ Sí
│  ├─ ¿Es una cuenta de Nivel 1 (alto valor, estratégica, trato nombrado)?
│  │  └─ Sí → Invierte 20 min en expediente completo (Nivel 1)
│  └─ ¿Es Nivel 2 (mercado medio, lista de cuentas)?
│     └─ Sí → 10 min de resumen medio (Nivel 2)
│  └─ ¿Es prospección de volumen o calificación rápida?
│     └─ Sí → 3 min de snapshot (Nivel 3)
└─ No → Pide nombre de empresa + URL de LinkedIn antes de comenzar
```

#### ¿Cómo encuentro a los tomadores de decisiones?

```
Comienza con página de LinkedIn de la empresa:
├─ ¿Lista C-suite/VP?
│  ├─ Sí → Nota nombres, verifica sus perfiles individuales de LinkedIn para actividad reciente
│  └─ No → La empresa puede ser <50 empleados; asume CEO es comprador económico
├─ Verifica pestaña "Gente" en página de empresa
│  └─ Filtra por título (VP Finanzas, VP Ventas, CTO, Chief Product Officer)
├─ Verifica de manera cruzada en ofertas de trabajo
│  └─ "Reporte a [Nombre]" en oferta de trabajo = confirma rol + nombre
└─ Busca en Google + LinkedIn "[Empresa] [Rol]"
   └─ Usa fecha de última actividad para calibrar compromiso
```

#### ¿Cómo extraigo señales de dolor?

```
Ofertas de Trabajo (mayor fidelidad):
├─ Lee 3–5 ofertas para tu función
├─ Extrae patrones: "buscamos X para arreglar Y"
├─ Nota urgencia (contratar nivel gerente/director = alta prioridad)
├─ Nota contexto (contratar para nueva función = expansión; requisitos = problemas)

Reseñas G2 (validación):
├─ Filtra por tamaño de empresa + industria
├─ Lee 4–6 reseñas, busca palabras clave: "lento", "integración", "falta", "necesidad", "caro"
├─ Cuenta frecuencia (3+ reseñas mencionan mismo dolor = señal fuerte)
└─ Prioriza reseñas recientes (< 6 meses de antigüedad)

Ofertas de Trabajo en LinkedIn:
├─ Busca "[Nombre de Empresa] contratando"
├─ Ordena por más reciente
├─ Extrae 3–5 roles abiertos + sus descripciones
└─ Nota: Stack de títulos revela prioridades org (ej. 5 roles de ventas abiertos = modo crecimiento)
```

#### ¿Cómo elijo el nivel de investigación?

```
Criterios de Nivel 1 (Expediente Completo — 20 min):
├─ ACV o tamaño de trato >$100k
├─ Trato nombrado o cuenta estratégica
├─ Objetivo C-suite o proceso de compra empresarial
└─ Puedes invertir tiempo para investigación de alta precisión

Criterios de Nivel 2 (Resumen Medio — 10 min):
├─ ACV $20k–$100k
├─ Cuenta en lista de 10–50 objetivos
├─ Desarrollo de ventas (SDR) generación de leads
└─ Necesitas señal antes del primer punto de contacto

Criterios de Nivel 3 (Perfil Mínimo — 3 min):
├─ ACV <$20k o prospección de volumen
├─ Lista de cuentas de 100+
├─ Venta social o calificación rápida
└─ Decisión rápida: ajuste o saltar
```

---

### Benchmarks de Investigación y Asignación de Tiempo

**Desglose de Nivel 1 (20 min):**
- Capa 1 (Estructura Organizacional): 5 min
- Capa 2 (Eventos Recientes): 3 min
- Capa 3 (Tech Stack): 4 min
- Capa 4 (Señales de Dolor): 6 min
- Capa 5 (Social): 1 min
- Síntesis + escritura de expediente: 1 min

**Desglose de Nivel 2 (10 min):**
- Capas 1–4: 9 min (omitiendo profundidad en Capa 5)
- Escritura de expediente: 1 min

**Desglose de Nivel 3 (3 min):**
- Escaneo rápido de página de empresa: 1 min
- Una señal de dolor: 1 min
- Escritura de párrafo: 1 min

**Consejos de reducción de esfuerzo:**
- BuiltWith antes de LinkedIn (10 seg para revelar 80% del stack)
- Búsqueda de reseña G2: filtra por tamaño de empresa primero (ahorra 3 min de reseñas irrelevantes)
- Ofertas de trabajo: lee solo las primeras 5 (rendimientos decrecientes después de 5)
- LinkedIn: solo verifica últimos 30 días de actividad (posts más antiguos irrelevantes para prioridades actuales)

---

### Antipatrones a Evitar

1. **Investigar sin hipótesis** — No comiences Capa 4 (dolor) sin Capa 3 (tech stack); perderás señales.
2. **Sobre-investigar Nivel 3** — Si solo haces 3 minutos, no gastes 5 leyendo reseñas. Elige una señal y avanza.
3. **Confundir actividad de fundador/CEO con actividad de empresa** — Un CEO quieto en LinkedIn ≠ empresa inactiva. Verifica página de empresa + prensa independientemente.
4. **Tomar reseñas G2 al pie de la letra** — Siempre verifica: (a) título de revisor (IC vs. tomador de decisiones), (b) fecha de reseña (60+ días = menos relevante), (c) coincidencia de tamaño de empresa.
5. **Perder el "por qué" en tech stack** — No solo listes herramientas. Pregunta: ¿Por qué esta herramienta? ¿Qué problema resuelve? ¿Es una brecha o una fortaleza?
6. **Priorizar novedad sobre relevancia** — Una ronda de financiamiento de 3 meses de antigüedad no es un gancho si su señal de dolor tiene 2 años y sin resolver (sugiere diferentes prioridades).
7. **Afirmaciones de una sola fuente** — Oferta de trabajo dice "crecimiento" ≠ automáticamente señal de alta urgencia. Verifica de manera cruzada con noticias recientes o consenso de reseña.

---

## Ejemplo

### Escenario: Investigación de Nivel 1 en [EMPRESA DE EJEMPLO REAL]

**Encargo:** Eres un ejecutivo de cuenta para una plataforma de pipeline de datos (como Fivetran, Airbyte, o dbt Cloud). Tu empresa se especializa en automatizar ingesta y transformación de datos. Identificaste una empresa de e-commerce de mercado medio, [TechRetail Inc.], como objetivo. Necesitas un Expediente de Cuenta Completo antes de tu primera llamada con su VP de Datos.

**Empresa:** TechRetail Inc. (ejemplo ficticio)
**LinkedIn:** linkedin.com/company/techretail-inc
**Tu producto:** Orquestación de pipeline de datos automatizado + monitoreo de calidad de datos
**Nivel:** Nivel 1 (trato nombrado, ACV empresarial)

---

### Proceso de Investigación (siguiendo 5 capas)

#### Capa 1: Estructura Organizacional

**Revisión de página de LinkedIn de la empresa:**
- Cantidad de empleados: ~450 (de sección "Acerca de")
- Liderazgo: CEO [Sarah Chen], CTO [Marcus Williams], VP Finanzas [David Park], VP Ventas [Jessica Liu]

**Resultados de búsqueda:** "[TechRetail VP Datos]" → Encontrado [Alex Rodriguez], VP de Datos y Analytics, URL de LinkedIn [enlace], última publicación 1 junio 2026 (activo, 3-4 publicaciones por semana)

**Resultados de búsqueda:** "[TechRetail Director Ingeniería]" → Encontrado [Jamie Kim], Director de Ingeniería de Datos, URL de LinkedIn [enlace], última publicación 28 mayo 2026 (activo, responde a comentarios)

**Verificación cruzada en pestaña "Gente" de LinkedIn:**
- [Alex Rodriguez]: VP de Datos y Analytics — reporte directo a VP Ventas (Jessica Liu) según perfil
- [Jamie Kim]: Director de Ingeniería de Datos — reporte directo a CTO (Marcus Williams)
- [Sarah Chen]: CEO — ocasionalmente publica sobre cultura de empresa + crecimiento

**Mapa de tomador de decisiones:**
- **Comprador Económico:** [David Park], VP Finanzas (dueño presupuesto infraestructura de datos, P&L para gasto técnico)
- **Campeón:** [Alex Rodriguez], VP de Datos (usuario diario de herramientas de pipeline, tiene KPIs vinculados a calidad de datos + velocidad)
- **Influyente:** [Marcus Williams], CTO (puede bloquear si arquitectura no se ajusta a prácticas de ingeniería; puede acelerar si lo respalda)

---

#### Capa 2: Eventos Recientes

**Página de LinkedIn de la empresa:**
- 15 mayo 2026: Anuncio publicado: "Hemos recaudado $25M en financiamiento de Serie B para impulsar nuestra expansión a mercados de la UE y fortalecer nuestra infraestructura de datos." [Enlace]
- 22 mayo 2026: "¡Emocionado de anunciar [Jamie Kim] como nuestro nuevo Director de Ingeniería de Datos! Jamie aporta 10 años construyendo plataformas de datos en [Empresa Anterior]."
- 8 mayo 2026: Publicó estudio de caso: "Cómo reducimos tiempo de procesamiento de datos en 40% a través de [iniciativa interna]."

**LinkedIn del CEO (Sarah Chen):**
- 1 junio 2026: Recompartió artículo de TechCrunch sobre "El Futuro de Plataformas de Datos de Cliente" con comentario: "Esto resuena—nuestro roadmap es fuertemente enfocado en datos."
- 25 mayo 2026: Publicó sobre asistir a conferencia de ingeniería de datos, mencionó "impresionado por nuevas herramientas en el espacio de orquestación."

**Prensa/Noticias:**
- Crunchbase: Financiamiento de Serie B, $25M, liderado por [Nombre de VC], 15 mayo 2026
- VentureBeat: "TechRetail Lands $25M para Expandir Personalización Impulsada por Datos" (artículo confirma enfoque en datos de cliente + personalización)

**Traducción:** La empresa tiene capital, está invirtiendo en equipo de datos (nueva contratación de director sugiere urgencia), CEO está activamente buscando nuevas herramientas de datos, y VP Finanzas (propietario presupuesto) está activamente publicando sobre temas de finanzas/ops (señal receptiva).

**Puntuación de recencia:**
- Financiamiento de Serie B (mayo) = máxima urgencia (capital a desplegar, ventana de gastos de 90 días)
- Nueva contratación de Ingeniería de Datos (mayo) = medio-alta (escalando el equipo, probablemente evaluará herramientas)
- Investigación de herramientas del CEO (junio) = media (señala apertura a nuevas soluciones)

---

#### Capa 3: Tech Stack y Brechas

**Verificación de BuiltWith:**
- Analytics: Mixpanel, Segment, Google Analytics
- CRM: Salesforce
- Data Warehouse: Snowflake (confirmado en oferta de trabajo + materiales de prensa)
- BI: Looker (mencionado en LinkedIn de [Jamie Kim] como "trabajó con Looker en empresa anterior")
- ETL/Data Pipeline: [No claramente listado]

**Ofertas de Trabajo de LinkedIn (últimas 5):**
1. "Senior Data Engineer" (publicado 20 mayo): "Requerido: SQL, Python, Airflow u herramienta de orquestación similar. Nice to have: experiencia con dbt."
   - Traducción: Actualmente usando Airflow, interesado en dbt; probablemente evaluando mejoras de orquestación
2. "Analytics Engineer" (publicado 28 mayo): "Construye transformaciones y modelos de datos. Requerido experiencia con SQL, dbt, Snowflake."
   - Traducción: Contratando activamente para dbt/ingeniería analytics; capacidad en etapa inicial que están agregando
3. "Data Quality Engineer" (publicado 1 junio): "Dueño de datos quality y testing. Estamos construyendo nuevos procesos de monitoreo."
   - Traducción: Data quality es un *nuevo problema* que están resolviendo; inversión de infraestructura confirmada
4. "Data Infrastructure Lead" (publicado 10 mayo): "Propietario de nuestro roadmap de plataforma de datos. Debe tener experiencia escalando clusters de Snowflake + reduciendo costos."
   - Traducción: Dolor de costo + escala; eficiencia de infraestructura importa

**Reseñas G2 (filtradas por 100–1000 empleados, e-commerce):**
- Reseña 1 (mayo 2026, Sr. Data Analyst): "Snowflake es sólido, pero nuestra capa de transformación es fragmentada. Tenemos scripts en Python, modelos dbt, y DAGs de Airflow—difícil rastrear dependencias. Integración entre estas herramientas necesita mejorar."
  - Dolor: Orquestación multi-herramienta fragmentada; rastreo de dependencias roto
- Reseña 2 (junio 2026, Analytics Manager): "Estamos golpeando problemas de escalabilidad con Airflow. Despliegues toman 2+ horas, y depuración de trabajos fallidos es dolorosa."
  - Dolor: Escalabilidad de Airflow + overhead operacional
- Reseña 3 (abril 2026, Data Engineering Lead): "Transitando de scripts personalizados a Airflow, pero curva de aprendizaje es empinada y carecemos de buen monitoreo. Buscamos soluciones que simplifiquen esto."
  - Dolor: Adopción de Airflow + monitoreo
- Reseña 4 (mayo 2026, VP Analytics, otra empresa, pero mismo tamaño): "Nuestro pipeline de datos es un cuello de botella. Queremos pasar a solución gestionada para reducir overhead de ops, pero estamos atrapados en Airflow."
  - Inferencia: TechRetail probablemente tiene el mismo problema (bloqueo de Airflow)

**Resumen de Tech Stack:**

Herramientas actuales:
- Warehouse: Snowflake
- Orquestación: Airflow (principal), scripts Python personalizados
- Transformación: dbt (siendo adoptado)
- Analytics: Looker, Mixpanel, Segment
- Sin evidencia de solución de pipeline de datos gestionada (Fivetran, Airbyte, etc.)

Brechas identificadas:
1. **Escalabilidad de orquestación:** Tiempos de despliegue de Airflow lentos (2+ horas por revisión de gerente de contratación), sin estrategia de monitoreo, integración multi-herramienta fragmentada
2. **Gobernanza de transformación de datos:** Múltiples capas de transformación (dbt + scripts Python) no integradas; rastreo de dependencias faltante
3. **Calidad de datos/observabilidad:** Nueva contratación (Data Quality Engineer) sugiere que esto es recién priorizado; sin solución establecida

Fricción de integración:
- Airflow + Snowflake + dbt = trabajo de integración manual (revisado en G2 como "fragmentado")
- Optimización de costo (contratación para "reducir costos de Snowflake") sugiere que están golpeando sorpresa de factura por escalado

---

#### Capa 4: Señales de Dolor (Top 3)

**Señal #1: Overhead Operacional de Airflow + Cuello de Botella de Escalabilidad**

Evidencia:
- Oferta de trabajo: "Data Infrastructure Lead" explícitamente menciona "reducir overhead operacional," "escalar clusters de Snowflake," publicado 10 mayo
- Reseñas G2: "Despliegues toman 2+ horas," "depuración de trabajos fallidos es dolorosa" (junio 2026), "curva de aprendizaje empinada + falta de monitoreo" (abril 2026)
- Nueva contratación: Jamie Kim (Director de Ingeniería de Datos, ex-[Empresa Anterior], 22 mayo) probablemente traída para resolver problemas de ops/escalado

Frecuencia: 3 ofertas de trabajo mencionan orquestación/airflow, 3 reseñas G2 mencionan dolor operacional
Urgencia: **Alta** — Contratación de nuevo director (señal que empresa prioriza esto ahora), capital de Serie B a invertir, ofertas de trabajo recientes (contratación para arreglar)
Tu gancho (ángulo Fivetran/Airbyte): "Tus ofertas de trabajo muestran que estás escalando Airflow, pero el verdadero desbloqueo es reducir overhead de ops. Una plataforma de pipeline gestionada deja que tu equipo se enfoque en analytics, no infraestructura."

---

**Señal #2: Multi-Herramienta Data Stack + Fragmentación de Integración**

Evidencia:
- Oferta de trabajo: "Analytics Engineer" (28 mayo) requiere dbt; simultáneamente, oferta para "Senior Data Engineer" (20 mayo) requiere Airflow + "nice to have: dbt"
  - Traducción: Están adoptando dbt pero no lo han integrado completamente con orquestación
- Reseña G2: "Tenemos scripts en Python, modelos dbt, y DAGs de Airflow—difícil rastrear dependencias"
- Tech stack: Snowflake + Looker + Mixpanel + Segment + Python personalizado + Airflow + dbt = 7 herramientas, débilmente conectadas

Frecuencia: Mencionado en 2 ofertas de trabajo, 1 reseña, inferido de tech stack
Urgencia: **Medio-Alta** — Activamente contratando para resolver esto (rol de Analytics Engineer), pero no aún crítico
Tu gancho (plataforma dbt Cloud / orquestación): "Estás construyendo un data stack moderno (Snowflake + dbt), pero tu capa de orquestación no está construida para manejarlo. Una plataforma que sincroniza Airflow + dbt + Snowflake reduce tu deuda de integración en 60%."

---

**Señal #3: Data Quality + Observabilidad (Nueva Prioridad)**

Evidencia:
- Oferta de trabajo: "Data Quality Engineer" (publicado 1 junio) — *nuevo rol*, explícitamente dice "Estamos construyendo nuevos procesos de monitoreo"
  - Traducción: Data quality es ahora prioridad de negocio (probablemente disparado por Serie B, precisión de datos orientada al cliente)
- Reseña G2: "Carecemos de buen monitoreo" (abril 2026)
- Implicación: Expansión de Serie B = mercados de UE + estrategia de personalización = precisión de datos se vuelve crítica

Frecuencia: 1 oferta de trabajo nueva + 1 mención de reseña
Urgencia: **Media** — Recién priorizado, pero no aún maduro (contratando para esto ahora)
Tu gancho (dbt + herramientas de data quality): "Acabas de contratar para data quality. La parte más difícil no es monitoreo—es tener un sistema que *previene* datos malos ingresando a tu pipeline. [Tu herramienta] atrapa problemas antes de que golpeen Snowflake."

---

#### Capa 5: Huella Social

**Actividad de LinkedIn del CEO (Sarah Chen):**
- Nivel de actividad: 2–3 publicaciones por semana (engagement alto)
- Contenido: Hitos de empresa (financiamiento, contrataciones), tendencias de industria (plataformas de datos, personalización), cultura
- Engagement: ~100–200 likes por publicación, comentarios de figuras de industria
- Última actividad: 1 junio 2026 (activo hoy)
- Veredicto: **Líder de pensamiento, altamente visible, receptivo a tendencias de industria**

**LinkedIn del VP de Datos (Alex Rodriguez):**
- Nivel de actividad: 3–4 publicaciones por semana (muy activo)
- Contenido: Ingeniería de datos, consejo de carrera, consejos de Snowflake/dbt, posturas personales sobre herramientas de datos
- Engagement: ~50–150 likes, responde a comentarios
- Última actividad: 1 junio 2026 (activo)
- Conexiones: ~2,500 (red de industria fuerte)
- Veredicto: **Altamente comprometido en comunidad de ingeniería de datos, probablemente receptivo a entrada de líderes de pensamiento**

**LinkedIn del CTO (Marcus Williams):**
- Nivel de actividad: 1 publicación por mes (menos visible)
- Contenido: Victorias de ingeniería, anuncios de contratación
- Última actividad: 28 mayo 2026
- Veredicto: **Menos visible, pero responde a comentarios (no inactivo)**

---

### Salida de Expediente de Cuenta

```
## TechRetail Inc. — Expediente de Inteligencia de Cuenta

### Descripción General de la Empresa
TechRetail Inc. es una empresa de ~450 personas especializando en datos de cliente y personalización, con clientes a través de sectores retail y CPG. Acaban de cerrar $25M de Serie B (mayo 2026) para expandir a mercados de UE y fortalecer infraestructura de datos—creando una ventana activa de despliegue de capital de 90 días.

### Mapa de Tomador de Decisiones

**Comprador Económico:** David Park, VP Finanzas
- Propietario P&L: Presupuesto de infraestructura de datos + gasto técnico
- Última actividad en LinkedIn: 30 mayo 2026 (publica 1–2x por mes en finanzas/ops)
- Señal: Lo suficientemente activo para ver divulgación en frío; Finanzas controla presupuesto de datos/infraestructura

**Campeón:** Alex Rodriguez, VP de Datos y Analytics
- Usa herramientas de orquestación + transformación de datos diariamente; OKRs vinculados a velocidad de pipeline de datos + calidad
- Última actividad en LinkedIn: 1 junio 2026 (publica 3–4x por semana, muy comprometido)
- Señal: Altamente comprometido en comunidad de ingeniería de datos; probablemente lea entrada de pares o vendedores; puede influir decisión de compra hacia arriba a Finanzas

**Influyente:** Marcus Williams, CTO
- Puede bloquear/acelerar: Decisiones arquitectónicas, prácticas de ingeniería; palabra final en integración de plataforma
- Última actividad en LinkedIn: 28 mayo 2026 (actividad más baja, pero comprometido cuando activo)
- Señal: Nueva contratación de director de ingeniería de datos (Jamie Kim) reporta a él; su aprobación es requerida para implementación

---

### Capa 2: Eventos Recientes (Señales de Impulso)

- **15 mayo 2026 (Financiamiento de Serie B):** $25M de financiamiento de Serie B para expandir UE + fortalecer infraestructura de datos
  - Implicación: Capital asignado para inversión de infraestructura; ventana de gastos de 90 días probablemente activa; ciclo presupuestario reinicio
  - Fuente: [company-linkedin-post]

- **22 mayo 2026 (Contratación de Director):** Jamie Kim contratado como Director de Ingeniería de Datos (ex-[Empresa Anterior], 10 años antecedente construyendo plataformas de datos)
  - Implicación: Empresa está acelerando desarrollo de plataforma de datos; problemas de ops/escalado siendo abordados directamente; nuevo director evaluará herramientas
  - Fuente: [alex-rodriguez-linkedin-post]

- **1 junio 2026 (Nuevo Rol de Data Quality):** Rol de Data Quality Engineer publicado; descripción de trabajo dice "Estamos construyendo nuevos procesos de monitoreo"
  - Implicación: Data quality es ahora prioridad crítica de negocio (probablemente expansión a UE + precisión de datos para personalización); stack de monitoreo siendo construido ahora
  - Fuente: [techretail-careers-page]

- **8 mayo 2026 (Éxito Interno):** Publicó estudio de caso sobre reducir tiempo de procesamiento de datos en 40%
  - Implicación: Empresa es enfocada en datos; públicamente celebrando victorias de eficiencia; abierto a mejoras de proceso
  - Fuente: [company-blog]

- **1 junio 2026 (Investigación de Herramientas del CEO):** Sarah Chen (CEO) recompartió artículo de TechCrunch sobre "Futuro de Plataformas de Datos de Cliente" con comentario: "Esto resuena—nuestro roadmap es fuertemente enfocado en datos"
  - Implicación: CEO está activamente investigando tendencias de plataforma de datos; infraestructura de datos es prioridad estratégica
  - Fuente: [sarah-chen-linkedin]

---

### Capa 3: Tech Stack y Brechas

**Stack Actual (verificado por BuiltWith + ofertas de trabajo + LinkedIn):**
- **Data Warehouse:** Snowflake (principal)
- **Orquestación:** Apache Airflow (principal), scripts Python personalizados
- **Transformación:** dbt (recién adoptado; contratando para rol de "Analytics Engineer")
- **Analytics/BI:** Looker
- **Customer Data:** Segment, Mixpanel
- **CRM:** Salesforce

**Brechas Identificadas:**

1. **Escalabilidad de orquestación + operations:** Usando Airflow open-source con overhead operacional pesado. Oferta de trabajo para "Data Infrastructure Lead" explícitamente menciona "reducir overhead operacional" y "escalar clusters de Snowflake." Reseñas G2 de empresas similares notan "despliegues de 2+ horas" y "brechas de monitoreo." Sin solución de orquestación gestionada en lugar (sin Fivetran, Airbyte, Prefect, Dagster, o dbt Cloud observado).
   - Implicación de brecha: Están construyéndolo in-house hoy; capital de Serie B los hace comprador ahora

2. **Integración de dbt + gobernanza:** Recién contratados para rol de "Analytics Engineer", pero dbt no está integrado con Airflow a escala. Reseña G2 nota "fragmentos de scripts Python + modelos dbt + DAGs de Airflow—difícil rastrear dependencias."
   - Implicación de brecha: Multi-herramienta data stack requiere capa de integración; rastreo de dependencias roto

3. **Observabilidad de data quality:** Nuevo rol de "Data Quality Engineer"; oferta de trabajo explícitamente dice "construyendo nuevos procesos de monitoreo." Reseña G2 nota "carecemos de buen monitoreo."
   - Implicación de brecha: Data quality es recién priorizado; stack de monitoreo siendo construido; comprador para herramientas de observabilidad ahora

**Fricción de integración:**
- Snowflake + Airflow: Integración manual, monitoreo vía logs de Airflow (limitado)
- Airflow + dbt: Sin integración nativa; requiere orquestación personalizada
- dbt + Snowflake: Funciona, pero escalado requiere gobernanza (rastreo de modelo, linaje)

---

### Capa 4: Señales de Dolor (Top 3)

**Señal de Dolor #1: Overhead Operacional de Airflow + Escalabilidad**

Evidencia:
- Oferta de trabajo (20 mayo): "Senior Data Engineer requerido: Airflow u orquestación similar. Nice to have: experiencia con dbt" → señala uso actual de Airflow, interés en alternativas
- Oferta de trabajo (10 mayo): "Data Infrastructure Lead — Propietario de roadmap de plataforma de datos. Debe tener experiencia escalando clusters de Snowflake + reduciendo costos" → dolor explícito de costo + escalado
- Reseñas G2 (filtradas por tamaño de empresa + e-commerce):
  - Mayo 2026: "Despliegues toman 2+ horas, depuración de trabajos fallidos es dolorosa"
  - Abril 2026: "Curva de aprendizaje empinada, falta de monitoreo"
- Contexto de nueva contratación: Jamie Kim (Director de Ingeniería de Datos, contratado 22 mayo) antecedente en "escalando plataformas de datos" en empresa anterior → señala que este dolor fue requisito de contratación

Frecuencia: Mencionado en 3 ofertas de trabajo + 2 reseñas G2 = alto consenso
Urgencia: **Alta** — Director recién contratado para arreglar; capital de Serie B asignado; posts de trabajo recientes
Tu gancho: "Las matemáticas de tu Serie B no funcionan si 2 horas de cada día de despliegue se gastan en ops de Airflow. Tu nuevo Director de Ingeniería de Datos (Jamie Kim, basado en su antecedente) probablemente evaluará soluciones de orquestación que corten overhead operacional en 50%+ dentro de Q3. Una plataforma gestionada deja que tu equipo se enfoque en estrategia de datos, no infraestructura."

---

**Señal de Dolor #2: Fragmentación de Data Stack Multi-Herramienta + Rastreo de Dependencias**

Evidencia:
- Oferta de trabajo (28 mayo): "Analytics Engineer — Transformar datos usando SQL, dbt, Snowflake" → señala adopción de dbt pero no aún madura
- Oferta de trabajo (20 mayo): "Senior Data Engineer — Airflow u similar + nice to have dbt" → señala co-existencia de dos enfoques de transformación
- Reseña G2 (mayo 2026): "Tenemos scripts Python, modelos dbt, y DAGs de Airflow—difícil rastrear dependencias. Integración entre herramientas necesita mejorar"
- Oferta de trabajo (1 junio, Data Quality Engineer): "Dueño de data quality y testing" → señala que quieren centralizar calidad, pero stack actual es fragmentado

Frecuencia: Múltiples ofertas de trabajo + 1 reseña detallada = patrón claro
Urgencia: **Medio-Alta** — Activamente contratando para resolver (rol de Analytics Engineer), pero no aún ruta crítica
Tu gancho: "Estás construyendo stack moderno (dbt + Snowflake), pero tu capa de orquestación no fue construida para manejarlo. Tienes lógica de transformación dispersa en scripts Python, dbt, y Airflow. Consolidar en plataforma que sincroniza los tres corta tu carga de rastreo de dependencias en 70% y hace tu gobernanza de datos escalable."

---

**Señal de Dolor #3: Data Quality + Observabilidad (Nueva Prioridad Crítica de Negocio)**

Evidencia:
- Oferta de trabajo (1 junio): "Data Quality Engineer — Estamos construyendo nuevos procesos de monitoreo" (nuevo rol, post reciente)
- Reseña G2 (abril 2026): "Carecemos de buen monitoreo. Transitando a Airflow, pero estrategia de monitoreo no establecida"
- Contexto: Expansión de Serie B a mercados de UE + enfoque de personalización = precisión de datos impacta directamente experiencia de cliente + ingresos
- Señal del CEO (1 junio): "Nuestro roadmap es fuertemente enfocado en datos" → inversión en data quality es estratégica

Frecuencia: 1 oferta de trabajo reciente + 1 reseña + contexto estratégico = prioridad emergente
Urgencia: **Media** — Recién priorizado (contratando hoy), pero no aún maduro; sin embargo, se volverá crítico dentro de 60 días
Tu gancho: "Acabas de agregar rol de Data Quality Engineer. Eso significa que precisión de datos es ahora en agenda ejecutiva (probablemente disparado por tu expansión a UE + roadmap de personalización). La parte más difícil de data quality no es monitoreo—es prevenir datos malos ingresando tu pipeline en primer lugar. La mayoría de plataformas agregan monitoreo después del hecho. [Tu herramienta] previene problemas upstream."

---

### Gancho Mejor de Personalización

**Usa el capital de Serie B + nueva contratación de director como vector de entrada. Lidera con antecedente de Jamie Kim como prueba social.**

**Apertura recomendada:**
"Alex, noté que TechRetail acaba de traer a Jamie Kim como Director de Ingeniería de Datos (felicidades al equipo). Su antecedente en [Empresa Anterior] fue construyendo plataformas de datos que escalaron de Airflow a 10B+ eventos/día. Estoy adivinando que eso fue parte de por qué está aquí—para abordar los mismos desafíos de escalado que estás golpeando post-Serie B. Ayudamos a equipos de ingeniería como el tuyo a cortar overhead operacional de Airflow en 50%+ mientras mantienes tus inversiones de dbt + Snowflake intactas. Me encantaría compartir cómo [empresa similar de su tamaño] resolvió esto en Q2. ¿Tienes 20 minutos la próxima semana?"

**Ganchos alternativos (en orden de prioridad):**
1. **Gancho de noticias:** "Expansión de Serie B a UE requiere precisión de datos a escala. Tu nuevo rol de Data Quality Engineer confirma que eso está en tu agenda. Aquí está cómo [empresa] maneja verificaciones de data quality upstream..."
2. **Gancho de tech:** "Tus ofertas de trabajo muestran que estás contratando para dbt + Airflow. La parte complicada—y la razón por la que la mayoría de equipos golpean muros de escalado—es integrar los dos sin contratar un equipo de plataforma. [Tu herramienta] resuelve eso..."
3. **Gancho de costo:** "Tu rol de 'Data Infrastructure Lead' menciona reducir costos de Snowflake. La mayoría de equipos golpean un muro: despliegues de Airflow se vuelven más lentos, queries de dbt se ejecutan más largo, costos suben. [Tu herramienta] está construida para ejecutar ambos eficientemente..."

---

### Canal Recomendado Primero

**LinkedIn InMail a Alex Rodriguez, VP de Datos**

**Por qué:**
- Está altamente activo (3–4 publicaciones por semana, última actividad hoy), así que probablemente abrirá + leerá InMail
- Como VP de Datos, dueño del dolor día a día (ops de orquestación, gobernanza de transformación)
- *No* es el comprador económico (David Park, VP Finanzas es), pero es el Campeón que puede programar reunión e influir hacia arriba
- Directo a Comprador Económico (David Park) salta el campeón; menos cálido, requiere prueba social nivel CEO
- Email (frío) es posible, pero su engagement en LinkedIn sugiere que InMail superará

**Por qué no alternativas:**
- Email (introducción cálida): Más rápido si tienes conexión mutua, pero sin evidencia de una; LinkedIn InMail es más cálido
- Mensaje en LinkedIn: InMail es intención más alta desde perspectiva de vendedor; muestra que respetas su tiempo
- Divulgación de Influyente (Marcus Williams, CTO): Menos activo; Alex es audiencia más receptiva

---

### Marco Recomendado

**Marco "disparado por evento" con prueba social de pares**

**Por qué este marco:**
1. **Disparador de evento:** Serie B + nueva contratación de director = prueba de apetito por cambio y asignación de presupuesto
2. **Prueba social de pares:** Tienes cliente de tamaño/etapa similar en e-commerce o infraestructura de datos que resolvió esto post-Serie B; esa empresa se vuelve tu referencia
3. **Credibilidad:** Nuevo director (Jamie Kim) querrá evaluar soluciones rápidamente; tener estudios de caso de su red de pares acelera ciclo de trato

**Ejecución:**
- **Primer contacto (InMail a Alex):** Gancho de noticias (Serie B) + nueva contratación de director como prueba que se importan de este problema + estudio de caso de cliente de referencia (si tienes uno en e-commerce/infraestructura de datos en escala similar)
  - Longitud de mensaje: máximo 40 palabras + un enlace a estudio de caso
  - Objetivo: Obtener llamada de descubrimiento de 20 minutos
- **Llamada de descubrimiento con Alex + Jamie Kim:** Marco MEDDIC (entender presupuesto, stakeholders, timeline vinculado a ventana de capital de Serie B)
  - Clave: Jamie Kim probablemente será dueño de evaluación; alinea en prueba técnica (demo escenario dbt + Snowflake)
- **Cierre:** Marco ROI (reducir overhead de ops + costos de Snowflake)
  - Benchmark: "La mayoría de clientes ven reducción de overhead de ops de 50%+ en primeros 90 días + ahorros de costos de Snowflake de 20–30%"

---

### Puntuación de Calidad de Datos y Confianza

- **Actualidad de datos:** Investigación completada 2 junio 2026 (actual a partir de hoy)
- **Confianza en mapa de tomador de decisiones:** **Alta**
  - Alex Rodriguez confirmado vía LinkedIn como VP de Datos (múltiples fuentes: página de empresa, LinkedIn personal, contexto de oferta de trabajo)
  - David Park confirmado vía LinkedIn como VP Finanzas (página de empresa + patrones de publicación financiera)
  - Marcus Williams confirmado como CTO (página de empresa, Jamie Kim reporta a él)
  - Los tres confirmados activos dentro de últimas 3 días
- **Confianza en solidez de señal de dolor:** **Alta**
  - Dolor de Airflow: 3 ofertas de trabajo + 2 reseñas G2 recientes + contratación de director reciente = confianza muy alta
  - Dolor de integración de dbt: 2 ofertas de trabajo + 1 reseña + señal de contratación = confianza alta
  - Dolor de data quality: 1 oferta de trabajo reciente + 1 reseña + contexto estratégico (expansión a UE) = confianza medio-alta
- **Siguiente paso recomendado:** **Listo para divulgación cálida**
  - Timing de Serie B + contrataciones recientes + tomadores de decisiones activos = ventana de alta intención (30–60 días antes de que capital se despliegue en otro lugar)
  - Prioridad: InMail a Alex Rodriguez dentro de 48 horas
  - Secundario: Obtén introducción cálida a Jamie Kim vía conexión mutua si está disponible (de-riesks la conversación técnica)
```

---

## Notas para Practicantes

1. **Investigación de Nivel 1 a escala empresarial:** Si empresa es >2,000 empleados, puedes necesitar agregar capa de "Patrocinador" (director que puede presentarte al Comprador Económico). A esa escala, alcanzar el CFO directamente es menos efectivo que ir a través de patrocinador de confianza.

2. **Adapta plantilla de expediente a tu producto:** La plantilla arriba es genérica. Para tu caso de uso (cualquiera que sea tu producto), reemplaza viñetas "Tu gancho" con tu propuesta de valor específica. Ejemplos:
   - Si vendes plataforma de datos (Fivetran): Enfatiza "orquestación gestionada + reducción de costo"
   - Si vendes dbt Cloud: Enfatiza "gobernanza de dbt + rastreo de dependencias"
   - Si vendes herramientas de data quality (dbt tests + Great Expectations): Enfatiza "prevenir datos malos upstream"

3. **Cuándo re-investigar:** Actualiza este expediente si (a) empresa recauda nuevo financiamiento, (b) tomador de decisiones clave se va/se une, (c) lanzamiento de producto nuevo o pivot, (d) noticias importantes (adquisición, presentación pública). De otro modo, expediente es válido por 60 días.

4. **Vs. empresa única vs. lista de cuenta:** Usa Nivel 1 para tratos nombrados; usa Nivel 2/3 para listas de cuenta. Si trabajas a través de lista de 100 cuentas, ejecuta todas las 100 en Nivel 3 primero (identifica fruta baja colgada), luego tier-up las top 10–15 a Nivel 1 para investigación más profunda.

5. **Investigación como calificación:** Las señales de dolor deben informar lógica de calificación. Si ves <3 señales de dolor después de minería de Capa 4, la empresa puede ser mal ajuste (no golpeando los problemas que tu producto resuelve). Considera desoprioritizar hasta que señales se vuelvan más claras.
