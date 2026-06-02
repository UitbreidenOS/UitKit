---
name: exec-briefing
description: "Documento de informe ejecutivo: contexto de la reunión, antecedentes de los asistentes, agenda, puntos de conversación, resultados deseados y materiales de lectura previa — para que el ejecutivo entre preparado"
---

# Habilidad: Informe Ejecutivo

## Cuándo activar
- El ejecutivo tiene una reunión de alto impacto en las próximas 24-48 horas y necesita prepararse
- Se acerca una reunión del consejo, reunión con inversores, EBC (centro de briefing ejecutivo) de clientes, o cumbre de socios
- El ejecutivo se va a reunir con alguien importante por primera vez y necesita contexto sobre quién es esa persona
- Un briefing político o de analistas requiere investigación de antecedentes antes de que el ejecutivo pueda ser creíble
- Cualquier reunión donde "improvisar" sería un error

## Cuándo NO usar
- Reuniones internas rutinarias con personas que el ejecutivo conoce bien — es excesivo
- Briefings que requieren información clasificada o propietaria a la que no tienes acceso — solo puedes trabajar con lo que se proporciona
- Preparación en tiempo real en la sala — este es un documento de preparación, no un asistente en vivo

## Instrucciones

### Prompt completo de informe ejecutivo

```
Genera un documento de informe ejecutivo para una reunión próxima.

EJECUTIVO: [nombre, título]
REUNIÓN: [nombre o propósito de la reunión]
FECHA/HORA: [fecha, hora, zona horaria]
DURACIÓN: [X minutos]
FORMATO: [presencial / video / teléfono]
UBICACIÓN: [si es presencial: lugar, sala; si es virtual: plataforma]

ASISTENTES (proporcionar para cada uno):
- [Nombre], [Título], [Empresa/Organización]
  Antecedentes: [hechos relevantes — roles anteriores, puntos de vista conocidos, relación con el ejecutivo, cualquier historial]
  Por qué están en esta reunión: [su participación en el resultado]

PROPÓSITO DE LA REUNIÓN:
- La agenda declarada: [qué está en la invitación del calendario]
- El propósito real: [qué necesita suceder o decidirse en realidad]
- Quién convocó esta reunión y por qué: [contexto]

CONTEXTO E HISTORIAL:
[Cualquier historial relevante entre las partes — acuerdos previos, disputas, relaciones, obligaciones]

MATERIALES DISPONIBLES:
[Lista cualquier documento que el ejecutivo debería haber leído — puedes resumirlos a continuación o ya los leyeron]

RESULTADOS DESEADOS (priorizados):
1. [Resultado primario — ¿cómo se ve el éxito?]
2. [Resultado secundario]
3. [Alternativa aceptable si el primario no es alcanzable]

LO QUE ESTAMOS PIDIENDO (si aplica):
[Solicitud específica, compromiso o decisión necesaria de los asistentes]

LO QUE ELLOS QUIEREN DE NOSOTROS (si se conoce):
[Lo que la otra parte espera obtener de esta reunión]

Genera el documento de informe con:
1. Resumen de la reunión (1 párrafo)
2. Perfiles de asistentes (1 párrafo corto por persona)
3. Contexto e historial
4. Agenda sugerida (con tiempos)
5. Puntos de conversación (3-5 por tema clave)
6. Preguntas clave a hacer
7. Qué NO decir o comprometerse
8. Resultados deseados
9. Próximos pasos a proponer al final
```

---

### Prompt de investigación de antecedentes de asistentes

```
Construye perfiles de asistentes para una reunión ejecutiva.

ASISTENTES:
[Para cada persona: nombre, título, empresa, URL de LinkedIn si está disponible, cualquier otra fuente]

Para cada asistente, investigar y compilar:

ANTECEDENTES PROFESIONALES:
- Rol actual y tiempo en él
- Empresas y roles anteriores (especialmente cualquiera que conecte con el mundo de nuestro ejecutivo)
- Formación académica (relevante, no exhaustiva)
- Cualquier escritura pública, discursos o posiciones tomadas que sean relevantes

RELACIÓN CON NOSOTROS:
- Interacciones previas con nuestro ejecutivo o empresa (si las hay)
- Cómo llegaron a esta reunión
- Su participación en el resultado

PUNTOS DE VISTA Y PRIORIDADES CONOCIDOS:
[Basado en declaraciones públicas, artículos o cualquier información — ¿qué les importa?]

SENSIBILIDADES POTENCIALES:
[Cualquier cosa con la que nuestro ejecutivo deba tener cuidado — relaciones con competidores, conflictos pasados, consideraciones culturales]

INICIO DE CONVERSACIÓN:
[Una línea de apertura natural y genuina que el ejecutivo puede usar y que demuestre que hizo su tarea]
```

---

### Informe para reunión del consejo

