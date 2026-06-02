---
name: candidate-sourcer
description: "Búsqueda de candidatos pasivos: cadenas de búsqueda en LinkedIn, búsqueda booleana, secuencias de mensajes de contacto y seguimiento de pipeline para reclutadores"
---

# Habilidad: Buscador de Candidatos

## Cuándo activar
- Tienes un puesto abierto sin candidatos aún y necesitas buscar proactivamente
- La calidad de los candidatos entrantes es baja y necesitas encontrar candidatos pasivos
- Necesitas una cadena de búsqueda booleana para encontrar perfiles específicos en LinkedIn Recruiter o Google
- Estás escribiendo el primer mensaje de contacto para un candidato pasivo que no está buscando activamente
- Estás construyendo un pipeline de búsqueda — necesitas encontrar 50+ perfiles para trabajar
- Rastreando una campaña de búsqueda a través de múltiples roles simultáneamente

## Cuándo NO usar
- Escribir la descripción del puesto — usa `/job-description` para eso
- Filtrar o entrevistar candidatos — usa `/interview-scorecard`
- Ofertas de compensación — usa `/comp-benchmarker`
- Situaciones de movilidad interna o recontratación — conversación y proceso diferente

## Instrucciones

### Constructor de cadenas de búsqueda en LinkedIn

```
Construye una cadena de búsqueda en LinkedIn para encontrar candidatos para [rol].

Rol: [Título del puesto]
Calificaciones imprescindibles:
- [Habilidad o experiencia 1]
- [Habilidad o experiencia 2]
- [Credencial, herramienta o experiencia en la industria]

Agradables de tener:
- [Diferenciador 1]
- [Diferenciador 2]

Empresas objetivo (donde podrían trabajar ahora o anteriormente):
- Competidores directos: [lista]
- Empresas adyacentes con habilidades transferibles: [lista]
- Industrias que producen buenos antecedentes para este rol: [lista]

Excluir:
- [Empresas de las que no quieres contratar — ej., tu propia empresa, empresas conocidas por malas prácticas]
- [Ubicaciones a excluir]

Antigüedad / rango de experiencia:
- Años de experiencia: [X-Y años]
- Nivel: [IC / Manager / Director / VP]

Producir:

## Cadena Booleana para LinkedIn Recruiter
(Usar en LinkedIn Recruiter Search → campo Keywords)

("variante de título 1" OR "variante de título 2" OR "variante de título 3")
AND ("habilidad 1" OR "habilidad 2")
AND ("nombre de empresa" OR "nombre de empresa 2")
NOT ("término excluido")

## Búsqueda X-Ray en Google
(Para encontrar perfiles de LinkedIn sin acceso a Recruiter)
site:linkedin.com/in "[título del puesto]" "[habilidad]" "[ubicación]" -intitle:"profiles" -inurl:"dir/"

## Lógica booleana explicada
Usa AND para requerir ambos términos
Usa OR para encontrar cualquiera de los términos (más amplio)
Usa NOT para excluir términos
Usa comillas para frases exactas
Usa paréntesis para agrupar la lógica

## Refinamientos
Si la búsqueda devuelve demasiados resultados: agrega AND con otra habilidad requerida
Si devuelve muy pocos: reemplaza AND con OR entre términos clave, o elimina el filtro de empresa
Objetivo: 50-200 perfiles sólidos para campaña de búsqueda activa — no miles

## Variaciones de búsqueda para ejecutar en paralelo
Variación 1: [enfoque en título]
Variación 2: [enfoque en habilidades]
Variación 3: [enfoque en empresa/antecedentes]
```

### Plantillas de mensajes de contacto

