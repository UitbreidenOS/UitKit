---
name: product-analytics
description: "Analítica de productos: definir frameworks de métricas, construir dashboards, analizar adopción de características, medir activación y retención, interpretar datos para tomar decisiones de productos"
---

# Habilidad de Analítica de Productos

## Cuándo activar
- Decidir qué métricas rastrear para un producto o una característica
- Analizar por qué una característica tiene baja adopción después del lanzamiento
- Construir un panel de métricas de productos desde cero
- Interpretar datos de retención o activación para encontrar problemas
- Preparación de una revisión de producto informada por datos o decisión de hoja de ruta
- Diseño de un marco de métricas (North Star, jerarquía L1/L2)

## Cuándo NO usar
- Configuración de la infraestructura de análisis — use la habilidad analytics-tracking
- Diseño y estadísticas de pruebas A/B — use la habilidad experiment-designer
- Análisis de atribución de marketing — eso es paid-ads o analytics-tracking

## Instrucciones

### Diseño de framework de métricas

```
Diseñe un framework de métricas para [producto].

Producto: [describir]
Etapa: [pre-PMF / crecimiento / escala]
Modelo de negocio: [suscripción / basado en el uso / freemium / mercado]
Tamaño del equipo: [1-5 / 6-20 / 20+]

Jerarquía de métricas:

Nivel 0 — Métrica North Star (1 métrica):
[La métrica única que representa mejor el valor entregado a los usuarios]
Debe ser: indicador principal de ingresos, mensurable, accionable por el equipo
Ejemplos: DAU, proyectos activos semanales, mensajes enviados, informes generados

Nivel 1 — Métricas de pilares (3-5 métricas):
[Los componentes que explican la métrica North Star]
Framework: Adquisición, Activación, Retención, Referencia, Ingresos (AARRR)

Nivel 2 — Métricas diagnósticas (para cada pilar):
[Métricas que ayudan a diagnosticar por qué se mueve una métrica L1]

Ejemplo de framework para una herramienta B2B SaaS:
NSM: Equipos Activos Semanalmente (equipos con ≥ 3 miembros que usaron la función principal esta semana)
L1: 
  - Nuevos equipos registrados (Adquisición)
  - % que invitaron a 3+ miembros en la semana 1 (Activación)
  - % retenidos en la semana 4 (Retención)
  - Retención Neta de Ingresos (Ingresos)
L2 (para Activación):
  - Tiempo hasta la primera acción central
  - % que completaron la lista de verificación de incorporación
  - Tasa de envío de invitaciones en la sesión 1

Diseñe el framework para mi producto. Incluir: qué NO rastrear (métricas de vanidad).
```

### Análisis de adopción de características

```
Analice la adopción para [función].

Función: [describir lo que hace]
Fecha de lanzamiento: [hace X semanas/meses]
Tasa de adopción actual: [X% de usuarios elegibles lo han utilizado]
Tasa de adopción objetivo: [X%]
Herramienta de análisis: [Mixpanel / Amplitude / PostHog / GA4]

Marco de análisis de adopción:

1. Definir "adoptado":
   □ ¿Primer uso? (conciencia) — demasiado suelto
   □ ¿Usado X veces? (compromiso) — mejor
   □ ¿Usado en X% de sesiones? (hábito) — mejor
   [Establecer un umbral claro de adopción antes de analizar]

2. Embudo desde descubrimiento de características hasta adopción:
   - Vio punto de entrada de característica: [X%]
   - Hizo clic / iniciado: [X%]
   - Completó primer uso: [X%]
   - Regresó y volvió a usar: [X%]
   - "Adoptado" (según su definición): [X%]

3. Segmentación (qué usuarios adoptan o no):
   - Por rol de usuario / plan / tamaño de empresa
   - Por cohorte de activación (usuarios más nuevos vs más antiguos)
   - Por caso de uso principal o flujo de trabajo

4. Barreras para la adopción (cualitativas):
   - ¿Es la característica descubrible? (verificar: ¿saben siquiera que existe?)
   - ¿Es el valor inmediatamente claro? (experiencia de primer uso)
   - ¿Requiere configuración o estado previo?
   - ¿Hay un flujo de trabajo competidor ya en uso?

5. Recomendaciones por punto de abandono:
   - Bajo conocimiento → anuncio en la aplicación, consejo, correo electrónico
   - Baja finalización del primer uso → simplificar la interfaz o agregar configuración guiada
   - Bajo uso repetido → verificar si el valor central se entregó en el primer uso

Consulta para ejecutar en [herramienta de análisis] + interpretación de resultados.
```

### Análisis de retención

