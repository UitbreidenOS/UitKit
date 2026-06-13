---
name: product-manager-toolkit
description: "Kit de herramientas del gerente de productos: priorización RICE, plantillas PRD, especificaciones de funciones, alineación de partes interesadas, lista de verificación go-to-market y flujo de descubrimiento a entrega"
---

# Habilidad de Kit de Herramientas del Gerente de Productos

## Cuándo activar
- Priorizar un trabajo pendiente de funciones con un marco estructurado
- Escribir un PRD (Documento de Requisitos del Producto) o especificación de función
- Preparar un plan go-to-market para el lanzamiento de una nueva función
- Ejecutar una sesión de alineación de partes interesadas antes de compilar
- Sintetizar el descubrimiento del cliente en requisitos accionables
- Escribir historias de usuario con criterios de aceptación apropiados

## Cuándo NO usar
- Hoja de ruta de producto estratégico — use la habilidad product-roadmap
- Investigación de usuario y creación de personas — use la habilidad ux-researcher
- Diseño de prueba A/B — use la habilidad experiment-designer
- Configuración de Jira y planificación de sprint — use la habilidad jira-expert

## Instrucciones

### Priorización RICE

```
Priorizar el trabajo pendiente de funciones con puntuación RICE.

Funciones a puntuar: [lista]
Capacidad del equipo: [X semanas-ingeniero por sprint]
Horizonte temporal: [este trimestre / este sprint / este mes]

Fórmula RICE:
Puntuación = (Alcance × Impacto × Confianza) / Esfuerzo

ALCANCE — usuarios afectados por trimestre:
- Cuente a los usuarios que realmente utilizarán esta función en una ventana de 3 meses
- No: "todos los usuarios podrían beneficiarse teóricamente"
- Sí: "23% de nuestro DAU que utilizan el flujo de pagos"
- Expresar como número (p. ej., 1,500 usuarios)

IMPACTO — impacto por usuario (escala 1-3):
- 3: Masivo — cambia fundamentalmente cómo trabajan los usuarios con el producto
- 2: Alto — mejora significativa en un flujo de trabajo importante
- 1: Medio — mejora notable
- 0,5: Bajo — mejora de conveniencia menor
- 0,25: Mínimo — solo cosmético o caso extremo

CONFIANZA — cuán seguro está (0-100%):
- 100%: Validado con datos e investigación
- 80%: Algunos estudios, suposiciones razonables
- 50%: Instinto, sin investigación aún
- 20%: Hipótesis pura, sin probar

ESFUERZO — semanas-ingeniero para construir (incluido diseño, prueba, despliegue):
- Sea honesto. Duplique su primera estimación.
- Incluir: diseño, desarrollo, pruebas, documentos, instrumentación analítica

Tabla de puntuación:
| Función | Alcance | Impacto | Confianza | Esfuerzo | Puntuación RICE | Notas |
|---|---|---|---|---|---|---|
| [Función A] | 2500 | 2 | 80% | 3w | (2500×2×0,8)/3 = 1333 | |
| [Función B] | 800 | 3 | 50% | 6w | (800×3×0,5)/6 = 200 | |

Resultado: lista clasificada + top 3 para construir este sprint a capacidad [X].
```

### Plantilla PRD