```
Escribe mensajes de contacto para la búsqueda de candidatos pasivos.

Rol: [Título del puesto]
Empresa: [Nombre de tu empresa]
Qué hace atractivo este rol: [3 cosas específicas — no genéricas]
Antecedentes del candidato: [describe a quién le estás enviando esto — sus probables antecedentes y rol actual]
Canal: [LinkedIn InMail / Correo electrónico / Presentación a través de conexión mutua]
Tono: [profesional / conversacional — adecuado al nivel de antigüedad del rol]

Marco del mensaje:

ESTRUCTURA (en orden):
1. Interrupción del patrón — no empieces con "Hola, soy [Reclutador] de [Empresa]"
2. Señal de relevancia — por qué ellos, específicamente
3. Gancho del rol — 1 cosa específica y atractiva sobre el rol
4. Solicitud ligera — siguiente paso sin presión, no "¿Estás interesado en aplicar?"

---

PLANTILLA A — LinkedIn InMail (menos de 150 palabras — ve al grano)

Asunto: [Rol] en [Empresa] — vi tu trabajo en [su empresa]

Hola [Nombre],

[Observación específica sobre su trayectoria — "Tu experiencia liderando [X] en [Empresa] llamó mi atención porque..."] — no "Me encontré con tu perfil."

Estamos construyendo [una oración atractiva sobre lo que hace la empresa — etapa, misión, impulso].

El [rol] en el que estoy trabajando sería responsable de [algo específico e impactante], y dados tus antecedentes en [coincidencia específica], creo que vale la pena una conversación.

¿Tendría sentido una llamada de 20 minutos esta semana para ver si hay compatibilidad?

[Tu nombre]

---

PLANTILLA B — Presentación cálida a través de conexión mutua (correo electrónico)

Asunto: [Contacto mutuo] sugirió que me pusiera en contacto

Hola [Nombre],

[Contacto mutuo] mencionó que podrías estar abierto a escuchar sobre lo que estamos construyendo en [Empresa] — espero que esté bien que me ponga en contacto directamente.

[Una oración sobre la empresa — sé específico, nada de frases genéricas.]

El [rol] que estoy tratando de cubrir es [propuesta específica — qué serían responsables, con quién trabajarían, por qué ahora].

Sé que estas conversaciones funcionan mejor cuando hay una compatibilidad real en ambos lados, así que prefiero hablar antes de enviar algo formal. ¿Te funcionaría 20 minutos esta semana?

[Tu nombre]

---

PLANTILLA C — Seguimiento (si no hay respuesta al primer mensaje después de 7 días)

Hola [Nombre],

Sé que no estás mirando tu InMail todo el día — solo quería hacer un recordatorio una vez por si quedó enterrado.

Si el momento no es el indicado, no hay problema en absoluto. Si tienes curiosidad por lo que estamos construyendo, con mucho gusto comparto más contexto antes de cualquier tipo de conversación formal.

[Tu nombre]

---

Reglas:
- Personaliza la primera línea — si no puedes decir algo específico sobre ellos, no lo envíes
- Una solicitud clara al final — llamada de 20 minutos, no "cuéntame qué piensas"
- Nunca adjuntes una descripción del puesto en el primer mensaje — indica carta genérica
- Haz seguimiento una vez — después de eso, sigue adelante

Genera mensajes de contacto para [rol] adaptados al [tipo de candidato] que estoy buscando.
```

### Rastreador de pipeline de búsqueda

```
Construye un rastreador de pipeline de búsqueda para [rol].

Rol: [Título del puesto]
Objetivo de búsqueda: [X candidatos calificados en pipeline para producir 1 contratación]
Fecha objetivo de primera contratación: [fecha]

Matemática del pipeline (regla general para tasas de conversión de reclutamiento):
- Perfiles identificados → Contacto enviado: 30-50% (filtrar por calidad antes del contacto)
- Contacto enviado → Respondió: 15-30% (los candidatos pasivos tienen tasas de respuesta bajas)
- Respondió → Interesado en llamada: 50-70% (de los que responden, la mayoría tiene curiosidad)
- Pasó la pantalla telefónica → Avanzar a panel: 40-60%
- Panel → Oferta: 30-50%
- Oferta → Aceptación: 70-90%

Para 1 contratación, trabajar hacia atrás:
Fecha objetivo de contratación en [X semanas]
Ofertas a extender: ~1.5 (asumir 1 rechazo)
Aprobaciones de panel necesarias: ~3-4
Pantallas telefónicas: ~7-10
Respuestas interesadas: ~12-15
Contactos enviados: ~50-80
Perfiles identificados y calificados: ~100-150

Rastreador de etapas del pipeline (construir en Notion, Airtable o Google Sheets):

| Candidato | Empresa | Rol | Fuente | Etapa | Último contacto | Próxima acción | Notas |
|---|---|---|---|---|---|---|---|
| [Nombre] | [Empresa] | [Título] | [LinkedIn / Referido / Bolsa de trabajo] | [Identificado / Contacto enviado / Respondió / Pantalla / Panel / Oferta / Rechazado / Contratado] | [fecha] | [acción + fecha] | [notas] |

Definiciones de etapas:
1. Identificado — encontrado en LinkedIn, no se ha contactado
2. Contacto enviado — primer mensaje enviado, esperando respuesta
3. Respondió — respondieron, positivo o pidiendo más información
4. Pantalla telefónica — programada o completada
5. Avanzado — pasando a entrevista de panel
6. Panel — en proceso de entrevistas
7. Oferta — oferta extendida
8. Contratado / Rechazado / En pausa

Cadencia semanal de búsqueda:
- Lunes: revisar pipeline, avanzar o cerrar candidatos estancados
- Martes-Jueves: nuevo contacto — enviar en lotes 15-20 mensajes
- Viernes: seguimiento a no respondedores (solo 1 seguimiento, después de 7 días)

Produce un plan de búsqueda con cronograma, objetivos del pipeline y programa de contactos.
```

