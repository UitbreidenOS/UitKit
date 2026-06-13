# Flujo de trabajo de respuesta a incidentes

Flujo de trabajo de extremo a extremo para gestionar un incidente de producción desde la detección hasta el post-mortem.

## Cuándo usar

Utilice este flujo de trabajo cuando:
- Se dispara una alerta que indica impacto en el usuario
- Un cliente reporta que algo está roto
- La implementación causó comportamiento inesperado
- Las tasas de error o latencia exceden los umbrales SLO

## Fase 1: Detectar y declarar (0-5 minutos)

**Paso 1 — Verifique el incidente:**
```
¿Esto realmente afecta a los usuarios? Verifique:
- Dashboard de tasa de error (superior al 1%?)
- Dashboard de latencia (p99 sobre SLO?)
- Reportes directos de usuarios a través de soporte
- Resultados de monitores sintéticos
```

**Paso 2 — Clasificar gravedad:**
- **SEV1**: Interrupción completa del servicio o pérdida de datos. Todos los manos.
- **SEV2**: Degradación significativa (>25% de usuarios afectados). IC asignado.
- **SEV3**: Impacto menor, solución alternativa disponible. Manejar en horario comercial.

**Paso 3 — Declarar y comunicar:**
```
Publicar en #incidents:
[SEV{N}] {Nombre del servicio} — {descripción de una línea}
Impacto: {quién y qué se ve afectado}
IC: {su nombre}
Sala de guerra: {link}
Próxima actualización: {tiempo, máximo 30 min para SEV1}
```

## Fase 2: Investigar (5-30 minutos)

**Haga estas preguntas en orden:**

1. ¿Ha habido cambios recientemente? (implementación, configuración, pico de tráfico)
   ```bash
   git log --oneline -10  # commits recientes
   # Verificar: registros de implementación, cambios de banderas de función, cambios de configuración
   ```

2. ¿Cuál es el radio de explosión?
   - ¿Qué usuarios se ven afectados?
   - ¿Qué funciones/puntos finales fallan?
   - ¿Qué dependencias están involucradas?

3. ¿Qué muestran los registros?
   ```bash
   # Encuentre el primer error
   # Verificar: mensajes de error, stack traces, timing
   ```

4. ¿Cómo se ven los datos?
   ```bash
   # Verificar: cantidad de conexiones DB, profundidad de cola, tasa de acierto de caché
   ```

**Hipótesis clasificadas por probabilidad:**
1. Implementación reciente (si se implementó en las últimas 2 horas)
2. Dependencia ascendente (comprobar páginas de estado)
3. Pico de tráfico o problema de capacidad
4. Corrupción de datos o estado inesperado
5. Fallo de infraestructura

## Fase 3: Mitigar (camino más corto hacia la reducción del impacto del usuario)

**Opciones en orden de velocidad:**

1. **Revertir** (más rápido si lo causa la implementación):
   ```bash
   # Reversión basada en Git o interruptor de parada de bandera de función
   ```

2. **Deshabilitar la función** (bandera de función):
   ```
   Establecer feature.broken_thing = false
   ```

3. **Escalar** (si hay problema de capacidad):
   ```bash
   kubectl scale deployment api --replicas=10
   ```

4. **Aplicar un hotfix** (si la reversión no es posible):
   - Rama desde la etiqueta que estaba en producción
   - Corrección mínima, revisión acelerada
   - Implementar con monitoreo adicional

**La mitigación no significa resolución.** La mitigación reduce el impacto del usuario; la resolución soluciona la causa raíz.

## Fase 4: Comunicar (en curso durante todo)

**Actualización del cliente (para SEV1/SEV2):**
```
Estamos experimentando {breve descripción}. Nuestro equipo está investigando activamente.
Tiempo detectado: {tiempo}
Impacto: {descripción orientada al usuario}
Próxima actualización: {15-30 min a partir de ahora}
Página de estado: {link}
```

**Actualización de resolución:**
```
[RESUELTO] {Nombre del servicio} — {tiempo resuelto}
Duración: {X horas Y minutos}
Impacto: {qué se vio afectado}
Causa raíz: {breve — post-mortem completo dentro de 48 horas}
Estado: Todos los sistemas funcionan normalmente.
```

## Fase 5: Resolver y verificar

**Antes de cerrar el incidente:**
- [ ] Las tasas de error vuelven a la línea de base normal
- [ ] Latencia vuelve a la normalidad
- [ ] Sin registros anómalos
- [ ] Los usuarios afectados pueden completar el flujo de trabajo impactado
- [ ] El equipo en llamada está seguro de que el problema se resolvió

## Fase 6: Post-mortem (dentro de 48 horas para SEV1/SEV2)

**Documento post-mortem:**
1. **Resumen**: Qué sucedió, cuánto tiempo, cuál fue el impacto
2. **Cronología**: Minuto a minuto desde la detección hasta la resolución
3. **Causa raíz**: La causa subyacente real (no el síntoma)
4. **Factores contribuyentes**: Qué hizo que esto fuera peor o más difícil de detectar/arreglar
5. **Lo que salió bien**: Velocidad de detección, comunicación, herramientas que ayudaron
6. **Lo que salió mal**: Brechas en monitoreo, detección lenta, fallos de comunicación
7. **Elementos de acción**: Mejoras específicas, asignadas al propietario, limitadas en tiempo

**Cultura sin culpa:**
- Los post-mortems identifican fallas del sistema, no fallas individuales
- El objetivo es prevenir la recurrencia, no asignar culpa
- Publique post-mortems ampliamente — toda la compañía aprende

## Habilidades relacionadas

- `/runbook-generator` — crear runbooks para modos de fallo específicos
- `/slo-architect` — diseñar SLO's y alertas de tasa de quemado
- `/observability-designer` — instrumentar su sistema para detectar más rápido
- `/agents/roles/incident-commander` — asistente de IA para coordinación de sala de guerra

---
