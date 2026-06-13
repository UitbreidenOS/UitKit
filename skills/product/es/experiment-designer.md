---
name: experiment-designer
description: "Diseño de pruebas A/B y experimentos: escritura de hipótesis, cálculo de tamaño de muestra, significancia estadística, seguimiento de experimentos, evitar errores comunes, interpretar resultados"
---

# Habilidad de Diseñador de Experimentos

## Cuándo activar
- Diseño de una prueba A/B o experimento multivariado
- Cálculo del tamaño de muestra requerido antes de ejecutar una prueba
- Interpretación de resultados de experimentos (¿es significativo? ¿debemos enviarlo?)
- Configuración de un marco de experimentación para un equipo
- Evitar errores comunes de prueba (escaneo, efecto de novedad, comparaciones múltiples)
- Decidir si ejecutar un experimento o simplemente enviar

## Cuándo NO usar
- Cuando tenga < 1.000 usuarios/semana — no hay suficiente tráfico para pruebas significativas; use cualitativo
- Cuando el cambio es una corrección de bug o claramente bueno — no pruebe lo obvio, envíelo
- Cuando necesite resultados en < 1 semana — las pruebas insuficientes son peores que no hacer pruebas
- Configuración de herramientas de análisis — use la habilidad analytics-tracking

## Instrucciones

### Diseño de hipótesis y experimentos

```
Diseñe una prueba A/B para [cambio].

Lo que queremos probar: [describe el cambio — copia, interfaz de usuario, flujo, función]
Por qué creemos que funcionará: [el insight o los datos detrás de esta idea]
Métrica principal: [la métrica que optimizamos]
Métricas secundarias: [métricas para ver regresiones]
Tráfico disponible: [sesiones/día o usuarios/semana en esta página/flujo]

Diseño del experimento:

1. Hipótesis (escriba antes de tocar el código):
   Formato: "Creemos que [cambio] mejorará [métrica] para [segmento de usuario] porque [razón basada en insight/datos]."
   
   Mal: "Creemos que un botón CTA más grande aumentará las conversiones."
   Bien: "Creemos que cambiar el texto CTA de 'Comenzar' a 'Comenzar Prueba Gratuita' aumentará las inscripciones de prueba para visitantes por primera vez porque nuestros datos de entrevista muestran que los usuarios no se dan cuenta de que la prueba es gratuita."

2. Variantes:
   - Control (A): estado actual — sin cambios
   - Variante B: el cambio
   - (Opcional) Variante C: una versión más audaz del cambio
   
   Regla: pruebe una cosa por experimento. Dos cambios = no sabe cuál impulsó el resultado.

3. División de tráfico:
   - 2 variantes: 50/50 (poder estadístico máximo)
   - 3 variantes: 33/33/33 — requiere más tráfico o prueba más larga
   - Aumento: comience en 5-10% → confirme sin errores → exposición completa

4. Métrica principal:
   [Nombre] — medido como: [definición]
   Efecto mínimo detectable: [X% mejora relativa que consideramos significativa]
   
5. Criterios de éxito (decida antes de lanzar — sin cambio de objetivos):
   Ganar: p-valor < 0,05 Y MDE alcanzado Y sin regresión significativa en métricas secundarias
   Llame temprano: solo si claramente dañino — NO PARE temprano para un resultado ganador

Genere brief de experimento completo para mi prueba.
```

### Calculadora de tamaño de muestra

```
Calcule el tamaño de muestra requerido para [experimento].

Tipo de métrica principal: [tasa de conversión / valor medio / proporción]
Línea de base actual: [X% tasa de conversión / $X promedio / X% de usuarios]
Efecto mínimo detectable (MDE): [X% cambio relativo — la victoria más pequeña que vale la pena enviar]
Poder estadístico: [80% estándar / 90% para experimentos críticos]
Nivel de significancia: [α = 0,05 estándar / α = 0,01 para apuestas altas]
Número de variantes: [2 / 3 / 4]

Fórmula de tamaño de muestra (para proporciones):
n = 2 × (z_α/2 + z_β)² × p(1-p) / δ²

donde:
- z_α/2 = 1,96 (para α=0,05, dos colas)
- z_β = 0,84 (para poder 80%)
- p = tasa de conversión de línea de base
- δ = diferencia absoluta (línea de base × MDE)

Para sus entradas:
Línea de base: [X%]
MDE: [X% relativo] = [Y% absoluto]
n requerida por variante: [calculado]
Muestra total: [n × número de variantes]

A su nivel de tráfico ([X visitantes/día]):
Duración de prueba requerida: [X días]

Indicadores de advertencia:
- Si duración > 4 semanas: rediseño de prueba (aumentar MDE, o esperar más tráfico)
- Si MDE < 1%: probablemente no vale la pena probar — difícil alcanzar significancia
- Si MDE > 30%: muy optimista — verifique que el caso comercial sea real

Calcule para mis entradas específicas y confirme que la duración sea viable.
```

### Errores comunes de experimentos