### Informe de investigación de candidatos

```
Investiga este candidato antes de que me ponga en contacto o lo entreviste.

Candidato: [Nombre]
Empresa actual: [Empresa]
Rol actual: [Título]
LinkedIn: [URL o detalles del perfil]

Produce un informe del candidato:

RESUMEN DE ANTECEDENTES
- Rol actual y permanencia: [X años en Empresa — ¿es esta una permanencia típica o inusualmente corta/larga?]
- Trayectoria profesional: [¿esta persona está avanzando, moviéndose lateralmente o bajando en antigüedad?]
- Experiencia en la industria: [¿en qué industrias ha trabajado?]
- Tipos de empresa: [startup / scale-up / empresa grande / agencia — ¿en qué entornos es nativo?]
- Habilidades y herramientas: [¿qué habilidades técnicas o de dominio son visibles en el perfil?]

SEÑALES DE COMPATIBILIDAD CON EL ROL
- Experiencia relevante para [tu rol abierto]: [fuerte / parcial / brecha]
- Brecha a llenar en la entrevista: [¿qué no puedes saber del perfil?]
- Preocupación potencial: [¿hay algo en la trayectoria que necesite explicación?]

GANCHOS DE PERSONALIZACIÓN PARA EL CONTACTO
- Algo específico a referenciar: [publicación reciente / hito de la empresa / movimiento de carrera / conexión compartida]
- Qué podría hacerlos receptivos ahora: [su empresa acaba de hacer despidos / acaban de ser promovidos — rol nuevo = probablemente no se mueven pronto]
- En qué probablemente están interesados: [avance profesional / desafío técnico / misión / compensación — inferir de la trayectoria]

INTELIGENCIA PARA LA ENTREVISTA
- Qué investigar: [transiciones o brechas específicas en el perfil]
- Motivaciones probables: [¿por qué podrían estar abiertos a moverse?]
- Ofertas competidoras probables: [¿quién más podría estar contratando perfiles similares ahora?]

Produce el informe del candidato para [nombre].
```

## Ejemplo

**Usuario:** Estoy buscando un Gerente de Marketing de Crecimiento para mi empresa B2B SaaS en Ámsterdam. Necesitan tener experiencia en adquisición pagada (Google/Meta), algo de SEO, e idealmente venir de un entorno SaaS. Ayúdame a construir mi búsqueda y contacto.

**Plan de búsqueda de Claude:**

**Búsqueda booleana en LinkedIn:**

```
("Growth Marketing Manager" OR "Performance Marketing Manager" OR "Digital Marketing Manager" OR "Growth Manager")
AND ("Google Ads" OR "paid acquisition" OR "PPC" OR "SEM")
AND ("SaaS" OR "B2B" OR "software")
AND (Amsterdam OR Netherlands OR "The Netherlands")
```

**Google X-Ray (sin necesidad de LinkedIn Recruiter):**
```
site:linkedin.com/in "growth marketing" ("google ads" OR "paid acquisition") "saas" "amsterdam"
```

**Empresas objetivo donde buscar:**
Empresas en Ámsterdam con modelos de negocio SaaS de donde comúnmente vienen los especialistas en marketing de crecimiento: Booking.com (talento en marketing de performance), Adyen, MessageBird (ahora Bird), Sendcloud, Picnic, Mews — también busca en agencias con base en Ámsterdam que hacen paid para clientes SaaS.

**Mensaje de contacto — LinkedIn InMail:**

Asunto: Rol de Growth Marketing en Ámsterdam — tu trayectoria en SaaS destacó

Hola [Nombre],

Tu tiempo en [su empresa] liderando [canal específico] llamó mi atención — particularmente [algo específico que hayan hecho si es visible en el perfil].

Estamos escalando el crecimiento en [tu empresa] — [propuesta de empresa en una oración: "una herramienta SaaS B2B usada por más de 2,000 empresas de logística en Europa"] — y estoy buscando un Gerente de Marketing de Crecimiento para ser propietario de nuestra adquisición pagada y movimiento SEO de principio a fin. Responsabilidad real, no ejecución para una agencia.

¿Tendría sentido una llamada de 20 minutos para ver si hay algo aquí?

[Nombre]

**Objetivo del pipeline:**
- Identificar 80-100 perfiles esta semana
- Enviar 30-40 mensajes de contacto (filtrar por calidad antes de enviar)
- Esperar 6-10 respuestas en 2 semanas
- Pantalla telefónica 5-7, avanzar 2-3 a panel
- Contratar 1 en 6-8 semanas desde el inicio de la búsqueda activa

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
