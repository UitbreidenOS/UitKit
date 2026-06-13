---
name: gdpr-expert
description: "Cumplimiento de RGPD: escaneo de riesgo de privacidad del código, generación de EIPD (art. 35), gestión de derechos de los interesados (art. 15-22), evaluación de base legítima y acuerdos de procesador de datos"
---

# Habilidad Experto en RGPD

## Cuándo activar
- Análisis de una base de código o sistema para riesgos de cumplimiento de RGPD
- Generación de una Evaluación de Impacto relativa a la Protección de Datos (EIPD) bajo Artículo 35
- Gestión de solicitudes de derechos de los interesados (acceso, supresión, portabilidad, objeción)
- Evaluación de la base legítima para una actividad de procesamiento de datos
- Revisión de un Acuerdo de Tratamiento de Datos (ATD) con un proveedor
- Preparación para una auditoría de RGPD o investigación regulatoria

## Cuándo NO usar
- Banners de consentimiento de cookies — la implementación es una tarea de desarrollo, usar documentación de biblioteca
- Cumplimiento solo de CCPA (EE.UU.) — esta habilidad se enfoca en RGPD; muchos principios se superponen pero las reglas difieren
- Cumplimiento de HIPAA — marco diferente, usar un especialista
- Reemplazar el asesoramiento del Delegado de Protección de Datos (DPD) calificado en situaciones nuevas o de alto riesgo

## Instrucciones

### Escaneo de riesgo de privacidad

```
Analizar este sistema para riesgos de cumplimiento de RGPD.

Descripción del sistema: [describir qué hace el sistema, qué datos procesa]
Pila tecnológica: [lenguajes, marcos, bases de datos]
Categorías de datos procesados: [enumerar — correo electrónico, nombre, IP, ubicación, salud, financiero, biométrico]
Usuarios: [¿Residentes de la UE? ¿B2B? ¿B2C?]

Lista de verificación de riesgo de RGPD por categoría:

IDENTIFICACIÓN DE DATOS PERSONALES:
□ ¿Qué datos personales se recopilan? (nombre, correo electrónico, IP, ID de dispositivo, ubicación, datos de comportamiento)
□ ¿Qué datos de categorías especiales se procesan? (salud, biométrico, político, religioso, orientación sexual)
□ ¿Todos los datos recopilados son realmente necesarios? (minimización de datos — Artículo 5(1)(c))

BASE LEGÍTIMA (Artículo 6):
Para cada actividad de procesamiento, identifique la base legítima:
- Consentimiento (Art. 6(1)(a)): libremente dado, específico, informado, inequívoco — no incluido en condiciones
- Contrato (Art. 6(1)(b)): procesamiento necesario para ejecutar un contrato con el interesado
- Obligación legal (Art. 6(1)(c)): requerido por la ley de la UE/Estado miembro
- Interés legítimo (Art. 6(1)(f)): debe pasar una prueba de evaluación de interés legítimo de 3 partes — no es una solución general
🔴 Bandera roja: usar « interés legítimo » sin una evaluación documentada de interés legítimo

GESTIÓN DEL CONSENTIMIENTO:
□ ¿Se obtiene el consentimiento antes de recopilar datos (no después)?
□ ¿Es granular el consentimiento (separado para cada propósito)?
□ ¿Pueden los usuarios retirar su consentimiento tan fácilmente como lo dieron?
□ ¿Se mantiene un registro de consentimiento con marca de tiempo y versión?

RETENCIÓN DE DATOS:
□ ¿Existe una política de retención documentada por categoría de datos?
□ ¿Se eliminan o anonimatizan automáticamente los datos después del período de retención?
🔴 Bandera roja: « conservamos datos indefinidamente » o « hasta que el usuario elimine su cuenta »

SEGURIDAD (Artículo 32):
□ ¿Se cifran los datos personales en reposo y en tránsito?
□ Controles de acceso: ¿solo el personal autorizado puede acceder a datos personales?
□ ¿Se registran innecesariamente los datos personales (registros de depuración que contienen PII)?
□ ¿Seudonimización implementada donde es posible?

PROCESADORES DE DATOS (Artículo 28):
□ ¿Existe un ATD firmado con cada proveedor que procesa datos personales?
□ ¿Sub-procesadores enumerados y aprobados?
□ ¿Proveedor en un tercer país? ¿Cláusulas Contractuales Tipo (CCT) implementadas?

NOTIFICACIÓN DE VIOLACIÓN (Artículo 33-34):
□ ¿Puede detectar una violación de datos dentro de 72 horas?
□ ¿Existe un proceso de notificación de violación documentado?
□ ¿Quién es responsable de notificar a la autoridad supervisora?

Resultado: registro de riesgos con referencia de artículo, gravedad (🔴/🟡/🟢) y corrección recomendada.
```