```
Revise mi diseño de experimento e indique problemas potenciales.

Descripción del experimento: [describa la prueba que planifica]
Duración planeada: [X días]
Fuente de tráfico: [todo el tráfico / segmento / página específica]

Errores comunes a revisar:

□ ESCANEO: Detener una prueba temprano porque los resultados se ven bien
  Riesgo: la tasa de falsos positivos se dispara — la variante ganadora es a menudo un golpe de suerte
  Corrección: Decide duración de ejecución antes de lanzar y cumpla (o use pruebas secuenciales)

□ COMPARACIONES MÚLTIPLES: Probar 5 variantes = 5 oportunidades de encontrar falso positivo
  Riesgo: en α=0,05, ejecutar 5 pruebas → 0,25 falsos positivos esperados por lote
  Corrección: Use corrección de Bonferroni (α/n) o limite a 2-3 variantes

□ EFECTO DE NOVEDAD: Los usuarios por primera vez responden a todo lo nuevo
  Riesgo: el aumento inicial desaparece después de la primera exposición
  Corrección: Ejecute prueba para ciclos comerciales completos de 2+ (típicamente 2 semanas mínimo)

□ DESAJUSTE DE PROPORCIÓN DE MUESTRA: Tráfico desigual a variantes
  Riesgo: randomización rota — resultados inválidos
  Corrección: Trace proporción de asignación acumulativa diariamente; alerta si > 5% del objetivo

□ EFECTOS DE RED: Los usuarios interactúan entre sí
  Riesgo: grupos de control y variante no son independientes
  Corrección: Cluster aleatorizado por equipo/cuenta, no por usuario individual

□ SESGO DE SUPERVIVENCIA: Solo medir usuarios comprometidos
  Riesgo: la mejora se ve excelente pero solo para usuarios que habrían convertido de todas formas
  Corrección: Incluya todos los usuarios elegibles, no solo aquellos que "se comprometieron" con la variante

□ LAG DE INSTRUMENTACIÓN: El cálculo de métricas se retrasa detrás del experimento
  Riesgo: los resultados tempranos muestran números inflados o deflacionados
  Corrección: Agregue 24-48 horas antes de leer resultados; verifique el disparo de eventos en modo depuración

Indique cuáles de estos se aplican a mi experimento planeado + correcciones específicas.
```

### Interpretación de resultados

```
Interprete mis resultados de experimentos.

Experimento: [describa la prueba]
Duración: [X días]
Tamaño de muestra por variante: [X control / X variante]
Métrica principal:
  Control: [X%]
  Variante: [X%]
  Aumento relativo: [+X%]
  p-valor: [X]
  Intervalo de confianza: [X% a X%]
Métricas secundarias: [lista y si se movieron]

Marco de interpretación:

Estadísticamente significativo + prácticamente significativo: ENVIAR
  Ambos p < 0,05 Y aumento relativo ≥ MDE → victoria clara, enviar

Estadísticamente significativo + NO prácticamente significativo: NO ENVIAR
  p < 0,05 pero aumento de 0,3% en línea de base de 2% → real pero no vale el costo de mantenimiento

NO significativo + direccionalmente positivo: EXTENDER O REDISEÑAR
  p = 0,12 con tendencia positiva → insuficiente poder; extienda si el costo es bajo; rediseñe si es costoso

NO significativo + plano: CONTINUAR
  p > 0,5, efecto cerca de cero → la idea no funcionó; falle rápido e intente siguiente hipótesis

Regresión significativa en métrica secundaria: DETENER, NO ENVIAR
  Incluso si la métrica principal ganó, una regresión en ingresos o retención anula

Para mis resultados:
1. Conclusión estadística: [significativo / no significativo / límite]
2. Significancia práctica: [significativa / no significativa]
3. Evaluación de métrica secundaria: [¿alguna regresión?]
4. Decisión: [enviar / no enviar / extender / rediseñar]
5. Lo que aprendimos (incluso si no enviamos): [el insight que hace la siguiente prueba mejor]
```

## Ejemplo

**Usuario:** Estamos probando un nuevo flujo de pago. La conversión de línea de base es 3,2%. Queremos detectar una mejora relativa del 15% (a 3,68%). Obtenemos 500 visitantes/día al pago. ¿Cuánto tiempo deberíamos ejecutar?

**Cálculo de Claude:**

**Cálculo de tamaño de muestra:**
- Línea de base: 3,2%
- Objetivo: 3,68% (aumento relativo de 15% = 0,48% absoluto)
- α = 0,05 (dos colas), Poder = 80%
- n requerida por variante ≈ **4.950 usuarios**
- Muestra total necesaria: **9.900 usuarios** (ambas variantes)

**A 500 visitantes/día:**
- 9.900 ÷ 500 = **~20 días mínimo**

**Mi recomendación: ejecute durante 28 días (4 semanas completas)**

Por qué 4 semanas, no 20 días:
1. Captura la estacionalidad semanal completa (el comportamiento de pago difiere de semana a fin de semana)
2. Amortiguador para efecto de novedad — la nueva interfaz de pago puede verse artificialmente bien en la semana 1
3. Permite 4 ciclos comerciales completos (lunes-domingo)

**Antes de lanzar:**
- Confirme que su herramienta de análisis registra correctamente los eventos "pago visitado" y "compra completada" por separado
- Configure ahora sus criterios de éxito: "Enviamos si p < 0,05 Y aumento ≥ 15% Y sin regresión en valor de pedido promedio"
- No mire resultados hasta el día 28

**Una precaución:** Si su cifra de 500 visitantes/día incluye usuarios móviles y de escritorio, segmente los resultados por dispositivo. Los flujos de pago se comportan muy diferente en móvil vs. escritorio — un resultado ganador general podría estar enmascarando una regresión en una plataforma.

---
