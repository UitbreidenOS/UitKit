# Guide des motifs de déploiement

Stratégies de déploiement courantes — quand utiliser chacune, comment la mettre en œuvre et les compromis.

## Motif 1 : Déploiement direct (tout à la fois)

**Comment ça fonctionne :** Déployer la nouvelle version sur tous les serveurs simultanément.

**Quand utiliser :**
- Services non critiques ou outils internes
- Petite base d'utilisateurs où la restauration est rapide
- Services sans état sans migrations de base de données
- Correctifs d'urgence qui doivent être partout immédiatement

**Comment :**
```bash
# Style Railway / Render / Heroku
git push origin main

# Docker / Kubernetes
kubectl set image deployment/api api=my-image:v2.0.0

# Vérifier
kubectl rollout status deployment/api
```

**Restauration :**
```bash
kubectl rollout undo deployment/api
# ou : déployer la balise d'image précédente
```

**Risques :** Impact complet si quelque chose ne va pas. Tous les utilisateurs affectés immédiatement.

---

## Motif 2 : Déploiement progressif

**Comment ça fonctionne :** Remplacer les instances une à une. À tout moment, certaines instances exécutent l'ancien code, d'autres le nouveau.

**Quand utiliser :**
- Services qui peuvent gérer en toute sécurité les demandes provenant des anciennes et nouvelles versions simultanément
- APIs web standards sans modifications de schéma incompatibles
- La plupart des services de production comme stratégie par défaut

**Comment (Kubernetes) :**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # ajouter 1 nouveau pod avant supprimer ancien
      maxUnavailable: 0    # ne jamais avoir moins que les pods souhaités en cours d'exécution
```

```bash
# Déployer
kubectl apply -f deployment.yaml

# Surveiller
kubectl rollout status deployment/api
# Watch: kubectl get pods -w
```

**Prérequis :** L'application doit être compatible avec les versions antérieures pendant la transition (ancien et nouveau exécutés simultanément).

**Restauration :**
```bash
kubectl rollout undo deployment/api
```

---

## Motif 3 : Déploiement bleu-vert

**Comment ça fonctionne :** Exécuter deux environnements identiques (bleu = courant, vert = nouveau). Basculer le trafic instantanément.

**Quand utiliser :**
- Exigence de zéro temps d'arrêt
- Besoin de capacité de restauration instantanée
- Migration de base de données qui nécessite une version d'application spécifique
- Services à fort trafic où la mise en place progressive n'est pas assez granulaire

**Comment :**
```yaml
# Deux déploiements : api-blue (courant) et api-green (nouveau)
# Le service sélectionne quel déploiement obtient le trafic

# Déployer une nouvelle version sur green
kubectl apply -f deployment-green.yaml

# Tester green (trafic interne seulement)
kubectl port-forward svc/api-green 3001:3000

# Basculer le trafic vers green
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# Green est maintenant actif. Blue est conservé pour une restauration instantanée.
# Après 24h stable : décommissionner blue
kubectl delete deployment api-blue
```

**Avec AWS ALB :**
```bash
# Routage pondéré : 100% → blue
# Tester la nouvelle version via endpoint green direct
# Swap : 100% → green
aws elbv2 modify-rule --rule-arn ... --actions ... 
```

---

## Motif 4 : Déploiement canari

**Comment ça fonctionne :** Envoyer un petit % du trafic à la nouvelle version, augmenter progressivement.

**Quand utiliser :**
- Grande base d'utilisateurs où même 1% du trafic est un signal significatif
- Modifications à haut risque où vous voulez des données utilisateur réelles avant la mise en place complète
- Déploiement piloté par les SLO (restauration automatique si les métriques se dégradent)

**Comment (Kubernetes + Argo Rollouts) :**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5    # 5% du trafic
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

**Canari simple sans Argo (Kubernetes) :**
```bash
# Exécuter un nouveau déploiement à côté d'un ancien avec 1 réplica (ancien a 9 = 10% canari)
kubectl scale deployment api-new --replicas=1
kubectl scale deployment api-old --replicas=9

# Si sain, basculer progressivement
kubectl scale deployment api-new --replicas=5
kubectl scale deployment api-old --replicas=5

# Basculement complet
kubectl scale deployment api-new --replicas=10
kubectl delete deployment api-old
```

---

## Motif 5 : Indicateurs de fonctionnalité (bascules de version)

**Comment ça fonctionne :** Le code est déployé mais les fonctionnalités sont activées/désactivées sans déploiement.

**Quand utiliser :**
- Dissocier le déploiement de la version (toujours recommandé)
- Tests A/B des nouvelles fonctionnalités
- Déploiement progressif par segment d'utilisateur (% d'utilisateurs, clients spécifiques, utilisateurs bêta)
- Bouton d'arrêt pour les fonctionnalités qui pourraient causer des problèmes

**Mise en œuvre simple :**
```typescript
// Utiliser un service d'indicateur de fonctionnalité (LaunchDarkly, Flagsmith, Growthbook, ou PostHog)
const flags = await getFeatureFlags(userId)

if (flags.newCheckoutFlow) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}

// Ou : basé sur les variables d'environnement (plus simple, moins granulaire)
const showNewFeature = process.env.FEATURE_NEW_CHECKOUT === 'true'
```

**Indicateurs de fonctionnalité PostHog (niveau gratuit, open source) :**
```typescript
import { PostHog } from 'posthog-node'
const client = new PostHog(process.env.POSTHOG_API_KEY!)

const isEnabled = await client.isFeatureEnabled('new-checkout', userId)
```

---

## Choisir le bon motif

| Motif | Vitesse | Restauration | Risque | Meilleur pour |
|---|---|---|---|---|
| Direct | Rapide | Lent | Élevé | Correctifs, outils internes |
| Roulant | Moyen | Moyen | Moyen | Déploiements API standards |
| Bleu-vert | Rapide (basculement) | Instantané | Bas | Exigence zéro temps d'arrêt |
| Canari | Lent | Rapide | Très bas | Haut risque, grande échelle |
| Indicateurs de fonctionnalité | Instantané | Instantané | Minimal | Toutes les fonctionnalités de production |

**Recommandation par défaut :** Déploiement progressif + indicateurs de fonctionnalité. Roulant pour l'infrastructure ; indicateurs pour les changements de produit.

---
