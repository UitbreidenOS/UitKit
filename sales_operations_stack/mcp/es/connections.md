# Guía de Conexiones e Integración de MCP

## Descripción General

Sales Operations Stack se integra con múltiples MCPs para datos de pipeline en tiempo real, análisis e informes.

---

## Inicio Rápido

### Opción 1: Salesforce

Tu organización de Salesforce es tu única fuente de verdad para el pipeline.

**Configuración:** Sigue `salesforce.md` en este directorio.

**Lo que obtienes:**
- Consultas de oportunidades en tiempo real
- Registro automático de actividades en oportunidades
- Datos de trato en `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Seguimiento de cuota directamente desde CRM

### Opción 2: HubSpot

Tu cuenta de HubSpot es tu única fuente de verdad para los tratos.

**Configuración:** Sigue `hubspot.md` en este directorio.

**Lo que obtienes:**
- Consultas de tratos en tiempo real
- Registro automático de actividades en tratos
- Datos de trato en `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Seguimiento de cuota directamente desde CRM

---

## ¿Cuál Deberías Elegir?

| Factor | Salesforce | HubSpot |
|--------|-----------|---------|
| **Organizaciones empresariales** | ✓ (opción estándar) | ✓ (opción en crecimiento) |
| **Mercado medio** | ✓ (común) | ✓ (muy común) |
| **Complejidad de configuración** | Media (OAuth) | Baja (clave API) |
| **Campos personalizados** | Altamente personalizable | Personalizable |
| **Reportes** | Motor de reportes avanzado | Reportes buenos |
| **Precios** | Generalmente más alto | Generalmente más bajo |

**Decisión:** Pregunta a tu equipo de ventas/rev-ops qué CRM utilizan. Configura ese.

---

## Lista de Verificación de Configuración

- [ ] **Elige CRM:** ¿Salesforce o HubSpot?
- [ ] **Obtén credenciales:** Clave API u OAuth (depende del CRM)
- [ ] **Añade a settings.json:** Copia la configuración del archivo .md apropiado
- [ ] **Reinicia Claude Code:** Para que el servidor MCP se active
- [ ] **Prueba la conexión:** Ejecuta `/pipeline-review` (debe mostrar herramientas CRM en la lista)
- [ ] **Valida datos:** Exporta una pequeña muestra de pipeline y verifica que las consultas funcionen

---

## Permisos de Datos

### Salesforce

Asegúrate de que tu usuario de API tenga:
- Acceso de lectura al objeto Opportunity
- Acceso de lectura al objeto Account
- Acceso de lectura al objeto Contact (si se usa para mapeo de comité comprador)
- Acceso de escritura al objeto Task (para registro de actividades)

### HubSpot

Asegúrate de que tu aplicación privada tenga permisos:
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.objects.contacts.read`
- `crm.objects.companies.read`

---

## Opcional: Configuración Dual de CRM

Si utilizas tanto Salesforce como HubSpot (por ejemplo, Salesforce para empresas, HubSpot para pipeline PYME):

```json
{
  "mcpServers": {
    "salesforce": { ... },
    "hubspot": { ... }
  }
}