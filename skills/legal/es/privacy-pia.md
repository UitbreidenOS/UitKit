---
name: privacy-pia
description: "Evaluación de impacto de privacidad (PIA/DPIA): entrada de actividad de procesamiento, verificación de base legal, prueba de necesidad de DPIA, registro de riesgos, entrega a DPO — flujo de trabajo del Artículo 35 del RGPD"
---

> 🇪🇸 Versión en español. [Versión en inglés](../privacy-pia.md).

# Habilidad de Privacidad PIA

## Cuándo activar
- Lanzamiento de una nueva característica de producto que procesa datos personales
- Incorporación de un nuevo proveedor que manejará datos personales
- Cambio en cómo utiliza los datos personales existentes (nuevo propósito, nuevo intercambio)
- DPIA obligatoria requerida bajo el Artículo 35 del RGPD (perfilado sistemático, procesamiento a gran escala, monitoreo público)
- Preparación de su documentación de governance de privacidad para una auditoría de cumplimiento

## Cuándo NO usar
- Respuesta a una brecha de datos activa — proceso diferente (Artículos 33/34 del RGPD)
- Solicitudes de acceso a datos de sujetos — use la habilidad DSAR
- Presentaciones legales formales a autoridades supervisoras — necesita su DPO + abogado

## Importante

Una DPIA es obligatoria bajo el Artículo 35 del RGPD antes del procesamiento que es "probable que resulte en alto riesgo". No realizar una DPIA requerida es en sí una violación. Claude estructura la evaluación — su DPO debe revisar y aprobar antes de que comience la actividad de procesamiento.

## Instrucciones

### Paso 1 — Entrada de actividad de procesamiento

```
Documente esta actividad de procesamiento:

Nombre de actividad: [qué está construyendo o cambiando]
Propósito: [por qué procesa estos datos — sea específico]
Sujetos de datos: [quién — clientes / empleados / usuarios / público]
Categorías de datos personales:
- Estándar: [nombre, correo electrónico, dirección, teléfono, etc.]
- Categorías especiales (Artículo 9 del RGPD): [salud / biométrico / origen étnico / político / religioso / orientación sexual / antecedentes penales]
Responsable del tratamiento: [su organización]
Responsables conjuntos (si aplica): [otras organizaciones con poder decisorio]
Encargados del tratamiento: [proveedores / herramientas que procesan datos en su nombre]
Países involucrados: [dónde se almacenan / transfieren los datos]
Período de retención: [cuánto tiempo retiene los datos]
```

### Paso 2 — Base Legal

```
Identifique la base legal para esta actividad de procesamiento.

Bases legales del Artículo 6 del RGPD (elija una):
1. Consentimiento (Art. 6(1)(a)): libremente dado, específico, informado, inequívoco — puede revocarse
2. Contrato (Art. 6(1)(b)): necesario para un contrato con el sujeto de datos
3. Obligación legal (Art. 6(1)(c)): requerido por ley de la UE/estado miembro
4. Intereses vitales (Art. 6(1)(d)): proteger la vida
5. Tarea pública (Art. 6(1)(e)): interés público o autoridad oficial
6. Intereses legítimos (Art. 6(1)(f)): sus intereses vs. derechos de sujetos de datos (LIA requerido)

Para datos de categoría especial, TAMBIÉN necesita una condición del Art. 9(2):
- Consentimiento explícito
- Obligación de ley laboral
- Intereses vitales (persona incapacitada)
- Actividades lícitas de organización sin fines de lucro
- Hecho público
- Reclamaciones legales
- Interés público sustancial
- Salud/bienestar social
- Salud pública
- Archivo/investigación

Documente la base legal y por qué se aplica.
[VERIFY] con DPO — elegir la base incorrecta es un problema de cumplimiento.
```

### Paso 3 — Prueba de Necesidad de DPIA

