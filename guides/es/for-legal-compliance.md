# Claude para Oficiales de Legal y Cumplimiento

Todo lo que un abogado interno, Director Legal o Responsable de Cumplimiento necesita para ejecutar revisión de contratos, cumplimiento normativo, programas de privacidad e investigación legal potenciados por IA en Claude Code.

---

## Para quién es esto

Eres asesor legal interno, responsable de cumplimiento, DPO o Director Legal cuyo trabajo es proteger a la empresa de riesgos legales, mantener las operaciones en cumplimiento con las normativas y asesorar a las partes interesadas de forma rápida y precisa. Estás perpetuamente corto de personal en relación con el volumen de trabajo legal, y pasas demasiado tiempo en la clasificación de contratos, recopilación de evidencia e investigación que podría acelerarse.

**Antes de Claude Code:** 60-90 minutos para revisar un NDA estándar. Media jornada para producir un análisis de brechas de cumplimiento. Días para investigar una cuestión legal novedosa en múltiples jurisdicciones. Meses para prepararse para una auditoría SOC2.

**Después:** Revisión inicial de NDA en 5 minutos. Registro de obligaciones de cumplimiento en 20 minutos. Memorando de investigación multi-jurisdiccional en 30 minutos. Lista de verificación de evidencia SOC2 y análisis de brechas en 45 minutos.

**Lo que Claude no reemplaza:** Juicio legal, asesoría legal licenciada, presentaciones judiciales y cualquier documento que se firme y envíe externamente sin revisión humana.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de legal y cumplimiento
npx claudient add skills legal

# O seleccionar individualmente:
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/privacy-pia
npx claudient add skill legal/eu-ai-act
npx claudient add skill legal/iso27001
npx claudient add skill legal/dsar-response
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/legal-research
npx claudient add agents advisors/general-counsel
npx claudient add agents advisors/ciso-advisor
```

---

## Tu stack legal de Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/contract-review` | Análisis de contratos ROJO/AMARILLO/VERDE: señales de riesgo, cláusulas faltantes, sugerencias de corrección | Cada contrato antes de firmar |
| `/nda-review` | Clasificación de NDA: tipo, alcance, señales de alerta, indicador de revisión por abogado | Clasificación de cola de NDA |
| `/gdpr-expert` | Cumplimiento GDPR: análisis artículo por artículo, base legal, requisitos de DPA | Cualquier pregunta sobre GDPR o nueva actividad de tratamiento |
| `/soc2-compliance` | SOC2 Tipo II: mapeo de controles, requisitos de evidencia, análisis de brechas | Preparación para auditoría SOC2 |
| `/privacy-pia` | Evaluación de Impacto en la Privacidad: puntuación de riesgo, mitigación, resultado DPIA | Nuevos productos o tratamiento de alto riesgo |
| `/eu-ai-act` | Ley de IA de la UE: clasificación de riesgo, usos prohibidos, obligaciones de cumplimiento | Cualquier sistema de IA desplegado en la UE |
| `/iso27001` | Análisis de brechas ISO 27001:2022 y guía de implementación | Preparación para certificación ISO |
| `/dsar-response` | Respuesta a Solicitudes de Acceso de Sujetos de Datos: clasificación, guía de redacción, borradores de respuesta | DSARs entrantes |
| `/compliance-tracker` | Registro de obligaciones, lista de verificación de evidencia, seguimiento de plazos para GDPR/SOC2/ISO27001 | Gestión continua del cumplimiento |
| `/legal-research` | Memorandos de investigación legal, resúmenes de jurisprudencia, comparaciones de jurisdicciones | Preguntas de investigación |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `general-counsel` | Opus | Análisis legal complejo, asesoría legal estratégica, cuestiones legales novedosas |
| `ciso-advisor` | Opus | Cuestiones legales relacionadas con seguridad: seguridad de proveedores, respuesta a brechas, interpretación de pruebas de penetración |

---

## Flujo de trabajo diario

### Mañana — Revisión de cola de contratos (30-60 minutos)

