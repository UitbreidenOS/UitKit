# Implementación Claude Code Enterprise — Cumplimiento y Seguridad

## Cuándo activar
Implementación de Claude Code en una industria regulada (finanzas, sanidad, gobierno); revisión de seguridad empresarial de herramientas de IA; requisitos de residencia o soberanía de datos; preguntas sobre implementación on-premises o en cloud privado; requisitos de cumplimiento HIPAA, SOC2, PCI o FedRAMP.

## Cuándo NO usar
Desarrolladores individuales o pequeños equipos sin requisitos de cumplimiento; uso estándar de Claude Code sin restricciones de gestión de datos empresarial; equipos que ya han completado su revisión de cumplimiento y solo necesitan ayuda de características.

## Instrucciones

**Identidad y autenticación :**
- Utilice `ANTHROPIC_WORKSPACE_ID` para federación de identidad de carga de trabajo — elimina claves API de larga duración de variables de entorno y secretos de CI
- SSO empresarial a través de SAML 2.0 u OIDC para control de acceso del equipo (Okta, Azure AD, Google Workspace todos compatibles)
- Rote claves API trimestralmente como mínimo si la federación de identidad de carga de trabajo no está en uso

**Retención Cero de Datos (ZDR) :**
- Disponible en planes empresariales
- Los prompts y respuestas no se registran ni se almacenan en Anthropic
- Requerido para HIPAA; requerido para algunos escenarios PCI DSS
- Obtenga un BAA firmado de Anthropic antes de enviar cualquier PHI — ZDR solo no constituye un BAA
- Confirme que ZDR está activo en su espacio de trabajo antes de permitir datos regulados en sesiones

**Configuración de red :**
- Claude Code requiere solo HTTPS saliente — no se requieren puertos entrantes
- Funciona detrás de proxies corporativos: establezca la variable de entorno `HTTPS_PROXY`
- Sin reglas de firewall especiales más allá del puerto 443 saliente a puntos finales de Anthropic
- Para implementaciones de punto final privado, establezca `ANTHROPIC_BASE_URL` en su punto final de Bedrock o Vertex

**Residencia de datos — use proveedores en la nube para procesamiento regional :**

| Requisito de región | Proveedor y región |
|---|---|
| Solo EE.UU. | API directa de Anthropic (us-east-1) o Bedrock us-east-1 |
| Solo UE | Bedrock eu-west-1 o Vertex AI eu-west-4 |
| APAC | Bedrock ap-northeast-1 |

La API directa de Anthropic solo procesa en centros de datos estadounidenses — use Bedrock o Vertex para requisitos de residencia de datos no estadounidenses.

**Registro de auditoría :**
Todas las llamadas de herramienta Claude Code se registran en archivos de sesión `.claude/` locales. Para integración SIEM:
- Envíe registros a Splunk, Datadog o Elastic a través de un hook PostToolUse
- Campos de registro: marca de tiempo, nombre de herramienta, resumen de entrada, código de salida, ID de sesión
- Retenga los registros según su programa de retención regulatoria (7 años para la mayoría de regulaciones financieras)

**Sanidad (HIPAA) :**
- ZDR + Bedrock o Vertex requerido (nunca API directa para PHI)
- BAA de Anthropic requerido — obtener antes de la primera sesión de PHI
- Implemente Claude Code en una VPC con puntos finales privados; sin salida de internet pública para sesiones que manejan PHI
- Nunca pegue PHI en prompts sin confirmación de ZDR activo

**Finanzas (SOC2/PCI) :**
- Hook de escáner de secretos obligatorio en todas las sesiones de desarrollador (prevenir commits de clave accidental)
- Deshabilite el acceso a internet en entornos de CI ejecutando Claude Code
- Audite todas las llamadas de herramienta — registre como mínimo cada escritura de archivo y comando shell
- Hook de revisión de código requerido antes de cualquier implementación de producción iniciada por Claude Code
- Alcance de PCI DSS: confirme con su QSA si las sesiones de Claude Code tocan entornos de datos del titular de la tarjeta

**Gobierno (FedRAMP) :**
- Implementación autorizada por FedRAMP a través de AWS GovCloud con Bedrock
- Verifique el estado de autorización FedRAMP actual en el mercado de FedRAMP antes de la adquisición — los niveles de autorización y el alcance cambian
- Los puntos finales de GovCloud requieren credenciales de API separadas de AWS comercial

**Red privada / Aislado del aire :**
- Claude Code puede ejecutarse completamente contra puntos finales privados de Bedrock o Vertex
- Establezca `ANTHROPIC_BASE_URL` en la URL de su punto final privado
- Todos los servidores MCP referenciados en `.claude/mcp.json` también deben ser accesibles sin acceso a internet público
- Sin telemetría ni búsqueda de actualizaciones si `ANTHROPIC_BASE_URL` se establece en un punto final privado

## Ejemplo

Empresa de servicios financieros implementando en 50 ingenieros:
- SSO a través de Okta SAML vinculado a `ANTHROPIC_WORKSPACE_ID`
- Bedrock eu-west-1 para requisito de residencia de datos de la UE
- `HTTPS_PROXY` establecido a nivel organizacional a través del entorno administrado por TI
- Hook de escáner de secretos aplicado a todas las sesiones a través de `CLAUDE.md` compartido en la raíz del monorepo
- Hook PostToolUse envía registros de auditoría a Splunk con ID de sesión y nombre de herramienta
- Acuerdo ZDR establecido; BAA no requerido (sin PHI)
- Sin acceso directo a la API de Anthropic — todo el tráfico se enruta a través del punto final privado de Bedrock

---

> **Trabaje con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