```
Determine si se requiere un DPIA completo (Evaluación de Impacto de Protección de Datos).

DPIA es obligatorio si el procesamiento es "probable que resulte en alto riesgo". Verifique:

Activadores obligatorios (Art. 35(3) y directrices del EDPB):
- ¿Perfilado automatizado sistemático y extensivo con efectos legales/significativos? [sí/no]
- ¿Procesamiento a gran escala de datos de categoría especial (salud, biométrico, etc.)? [sí/no]
- ¿Monitoreo sistemático de un área públicamente accesible? [sí/no]

Criterios del EDPB (2+ = DPIA probablemente requerido):
- ¿Evaluación/calificación de individuos? [sí/no]
- ¿Toma de decisiones automatizada con efectos legales/significativos? [sí/no]
- ¿Monitoreo sistemático? [sí/no]
- ¿Datos sensibles o de naturaleza altamente personal? [sí/no]
- ¿Procesamiento a gran escala? [sí/no]
- ¿Combinación o vinculación de conjuntos de datos? [sí/no]
- ¿Datos sobre sujetos vulnerables? [sí/no]
- ¿Uso innovador o aplicación de nuevas soluciones tecnológicas/organizacionales? [sí/no]
- ¿Impide a los sujetos de datos ejercer sus derechos? [sí/no]

Recomendación: [DPIA obligatoria / DPIA recomendada / DPIA no requerida — documente razonamiento]
```

### Paso 4 — Registro de Riesgos

```
Identifique y evalúe riesgos de privacidad para esta actividad de procesamiento.

Para cada riesgo: [Riesgo] | [Probabilidad: Alto/Medio/Bajo] | [Severidad: Alto/Medio/Bajo] | [Mitigación] | [Riesgo residual después de mitigación]

Riesgos comunes a evaluar:
1. Acceso no autorizado / brecha de datos
2. Datos utilizados más allá del propósito indicado (cambio de propósito)
3. Recopilación excesiva (falla de minimización de datos)
4. Datos inexactos que causan daño al sujeto de datos
5. Retención más allá del período necesario
6. Transferencia a país tercero sin salvaguardas adecuadas
7. Denegación de derechos (acceso, eliminación, portabilidad)
8. Resultados discriminatorios del procesamiento automatizado
9. Re-identificación de datos seudonimizados
10. Falla de proveedor/procesador

¿Es el riesgo residual después de medidas de mitigación aceptable?
Si riesgo residual ALTO permanece — debe consultar a la autoridad supervisora antes de proceder (Art. 36).
```

### Paso 5 — Resumen de Entrega a DPO

```
Genere un resumen de entrega a DPO para esta PIA/DPIA.

Incluya:
- Descripción de la actividad (un párrafo)
- Base legal y lógica
- ¿DPIA requerida? Sí/No — lógica
- Top 3 riesgos y mitigaciones
- Preguntas abiertas que requieren orientación de DPO
- Aprobación recomendada: [aprobar / aprobar con condiciones / rechazar / consultar DPA]

[VERIFY] con DPO antes de que comience el procesamiento.
```

## Ejemplo

**Nueva característica:** Una aplicación quiere usar datos de ubicación + historial de compras para construir perfiles de usuario para publicidad personalizada.

**Evaluación de Claude:**

**Actividad de procesamiento:** Combinación de datos de ubicación e historial de compras para publicidad personalizada basada en perfilado.

**Base legal:** Consentimiento (Art. 6(1)(a)) requerido — el interés legítimo probablemente sea insuficiente para superar la intrusión del rastreo de ubicación.

**DPIA obligatoria:** SÍ — perfilado sistemático (activador 1), coincidencia de múltiples conjuntos de datos (criterio EDPB 6), y naturaleza especial de datos de ubicación (rastreo persistente). 3+ criterios cumplidos.

**Riesgos principales:**
- Alto: Datos de perfil utilizados más allá del propósito de publicidad (cambio de propósito) — mitigación: limitación contractual de propósito + imposición técnica
- Alto: Datos de ubicación revelan información sensible (salud, práctica religiosa, actividad sindical) — mitigación: agregación + precisión mínima
- Medio: Consentimiento no libremente dado si feature-gated — mitigación: opt-in genuino, sin penalización por rechazo

**Recomendación de DPO:** DPIA obligatoria antes del lanzamiento. Consulte DPA si el riesgo residual después de mitigación permanece alto.

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