**1. Clasificación de contratos**
```
/contract-review

Clasifica la cola de contratos de hoy:
[Pegar texto del contrato o describir cada contrato]

Para cada uno:
- Nivel de riesgo general (ALTO / MEDIO / BAJO)
- Número de problemas ROJOS
- Si necesita asesoría externa
- Acción recomendada: aprobar / negociar / escalar / rechazar

Ordena por prioridad — problemas ROJOS primero.
```

**2. Revisión rápida de NDA**
```
/nda-review

Revisa este NDA — primera revisión estándar:
[Pegar texto del NDA]

Resultado:
- Tipo (mutuo / unilateral)
- Plazo
- Disposiciones no estándar
- ¿Necesito leerlo completamente o es estándar del mercado?
- Enviar a abogado: sí / no
```

---

### Monitoreo de cumplimiento (15-30 minutos, diario)

**3. Radar regulatorio**
```
/compliance-tracker

Verificación diaria de cumplimiento:
- ¿Se recibieron DSARs ayer? ¿Estado del seguimiento de plazos?
- ¿Hay ventanas de notificación de brechas abiertas?
- ¿Plazos de certificación dentro de 30 días?
- ¿Cambios regulatorios que debería conocer esta semana?
[Pegar cualquier nueva comunicación o alerta regulatoria]
```

**4. Gestión de respuestas a DSARs**
```
/dsar-response

Nueva DSAR recibida de: [nombre]
Recibida: [fecha] — respuesta requerida: [fecha + 30 días, o 45 días para CCPA]
Solicitud: [describir qué están solicitando]

Producir:
- Plantilla de carta de acuse de recibo
- Lista de verificación interna de recopilación de datos (qué sistemas consultar)
- Guía de redacción (qué debe eliminarse antes de la divulgación)
- Cronograma de respuesta e hitos
```

---

### Redacción de políticas (variable — 1-3 horas)

**5. Creación o actualización de política**
```
/gdpr-expert

Redacta / actualiza nuestra [tipo de política] para cumplir con el GDPR.

Contexto de la empresa:
- Actividades de tratamiento: [describir]
- Jurisdicción: [UE / Reino Unido / ambas]
- Última actualización: [fecha]
- Qué cambió que requiere actualización: [razón]

Producir: borrador completo de política con citas de artículos. Señala cada disposición que requiera revisión legal antes de la finalización.
```

---

### Investigación legal (variable)

**6. Pregunta de investigación**
```
/legal-research

Pregunta de investigación: [pregunta en lenguaje llano]
Jurisdicción(es): [lista]
Contexto: [por qué necesitamos saberlo — decisión empresarial en juego]
Profundidad: [resumen rápido / memorando estándar / investigación profunda]

Producir un memorando de investigación con citas. Señala [VERIFICAR] en cada cita legal específica.
```

---

### Orientación a partes interesadas (a demanda)

**7. Orientación legal rápida para equipos de negocio**
```
/general-counsel

Una parte interesada del negocio pregunta: [describir la pregunta empresarial]

Necesitan saber: [qué están intentando hacer]
Riesgo que les preocupa: [qué les inquieta]

Dame una respuesta en lenguaje llano que pueda reenviarles en 10 minutos.
Indicador de escalada: ¿esto necesita un memorando legal completo o asesoría externa?
```

---

## Flujo de trabajo de revisión de contratos (cola diaria)

Para un paso a paso detallado, ver [workflows/contract-review.md](../workflows/contract-review.md).

**Referencia rápida:**

```
Prioridad 1 (revisar el mismo día):
- Acuerdos con fecha límite de firma hoy o mañana
- Cualquier contrato con indemnización ilimitada
- Cualquier acuerdo de procesamiento de datos (DPA) para un nuevo proveedor
- NDA con definiciones de alcance no estándar

Prioridad 2 (revisar en 3 días):
- MSAs de proveedores estándar con valor anual inferior a $50K
- Contratos de clientes de nuevo logo (verificación de plantilla)
- Cartas de oferta de empleo

Prioridad 3 (revisar esta semana):
- Renovaciones de acuerdos de proveedores existentes (comparar con términos anteriores)
- Acuerdos de socios (riesgo comercial bajo)
- Políticas o procedimientos internos

Delegar a asesoría externa:
- Cualquier contrato superior a $250K (o tu umbral de materialidad)
- Documentos de litigios, acuerdos de conciliación
- Acuerdos financieros o de salud regulados
- Cesiones de PI, transferencia de tecnología, acuerdos de exclusividad
```

