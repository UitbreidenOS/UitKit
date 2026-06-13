# Entrevista de Arranque en Frío — Configuración del Complemento Legal

## Cuándo activar

- Primer uso de cualquier habilidad legal para una nueva organización
- La salida del complemento legal contiene marcadores `[PLACEHOLDER]`
- La salida es demasiado genérica y no específica de la práctica
- Incorporación de un nuevo equipo legal a Claude Code

**Por qué importa esto :** La entrevista de arranque en frío es el punto de apalancamiento más común para la calidad de las habilidades legales. La salida genérica casi siempre es rastreable a una entrevista omitida o incompleta. Una entrevista de 10–15 minutos transforma cada habilidad posterior de genérica a específica de la práctica.

## Cuándo NO usar

- La entrevista ya está completada y existe un perfil de organización — verifique `~/.claude/plugins/config/legal/company-profile.md` antes de ejecutar nuevamente
- Tareas rápidas de investigación legal única donde la personalización no es necesaria y no se tomarán decisiones de estrategia

## Instrucciones

La entrevista recopila cuatro categorías de información y las escribe en un perfil de organización. Trabaje secuencialmente a través de cada categoría — no omita secciones.

---

**1. Contexto de la práctica (quién es usted)**

Recopile :
- Nombre de la organización y tipo de entidad : firma de abogados / equipo legal interno / departamento legal independiente
- Áreas de práctica manejadas (contratos comerciales, derecho laboral, propiedad intelectual, M&A, privacidad de datos, etc.)
- Jurisdicción(es) donde ejerce — especifique la ley que rige principal
- Rango de tamaño de transacción típico (por ejemplo, acuerdos de proveedores de $50K–$2M)
- Postura de riesgo : agresiva / conforme al mercado / conservadora

---

**2. Estructura del equipo y escalada**

Recopile :
- Tamaño del equipo y funciones (pasante legal → asociado → counsel → general counsel / socio principal)
- Límites de autoridad en dólares por rol — qué puede aprobar cada rol sin escalar
- Contactos de escalada : nombre y identificador de Slack o correo electrónico por nivel de autoridad
- Canal de escalada preferido : Slack / correo electrónico / reunión regular

---

**3. Posiciones de Estrategia (por tipo de contrato)**

Para cada tipo de contrato que maneja su equipo, documente :

| Campo | Recopile |
|-------|---------|
| Lado | Lado de ventas o lado de compras |
| Limitación de responsabilidad | Límite preferido (por ejemplo, 1× honorarios), alternativas aceptables, lista de no aceptación |
| Indemnización | Posición estándar, alternativas aceptables, no aceptación |
| Ley aplicable y jurisdicción | Preferida, aceptable, no aceptación |
| Protección de datos | Requisitos de DPA, cláusulas estándar preferidas |
| Punto de ruptura | La única cláusula que requiere inmediatamente escalada para este tipo de contrato |

Tipos de contrato típicos a cubrir : acuerdo de proveedor SaaS, NDA, acuerdo de empleo, acuerdo de servicios, acuerdo de procesamiento de datos, acuerdo de asociación.

---

**4. Sistemas e integraciones**

Recopile :
- Sistema CLM en uso (si corresponde) y estado de integración con Claude Code
- Ubicación de almacenamiento de contratos (unidad compartida, CLM, archivo de correo electrónico)
- Otras herramientas en la pila legal que Claude Code puede necesitar para interactuar

---

**Salida :** Escriba un perfil en `~/.claude/plugins/config/legal/company-profile.md` (compartido en todas las habilidades legales) y subperfiles específicos de práctica por tipo de habilidad en el mismo directorio.

Después de escribir el perfil, confirme qué habilidades legales están activas y cómo usarán el perfil. Todas las habilidades legales leen este perfil antes de procesar cualquier documento.

**Seguridad :** El perfil se almacena solo localmente. Nunca envíe contenido del perfil fuera del sistema local.

## Ejemplo

**Entrada :** « Guíeme a través de la entrevista de arranque en frío para nuestro equipo legal interno en una empresa SaaS de 200 personas. Manejamos principalmente acuerdos de proveedores SaaS, NDA y cuestiones de empleo. Somos del lado de compra y preferimos posiciones conservadoras. »

**Comportamiento esperado :**

La habilidad realiza la entrevista de cuatro categorías como una conversación estructurada, recopilando respuestas a cada campo. Al final escribe :

- `~/.claude/plugins/config/legal/company-profile.md` — identidad de la organización, estructura del equipo, contactos de escalada
- `~/.claude/plugins/config/legal/playbook-saas-vendor.md` — posiciones para acuerdos de proveedores SaaS
- `~/.claude/plugins/config/legal/playbook-nda.md` — posiciones para NDA
- `~/.claude/plugins/config/legal/playbook-employment.md` — posiciones para cuestiones de empleo

Luego confirma : « Perfil completo. Las habilidades de Contract Reviewer, Escalation Flagger y Redline Negotiator ahora usarán este perfil para todas las revisiones. »

---
