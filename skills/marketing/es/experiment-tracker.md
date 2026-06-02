---
name: experiment-tracker
description: "Seguimiento de pruebas A/B: redacción de hipótesis, calculadora de tamaño de muestra, análisis de resultados e interpretación de significancia estadística para experimentos de crecimiento"
---

# Habilidad de Seguimiento de Experimentos

## Cuándo activar
- Ejecutando una prueba A/B y necesitas una hipótesis estructurada y métricas de éxito antes del lanzamiento
- Calculando el tamaño de muestra y la duración de la prueba antes de iniciar un experimento
- Analizando resultados de pruebas y determinando si has alcanzado significancia estadística
- Documentando los aprendizajes del experimento para el equipo o el registro de experimentos
- Priorizando qué experimentos ejecutar a continuación basándote en puntuación ICE o RICE
- Una prueba ha concluido y necesitas decidir: publicar, eliminar o iterar

## Cuándo NO usar
- Diseño completo de experimentos desde cero — usa `/experiment-designer` para eso
- Configuración de analítica y seguimiento de eventos — usa `/analytics-tracking`
- Interpretar investigación cualitativa o entrevistas de usuarios — metodología diferente
- Cuando tu tamaño de muestra es demasiado pequeño para ejecutar cualquier prueba válida (< 100 conversiones por variante esperadas)

## Instrucciones

### Marco de redacción de hipótesis

```
Escribe una hipótesis de experimento estructurada para mi prueba A/B.

Idea de prueba: [describe el cambio que quieres hacer]
Página / funcionalidad: [dónde en el producto o embudo]
Estado actual: [qué existe hoy]
Cambio propuesto: [qué quieres probar]

Produce una hipótesis en este formato:

Creemos que [CAMBIO]
para [SEGMENTO DE AUDIENCIA]
resultará en [RESULTADO ESPERADO]
porque [MECANISMO / RAZONAMIENTO]
Sabremos que esto es verdad cuando [CRITERIOS DE ÉXITO MEDIBLES]
y la prueba haya alcanzado [TAMAÑO MÍNIMO DE MUESTRA] conversiones por variante
con [95%] de confianza estadística.

También produce:
- Métrica principal: [la única métrica que determina ganar/perder]
- Métricas secundarias: [métricas de guardarraíl — no deben retroceder]
- Efecto mínimo detectable (EMD): [la mejora más pequeña que vale la pena publicar]
- Riesgo: [qué puede salir mal — efecto novedad, interacción de segmentos, etc.]
```

### Calculadora de tamaño de muestra

```
Calcula el tamaño de muestra requerido para mi prueba A/B.

Tipo de prueba: [tasa de conversión / ingresos por usuario / retención / engagement]
Tasa base actual: [X%] (p. ej., tasa de conversión actual)
Efecto mínimo detectable (EMD): [X%] (mejora relativa que vale la pena detectar)
  — Conservador: mejora relativa del 5-10% (se necesita muestra grande)
  — Moderado: mejora relativa del 15-20% (típico)
  — Agresivo: mejora relativa del 30%+ (muestra pequeña, solo detecta cambios grandes)
Significancia estadística: [95%] (estándar) o [90%] (aceptable para pruebas de bajo riesgo)
Poder estadístico: [80%] (estándar) o [90%] (pruebas de alto riesgo)
Número de variantes: [2] (A vs. B) o [3+] (multivariante — dividir por n-1)

Cálculo:

Para pruebas de tasa de conversión, usa la prueba z de dos proporciones:

n requerida por variante = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1 - p2)²

Donde:
- p1 = tasa base
- p2 = tasa base × (1 + EMD)
- z_α/2 = 1,96 (significancia del 95%)
- z_β = 0,842 (poder del 80%)

Proporciona:
- Conversiones requeridas por variante: [N]
- Visitantes requeridos por variante (a la tasa de conversión actual): [N]
- Duración esperada de la prueba a [tráfico actual] por día: [X días / semanas]
- Advertencia si la duración > 8 semanas (los efectos estacionales contaminarán los resultados)
- Advertencia si las conversiones por variante < 100 (la prueba está infrapotenciada — aumenta el EMD o espera)

Muéstrame los números para mi prueba.
```

### Lista de verificación previa al lanzamiento

