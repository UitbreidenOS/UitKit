Now I'll create the Spanish translation:

# /analyze-pipeline

**Activación:** Ejecutar semanalmente (cada lunes) antes de la sincronización de liderazgo, o bajo demanda para visibilidad del pipeline.

**Propósito:** Generar snapshot de salud del pipeline en tiempo real: recuento de acuerdos por etapa, edad promedio por etapa, salud del pronóstico, tasas de conversión por etapa e identificación de acuerdos en riesgo.

**Qué hace:**
1. Extrae la exportación actual de CRM (Salesforce, HubSpot o Pipedrive)
2. Valida la antigüedad de los datos (advierte si tienen >24 horas)
3. Segmenta acuerdos por etapa, nivel (Enterprise/Mid/Commercial) y representante
4. Calcula métricas clave: valor del pipeline, envejecimiento de etapa, tasas de conversión, precisión del pronóstico
5. Identifica acuerdos en riesgo (>30 días en etapa, <50% de probabilidad)
6. Genera dashboard resumen: riesgos principales, ritmo de cuota, acciones recomendadas
7. Guarda el informe en `reports/pipeline-snapshot-{YYYY-MM-DD}.md`
8. Registra el resumen en `session-log.md`

**Entradas:** Conexión CRM (requiere credenciales de API o archivo de exportación)

**Salida:** `reports/pipeline-snapshot-{date}.md` — Informe completo de salud con métricas, acuerdos en riesgo, tendencias de conversión y acciones

**Propietario:** Sales Ops Lead | **Frecuencia:** Semanal + bajo demanda

**Ejemplo:**

```bash
/analyze-pipeline
```

Salida:
- Cobertura del pipeline: 3.8:1 (objetivo 3.5–4.5:1) ✓ Verde
- Precisión del pronóstico: 92% vs. 95% enviado — Monitorear
- Acuerdos en riesgo: 7 (>30 días en etapa o <50% de probabilidad) — Escalar a managers
- Ritmo de cuota: -14% vs. objetivo prorrateado — Se requiere intervención

Próximo paso: Revisar acuerdos en riesgo; programar revisiones de acuerdos con representantes afectados.

---
