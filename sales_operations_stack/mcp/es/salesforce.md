Now I'll create the Spanish translation while preserving all structure, terminology, and formatting:

```markdown
# Configuración de Salesforce MCP

## Propósito

Conecta Salesforce CRM para extracción de datos de pipeline en tiempo real, consultas de tratos y gestión de oportunidades dentro de Claude Code.

## Cuándo usar

- Ejecutar `/analyze-pipeline` — consultar oportunidades actuales e historial de etapas
- Ejecutar análisis de cuota y territorio — agregar por representante, territorio y cuenta
- Registrar acciones en sesión — escribir actividades y notas en registros de Salesforce

## Pasos de Configuración

### 1. Obtener Credenciales de API de Salesforce

1. Inicia sesión en tu organización de Salesforce
2. Ve a **Setup** → **Apps** → **App Manager**
3. Crea una nueva **Connected App**:
   - Nombre: "Claude Code Sales Ops"
   - Habilita configuración de OAuth 2.0
   - URL de devolución: `http://localhost:8000` (desarrollo local)
   - Scopes: `api`, `refresh_token`, `offline_access`
4. Copia la **Consumer Key** y **Consumer Secret**
5. Genera un **Security Token** (Setup → Personal Setup → Security → Reset Security Token)

### 2. Configurar settings.json

Agrega a `.claude/settings.json`:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-salesforce"],
      "env": {
        "SALESFORCE_INSTANCE_URL": "https://yourorg.salesforce.com",
        "SALESFORCE_CLIENT_ID": "your-consumer-key",
        "SALESFORCE_CLIENT_SECRET": "your-consumer-secret",
        "SALESFORCE_USERNAME": "your-username@yourorg.com",
        "SALESFORCE_PASSWORD": "your-password",
        "SALESFORCE_SECURITY_TOKEN": "your-security-token"
      }
    }
  }
}
```

### 3. Probar la Conexión

Reinicia Claude Code. Prueba con:
```
/pipeline-review
```

Si las herramientas de Salesforce aparecen en la lista de herramientas, la conexión está funcionando.

---

## Herramientas Disponibles

Una vez configurado, puedes:

**Leer Oportunidades:**
- Consultar oportunidades por representante, etapa, rango de cantidad
- Obtener detalles de una sola oportunidad (propietario, contactos, cantidad, etapa, fecha de cierre)
- Extraer campos personalizados (puntuación de ICP, nivel de riesgo, etc.)

**Escribir Actividades:**
- Registrar tarea/actividad en registro de oportunidad
- Actualizar etapa, cantidad y fecha de cierre de oportunidad
- Agregar notas a la oportunidad

**Consultar Informes:**
- Ejecutar informes de Salesforce a través de API (si está configurado)
- Obtener datos de pipeline formateados

**Consultas de Contacto/Cuenta:**
- Buscar nombres de cuenta, industria, cantidad de empleados
- Encontrar funciones de contacto por cuenta

---

## Consultas de Ejemplo en Claude

**Consultar pipeline para un representante específico:**
```
Usa Salesforce MCP para obtener todas las oportunidades del representante "Sarah K" 
donde la etapa no es "Closed-Won" ni "Closed-Lost".
Devuelve: nombre del trato, valor, etapa, fecha de cierre, fecha de última actividad.
```

**Escribir actividad en oportunidad:**
```
Registra en la oportunidad de Salesforce "Apex Industries" (ID: 0061...):
Actividad: "VP aprobó el trato 2026-06-12. Puntuación de riesgo: 64/100."
```

---

## Alternativa: HubSpot MCP

Si tu CRM es HubSpot en su lugar:
- La configuración es similar; reemplaza variables de entorno `SALESFORCE_*` con `HUBSPOT_API_KEY`
- La estructura de consulta sigue siendo la misma (oportunidades/tratos, contactos, actividades)
- Ver `hubspot.md` en este directorio

---

Construido con [Claudient](https://github.com/Claudient/Claudient)