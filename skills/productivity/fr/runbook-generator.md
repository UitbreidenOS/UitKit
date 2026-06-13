---
name: runbook-generator
description: "Generate runbooks for incidents, deployments, and operational tasks — step-by-step procedures with decision trees, rollback steps, and escalation paths"
---

# Compétence Générateur de Runbooks

## Quand activer
- Création d'un runbook pour une tâche opérationnelle récurrente
- Documentation des procédures de réponse aux incidents avant qu'un incident ne se produise
- Rédaction d'un runbook de déploiement pour une version complexe
- Construction d'un manuel d'appel pour les nouveaux ingénieurs
- Conversion de connaissances tribales informelles en procédures documentées

## Quand NE PAS utiliser
- Tâches ponctuelles — seulement utile de documenter si cela se reproduira
- Débogage exploratoire — les runbooks sont pour les modes de défaillance connus
- Runbooks spécifiques à la plateforme (étapes AWS Console) — vérifier avec l'interface utilisateur actuelle

## Instructions

### Runbook de réponse aux incidents

```
Générez un runbook de réponse aux incidents pour [mode de défaillance].

Mode de défaillance : [ce qui se casse — ex : « pool de connexions à base de données épuisé », « timeout du service de paiement », « disque plein »]
Service affecté : [quel service/système]
Symptômes (ce que l'on-call voit) : [alertes déclenchées / rapports utilisateurs / tableaux de bord]
Sévérité : [P1 critique / P2 majeur / P3 mineur]

Structure du runbook :
1. Résumé : ce que couvre ce runbook en 1-2 phrases
2. Symptômes : noms d'alertes exacts + ce que les utilisateurs expériment
3. Triage initial (< 5 minutes) :
   - Cela se passe-t-il réellement ? (vérifier)
   - Quel est le rayon de souffle ? (combien d'utilisateurs affectés)
   - C'est un nouveau déploiement ? (considérer un rollback)
4. Étapes d'investigation (ordonnées, avec résultats attendus) :
   - Étape 1 : [commande/vérification → ce que vous attendez de voir]
   - Étape 2 : [commande/vérification → point de décision]
5. Options d'atténuation (du plus rapide au plus lent) :
   - Option A : [correction rapide, temporaire]
   - Option B : [correction moyenne]
   - Option C : [correction appropriée, nécessite un déploiement]
6. Procédure de rollback (si causé par un déploiement) :
   - [étapes exactes]
7. Après l'incident : [ce qu'il faut vérifier avant de clôturer]
8. Escalade : [quand appeler qui]
```

### Runbook de déploiement

```
Générez un runbook de déploiement pour [service/fonctionnalité].

Service : [nom]
Type de déploiement : [roulant / blue-green / canary / tout-en-un]
Niveau de risque : [bas / moyen / élevé]
Dépendances : [services qui doivent être mis à jour avant/après]
Migrations de base de données : [oui/non — décrire si oui]

Structure du runbook :
1. Checklist de pré-déploiement (30-60 min avant) :
   □ Tous les tests réussissent en CI ?
   □ Migration testée sur staging ?
   □ Plan de rollback documenté ?
   □ Équipe notifiée (si risque élevé) ?
   □ Tableaux de bord de surveillance ouverts ?

2. Étapes de déploiement (commandes exactes ou étapes UI) :
   Étape 1 : [action] → Résultat attendu : [X]
   Étape 2 : [action] → Vérifier : [vérification Y]
   
3. Validation (immédiatement après le déploiement) :
   □ Le point de terminaison d'intégrité retourne-t-il 200 ?
   □ Le taux d'erreur est-il dans la plage normale ?
   □ Les flux utilisateur clés fonctionnent-ils ? (test de fumée)
   □ La migration de base de données s'est-elle déroulée correctement ?

4. Procédure de rollback (si quelque chose tourne mal) :
   Étape 1 : [commande de rollback exacte]
   Étape 2 : [rollback de base de données si nécessaire]
   Point de décision : quand rollback par rapport à hotfix ?

5. Post-déploiement (1 heure après) :
   □ Les taux d'erreur sont-ils stables ?
   □ Les métriques de performance sont-elles normales ?
   □ Fermer le problème/ticket de déploiement
```

