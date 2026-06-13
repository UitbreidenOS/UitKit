# Guía de patrones de implementación

Estrategias de implementación comunes — cuándo usar cada una, cómo implementarla y los compromisos.

## Patrón 1: Implementación directa (todo a la vez)

**Cómo funciona:** Implementar nueva versión en todos los servidores simultáneamente.

**Cuándo usar:**
- Servicios no críticos u herramientas internas
- Base de usuarios pequeña donde la reversión es rápida
- Servicios sin estado sin migraciones de base de datos
- Correcciones de emergencia que deben estar en todas partes inmediatamente

**Cómo:**
```bash
# Estilo Railway / Render / Heroku
git push origin main

# Docker / Kubernetes
kubectl set image deployment/api api=my-image:v2.0.0

# Verificar
kubectl rollout status deployment/api
```

**Reversión:**
```bash
kubectl rollout undo deployment/api
# o: implementar la etiqueta de imagen anterior
```

**Riesgos:** Impacto completo si algo va mal. Todos los usuarios afectados inmediatamente.

---

## Patrón 2: Implementación progresiva

**Cómo funciona:** Reemplazar instancias una por una. En cualquier momento, algunas ejecutan código anterior, otras nuevo.

**Cuándo usar:**
- Servicios que pueden manejar de forma segura solicitudes de versiones antigua y nueva simultáneamente
- API web estándar sin cambios de esquema incompatibles
- La mayoría de servicios de producción como estrategia predeterminada

**Cómo (Kubernetes):**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # agregar 1 nuevo pod antes de eliminar antiguo
      maxUnavailable: 0    # nunca tener menos que pods deseados
```

```bash
# Implementar
kubectl apply -f deployment.yaml

# Monitorear
kubectl rollout status deployment/api
# Watch: kubectl get pods -w
```

**Requisito previo:** La aplicación debe ser compatible con versiones anteriores durante la transición (antiguo y nuevo se ejecutan simultáneamente).

**Reversión:**
```bash
kubectl rollout undo deployment/api
```

---

## Patrón 3: Implementación azul-verde

**Cómo funciona:** Ejecutar dos entornos idénticos (azul = actual, verde = nuevo). Cambiar tráfico instantáneamente.

**Cuándo usar:**
- Requisito de tiempo de inactividad cero
- Necesidad de capacidad de reversión instantánea
- Migración de base de datos que requiere versión de aplicación específica
- Servicios de alto tráfico donde el despliegue gradual no es lo suficientemente granular

**Cómo:**
```yaml
# Dos implementaciones: api-blue (actual) y api-green (nuevo)
# El servicio selecciona qué implementación obtiene tráfico

# Implementar nueva versión a green
kubectl apply -f deployment-green.yaml

# Prueba green (solo tráfico interno)
kubectl port-forward svc/api-green 3001:3000

# Cambiar tráfico a green
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# Green está ahora activo. Blue se mantiene para reversión instantánea.
# Después de 24h estable: desmantelar blue
kubectl delete deployment api-blue
```

**Con AWS ALB:**
```bash
# Enrutamiento ponderado: 100% → azul
# Probar nueva versión vía endpoint verde directo
# Intercambio: 100% → verde
aws elbv2 modify-rule --rule-arn ... --actions ... 
```

---

## Patrón 4: Implementación canaria

**Cómo funciona:** Enviar pequeño % de tráfico a nueva versión, aumentar gradualmente.

**Cuándo usar:**
- Base de usuarios grande donde incluso 1% de tráfico es señal significativa
- Cambios de alto riesgo donde se necesitan datos de usuarios reales antes de despliegue completo
- Implementación impulsada por SLO (reversión automática si las métricas se degradan)

**Cómo (Kubernetes + Argo Rollouts):**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5    # 5% de tráfico
        - pause: {duration: 10m}
        - setWeight: 25
        - pause: {duration: 20m}
        - setWeight: 50
        - pause: {duration: 20m}
        - setWeight: 100
      analysis:
        templates:
          - templateName: success-rate
        args:
          - name: service-name
            value: api
```

**Canario simple sin Argo (Kubernetes):**
```bash
# Ejecutar nueva implementación junto a antigua con 1 réplica (antigua tiene 9 = 10% canario)
kubectl scale deployment api-new --replicas=1
kubectl scale deployment api-old --replicas=9

# Si está sano, cambiar gradualmente
kubectl scale deployment api-new --replicas=5
kubectl scale deployment api-old --replicas=5

# Cambio completo
kubectl scale deployment api-new --replicas=10
kubectl delete deployment api-old
```

---

## Patrón 5: Indicadores de características (conmutadores de lanzamiento)

**Cómo funciona:** El código se implementa pero las características se activan/desactivan sin implementación.

**Cuándo usar:**
- Desacoplar implementación del lanzamiento (siempre recomendado)
- Pruebas A/B de características nuevas
- Despliegue gradual por segmento de usuario (% de usuarios, clientes específicos, usuarios beta)
- Interruptor de emergencia para características que podrían causar problemas

**Implementación simple:**
```typescript
// Usar servicio de indicador de característica (LaunchDarkly, Flagsmith, Growthbook, o PostHog)
const flags = await getFeatureFlags(userId)

if (flags.newCheckoutFlow) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}

// O: basado en variables de entorno (más simple, menos granular)
const showNewFeature = process.env.FEATURE_NEW_CHECKOUT === 'true'
```

**Indicadores de características PostHog (nivel gratuito, código abierto):**
```typescript
import { PostHog } from 'posthog-node'
const client = new PostHog(process.env.POSTHOG_API_KEY!)

const isEnabled = await client.isFeatureEnabled('new-checkout', userId)
```

---

## Elegir el patrón correcto

| Patrón | Velocidad | Reversión | Riesgo | Mejor para |
|---|---|---|---|---|
| Directo | Rápido | Lento | Alto | Correcciones, herramientas internas |
| Progresivo | Medio | Medio | Medio | Implementaciones API estándar |
| Azul-verde | Rápido (cambio) | Instantáneo | Bajo | Requisito de tiempo de inactividad cero |
| Canario | Lento | Rápido | Muy bajo | Alto riesgo, gran escala |
| Indicadores de características | Instantáneo | Instantáneo | Mínimo | Todas las características de producción |

**Recomendación predeterminada:** Implementación progresiva + indicadores de características. Progresiva para infraestructura; indicadores para cambios de producto.

---