```
Analice datos de retención e identifique oportunidades de mejora.

Producto: [describir]
Definición de retención: [el usuario hizo X dentro de Y días]
Retención D1/D7/D14/D30 actual: [X% / X% / X% / X%]
Punto de referencia para su categoría: [busque su vertical — varía ampliamente]
Herramienta de análisis: [herramienta]

Pasos de análisis de retención:

1. Análisis de forma:
   - Curva de aplanamiento: la retención alcanza un piso → el producto tiene retención central (bien)
   - Declive continuo: sin piso de retención → problema PMF, no un problema de optimización
   - Caída de función escalonada en un día específico: algo sucede en ese momento (¿expira el ensayo? ¿el correo se detiene? ¿límite de características alcanzado?)

2. Comparación de cohortes:
   - Comparar cohortes semanales — ¿las cohortes recientes retienen mejor que las más antiguas?
   - Mejora: sus cambios funcionan
   - Declive: algo retrocedió (característica degradada, competencia mejorada)
   - Plano: sin mejora, sin regresión

3. Retención de segmento:
   ¿Qué usuarios retienen lo mejor?
   - Canal (orgánico vs. pagado — orgánico típicamente retiene 2-3x mejor)
   - Uso de características (usuarios que usaron característica X retienen Y% vs Z% para no usuarios)
   - Ruta de incorporación (lista de verificación completada o no)
   - Tamaño de empresa o plan

4. Identificar la "característica de activación":
   Encuentre el evento/característica que se correlaciona más con la retención del día 30.
   Ejecutar: correlación de eventos → análisis de retención en Amplitude o Mixpanel
   Haga que esta característica sea parte del flujo de incorporación.

5. Diseño de intervención:
   Caída D1 (< 40% retorno día 1): problema de incorporación
   Caída D7: problema de formación de hábito (notificaciones push, correo electrónico, nudge en la aplicación)
   Caída D30: problema de profundización de valor (nuevas características, integraciones, expansión de equipo)

Analice mis datos de retención y recomiende la intervención de mayor impacto.
```

### Panel de revisión de productos

```
Diseñe un panel de revisión de productos semanal para [producto/equipo].

Equipo: [producto / ingeniería / empresa completa]
Frecuencia: [semanal / cada dos semanas]
Objetivos: [tomar decisiones de hoja de ruta / identificar regresiones / rastrear progreso de OKR]

Secciones del panel:

1. Métrica North Star (semana a semana):
   [Nombre de métrica]: [valor actual] vs [semana pasada] vs [misma semana mes pasado]
   Tendencia: ↑/↓ [X%] — [¿está dentro del rango esperado?]

2. Adquisición:
   Nuevos registros: [X] (semana) / [X] (mes) / [X objetivo]
   CAC por canal: [orgánico / pagado / referencia]

3. Activación:
   Tasa de activación (definida como [X]): [X%] vs objetivo [X%]
   Tiempo de activación: p50 [Xh] / p90 [Xh]

4. Retención:
   Retención D7: [X%] / Retención D30: [X%]
   Tendencia de usuarios activos semanales: [datos sparkline]

5. Ingresos:
   MRR: $[X] — [+/-X% WoW]
   MRR nuevo: $[X] / Expansión: $[X] / Churn: $[X]
   Cambio MRR neto: $[X]

6. Salud del producto:
   Característica superior por uso esta semana: [X]
   Adopción de características en lanzamientos recientes: [nombres + %]
   Volumen de soporte: [X tickets] — [tendencia]

7. Experimentos:
   En curso: [nombre de prueba] — [días restantes] — [resultado actual]
   Concluido esta semana: [nombre de prueba] — [resultado] — [decisión]

8. Preguntas clave para esta semana:
   - [¿Qué cambió y por qué?]
   - [¿Qué necesita una decisión?]
   - [¿Qué aún no sabemos?]

Construya este panel en [Mixpanel / Amplitude / PostHog / Metabase / Notion].
```

## Ejemplo

**Usuario:** Nuestro SaaS (herramienta de colaboración de equipo B2B) tiene 35% de retención D30. Creemos que es un problema de activación. Analytics en Mixpanel. ¿Qué deberíamos investigar?

**Plan de análisis de Claude:**

35% D30 para una herramienta de colaboración B2B está por debajo de lo típico (45-60% para la categoría). Pero "problema de activación" es una hipótesis — validemos antes de reparar.

**Paso 1 — Confirme la ubicación de abandono en Mixpanel:**
Construya este embudo: Registro → Primer inicio de sesión → Invitación de equipo enviada → Característica central utilizada × 3 → D30 retenido.

Si la tasa de retención para usuarios que completan todos los pasos del embudo es > 60%, el problema ES la activación (no el valor del producto). Tiene un buen producto que la mayoría de los usuarios nunca experimentan.

**Paso 2 — Encuentre el predictor de activación:**
En Mixpanel: Retención → Comparar por "¿Hizo evento X en primeros 7 días". Pruebe estos eventos:
- Invitó a un miembro del equipo → retenido en D30?
- Usó [función central] 3+ veces → retenido en D30?
- Conectó una integración → retenido en D30?

El evento con la correlación de retención D30 más alta = su momento aha. Haga esto el objetivo de activación.

**Paso 3 — Encuentre la barrera:**
Si el evento de activación es "invitación de equipo enviada" y solo el 22% de registros envía uno en la semana 1, la pregunta es: ¿por qué no invitan a su equipo?

Segmente por: registros en solitario vs registros de equipo. Si los registros en solitario retienen el 15% y los registros de equipo el 58%, el problema es que adquiere demasiados usuarios en solitario, no que su flujo de activación esté roto.

**Salida de árbol de decisiones:**
- Baja tasa de activación + alta retención post-activación → reparar flujo de activación
- Alta tasa de activación + baja retención → reparar valor de producto o segmento objetivo
- Baja activación + baja retención post-activación → se necesita descubrimiento más profundo

---