### Runbook de tâche opérationnelle

```
Générez un runbook pour cette tâche opérationnelle récurrente.

Tâche : [décrire — ex : « vérification mensuelle de sauvegarde de base de données », « renouvellement de certificat SSL », « examen d'accès trimestriel »]
Fréquence : [quotidien / hebdomadaire / mensuel / trimestriel / ad-hoc]
Qui l'exécute : [rôle — tout ingénieur / ingénieur senior / DBA / devops]
Temps approximatif : [X minutes]

Sections :
1. Objectif : pourquoi cette tâche existe, ce qui se casse si elle est ignorée
2. Prérequis : accès/permissions nécessaires, outils requis
3. Étapes : numérotées, avec commandes exactes et résultats attendus
4. Vérification : comment confirmer l'accomplissement de la tâche
5. Gestion des défaillances : que faire si une étape échoue
6. Documentation : où enregistrer l'accomplissement (ticket / feuille de calcul / outil runbook)

Rendez-le exécutable par quelqu'un d'inconnu du système.
```

### Section manuel d'appel

```
Écrivez une section du manuel d'appel pour [équipe/service].

Audience : ingénieur entrant en appel pour la première fois
Contexte du service : [décrire ce que le service fait et qui l'utilise]

Couvrir :
1. De quoi êtes-vous responsable (et ce que vous NE l'êtes PAS)
2. Comment trier une alerte dans les 5 premières minutes
3. Attentes de communication (quand mettre à jour le canal incident, qui impliquer)
4. Matrice d'escalade : [rôle] → [contact] → [quand escalader]
5. Les 3 alertes les plus courantes et quoi faire pour chacune
6. Outils dont vous aurez besoin : [liste avec liens]
7. Que faire après la fermeture d'un incident (déclencheur post-mortem, nettoyage de ticket)
8. Conseils de survie (de l'équipe qui a écrit ceci)
```

## Exemple

**Utilisateur :** Générez un runbook pour l'alerte « haute utilisation mémoire » sur notre API Node.js.

**Claude génère :**

---
**RUNBOOK : Utilisation Élevée de la Mémoire — API Node.js**
*Sévérité : P2 (P1 si OOMKilled)*

**Symptômes :**
- Alerte : `api_memory_usage_percent > 85` pour > 10 minutes
- Impact utilisateur : ralentissements potentiels ou redémarrages si la mémoire atteint la limite

**Triage (5 premières minutes) :**
1. `kubectl top pods -n production | grep api` → Ceci affecte-t-il un pod ou tous les pods ?
2. `kubectl logs [pod-affecté] --tail=200 | grep -i "memory\|heap\|gc"` → Des journaux GC ?
3. Vérifier l'historique de déploiement : `kubectl rollout history deployment/api` → Cela a-t-il commencé après un déploiement ?

**Si pod unique :**
```bash
kubectl delete pod [pod-affecté]  # le pod redémarre avec une mémoire fraîche
```
Surveiller : la mémoire grimpe-t-elle à nouveau en 30 min ? → probable fuite mémoire, escalader.

**Si tous les pods (systémique) :**
- Vérifier le pic de trafic récent : regarder RPS sur le tableau de bord
- Si pic de trafic : augmenter `kubectl scale deployment api --replicas=X`
- Si pas de pic de trafic : c'est une fuite mémoire, appeler ingénieur senior

**Déclencheur de rollback :** Si le problème de mémoire a commencé après le déploiement d'aujourd'hui :
```bash
kubectl rollout undo deployment/api
```

**Escalade :** Si la mémoire reste > 90% après redémarrage ET pas de déploiement → appeler ingénieur senior on-call.

---