```
Genera un informe de reunión del consejo para el ejecutivo.

EMPRESA: [nombre]
FECHA DE REUNIÓN DEL CONSEJO: [fecha]
ROL DEL EJECUTIVO: [CEO / CFO / gerente que presenta]

MIEMBROS DEL CONSEJO:
[Listar todos los miembros del consejo con empresa/fondo, tiempo en el consejo y cualquier área de enfoque conocida]

AGENDA DE LA REUNIÓN:
[Pegar agenda]

TEMAS CLAVE QUE REQUIEREN PREPARACIÓN:
[Para cada punto de agenda que requiera que el ejecutivo presente o responda preguntas:]

Tema: [nombre]
Puntos de conversación del ejecutivo: [mensajes clave que quieren transmitir]
Datos que tener listos: [números específicos o diapositivas para referenciar]
Preguntas difíciles probables: [en qué presionará el consejo]
Respuestas a preguntas difíciles: [respuestas borrador]
Líneas rojas: [a qué NO comprometerse en la sala]

DINÁMICA DEL CONSEJO:
[Cualquier tensión, alineación o dinámica que el ejecutivo deba conocer antes de entrar]

Genera un documento de preparación previa al consejo que el ejecutivo pueda revisar la noche anterior.
```

---

### Informe para reunión con inversores

```
Genera un informe para una reunión con inversores.

TIPO DE REUNIÓN: [primera reunión / seguimiento / actualización a LP / presentación a co-inversor / nuevo lead potencial]
INVERSOR: [nombre, título, empresa]

PERFIL DE LA FIRMA:
- Tamaño del fondo y enfoque de etapa: [X]
- Empresas en cartera: [las relevantes que conocer — especialmente competidoras o adyacentes]
- Tesis o áreas de enfoque conocidas: [en qué invierten típicamente]
- Anuncios recientes: [cualquier salida de cartera, nuevo fondo, nuevos socios]

PERFIL DEL CONTACTO:
- [Nombre]: [antecedentes, cartera previa, cualquier cosa que hayan dicho públicamente sobre nuestro espacio]
- Fuente de referencia: [quién los presentó y por qué]

CONTEXTO DE NUESTRA EMPRESA:
- Etapa actual: [semilla / Serie A / crecimiento]
- Noticias recientes con las que liderar: [cualquier hito, cliente, lanzamiento de producto]
- Métricas que tener listas: [ARR, crecimiento, NRR, quema, pista]
- Lo que estamos recaudando: $[X] a $[X]M pre-money
- Por qué ahora: [nuestra narrativa de timing]

LO QUE QUEREMOS DE ESTA REUNIÓN:
[Próxima reunión / term sheet / presentación a empresa de su cartera / solo construir relación]

LO QUE PODRÍAN PREGUNTAR:
[Probables preguntas de inversores y respuestas sugeridas]

Genera el informe para la reunión con inversores.
```

---

### Informe para reunión gubernamental / de política

```
Genera un informe para una reunión gubernamental o de política.

REUNIÓN: [tipo — briefing al congreso / reunión con agencia reguladora / mesa redonda de política]
FECHA: [fecha]
REPRESENTANTES GUBERNAMENTALES ASISTENTES:
[Nombre, título, oficina/agencia, asignaciones de comités si es relevante]

NUESTRA POSICIÓN:
- Por qué abogamos: [posición de política]
- Nuestra justificación de negocio: [por qué esto nos importa]
- Las partes interesadas que representamos (si aplica): [clientes, industria, comunidades]
- Nuestra solicitud: [acción legislativa o regulatoria específica]

INVESTIGACIÓN DE ANTECEDENTES:
- El problema: [breve resumen del contexto de política]
- Estado actual: [dónde está esto en el proceso legislativo/regulatorio]
- Argumentos clave de la oposición: [quién no está de acuerdo y por qué]
- Nuestra refutación a la oposición principal: [nuestros contraargumentos]

PROTOCOLO Y TONO:
[Cualquier nota de protocolo — títulos, decoro, reglas de regalos, restricciones de fotografía]

Genera el informe con contexto de política, perfiles de asistentes, puntos de conversación y preparación de preguntas y respuestas.
```

---

### Marco de puntos de conversación

```
Escribe puntos de conversación para [ejecutivo] sobre [tema] para una reunión con [audiencia].

CONTEXTO:
- Por qué este tema está en la agenda: [antecedentes]
- Lo que la audiencia ya sabe: [su nivel de familiaridad]
- Lo que queremos comunicar: [nuestros mensajes clave]
- Lo que queremos evitar: [temas sensibles, compromisos prematuros]

FORMATO DE PUNTOS DE CONVERSACIÓN:
Genera 5 puntos de conversación. Para cada uno:
- Titular: [el punto en una oración]
- Evidencia o ejemplo de apoyo: [hecho específico, historia de cliente o dato]
- Transición: [cómo pasar al siguiente punto o responder una pregunta de seguimiento]

Tono: [formal / conversacional / técnico / apropiado para el consejo]
Lenguaje: Usar lenguaje claro. Sin palabras de moda. El ejecutivo debería poder decir estos de forma natural.
```