---

## Plan de incorporación de 30 días (nueva contratación legal / cumplimiento)

### Semana 1 — Conoce tu panorama de obligaciones
- Instala todas las habilidades legales: `npx claudient add skills legal`
- Ejecuta `/compliance-tracker` — construye tu registro de obligaciones para cada marco aplicable
- Revisa todos los contratos existentes en tus plantillas estándar — identifica qué es estándar del mercado vs. personalizado
- Identifica DSARs abiertas, notificaciones de brechas o solicitudes de auditoría — ponte al día con los plazos de inmediato
- Lee tu política de privacidad actual y el calendario de retención de datos — ¿coinciden con la práctica real?

### Semana 2 — Construye la línea base de cumplimiento
- Ejecuta `/gdpr-expert` en tus actividades de tratamiento actuales — produce o actualiza tu RoPA (Registro de Actividades de Tratamiento)
- Ejecuta `/soc2-compliance` o `/iso27001` — produce un análisis de brechas para tus marcos objetivo
- Mapea qué proveedores son procesadores de datos (necesitan DPAs) vs. responsables (análisis separado)
- Produce un registro de riesgos: ¿cuáles son los 5 principales riesgos legales que enfrenta este negocio ahora mismo?

### Semana 3 — Operacionaliza
- Configura tu flujo de trabajo de respuesta a DSARs usando `/dsar-response`
- Construye guías de contratos para tus 3 tipos de contratos más comunes (MSA de proveedor, MSA de cliente, NDA)
- Configura tu seguidor de plazos de cumplimiento con `/compliance-tracker`
- Informa a las partes interesadas del negocio sobre qué pueden y no pueden hacer sin revisión legal

### Semana 4 — Gestión proactiva de riesgos
- Produce tu primer informe de riesgos legales para el CEO y el directorio
- Ejecuta `/privacy-pia` en cualquier función de nuevo producto en desarrollo
- Programa revisiones de acceso trimestrales (trabajando con TI/Seguridad)
- Configura tu calendario de cumplimiento recurrente: plazos mensuales, trimestrales y anuales

---

## Integraciones de herramientas

### Thomson Reuters / Westlaw / LexisNexis

```
Usa bases de datos legales primarias para la validación de investigaciones.
Flujo de trabajo:
1. Usa /legal-research para identificar la cuestión legal y la ruta de investigación
2. Valida citas específicas en Westlaw o LexisNexis
3. Pega las resoluciones de casos verificadas de vuelta en Claude para análisis y redacción de memorandos
4. Usa Claude para escribir el memorando; usa Westlaw para asegurarte de que las citas estén actualizadas

NO dependas de las citas de Claude como autoritativas sin verificación en la base de datos primaria.
```

### Sistemas de gestión de contratos (Ironclad / DocuSign / Juro)

```
Flujo de trabajo para revisión de contratos con un CLM:
1. Nuevo contrato llega a tu CLM
2. Exportar como PDF/texto
3. Ejecutar /contract-review — obtener análisis ROJO/AMARILLO/VERDE
4. Agregar notas de revisión y tachaduras directamente en el CLM
5. Usar Claude para generar explicaciones de tachaduras para la contraparte

Para revisión masiva (exportación de datos de Ironclad):
1. Exportar metadatos de contratos como CSV
2. /contract-review: "Revisa este lote de contratos para identificar DPAs vencidas o cláusulas GDPR faltantes"
```

### Plataformas GRC (Vanta / Drata / Secureframe)

