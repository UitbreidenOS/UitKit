---
name: onboarding-cro
description: "Optimización de incorporación de usuarios: flujos de activación, identificación del momento aha, estados vacíos, secuencias de correo electrónico, listas de verificación in-app — reduce el tiempo para obtener valor y mejora la conversión de prueba"
---

# Onboarding CRO Skill

## Cuándo activar
- Mejorar la conversión de prueba a pagado mediante la corrección del flujo de incorporación
- Identificar y acelerar el "momento aha" para nuevos usuarios
- Diseñar estados vacíos, listas de verificación y nudges in-app
- Escribir secuencias de correo electrónico de incorporación (drip de activación)
- Auditar un embudo de registro a activación para encontrar caídas

## Cuándo NO usar
- Configuración general de análisis de embudos — usa la habilidad analytics-tracking
- Diseño del marco de pruebas A/B — usa la habilidad experiment-designer
- Páginas de destino de marketing — usa la habilidad copywriting
- Adquisición pagada — usa la habilidad paid-ads

## Instrucciones

### Identificar el momento aha

```
Ayúdame a identificar el momento aha para [producto].

Producto: [describe lo que hace]
Propuesta de valor principal: [qué problema resuelve?]
Tipo de usuario: [quiénes son tus mejores clientes?]
Evento de activación actualmente rastreado: [el evento que llamas "activado" — o ninguno]

Marco para encontrar el momento aha:

1. Método de correlación (si tienes datos):
   Observa usuarios que convirtieron a pagado versus los que se fueron.
   ¿Qué acción realizaron los convertidores que los que se fueron no?
   Ejecuta en Mixpanel/Amplitude: "Los usuarios que hicieron X dentro de 7 días tienen Y% retención superior"

2. Método de entrevista (cualitativo):
   Pregunta a 5-10 usuarios de poder: "Cuéntame sobre el momento en que supiste que este producto valía la pena pagar."
   Busca una acción específica, no un sentimiento.

3. Método de lógica de producto (si no hay datos):
   Mapea el viaje del usuario: registro → [paso 1] → [paso 2] → ... → valor
   El momento aha = el primer paso donde el usuario experimenta TU valor principal, no solo configuración.

Patrones comunes del momento aha:
- Slack: envió el primer mensaje en un canal (equipo presente)
- Dropbox: guardó el primer archivo desde múltiples dispositivos (sincronización funcionando)
- Loom: recibió una respuesta en un video grabado (ciclo de valor completo)

Para mi producto, el momento aha es probablemente: [identifica la acción específica]

Define el evento de activación: [usuario completa X dentro de Y días del registro]
```

### Diseño del flujo de incorporación

```
Diseña un flujo de incorporación para [producto].

Tipo de usuario: [solo / equipo / empresa]
Tiempo para el momento aha actualmente: [desconocido / X días / X minutos]
Objetivo: alcanza el momento aha en < [X] minutos para [X]% de usuarios
Método de registro: [correo electrónico / Google OAuth / solo invitación]
Incorporación actual: [ninguna / solo correo electrónico / lista de verificación in-app / recorrido guiado]

Plano de flujo de incorporación:

Paso 1 — Registro sin fricción:
□ Inicio de sesión social preferido (elimina fricción de correo electrónico/contraseña)
□ Recopila solo lo necesario para personalización (no tamaño de empresa para una herramienta solo)
□ Indicador de progreso claro si múltiples pasos

Paso 2 — Pregunta de personalización (máximo 1-2 preguntas):
"¿Para qué usarás principalmente [producto]?" → enruta a estado vacío relevante
Porqué: hace que el producto sea relevante antes de que hayan hecho nada

Paso 3 — Invitación de acción inicial (estado vacío):
□ Muestra UNA cosa a hacer, no cinco
□ Usa verbos de acción: "Crea tu primer X" no "Bienvenido a [producto]"
□ Pré-rellena con un ejemplo para que vean qué se ve bien
□ Ofrece una "demostración rápida" o proyecto de ejemplo para usuarios indecisos

Paso 4 — Entrega del momento aha:
□ La pantalla/momento donde se experimenta el valor principal
□ Celebra con una animación de micro-ganancia o confirmación
□ Superficie siguiente acción inmediatamente (no dejes que el impulso muera)

Paso 5 — Formación de hábitos:
□ Invita a un miembro del equipo (si producto de equipo)
□ Integración de conexión (Slack, GitHub, etc. — el gancho "pegajoso")
□ Establece un recordatorio recurrente o flujo de trabajo

Anti-patrones a evitar:
- Recorridos de funciones (los usuarios los omiten — hazlos hacer, no mirar)
- Pedir tarjeta de crédito antes de que se experimente el valor
- Asistentes de configuración largos antes de que se entregue algún valor

Diseña el flujo para mi producto con copie específico para cada paso.
```

### Secuencia de correo electrónico de incorporación