```
Ejecuta una verificación previa al lanzamiento de mi prueba A/B antes de iniciarla.

Nombre de la prueba: [nombre]
Herramienta: [Optimizely / VWO / LaunchDarkly / GrowthBook / personalizada]
Hipótesis: [del marco de hipótesis anterior]
Tamaño de muestra necesario: [N por variante]
Tráfico esperado por día: [N visitantes]
Duración esperada de la prueba: [X días]

Lista de verificación previa al lanzamiento:

SEGUIMIENTO
□ La métrica principal se rastrea correctamente (el evento se dispara en la conversión, no en la carga de página)
□ Se rastrean métricas secundarias/de guardarraíl (ingresos, duración de sesión, tasa de error)
□ Se rastrea el evento de asignación de prueba (para poder segmentar por variante en analítica)
□ Sin rupturas en el embudo existente o errores en el control — probar una base rota = resultados inválidos
□ QA en staging: confirmar que la variante se muestra correctamente en navegadores + móvil

CONFIGURACIÓN
□ División de tráfico confirmada: [50/50 o X/Y — documentar la división]
□ Reglas de segmentación documentadas: [quién está incluido / excluido]
□ Exclusión mutua: ¿esta prueba entra en conflicto con alguna otra prueba en ejecución?
□ Grupo de control si es necesario: si la prueba afecta significativamente los ingresos, mantener el 5-10% fuera de todas las pruebas

DURACIÓN
□ Ejecutar durante al menos 2 ciclos comerciales completos (mínimo 2 semanas — nunca parar en la primera significancia)
□ No revisar los resultados diariamente y parar anticipadamente — esto infla la tasa de falsos positivos
□ Establecer una fecha de parada fija: [fecha] — no extender sin una razón documentada

RIESGO
□ ¿Puedes revertir la variante instantáneamente si una métrica de guardarraíl se desploma?
□ ¿Hay riesgo de efecto novedad? (nueva UI = aumento a corto plazo que no persiste)
□ ¿Interactuará este segmento de prueba con otra prueba? Mapea tu matriz de pruebas.

Firma cuando todos los puntos estén marcados.
```

### Análisis de resultados

```
Analiza los resultados de mi prueba A/B y dime qué hacer.

Prueba: [nombre]
Duración: [X días]
Herramienta: [plataforma de analítica]

Resultados:
Control (A):
- Visitantes: [N]
- Conversiones: [N]
- Tasa de conversión: [X%]
- Ingresos por visitante (si aplica): $[X]

Variante (B):
- Visitantes: [N]
- Conversiones: [N]
- Tasa de conversión: [X%]
- Ingresos por visitante (si aplica): $[X]

Mejora relativa: [(B-A)/A × 100]%
Valor p: [X] (de tu herramienta de prueba)
Confianza: [X%]
Significancia estadística alcanzada: [Sí / No]

Análisis:

MARCO DE DECISIÓN:
1. ¿Es el resultado estadísticamente significativo al 95%?
   SÍ → proceder al análisis de impacto empresarial
   NO → verificar: ¿alcanzaste el tamaño de muestra requerido?
     - Si sí + sin significancia: el efecto es menor que el EMD → probablemente no vale la pena publicar
     - Si no: extender la prueba o aceptar que no puedes detectar un efecto tan pequeño

2. ¿Es la mejora significativa en términos económicos?
   Impacto anual en ingresos de esta mejora = [cálculo]:
   Mejora × conversiones diarias × valor promedio del pedido × 365 = $[X]/año
   Si el impacto anual < coste de implementar permanentemente, reconsiderar.

3. ¿Regresaron alguna métrica de guardarraíl?
   ¿Ingresos por visitante, duración de sesión, tasa de error, contactos de soporte?
   Si sí: NO publicar aunque la métrica principal sea positiva. Un aumento en registros que duplica los contactos de soporte no es una victoria.

4. Análisis de segmentos — ¿se mantiene la mejora en:
   - ¿Móvil vs. escritorio?
   - ¿Usuarios nuevos vs. recurrentes?
   - ¿Fuente de tráfico (de pago vs. orgánico)?
   - ¿Geografía?
   Los efectos de interacción significativos sugieren que la variante funciona para un segmento, no universalmente.

DECISIÓN: [PUBLICAR / ELIMINAR / PUBLICAR-SEGMENTADO / ITERAR]
Razonamiento: [específico, basado en los números]
Siguiente experimento: [qué probar a continuación según estos resultados]
```

### Plantilla de registro de experimentos