```
Usa Claude junto con tu plataforma GRC, no en lugar de ella:

Fortalezas de Claude: redacción de documentación de políticas, explicación de requisitos, análisis de brechas, comentarios de gestión
Fortalezas de la plataforma GRC: recopilación automatizada de evidencia, monitoreo continuo, portal para auditores

Flujo de trabajo:
1. La plataforma GRC señala una brecha de control
2. /compliance-tracker: explica el requisito del control y sugiere un enfoque de remediación
3. /gdpr-expert o /soc2-compliance: redacta la política o procedimiento para cerrar la brecha
4. Sube la política a la plataforma GRC como evidencia
```

### Notion / Confluence (base de conocimiento legal)

```
Construye tu base de conocimiento legal en Notion o Confluence:
1. Usa /legal-research para producir memorandos de investigación
2. Guarda memorandos en Notion con etiquetas: [jurisdicción] [tema] [fecha]
3. Cada memorando incluye: pregunta, respuesta, citas clave, marcadores [VERIFICAR] y fecha de revisión

Configura un recordatorio trimestral para revisar y actualizar los memorandos de alto tráfico.
Con el tiempo, esto se convierte en la biblioteca de precedentes de tu empresa.
```

### Slack (recepción de solicitudes legales)

```
Configura un canal de Slack #solicitudes-legales.
Claude Code puede monitorear y clasificar mediante un webhook:

Solicitud entrante → Claude lee el mensaje → clasifica:
  - Orientación rápida (respuesta en < 5 min): responder inmediatamente
  - Revisión estándar (contrato, NDA): enrutar a la cola legal
  - Complejo / novedoso: señalar para atención del Director Legal
  - Urgente (brecha, litigios): escalada inmediata

Usa n8n o Make para automatizar el enrutamiento.
```

---

## Referencias a seguir

| Métrica | Objetivo |
|---|---|
| Tiempo de primera revisión de NDA | <10 minutos |
| Tiempo de revisión de contrato estándar (MSA) | <45 minutos |
| Acuse de recibo de DSAR | El mismo día de recepción |
| Respuesta a DSAR | Dentro de 25 días (dejar 5 días de margen antes del plazo de 30 días) |
| Preparación de notificación de brecha | Plantilla pre-construida, lista para enviar en 2 horas |
| Brechas de cumplimiento abiertas (críticas) | 0 |
| Brechas de cumplimiento abiertas (no críticas) | <5, todas con responsable + plazo |
| Cobertura de DPA de proveedores | 100% de los procesadores de datos |
| Ciclo de revisión de políticas | Anual (todas las políticas revisadas y aprobadas) |
| Informe de riesgo legal al directorio | Trimestral |

---

## Errores comunes (y cómo Claude Code ayuda a evitarlos)

**Error 1: Tratar todos los contratos como igualmente riesgosos**
`/contract-review` da una puntuación de riesgo general (ALTO / MEDIO / BAJO) de inmediato. Clasifica primero, revisa proporcionalmente.

**Error 2: Los marcos de cumplimiento como proyectos únicos**
`/compliance-tracker` convierte el cumplimiento en un registro de obligaciones continuo con plazos — no una auditoría única.

**Error 3: Investigación legal sin validación de citas**
Cada resultado de `/legal-research` incluye marcadores `[VERIFICAR]`. Son indicaciones para verificar la fuente primaria — no son opcionales.

**Error 4: Sin rastro de auditoría para respuestas a DSARs**
`/dsar-response` genera un rastro de evidencia para cada solicitud: fecha de recepción, plazo, datos recopilados, redacciones realizadas.

**Error 5: Dar orientación sin documentarla**
Usa Claude para redactar memorandos legales incluso para preguntas de orientación rápida. Una respuesta verbal de 2 frases no es descubrible. Un breve memorando sí lo es.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Flujo de trabajo de revisión de contratos](../workflows/contract-review.md)
- [Habilidad de experto en GDPR](../skills/legal/gdpr-expert.md)
- [Habilidad de revisión de contratos](../skills/legal/contract-review.md)
- [Habilidad de seguimiento de cumplimiento](../skills/legal/compliance-tracker.md)
- [Habilidad de investigación legal](../skills/legal/legal-research.md)
- [Habilidad de respuesta a DSAR](../skills/legal/dsar-response.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
