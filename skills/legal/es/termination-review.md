---
name: termination-review
description: "Employment termination risk review: red flag checklist, final pay timing, severance analysis, documentation gaps, protected class checks — before the decision is final"
---

> 🇪🇸 Versión en español. [Versión en inglés](../termination-review.md).

# Habilidad de Revisión de Terminación Laboral

## Cuándo activar
- Antes de terminar la relación laboral de un empleado — verificar riesgos legales
- Revisar si su documentación respalda el despido
- Evaluar los términos de indemnización y acuerdo de separación
- Determinar si primero se necesita un Plan de Mejora del Desempeño (PIP)
- Entender los requisitos específicos de jurisdicción para el pago final y el plazo de preaviso

## Cuándo NO usar
- Después de que una decisión ya ha sido comunicada — demasiado tarde para mitigar riesgos
- Despidos masivos — requiere un proceso legal específico (Ley WARN, consulta colectiva)
- Empleados sindicalizados — proceso y obligaciones diferentes
- Terminación de contratos de contratistas — marco legal diferente

## Advertencia crítica

El despido es una de las acciones legales más riesgosas que una empresa puede tomar. Claude identifica factores de riesgo y le ayuda a reflexionar sobre la decisión — no da asesoramiento legal. **Siempre consulte a un abogado laboral antes de despedir, especialmente si hay señales de alerta presentes.**

## Instrucciones

### Verificación previa de señales de alerta

```
Estoy considerando terminar [rol/nivel, no se necesita nombre].

Realice la verificación de señales de alerta:

ACTIVIDAD RECIENTE (últimos 12 meses):
- ¿Ha presentado alguna queja (RR.HH., discriminación, acoso, seguridad)?
- ¿Ha tomado recientemente licencia protegida (FMLA, discapacidad, embarazo, militar)?
- ¿Ha participado en alguna actividad protegida (sindicato, denuncia, quejas salariales)?
- ¿Pertenece a una clase protegida y no hay otros empleados despedidos en esa clase?

DOCUMENTACIÓN:
- ¿Tengo problemas de desempeño escritos (PIPs, advertencias escritas, conversaciones documentadas)?
- ¿Son los problemas de desempeño consistentes en el tiempo o repentinos?
- ¿Se le dieron expectativas claras y una oportunidad justa de mejorar?
- ¿Es esta la primera vez que se le informa de un problema de desempeño?

PROCESO:
- ¿Era un PIP requerido bajo la política de la empresa y se siguió?
- ¿Hubo una investigación si la razón es mala conducta?
- ¿Han sido tratados de la misma manera los empleados en situaciones similares?

Dígame qué señales de alerta están presentes y qué significan.
```

### Evaluación de la solidez de la documentación

```
Quiero evaluar qué tan bien documentado está mi caso.

Razón del despido: [desempeño / mala conducta / reestructuración / otra]
Documentación que tengo:
- [listar lo que tiene: PIPs, correos electrónicos, advertencias escritas, notas de reuniones, etc.]
- Fechas de cada documento
- Si el empleado reconoció/firmó cada uno

¿Estoy bien posicionado? ¿Qué falta?
```

### Requisitos de pago final y plazo de preaviso

```
Estoy terminando la relación laboral de un empleado en [estado/país].
Su último día será [fecha].
Tiene [X] días de vacaciones acumuladas pero no tomadas.
Razón: [voluntario / involuntario / despido]

¿Cuáles son mis obligaciones respecto a:
1. Momento del último cheque de pago (inmediato / próximo día de pago habitual / X días)?
2. Pago de vacaciones acumuladas (obligatorio o discrecional)?
3. Período de preaviso (requerido o "pago en lugar de")?
4. ¿Aviso de continuación COBRA/beneficios?

Nota: los requisitos varían significativamente según la jurisdicción — [VERIFY] con un profesional de RR.HH. o abogado.
```

### Análisis de indemnización

```
Estoy considerando ofrecer una indemnización.

Rol: [título, antigüedad: X años]
Razón: [despido / desempeño / separación mutua]
Mi instinto: [X semanas / X meses]

Preguntas:
1. ¿Cuál es una indemnización estándar de mercado para este rol y antigüedad?
2. ¿Qué condiciones debo adjuntar? (no difamación, no solicitud, renuncia a reclamaciones)
3. ¿Cuáles son las consideraciones de la ADEA si el empleado tiene 40 años o más?
4. ¿Debo requerir que renuncie a reclamaciones? ¿Qué significa eso?
```

### Revisión del acuerdo de separación

```
Revise este borrador del acuerdo de separación y marque los problemas:
[pegar borrador]

Verificar:
- Contraprestación (¿es lo que ofrecemos adecuado para la renuncia?)
- Período de revocación (revisión de 21/45 días para renuncias ADEA + 7 días de revocación)
- Alcance de la no difamación (¿mutua o unilateral?)
- Condiciones de carta de referencia
- Aviso de continuación COBRA
- Devolución de propiedad de la empresa
- Confirmación de cesión de propiedad intelectual
```

## Ejemplo

**Usted describe la situación:**
```
Empleado: desarrollador senior, 4 años de antigüedad, 52 años de edad
Razón: Desempeño — incumplimiento de plazos, baja calidad de código
Documentación: Un correo electrónico de hace 6 meses mencionando preocupaciones. Sin PIP. Sin advertencias escritas.
Actividad reciente: Presentó una queja interna sobre un colega hace 3 meses
```

**Evaluación de riesgo de Claude:**

🔴 **ALTO RIESGO — No proceder sin asesoramiento legal**

**Señales de alerta presentes:**
1. **Actividad protegida (queja reciente):** El empleado presentó una queja hace 3 meses. Despedir dentro de los 6 meses después de una actividad protegida crea una fuerte reclamación de represalia, incluso si los problemas de desempeño son reales.

2. **Edad (empleado de 40+):** La ADEA aplica. La documentación debe mostrar que el mismo estándar se aplicó igualmente a empleados más jóvenes. Un correo electrónico no cumple con este estándar.

3. **Brecha de documentación — crítica:** Sin PIP, sin advertencias escritas, sin conversaciones de desempeño documentadas. "Un correo electrónico de hace 6 meses" no resistirá el escrutinio. Un tribunal o regulador preguntará por qué no le dio una oportunidad justa de mejorar.

**Lo que falta antes de que este despido pueda proceder de manera segura:**
- Un PIP documentado con expectativas claras, cronograma y puntos de control
- Reconocimiento escrito del empleado de los problemas de desempeño
- Evidencia de que empleados más jóvenes en situaciones similares fueron tratados de la misma manera
- Separación del cronograma de la queja (o documentado que la queja no jugó ningún papel)

**Pasos mínimos recomendados:**
1. Consulte a un abogado laboral ahora — antes de cualquier comunicación con el empleado
2. Considere si un PIP estructurado es apropiado (y legalmente requerido bajo la política de la empresa)
3. Documente todas las futuras conversaciones de desempeño

**No despida hasta que el asesoramiento legal haya revisado esta situación.**

---