### Generación de EIPD (Artículo 35)

```
Generar una Evaluación de Impacto relativa a la Protección de Datos para [actividad de procesamiento].

Actividad de procesamiento: [describir — por ejemplo « sistema de monitoreo de empleados basado en IA », « segmentación publicitaria conductual »]
Responsable del tratamiento: [nombre de la organización]
DPD (si se designa): [nombre o « ninguno designado »]
Propósito: [por qué procesa los datos]
Categorías de datos: [enumerar]
Destinatarios: [con quién se comparten los datos]
Transferencias a países terceros: [sí/no — dónde]

EIPD requerido (Art. 35(3)) cuando el procesamiento es probable resulte en RIESGO ALTO:
□ Perfilado sistemático y extenso con efectos significativos en personas
□ Procesamiento a gran escala de categorías especiales de datos (Art. 9) o datos penales (Art. 10)
□ Monitoreo sistemático de áreas públicamente accesibles

WP29 / EDPB añade 9 criterios — EIPD requerido si 2+ aplican:
□ Evaluación o puntuación (perfilado, puntuación crediticia)
□ Toma de decisiones automatizada con efectos legales o igualmente significativos
□ Monitoreo sistemático
□ Datos sensibles o altamente personales
□ Datos procesados a gran escala
□ Conjuntos de datos emparejados o combinados
□ Datos sobre personas vulnerables (niños, empleados, pacientes)
□ Uso innovador o nuevas soluciones tecnológicas u organizacionales
□ El procesamiento impide que los interesados ejerzan un derecho o utilicen un servicio

Estructura de EIPD:

1. DESCRIPCIÓN DEL PROCESAMIENTO:
   - Propósitos y base legítima
   - Categorías de datos e interesados
   - Flujos de datos (recopilación → procesamiento → almacenamiento → eliminación)
   - Procesadores y sub-procesadores involucrados
   - Períodos de retención

2. NECESIDAD Y PROPORCIONALIDAD:
   - ¿Es el procesamiento necesario para el propósito declarado?
   - ¿Podría el mismo propósito lograrse con menos datos?
   - ¿Es la base legítima elegida apropiada?

3. EVALUACIÓN DE RIESGOS:
   | Riesgo | Probabilidad | Gravedad | Riesgo residual después de controles |
   |---|---|---|---|
   | Acceso no autorizado a datos personales | Medio | Alto | Bajo (cifrado + controles de acceso) |
   | Violación de datos que afecta a gran número de individuos | Bajo | Muy alto | Bajo (detección de violación + plan de notificación 72h) |
   | Perfilado que conduce a discriminación | Medio | Alto | Medio — requiere monitoreo |

4. MEDIDAS PARA ABORDRAR RIESGOS:
   - Medidas técnicas: [cifrado, seudonimización, controles de acceso]
   - Medidas organizacionales: [capacitación, políticas, contratos ATD]
   - Privacidad por diseño: [minimización de datos, limitación de propósito integrada en arquitectura]

5. CONSULTA DEL DPD:
   [Revisión y aprobación del DPD, o motivo por el cual DPD no fue consultado]

6. CONSULTA DE AUTORIDAD SUPERVISORA:
   Requerido bajo Art. 36 si el riesgo residual sigue siendo ALTO después de todas las medidas.
   [Decisión: consultar / no requerido — motivo]

Generar la EIPD para mi actividad de procesamiento.
[REVISIÓN LEGAL REQUERIDA: DPD o asesoramiento calificado en privacidad debe revisar antes de finalizar]
```

