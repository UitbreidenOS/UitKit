---
name: slo-architect
description: "Conception SLO : définir les SLI, fixer les cibles de fiabilité, calculer les budgets d'erreur, concevoir les politiques d'alerte, créer les runbooks — méthodologie Google SRE"
---

# Compétence Architecte SLO

## Quand l'activer
- Définir les objectifs de niveau de service (SLO) pour un service
- Calculer les budgets d'erreur et définir les alertes de taux de combustion
- Passage de la surveillance réactive « est-ce actif ? » à la surveillance proactive basée sur SLO
- Rédaction des SLA pour les clients basées sur les SLO internes
- Création d'une culture de fiabilité à partir de zéro

## Quand NE PAS l'utiliser
- Configuration d'outil de surveillance spécifique — utiliser la doc de l'outil pour la syntaxe Prometheus/Datadog
- Procédures de réponse aux incidents — utiliser la compétence runbook
- Surveillance de disponibilité pure — Uptime Robot est plus simple pour les vérifications basiques

## Instructions

### Définir les SLI (Indicateurs de niveau de service)

```
Définir les SLI pour ce service.

Service : [décrivez — API / app web / pipeline de données / processeur de paiement]
Utilisateurs : [qui dépend de ce service ?]
Ce que « fonctionner » signifie pour les utilisateurs : [leur expérience quand les choses vont bien]

Types de SLI courants :
1. Disponibilité: % du temps le service est accessible
2. Latence : vitesse des réponses
3. Taux d'erreur : % des demandes qui échouent
4. Débit : capacité à gérer la charge
5. Fraîcheur des données : données comment obsolètes ?
6. Correction : les résultats sont-ils exacts ?

Pour mon service, définir 2-4 SLI avec formules de mesure exactes.
```

### Fixer les cibles SLO

```
M'aider à fixer les cibles SLO appropriées.

Criticité du service : [critique / important / interne seulement]
Base de fiabilité actuelle : [uptime / taux d'erreur sur les 90 derniers jours]
Impact commercial du temps d'arrêt : [décrivez — perte de revenus / impact client]
Maturité de l'équipe : [pas SRE / petite équipe SRE / SRE expérimentée]

Guidance de cible SLO :
- 99% (2 neuf): ~7.3 heures de temps d'arrêt/mois — OK pour les outils internes
- 99.5% : ~3.6 heures — SaaS B2B typique
- 99.9% (3 neuf) : ~43 minutes — standard pour client-facing
- 99.95% : ~21 minutes — attente de haute fiabilité
- 99.99% (4 neuf) : ~4.3 minutes — paiements, santé, infrastructure critique

Règle : L'objectif SLO doit être réalisable mais significatif. Ne jamais fixer 100% — c'est inréalisable.

Pour mon service : quel cible SLO est approprié et pourquoi ?
```

### Calcul du budget d'erreur

```
Calculer le budget d'erreur pour ces SLO.

SLO 1 : [métrique] = [X]% sur [28 jours / mois calendrier / roulant]
SLO 2 : [métrique] = [X]%

Budget d'erreur = 1 - cible SLO
Pour une fenêtre de 28 jours :
- SLO 99.9% → budget d'erreur 0.1% = 40.3 minutes de temps d'arrêt autorisé
- SLO 99.5% → budget d'erreur 0.5% = 3.36 heures autorisées

Consommation actuelle du budget d'erreur :
- Combien de budget avons-nous utilisé jusqu'à présent cette période ? [%]
- Combien de jours restent-ils dans la période ?
- Sommes-nous en voie de rester dans le budget ?

Si au-delà du budget : ce que nous devrions arrêter (lancements de nouvelles fonctionnalités) jusqu'à la récupération du budget ?
Si sous budget : quel risque pouvons-nous prendre (maintenance planifiée, expériences) ?
```

### Conception des alertes (alertes de taux de combustion)

```
Concevoir les alertes de taux de combustion pour ce SLO.

SLO : [X]% disponibilité sur 28 jours
Budget d'erreur : [calculé ci-dessus]

Stratégie d'alerte (manuel Google SRE) :
1. Combustion rapide (critique) : consomme le budget 14x plus vite que normal
   → Déclenche en : 1 heure de combustion soutenue
   → Alerte : page immédiatement, cela épuisera le budget en ~2 jours
   
2. Combustion lente (avertissement) : consomme le budget 6x plus vite que normal  
   → Déclenche en : 6 heures de combustion soutenue
   → Alerte : ticket, examiner au prochain standup, pas un appel de réveil
   
3. Budget à X% : alerte de seuil absolu
   → Quand 50% du budget est consommé dans les 14 premiers jours
   → Alerte : « sur la voie d'épuiser le budget, examiner la vélocité »

Pour mon SLO, générer :
- Seuils d'alerte (nombres réels, pas X)
- Noms d'alerte et niveaux de sévérité
- Politique d'escalade on-call
- Référence runbook pour chaque type d'alerte
```

## Exemple

**Utilisateur :** J'ai une API REST utilisée par les clients payants. Pas de SLO actuellement, juste une alerte « est-ce actif ». Par où commencer ?

**Pack de démarrage SLO Claude :**

**Étape 1 — Définir 3 SLI :**
- Disponibilité : `successful_requests / total_requests` (exclure les 400s, compter les 500s + timeouts comme défaillances)
- Latence : `p99_response_time < 500ms` comme ratio de toutes les demandes
- Taux d'erreur : `5xx_responses / total_responses`

**Étape 2 — Fixer les cibles SLO initiales (conservatrices) :**
- Disponibilité : 99.5% (budget de 3.6 heures/mois)
- Latence p99 : 99% des demandes < 500ms
- Taux d'erreur : < 0.5%

**Étape 3 — Une alerte pour commencer :**
Alerte de taux de combustion : si la disponibilité tombe en dessous de 99.5% pendant 1 heure d'affilée → page de l'ingénieur on-call.

**Étape 4 — Examen en 90 jours :**
Examinez la performance réelle par rapport au SLO. Si vous n'avez jamais utilisé le budget d'erreur, la cible peut être trop faible. Si vous êtes constamment dépassé, la cible a besoin d'ajustement ou d'investissement.

---