```
Escriba un PRD para [función].

Función: [describir]
Problema que resuelve: [el problema del usuario, no la descripción de la función]
Quién lo solicitud: [clientes / interno / impulsado por datos]
Prioridad: [P0 crítico / P1 alto / P2 medio]
Lanzamiento objetivo: [sprint / trimestre]

Estructura PRD:

## Descripción general
**Función:** [Nombre]
**Autor:** [nombre del PM] | **Fecha:** [fecha] | **Estado:** [Borrador / Revisión / Aprobado]
**Propietario de ingeniería:** [nombre] | **Propietario de diseño:** [nombre]

## Declaración del problema
[2-3 oraciones: quién tiene este problema, cuál es el costo del problema y por qué es importante resolverlo ahora. Sin lenguaje de solución aquí.]

## Métricas de éxito
Métrica principal: [el único KPI que cambia si esto se envía]
Métricas secundarias: [1-2 métricas de apoyo]
Contramétricas: [qué monitoreamos para asegurar que no rompamos nada más]

## Historias de usuario
Formato: "Como [tipo de usuario], quiero [acción], para que [resultado]."

Camino feliz:
- Como [usuario], quiero [acción principal], para que [valor principal].

Casos extremos:
- Como [usuario], cuando [condición extrema], quiero [acción], para que [resultado].

Estados de error:
- Como [usuario], cuando [el error ocurre], quiero [retroalimentación], para que [acción de recuperación].

## Criterios de aceptación
□ [Condición específica y comprobable — debe ser binaria aprobado/fallido]
□ [Otra condición]
□ [Condición de manejo de errores]

## Alcance

En alcance:
- [Comportamiento específico 1]
- [Comportamiento específico 2]

Fuera del alcance (explícito):
- [Algo que NO estamos construyendo en esta versión]
- [Caso extremo pospuesto a v2]

## Notas de diseño y técnicas
[Enlace a Figma / especificación de diseño]
[Cualquier limitación técnica de la que el PM sea consciente]
[Implicaciones del modelo API o de datos]

## Preguntas abiertas
- [ ] [Pregunta que debe resolverse antes de que comience la construcción] — propietario: [nombre] — vencimiento: [fecha]

## Plan de lanzamiento
- [ ] Instrumentación analítica: [eventos a disparar]
- [ ] Bandera de función: [sí — plan de implementación / no]
- [ ] Comunicaciones: [¿orientado al cliente? / ¿solo interno?]
- [ ] Actualización de docs necesaria: [sí/no]

Genere el PRD para mi función usando esta estructura.
```

### Especificación de función

```
Escriba una especificación de función detallada para [función].

Función: [nombre]
PRD: [enlace o pegue requisitos clave]
Audiencia: [equipo de ingeniería]

Estructura de especificación (más técnica que PRD):

## Función: [Nombre]
**Versión:** 1.0 | **Estado:** Listo para desarrollo

## Requisitos funcionales

### [Subfunción o nombre del flujo de usuario]
**Activador:** [qué inicia este flujo]
**Actor:** [quién realiza esta acción]

Pasos:
1. Usuario [acción] → Sistema [respuesta]
2. Usuario [acción] → Sistema [respuesta]

Requisitos de datos:
- Entrada: [qué datos son necesarios]
- Salida: [qué datos se devuelven/almacenan]
- Validación: [reglas que rigen la entrada válida]

**Estados de error:**
| Condición | Respuesta del sistema | Usuario ve |
|---|---|---|
| [condición de error] | [qué sucede] | [mensaje de error] |

## Requisitos no funcionales
- Rendimiento: [objetivo de tiempo de respuesta, p. ej., < 200 ms p99]
- Disponibilidad: [mismo SLA que el resto del producto]
- Retención de datos: [¿cuánto tiempo se conservan estos datos?]
- Seguridad: [consideraciones de autenticación, permiso o información de identificación personal]

## Diseño de API (si aplica)
Punto final: [MÉTODO /ruta]
Cuerpo de solicitud: [esquema]
Respuesta: [esquema]
Códigos de error: [lista]

## Eventos analíticos para disparar
| Evento | Cuándo | Propiedades |
|---|---|---|
| [event_name] | [cuándo se dispara] | [propiedades clave] |

## Plan de implementación
- [ ] Clave de bandera de función: [feature.flag.name]
- [ ] Prueba interna: [qué equipo + cuándo]
- [ ] Canario: [X% de usuarios, comenzando cuándo]
- [ ] Lanzamiento completo: [fecha o sprint]

Escriba la especificación para mi función.
```

### Lista de verificación Go-to-Market

