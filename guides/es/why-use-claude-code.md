# Por qué Claude Code — Arnés vs Indicación

Un concepto erróneo común: « A medida que mejoran los modelos, las características se convierten en indicaciones — entonces una indicación bien escrita equivale a un arnés completamente configurado. » Esto es falso. Comprender por qué importa para obtener lo máximo de Claude Code y para decidir qué pertenece a una indicación frente a qué pertenece a la configuración.

---

## Las 10 Cosas que Hace un Arnés que las Indicaciones No Pueden

| # | Capacidad | Arnés | Indicación |
|---|---|---|---|
| 1 | **Aislamiento de contexto** | Los suagentes se ejecutan en ventanas de contexto separadas | Las indicaciones comparten un contexto — todo se filtra |
| 2 | **Restricciones de herramientas** | El arnés aplica qué herramientas puede llamar un agente — bloqueado en el nivel de tiempo de ejecución | Las indicaciones solo pueden solicitar; el modelo puede o no cumplir |
| 3 | **Carga diferida** | Las habilidades se cargan solo cuando coinciden semánticamente — el contexto de inicio permanece pequeño | Las indicaciones deben cargar todas las instrucciones por adelantado — contexto grande desde el inicio |
| 4 | **Ganchos** | Los comandos de shell se activan en eventos (PreToolUse, Stop, PostCompact) independientemente de la salida del modelo | Las indicaciones instruyen; el modelo decide cumplir |
| 5 | **Enrutamiento de modelos** | Las diferentes tareas se enrutan a Haiku, Sonnet u Opus según la definición del agente | Una indicación se ejecuta en un modelo — sin enrutamiento |
| 6 | **Paralelismo** | Múltiples agentes se ejecutan simultáneamente en procesos separados | Las indicaciones secuenciales no pueden paralelizar — un turno a la vez |
| 7 | **Persistencia entre sesiones** | CLAUDE.md, las reglas y la memoria persisten automáticamente en cada sesión | Las indicaciones se reinician al final de la sesión — el contexto debe reinyectarse cada vez |
| 8 | **Indicación del sistema modular** | Cientos de fragmentos condicionales se activan según la configuración del proyecto | Una indicación plana — todo está siempre presente o nunca |
| 9 | **Activación automática de habilidades** | La experiencia del dominio se activa en la coincidencia de archivos o el disparador semántico | Las habilidades deben invocarse manualmente — nada es automático |
| 10 | **Puertas de permiso** | El arnés aplica reglas `allow`/`deny` para operaciones destructivas en el nivel de tiempo de ejecución | Las indicaciones solo pueden pedir cortésmente — sin aplicación |

---

## La Asimetría de Fichas

Su indicación es típicamente 6–60 fichas. El arnés gestiona 5.000–50.000+ fichas de entrada del modelo a través de carga diferida, activación condicional y almacenamiento en caché de indicaciones.

Una « indicación fuerte » opera a nivel de entrada del usuario — una fracción de lo que el modelo realmente ve. No puede alcanzar:

- Los fragmentos de indicación del sistema inyectados antes de su mensaje
- Las descripciones de herramientas cargadas por el arnés
- El contenido de habilidad activado por el contexto del archivo
- Los archivos de reglas coincidentes en la ruta de trabajo actual
- El contenido CLAUDE.md almacenado en caché de sesiones anteriores

Escribir una indicación de usuario larga y detallada para compensar la configuración que falta es como aumentar la señal gritando mientras ignora el piso de ruido.

---

## Implicaciones Prácticas

**No replique el comportamiento del arnés en indicaciones.**

Las indicaciones que intentan aplicar restricciones de herramientas (« no use Bash ») o establecer preferencias persistentes (« siempre use TypeScript para nuevos archivos ») no son confiables. El modelo puede seguirlas la mayoría de las veces, pero no hay garantía. La aplicación del arnés; las indicaciones solicitan.

| Lo que desea | Enfoque equivocado | Enfoque correcto |
|---|---|---|
| Estándares de codificación persistentes | Repetir en cada indicación | `CLAUDE.md` |
| Restringir agente a solo lectura | « Por favor no escriba archivos » | Lista blanca de `tools:` del agente |
| Ejecutar el linter después de cada edición | « Por favor ejecute el linter después de las ediciones » | Gancho `PostToolUse` |
| Experiencia de dominio para una tarea | Pegar documentos en la indicación | Archivo de habilidad |
| Efectos secundarios garantizados | « Después de terminar, notifícame » | Gancho `Stop` |
| Límite de seguridad | « No toque las credenciales de prod » | Regla de permiso `deny` |

---

## Cuándo las Indicaciones Son la Herramienta Correcta

Las indicaciones son la herramienta correcta para:

- **Instrucciones de tareas únicas** — orientación específica y única que no se generaliza
- **Contexto dinámico** — información conocida solo en tiempo de ejecución (una URL, una ruta de archivo proporcionada por el usuario, un número de versión específico)
- **Dirección de conversación** — redirección a mitad de sesión basada en lo que acaba de ver
- **Aclarar ambigüedad** — explicar cómo se ve « el comportamiento correcto » para este caso específico

Todo lo demás — valores predeterminados, estándares, patrones, restricciones, automatización, persistencia — pertenece a la capa del arnés.

---

## El Efecto Compuesto

La configuración del arnés se compone. Un proyecto con un CLAUDE.md bien estructurado, tres habilidades enfocadas, dos automatizaciones de ganchos y agentes correctamente restringidos funciona mejor el día 100 que el día 1, porque cada sesión se beneficia de la configuración acumulada sin ingeniería de indicaciones adicional.

Un proyecto que se basa en indicaciones se degrada con el tiempo. A medida que la base de código crece, las indicaciones se hacen más largas, el contexto se vuelve más ruidoso y los gastos generales de reestablecimiento de contexto al inicio de cada sesión aumentan.

La inversión en configuración del arnés paga dividendos en cada sesión futura. La inversión en un indicación del sistema largo paga dividendos solo en la actual.

---