---

### Lista de líneas rojas — qué NO comprometerse

```
Genera una lista de líneas rojas para [ejecutivo] que va a [reunión].

Contexto de la reunión: [qué se está discutiendo]

Basándose en la agenda de la reunión y nuestra situación actual, identificar:

COSAS A LAS QUE NO COMPROMETERSE SIN APROBACIÓN DEL CONSEJO:
[Decisiones que requieren aprobación del consejo — típicamente: M&A, acciones, grandes asociaciones, cambios de precios]

COSAS QUE NO DISCUTIR (legalmente sensibles):
[Cualquier cosa en litigación activa, revisión regulatoria o que podría crear responsabilidad]

COSAS A DESVIAR (no listo para divulgar):
[Anuncios próximos, productos en desarrollo, negociaciones no divulgadas]

CÓMO DESVIAR CON ELEGANCIA:
Para cada línea roja: escribe una desviación profesional que no dañe la relación.
"Eso es algo en lo que estamos trabajando activamente — me encantaría hacer un seguimiento una vez que tengamos una imagen más clara."
```

---

### Formato del documento de informe

```markdown
# Informe Ejecutivo
**Reunión:** [Nombre de la reunión]
**Fecha:** [Fecha y hora]
**Preparado para:** [Nombre del ejecutivo]
**Preparado por:** [Tu nombre]

---

## Resumen de la Reunión

[Un párrafo: quién, qué, por qué, cómo se ve el éxito]

---

## Asistentes

### [Nombre], [Título], [Empresa]
[2-3 oraciones: antecedentes, relación, por qué están aquí, una cosa que saber sobre ellos]

### [Nombre]
[Mismo formato]

---

## Contexto e Historial

[Antecedentes relevantes — interacciones previas, historial de la relación, qué nos trajo a esta reunión]

---

## Agenda Sugerida

| Tiempo | Tema | Responsable | Objetivo |
|---|---|---|---|
| 0:00 | Presentaciones | [Anfitrión] | Calentar el ambiente |
| 0:05 | [Tema 1] | [Nombre] | [Objetivo] |
| 0:20 | [Tema 2] | [Nombre] | [Objetivo] |
| 0:40 | Preguntas | Todos | Responder preguntas |
| 0:50 | Próximos pasos | [Anfitrión] | Confirmar acciones |

---

## Puntos de Conversación

### Sobre [Tema 1]
- [Punto 1]
- [Punto 2]
- [Punto 3]

### Sobre [Tema 2]
- [Punto 1]
- [Punto 2]

---

## Preguntas a Hacer

1. [Pregunta que avanza tu objetivo]
2. [Pregunta que revela las prioridades reales de la otra parte]
3. [Pregunta que pone a prueba el compromiso o la seriedad]

---

## Qué NO Comprometerse

- [Elemento 1] — requiere aprobación del consejo
- [Elemento 2] — legalmente sensible / en revisión activa
- [Elemento 3] — prematuro para discutir

---

## Resultados Deseados

1. [Resultado primario]
2. [Resultado secundario]
3. [Alternativa aceptable]

---

## Próximos Pasos Propuestos

Al final de la reunión, proponer:
- [Acción de seguimiento específica] para [fecha]
- [Quién hace qué]
- [Cuándo reunirse de nuevo, si aplica]

---

## Apéndice: Lectura de Antecedentes

[Enlaces o resúmenes de documentos relevantes, artículos o notas de reuniones previas]
```

## Ejemplo

**Usuario:** Nuestro CEO se reúne con la nueva VP de Adquisiciones de una empresa Fortune 500 que ha sido cliente durante 2 años. La VP comenzó hace 6 semanas. Objetivo: mantener la relación y explorar la expansión del contrato de $200K a $500K anuales. Reunión de 45 minutos.

**Salida esperada:** Informe completo — perfil de asistente investigando a la nueva VP (LinkedIn, antecedentes de empresa anterior, en qué se enfocó en su último rol), puntos de conversación sobre por qué este es el momento correcto para expandir (datos de uso, nuevos casos de uso desbloqueados en los últimos 6 meses, evidencia de ROI), pregunta clave a hacer ("¿Qué haría que esta asociación fuera un claro éxito en tus primeros 90 días?"), qué NO comprometerse (cambios de precios sin aprobación de finanzas, desarrollo personalizado) y próximos pasos propuestos (demostración del producto con su equipo en 2 semanas, llamada de presentación del patrocinador ejecutivo).

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