### Gestor de derechos de interesados

```
Manejar una solicitud de derechos de interesados bajo Artículos 15-22 de RGPD.

Tipo de solicitud:
- Artículo 15: Derecho de acceso (SAR — Solicitud de Acceso del Interesado)
- Artículo 16: Derecho de rectificación
- Artículo 17: Derecho al olvido (« derecho a ser olvidado »)
- Artículo 18: Derecho a la limitación del procesamiento
- Artículo 20: Derecho a la portabilidad de datos
- Artículo 21: Derecho de objeción
- Artículo 22: Derecho a no estar sujeto a decisiones automatizadas

Solicitante: [nombre, correo electrónico o referencia]
Fecha recibida: [fecha — respuesta vencida dentro de 30 días, extensible a 90 para casos complejos]
Identidad verificada: [sí / no — no procesar hasta confirmar identidad]

Flujo de trabajo de respuesta:

PASO 1 — Registrar y confirmar (dentro de 72 horas):
« Hemos recibido su solicitud bajo [Artículo X] del RGPD. Responderemos dentro de 30 días. Su número de referencia es DSR-[AAAA-MM-DD-NNN]. »

PASO 2 — Verificar identidad:
No revelar datos personales o confirmar eliminación sin verificación de identidad.
Aceptable: ID gubernamental, verificación de cuenta, preguntas de seguridad.
En caso de duda: solicitar verificación adicional (Art. 12(6) lo permite).

PASO 3 — Procesar la solicitud:
Para Artículo 15 (acceso): compilar todos los datos personales mantenidos, incluyendo:
  - Categorías de datos mantenidos
  - Propósitos del procesamiento
  - Destinatarios y transferencias a países terceros
  - Período de retención
  - Fuente de datos (si no es directamente del interesado)
  - Existencia de toma de decisiones automatizada

Para Artículo 17 (eliminación): eliminar de:
  - Base de datos primaria
  - Copias de seguridad (dentro de plazo razonable — anotar cronograma de eliminación de copias de seguridad)
  - Procesadores de terceros (notificar por escrito)
  - Anonimizar si la eliminación es técnicamente imposible
  
  Excepciones — eliminación NO requerida si el procesamiento es necesario para:
  - Obligación legal o reclamaciones legales
  - Libertad de expresión e información
  - Archivo de interés público

Para Artículo 20 (portabilidad): exportar datos en formato legible por máquina (JSON, CSV).
  Aplica solo a: datos proporcionados por el interesado + procesados en base de consentimiento o contrato.

PASO 4 — Documentar la respuesta:
Registro: fecha de solicitud, tipo, verificación de identidad, acciones tomadas, fecha de respuesta, exenciones reclamadas.

PASO 5 — Responder dentro de 30 días:
Si es imposible actuar: notificar al solicitante con motivo (puede extender a 90 días con notificación).
Si es manifestamente infundada o excesiva: puede cobrar una tarifa razonable o rechazar (documentar razones).

Redacte la respuesta para mi tipo de solicitud específico.
```

### Evaluación de base legítima