```
Escribe una secuencia de correo electrónico de incorporación para [producto].

Duración de la prueba: [X días / sin vencimiento]
Definición de activación: [usuario completa X]
Tasa de conversión de usuarios activados: [X%]
Tasa de conversión de usuarios no activados: [X%]
Nombre del remitente: [fundador / equipo de producto / soporte]

Secuencia de correo electrónico:

Correo 1 — Bienvenido (enviar: inmediatamente después del registro):
Asunto: [Llega rápido al momento aha — no "Bienvenido a [Producto]"]
Objetivo: impulsa primer inicio de sesión y primera acción
Contenido: 1 oración sobre lo que pueden hacer hoy + un botón CTA
Largo: < 100 palabras

Correo 2 — Nudge de activación (enviar: Día 2, si no activado):
Asunto: [¿Ya intentaste X?]
Objetivo: elimina el bloqueador que detiene la primera acción
Contenido: nombra la #1 cosa en la que la mayoría de usuarios se quedan atrapados + cómo resolverla
CTA: enlace directo al paso que no han completado

Correo 3 — Prueba social (enviar: Día 3, si no activado):
Asunto: [Cómo [empresa] ahorró [X] usando [producto]]
Objetivo: reavivar la intención con un estudio de caso relevante
Contenido: historia de 3 oraciones del resultado de un usuario similar
CTA: "Ver cómo lo hicieron" → enlace de vuelta al producto

Correo 4 — Destacado de características (enviar: Día 5, si activado):
Asunto: [Has hecho X. Aquí está lo que deberías intentar después.]
Objetivo: profundiza engagement hacia el momento aha o intención de actualización
Contenido: la una característica que convierte usuarios gratuitos en pagados
CTA: intenta la característica con un enlace profundo

Correo 5 — Advertencia de vencimiento de prueba (enviar: Día [trial_length - 3]):
Asunto: [3 días restantes — aquí está lo que perderás]
Objetivo: convertir o extender
Contenido: nombra específicamente a qué pierden acceso
CTA: actualiza ahora + opción "¿Necesitas más tiempo?" de extensión

Correo 6 — Último día (enviar: Día [trial_length]):
Asunto: [Última oportunidad — tu prueba [producto] termina esta noche]
Objetivo: empuje de conversión final
Contenido: oferta más difícil (descuento si presupuesto lo permite), o extiende 7 días
CTA: actualiza + opción "no ahora" que pide comentarios

Escribe cada correo para mi producto. Incluye asunto, texto de vista previa y cuerpo.
```

### Diseño de lista de verificación in-app

```
Diseña una lista de verificación de incorporación para [producto].

Objetivo de la lista: alcanza momento aha / llega al primer valor / completa configuración
Persona de usuario: [describe]
Elementos a completar: [lista los pasos que quieres que los usuarios realicen]
Mecanismo de recompensa: [barra de progreso / celebración / desbloquea una característica]

Principios de diseño de lista de verificación:
1. Máximo 5 elementos — más de 5 se siente como tareas
2. Primer elemento: completable en < 2 minutos (construye impulso)
3. Muestra marcas de verificación conforme se completan elementos (psicología de finalización)
4. El "desbloqueo" sucede en elemento 3-4, no el último elemento (mantenlos comprometidos)
5. Contraer una vez completado, no desaparecer (valor de referencia)

Lista de verificación para mi producto:
□ [Elemento 1] — [X mins] — se completa cuando: [evento disparado]
□ [Elemento 2] — [X mins] — se completa cuando: [evento disparado]
□ [Elemento 3] — [X mins] — desbloquea: [recompensa de característica o contenido]
□ [Elemento 4] — [X mins] — se completa cuando: [evento disparado]
□ [Elemento 5] — [X mins] — finalización: [celebración + solicitud de paso siguiente]

Mensajes de progreso a 0%, 40%, 80%, 100%:
[Escribe 4 mensajes que motiven la finalización]

Copie para cada elemento de lista de verificación (título de tarea + descripción de 1 línea).
```

## Ejemplo

**Usuario:** Nuestro SaaS de gestión de proyectos para equipos de ingeniería tiene una conversión de prueba a pagado del 18%. El momento aha es cuando un equipo completa su primer sprint. Solo el 31% de las pruebas llegan allí. Arregla la incorporación.

**Diagnóstico de Claude:**

31% alcanzar el momento aha es el problema real — no la conversión de 18%. Arregla la activación primero; la conversión sigue.

**Causa raíz:** "Complete a sprint" requiere demasiados requisitos — invitaciones de equipo, configuración de proyecto, tickets creados, sprint iniciado, sprint completado. Son 5 pasos, probablemente distribuidos durante días. La mayoría de iniciadores de prueba solo nunca invitan a su equipo.

**3 cambios con el impacto esperado más alto:**

1. **Cambia temporalmente el evento de activación:** Define "momento aha" como "primer sprint iniciado con 3+ tickets" en lugar de "sprint completado." Eso es alcanzable en 30 minutos, no 2 semanas. Mide la conversión de prueba desde este punto anterior.

2. **Agrega una compuerta de invitación de equipo temprano:** En el día 1, después de crear el primer proyecto, solicita: "Los equipos de ingeniería se mueven 3x más rápido juntos — invita a tu equipo ahora." Hazlo fácil (compartir enlace, no solo correo electrónico). Los no-invitadores son 4x menos propensos a convertir.

3. **Plantilla de sprint pre-construida:** En lugar de proyecto vacío → crear tickets → iniciar sprint, ofrece: "Comienza con nuestra plantilla de sprint de 2 semanas" → 5 tickets de ejemplo pre-rellenos para un equipo típico de ingeniería. Los usuarios pueden editar, no construir desde cero. Reduce el tiempo hasta el primer sprint iniciado de ~3 días a ~15 minutos.

Resultado esperado: elevar la activación del 31% al 50% → mejora estimada de conversión de prueba a pagado de 18% a ~28%.

---