```
Documenta este experimento para el registro de experimentos del equipo.

Experimento: [nombre — buscable, descriptivo]
Fecha: [inicio] → [fin]
Responsable: [nombre]
Equipo: [crecimiento / producto / marketing]
Estado: [en ejecución / concluido]

## Hipótesis
[Del marco de hipótesis]

## Configuración
- Herramienta: [Optimizely / VWO / personalizada]
- División de tráfico: [50/50]
- Audiencia: [todos los usuarios / usuarios nuevos / móvil / etc.]
- Segmentación: [URL, segmento, feature flag]

## Resultados
| Métrica | Control | Variante | Mejora | Significancia |
|---|---|---|---|---|
| Principal: [métrica] | [X%] | [X%] | [+X%] | [95%] |
| Guardarraíl: [métrica] | [X] | [X] | [+/-X%] | [N/A] |
| Guardarraíl: [métrica] | [X] | [X] | [+/-X%] | [N/A] |

Muestra: [N] por variante | Duración: [X días] | Valor p: [X]

## Decisión
[PUBLICADO / ELIMINADO / ITERADO]
Justificación: [por qué]

## Aprendizaje
[Qué nos dice esto sobre el comportamiento del usuario — no solo "la variante ganó"]
[Qué probar a continuación]

## Impacto anual (si se publicó)
$[X] de ingresos incrementales o mejora de [X%] en la métrica
```

### Priorización de experimentos

```
Prioriza mi backlog de experimentos usando la puntuación ICE.

Mis ideas de experimento:
1. [Idea 1]
2. [Idea 2]
3. [Idea 3]
[añadir todas las que sean necesarias]

Puntúa cada una con ICE:

IMPACTO (1-10): Si esto funciona con la mejora esperada, ¿cuán grande es el impacto en ingresos/métrica?
- 10: > $100K de impacto anual o > 20% de mejora en una métrica clave
- 7: $20-100K o mejora del 10-20%
- 4: $5-20K o mejora del 5-10%
- 1: < $5K o < 5% de mejora

CONFIANZA (1-10): ¿Qué tan seguros estamos de que esto funcionará?
- 10: Datos previos, investigación de usuarios y casos demostrados en otros apuntan a esto
- 7: Señal cualitativa fuerte o prueba similar funcionó en área adyacente
- 4: Basado en teoría, sin evidencia directa
- 1: Pura intuición

FACILIDAD (1-10): ¿Qué tan rápido podemos ejecutar esta prueba?
- 10: Solo cambio de texto, sin necesidad de desarrollo, en vivo en 1 día
- 7: Cambio menor de frontend, 1-2 días de desarrollo
- 4: Cambio de backend o lógica, 1 semana de desarrollo
- 1: Cambio de arquitectura, 4+ semanas de desarrollo

Puntuación ICE = (Impacto + Confianza + Facilidad) / 3

Clasifica todas las ideas por puntuación ICE. Señala aquellas que requieren > 2 semanas de ingeniería como Alto Esfuerzo — evalúa si deben ir al backlog de producto en su lugar.

Produce un calendario de experimentos ordenado para las próximas 4 semanas.
```

## Ejemplo

**Usuario:** Quiero probar cambiar el CTA de nuestra página de precios de "Iniciar Prueba Gratuita" a "Ver Precios" porque creo que los usuarios quieren ver los números antes de comprometerse. La conversión base es del 3,2%. ¿Qué tamaño de muestra necesito y cómo lo configuro?

**Resultado de Claude:**

**Hipótesis:**
Creemos que cambiar el CTA principal de "Iniciar Prueba Gratuita" a "Ver Precios"
para todos los visitantes que aterrizan en /precios
resultará en una mayor tasa de clics hacia la página de pago o selección de plan
porque los usuarios en modo de comparación de precios quieren ver los números antes de comprometerse con el encuadre de una "prueba".
Sabremos que esto es verdad cuando la tasa de clics del CTA aumente en ≥ 15% (relativo)
con un 95% de confianza estadística y un 80% de poder.

**Cálculo del tamaño de muestra:**
- Base: tasa de clics del CTA del 3,2%
- EMD: 15% relativo = tasa objetivo del 3,68%
- Requerido: **2.843 visitantes por variante** (5.686 en total)
- A 500 visitantes/día en la página de precios: **prueba de 12 días**
- A 200 visitantes/día: **prueba de 29 días** — ejecútala, vale la espera

**Previo al lanzamiento:**
- Confirmar que el evento de clic del CTA se dispara en analítica (no en la carga de página)
- Rastrear: vistas de la página de selección de plan (guardarraíl — no debe caer)
- Rastrear: registros de prueba (la métrica real aguas abajo — segmentar por variante en tu herramienta de analítica)
- No parar anticipadamente — aunque alcances significancia en la semana 1, ejecuta las 2 semanas completas

**Qué observar:**
Si "Ver Precios" gana en clics pero los registros de prueba no aumentan, los usuarios son más curiosos pero no más comprometidos. Eso es un problema de claridad de precios, no un problema de CTA — la próxima prueba es la propia página de precios.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