```
Evaluar la base legítima para [actividad de procesamiento].

Actividad de procesamiento: [describir precisamente — qué datos, qué propósito, qué resultado]
Interesados: [consumidores / empleados / contactos B2B / menores]
Relación con interesados: [cliente / empleado / prospecto / público]

Opciones de base legítima bajo Artículo 6:

CONSENTIMIENTO (Art. 6(1)(a)):
Condiciones: libremente dado, específico, informado, inequívoco, separado de otros términos
Mejor para: suscripciones a boletín, cookies no esenciales, comunicaciones de marketing
Debilidad: puede retirarse en cualquier momento → el procesamiento debe detenerse
🔴 No válido si: vinculado al contrato, casillas preseleccionadas, condicionado a acceso de servicios

CONTRATO (Art. 6(1)(b)):
Condiciones: procesamiento estrictamente necesario para ejecutar un contrato CON el interesado
Mejor para: procesamiento de orden del cliente, entrega de servicio pagado
🔴 No válido para: marketing a clientes existentes, análisis, prevención de fraude

OBLIGACIÓN LEGAL (Art. 6(1)(c)):
Condiciones: la ley de la UE o Estado miembro requiere el procesamiento
Mejor para: registros fiscales, requisitos de derecho laboral, AML/KYC
🔴 Debe citar la ley específica — « estamos obligados legalmente » es insuficiente

INTERESES VITALES (Art. 6(1)(d)):
Condiciones: proteger la vida del interesado u otra persona
Solo último recurso — casi nunca aplicable al procesamiento comercial

TAREA PÚBLICA (Art. 6(1)(e)):
Para autoridades públicas y quienes realizan funciones públicas. Rara vez aplicable a empresas privadas.

INTERÉS LEGÍTIMO (Art. 6(1)(f)):
Condiciones: la prueba de evaluación de interés legítimo de tres partes debe pasar:
  1. Prueba de propósito: ¿es el interés legítimo?
  2. Prueba de necesidad: ¿es el procesamiento necesario para ese interés?
  3. Prueba de equilibrio: ¿los intereses superan los derechos del interesado?

Mejor para: prevención de fraude, seguridad de red, marketing B2B, transferencias intra-grupo
🔴 NO PUEDE usarse: por autoridades públicas; cuando derechos fundamentales prevalecen; para monitoreo de empleados

Para mi actividad, evalúe qué base aplica e identifique cualquier debilidad.
[REVISIÓN LEGAL REQUERIDA antes de confiar en la evaluación]
```

## Ejemplo

**Usuario:** Estamos construyendo un producto SaaS que usa IA para analizar patrones de comportamiento de usuarios y puntuación de salud de clientes para nuestros clientes B2B. Los datos de sus usuarios finales fluyen a través de nuestro sistema. ¿Cuál es nuestra exposición de RGPD?

**Análisis de Claude:**

Usted es un **procesador de datos** (Artículo 4(8)) — sus clientes B2B son los responsables. Esto tiene implicaciones inmediatas:

**Sus obligaciones como procesador (Artículo 28):**
- ATD firmado con cada cliente B2B antes de procesar los datos de sus usuarios
- Procesar datos solo según instrucciones documentadas de cada responsable
- Implementar medidas de seguridad técnicas y organizacionales apropiadas
- Apoyar a los responsables en el cumplimiento de sus obligaciones de RGPD (SAR, EIPD, notificación de violaciones)
- Eliminar o devolver todos los datos al término del contrato

**Verificación de activación de EIPD:**
Su sistema de puntuación de comportamiento basado en IA probablemente activa el requisito de EIPD porque combina:
- Evaluación/perfilado sistemático de individuos (criterio WP29 1)
- Tecnología innovadora (puntuación basada en IA) (criterio WP29 9)
- Potencialmente a gran escala (si los clientes B2B tienen muchos usuarios finales)

Los responsables (sus clientes B2B) son responsables de la EIPD — pero necesitarán su documentación técnica sobre cómo funciona la IA para completarla. Preparar de manera proactiva un documento « contribución del procesador a EIPD ».

**Áreas de riesgo más alto para usted:**
1. 🔴 Cadena de sub-procesadores — cada herramienta que use para ejecutar la IA (AWS, plataforma ML, monitoreo) es sub-procesadores. Enumérelos todos. Su ATD debe nombrarlos o describir el proceso de aprobación.
2. 🔴 Transferencias a países terceros — si sus servidores o infraestructura ML están en los EE.UU., necesita CCT o confiar en el Marco de Privacidad de Datos UE-EE.UU.
3. 🟡 Transparencia — los usuarios finales probablemente no saben que su comportamiento está siendo puntuado. Sus clientes (responsables) deben decírselo.

---