```
Construya una lista de verificación go-to-market para [lanzamiento de función].

Función: [describir]
Tipo de lanzamiento: [mayor / menor / interno]
Audiencia: [todos los usuarios / segmento / nuevos registros / clientes B2B]
Fecha de lanzamiento: [objetivo]

Lista de verificación go-to-market por rol:

PRODUCTO (propietario):
□ Función completamente verificada y sin errores en la puesta en escena
□ Eventos analíticos verificados disparándose correctamente (verifique en modo de depuración)
□ Bandera de función configurada con el porcentaje de implementación correcto
□ Plan de reversión documentado (cómo desactivar la bandera si algo sale mal)
□ Prueba A/B configurada (si aplica)

INGENIERÍA (líder):
□ Se cumplen todos los criterios de aceptación
□ Rendimiento probado a carga esperada
□ Supervisión de errores configurada para nuevas rutas de código
□ Las migraciones de base de datos se completaron y probaron
□ Se prueba el interruptor de desactivación de la bandera de función

DISEÑO:
□ Los diseños finales se implementaron correctamente (verificación puntual con el diseñador)
□ Capacidad de respuesta móvil verificada
□ Prueba de accesibilidad aprobada
□ Estados vacíos y de error implementados

MARKETING (si es orientado al cliente):
□ Anuncio en la aplicación o información sobre herramientas escrita y revisada
□ Correo electrónico a usuarios afectados redactado (si es necesario)
□ Publicación de blog o entrada de registro de cambios lista para publicar
□ Documentación de ayuda actualizada o escrita
□ Equipo de ventas informado sobre la nueva capacidad

ÉXITO DEL CLIENTE (si es empresarial):
□ CSM informados sobre la función y los casos de uso clave
□ Clientes de alto contacto notificados con anticipación
□ Preguntas frecuentes preparadas para el equipo de soporte

DÍA DEL LANZAMIENTO:
□ Bandera de función habilitada a [X]% (o 100% para menores)
□ Monitor: tasa de error en nuevos puntos finales durante los primeros 30 minutos
□ Monitor: latencia p99 sin cambios
□ Anuncio publicado (en la aplicación / correo electrónico / blog)
□ Actualización #launches de Slack publicada

POST-LANZAMIENTO (1 semana):
□ Métrica principal: mejora de [X]% frente a la línea de base
□ Tasa de error: volver a la normalidad
□ Volumen de entradas de soporte: sin pico en esta función
□ Cualitativo: ¿hay comentarios del usuario sobre la función?

Genere la lista de verificación para su tipo de lanzamiento y estructura de equipo.
```

## Ejemplo

**Usuario:** PM en una empresa SaaS. La ingeniería me pide que priorice entre: (A) exportación CSV, (B) integración de Slack, (C) modo oscuro, (D) webhooks personalizados. Tenemos 4 semanas-ingeniero el próximo sprint. ¿Cómo decido?

**Análisis RICE de Claude:**

Voy a puntuar estos en su nombre con suposiciones razonables — necesita validar los números, pero esta estructura hará que la decisión sea defendible.

**Suposiciones que estoy haciendo (corríjame si me equivoco):**
- Usted es B2B SaaS, ~500 MAU usando las funciones en cuestión
- Sin investigación anterior o datos sobre estos específicamente

| Función | Alcance | Impacto | Confianza | Esfuerzo | RICE | Veredicto |
|---|---|---|---|---|---|---|
| Exportación CSV | 400 | 2 | 70% | 1w | 560 | **Construir** |
| Integración de Slack | 200 | 3 | 60% | 3w | 120 | Tal vez |
| Modo oscuro | 500 | 0,5 | 50% | 2w | 62 | Diferir |
| Webhooks personalizados | 80 | 3 | 80% | 4w | 48 | Diferir |

**Recomendación: exportación CSV este sprint, posponga el resto.**

**Por qué gana la exportación CSV:** Casi todos los usuarios en un producto B2B eventualmente necesitan exportar datos. Alto alcance, rápido de construir, alta confianza en que es necesario (si los clientes aún no lo solicitan, lo harán dentro de 6 meses de madurez del producto).

**Por qué la integración de Slack se ve baja:** La integración en sí puede tomar 3 semanas, pero el viaje de Slack a valor es largo — los usuarios necesitan configurarla, configurar notificaciones y cambiar hábitos. El alcance real es probablemente 30-40% de su estimación una vez que se considera la adopción. Guárdalo hasta que tengas validación del cliente.

**Por qué el modo oscuro es bajo:** Es una función de tabla de estadios que casi nunca es la razón por la que alguien compra o se va. Envíalo finalmente, pero no a costa de funciones de retención o adquisición.

**Por qué los webhooks personalizados son bajos:** Alto impacto por usuario, pero solo los usuarios avanzados lo necesitan. Los 80 usuarios que lo necesitan probablemente son ruidosos pero representan una pequeña parte de su apalancamiento de crecimiento.

---
