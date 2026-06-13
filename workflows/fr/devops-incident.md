# Flux de travail — Gestion des incidents DevOps

Un flux de travail structuré pour les ingénieurs DevOps et SRE utilisant Claude Code — de la première alerte au triage, à la coordination en salle de guerre, à la résolution et au post-mortem.

---

## Vue d'ensemble

**Gains de temps :** Une réponse aux incidents structurée avec Claude réduit la charge cognitive lors d'événements à forte pression, diminue de 60 % le temps de rédaction des post-mortems, et garantit que les lacunes dans les runbooks sont capturées avant le prochain incident.

**Ce que ce flux de travail couvre :**
- Déclenchement de l'alerte → triage → évaluation de la sévérité
- Coordination de la salle de guerre P1
- Pistes d'investigation parallèles
- Communication avec les parties prenantes pendant l'incident
- Résolution et vérification
- Processus de post-mortem

**Prérequis :** `/incident-response` et `/oncall-runbook` installés. Recommandé : PagerDuty ou OpsGenie MCP connecté, runbooks accessibles depuis Claude.

---

## Phase 1 : Déclenchement de l'alerte (0-5 minutes)

### Les 60 premières secondes — triage de sévérité

Ne pagez personne et n'ouvrez pas de salle de guerre avant d'avoir consacré 60 secondes à l'évaluation.

```
/incident-response

Alerte : [nom de l'alerte depuis PagerDuty/Datadog]
Service : [quel service]
Heure : [alerte déclenchée à HH:MM]

Triage rapide :
1. Que m'indique réellement cette alerte ? (copiez le texte de l'alerte + le seuil)
2. Cette alerte est-elle nouvelle, ou a-t-elle été déclenchée récemment ? (vérifier : les 7 derniers jours de cette alerte)
3. Y a-t-il un déploiement récent dans les 30-60 dernières minutes ? (vérifier : journal des déploiements)
4. D'autres services connexes alertent-ils également ? (vérifier : autres services dans le graphe de dépendances)
5. Existe-t-il un runbook pour cette alerte ? (vérifier : bibliothèque de runbooks)

Évaluation initiale : P1 / P2 / P3 ?

Critères P1 : service client en panne, risque de perte de données, échec du traitement des paiements, > 10 % des utilisateurs affectés
Critères P2 : performances dégradées, taux d'erreur élevé, < 10 % des utilisateurs affectés
Critères P3 : tâche en arrière-plan retardée, service non visible par les clients, performances dégradées mais SLO toujours respecté
```

**Règle de décision :**
- P1 → passez immédiatement à la Phase 2 (salle de guerre)
- P2 → investiguez vous-même pendant 10 minutes avant de pager d'autres personnes ; si non résolu, escaladez
- P3 → investiguez et résolvez pendant les heures normales ; pagez-vous un rappel, pas les autres

---

## Phase 2 : Mise en place de la salle de guerre (P1 uniquement — 5-10 minutes)

### Pager et rassembler

```
/incident-response

P1 confirmé : [brève description de ce qui se passe]

Mise en place de la salle de guerre :

1. Créez le canal d'incident : #inc-[YYYY-MM-DD]-[description-courte]
2. Postez le message initial dans le canal :

--- MODÈLE ---
🔴 INCIDENT P1 — [NOM DU SERVICE] — [HH:MM]

Statut : EN COURS D'INVESTIGATION
Sévérité : P1
Services affectés : [liste]
Impact client : [décrivez — ex. "le paiement retourne des erreurs 500 pour tous les utilisateurs"]
Responsable d'incident : [votre nom]
Ingénieur de garde : [nom]

Toutes les mises à jour dans ce fil. Ne créez pas de conversations parallèles.
Salle de guerre : [lien Zoom/Meet]
Runbook : [lien]
Tableau de bord : [lien]
--- FIN DU MODÈLE ---

3. Qui pager pour ce type d'incident :
- Responsable technique : [nom] — si P1 persiste > 15 minutes
- Équipe base de données : [contact] — si lié à la base de données
- Sécurité : [contact] — si toute indication de violation ou exposition de données
- Customer Success : [contact] — pour gérer les communications clients
- PDG : [contact] — si impact sur le chiffre d'affaires client > $X ou panne > 30 minutes

Pagez [listez qui pager] maintenant.
```

### Rôle du responsable d'incident

Pour un P1, une personne est responsable d'incident. Elle n'investigue pas — elle coordonne.

```
/incident-response

Je suis responsable d'incident pour ce P1. Attribuez les pistes d'investigation.

Incident : [décrivez]
Ingénieurs disponibles : [listez ceux qui sont dans la salle de guerre]

Pistes d'investigation parallèles :
Piste A — Investigation de la cause profonde : [nom de l'ingénieur]
  - En cours d'investigation : [journaux de service, base de données, déploiement récent]
  - Rapport dans : 5 minutes avec les conclusions ou "investigation en cours"

Piste B — Mitigation : [nom de l'ingénieur]
  - Essai : [rollback / redémarrage / désactivation du feature flag / mise à l'échelle manuelle]
  - ETA : [X minutes]

Piste C — Évaluation de l'impact client : [nom de l'ingénieur]
  - Mesure : [combien d'utilisateurs affectés, quelles zones géographiques, taux d'erreur]
  - Résultat : impact client quantifié pour la mise à jour des parties prenantes

Mon rôle en tant que responsable d'incident : recevoir les mises à jour de statut toutes les 5 minutes, prendre des décisions, communiquer en externe.

Générez un modèle de mise à jour toutes les 5 minutes que je posterai dans le canal.
```

---

## Phase 3 : Investigation (pistes parallèles)

### Investigation des journaux

```
/incident-response

En cours d'investigation : [description de l'incident]

Journaux disponibles (collez ou décrivez) :
[collez les lignes de journaux pertinentes — filtrez sur la fenêtre temporelle de l'incident]

Aidez-moi à identifier :
1. Première occurrence de l'erreur — horodatage exact et ligne de journal
2. Motif : s'agit-il d'un seul type d'erreur spécifique, ou de plusieurs ?
3. Toute trace de pile ou erreur en amont indiquant la cause profonde
4. Toute corrélation : cela se corrèle-t-il avec un utilisateur, un endpoint ou un motif de requête spécifique ?
5. Taux d'erreurs dans le temps — s'aggrave-t-il, est-il stable ou se rétablit-il ?

Sur la base des journaux : quelles sont les 2-3 principales hypothèses pour la cause profonde ?
```

### Investigation des métriques

```
/incident-response

Métriques pendant la fenêtre d'incident [HH:MM à HH:MM] :

[Collez ou décrivez ce que vous voyez dans votre tableau de bord]
- CPU : [tendance pendant l'incident]
- Mémoire : [tendance]
- Taux d'erreur : [tendance]
- Latence : [tendance]
- Débit (RPS) : [tendance]
- Connexions à la base de données : [tendance]
- Toute autre métrique pertinente]

Interprétez :
1. Qu'est-ce qui a changé en premier — quelle métrique a bougé avant les autres ?
2. S'agit-il d'un épuisement des ressources (CPU/mémoire) ou d'une erreur applicative ?
3. Y a-t-il un "point de rupture" dans la métrique — un moment où les choses se sont soudainement aggravées ?
4. Quelle métrique devrais-je surveiller pour savoir si la mitigation fonctionne ?
```

### Décision de mitigation

```
/incident-response

Options de mitigation pour : [décrivez l'hypothèse de cause profonde ou la cause profonde confirmée]

Options disponibles :
A. Rollback du dernier déploiement (déploiement [X] à [HH:MM]) — rétablissement estimé : [X min] — risque : [Y]
B. Redémarrage des pods : `kubectl rollout restart deployment/[service] -n [namespace]` — rétablissement : 2-3 min — risque : requêtes en cours abandonnées
C. Désactivation du feature flag : [nom du flag] — rétablissement : 1-2 min — risque : [fonctionnalité supprimée pour tous les utilisateurs]
D. Mise à l'échelle : ajouter N répliques — rétablissement : 3-5 min — risque : coût ; ne résout pas la cause profonde
E. [Autre option]

Recommandez : quelle mitigation convient le mieux à cette situation ?
Critères : délai le plus rapide pour rétablir l'impact client, risque le plus faible d'aggraver les choses, réversible.

Que dois-je surveiller dans les 5 minutes suivant l'application de la mitigation pour confirmer qu'elle fonctionne ?
```

---

## Phase 4 : Communication pendant l'incident

### Mise à jour de la page de statut client

```
/incident-response

Rédigez une mise à jour de la page de statut.

Audience : clients / public
Ton : honnête, calme, sans alarmer
Évitez : le jargon technique, l'attribution de responsabilité, le partage des détails internes de l'investigation

Statut : [En cours d'investigation / Identifié / Surveillance / Résolu]
Composant affecté : [quel service / quelle fonctionnalité]
Impact client : [ce qu'ils vivent — "certains utilisateurs peuvent rencontrer des échecs lors du paiement"]
Heure de début : [HH:MM fuseau horaire]
Ce que nous faisons : [bref — "notre équipe a identifié le problème et déploie un correctif"]

NE DITES PAS : "Nous nous excusons pour la gêne occasionnée." — surutilisé et vide de sens.
DITES : impact spécifique, ce que vous faites, et quand vous mettrez à jour de nouveau.

Modèle :
[STATUT] : [Titre court de ce qui se passe]
Nous [investiguons / avons identifié / surveillons] un problème affectant [composant].
[Ce que les clients vivent — spécifique].
Notre équipe [action en cours — ex. déploie un correctif / annule un changement].
Nous mettrons à jour cette page à [heure de la prochaine mise à jour].
```

### Mise à jour interne pour les parties prenantes (toutes les 15-30 minutes pendant un P1)

```
/incident-response

Rédigez une mise à jour interne pour les parties prenantes pour l'incident P1 [NOM].

Temps écoulé depuis le début de l'incident : [X minutes]
Dernière mise à jour postée : [HH:MM]

Statut actuel :
- Cause profonde : [identifiée / investigation en cours]
- Statut de la mitigation : [appliquée / en cours / pas encore]
- Impact client : [actuel — ex. "50 % des requêtes de paiement échouent, le reste fonctionne"]
- ETA de résolution : [X minutes / inconnu]

Audience : [canal Slack avec équipe dirigeante, CS, ventes]
Longueur : 5-6 phrases maximum — personne ne lit un mur de texte pendant une crise.

Format :
[HEURE] Mise à jour P1 — [SERVICE] :
Statut : [un mot]
Impact : [état actuel de l'impact client]
Cause profonde : [trouvée/non trouvée]
Action : [ce qui se passe en ce moment]
ETA : [estimation ou "investigation en cours"]
Prochaine mise à jour : [HH:MM]
```

---

## Phase 5 : Résolution et vérification

### Liste de contrôle de vérification de résolution

```
/incident-response

Vérifiez la résolution de l'incident pour [SERVICE].

Mitigation appliquée : [ce qui a été fait]
Heure d'application : [HH:MM]

Vérifiez le rétablissement selon ces dimensions :

1. Taux d'erreur : taux d'erreur actuel vs. référence (doit être de retour au SLO)
   Actuel : [X%] | Référence : [X%] | Seuil SLO : [X%]

2. Latence : latence p99 de retour à la normale
   Actuelle : [Xms] | Référence : [Xms] | Seuil SLO : [Xms]

3. Débit : RPS se rétablissant aux niveaux pré-incident
   Actuel : [X] | Pré-incident : [X]

4. Vérification côté client : exécutez un test synthétique ou vérifiez les données utilisateurs réels
   Un client peut-il effectuer avec succès [le flux affecté] ?

5. Services en aval : effets en cascade sur les services dépendants ?
   [Vérifiez chaque service qui dépend de celui-ci]

Si tous les contrôles réussissent : déclarez l'incident résolu.
Si un contrôle échoue : ne déclarez pas résolu — poursuivez l'investigation.

Rédigez le message "tout est clair" pour le canal d'incident et la page de statut.
```

### Message de fin d'incident

```
/incident-response

Rédigez le message de fin d'incident pour :

Incident : [nom]
Durée : [X minutes au total]
Cause profonde (brève) : [ce qui s'est passé]
Correctif appliqué : [ce qui a résolu le problème]
Suites dont l'équipe doit être informée : [changements de surveillance, ticket créé, etc.]

Canal : #inc-[nom] (copie vers #engineering et page de statut)

Format : 3-4 phrases. Spécifique. Incluez l'heure de résolution.

N'écrivez pas : "Nous sommes heureux d'annoncer que l'incident est résolu." Trop formel.
Écrivez : "À partir de [HH:MM], [service] est entièrement rétabli. La cause profonde était [X]. Nous avons [Y] et créé un ticket pour [prévenir la récurrence]."
```

---

## Phase 6 : Post-mortem

### Post-mortem dans les 48 heures suivant l'incident

```
/incident-response

Rédigez le post-mortem pour [NOM DE L'INCIDENT] — [DATE].

Données d'entrée :
- Historique du canal d'incident : [collez ou résumez]
- Chronologie telle que vous la connaissez :
  [HH:MM] — [ce qui s'est passé]
  [HH:MM] — [ce qui s'est passé]
  [HH:MM] — [résolution]
- Cause profonde trouvée : [décrivez]
- Facteurs contributifs : [tout ce qui a aggravé la situation ou rendu la détection/résolution plus difficile]
- Impact : [durée, services affectés, impact client, impact financier si connu]

Structure du post-mortem :

## Résumé
[3-4 phrases : ce qui s'est passé, impact, résolution]

## Chronologie
[Chronologie précise avec les heures — premier signe, première alerte, triage, étapes d'investigation, correctif appliqué, vérification]

## Cause profonde
[Cause profonde technique spécifique — pas "le service est tombé" mais ce qui l'a fait tomber]

## Facteurs contributifs
[Ce qui a aggravé la situation : détection lente, runbook manquant, rollback non testé, test défaillant qui a manqué le bug]

## Impact
[Quantifiez : N minutes d'indisponibilité, X% des utilisateurs affectés, Y tickets de support créés, $Z d'impact financier]

## Ce qui a bien fonctionné
[Soyez spécifique — ce qui a fonctionné dans la réponse et que nous devons préserver]

## Actions à entreprendre
Format : [QUOI] | Responsable : [NOM] | Échéance : [DATE]
- [ ] [Action 1 — ex. ajouter une alerte pour [X] qui aurait détecté cela 10 minutes plus tôt] | Responsable : [nom] | Échéance : [date]
- [ ] [Action 2] | Responsable : [nom] | Échéance : [date]
- [ ] [Action 3 — mettre à jour le runbook avec les étapes de résolution utilisées aujourd'hui] | Responsable : [nom] | Échéance : [date]

Règle : maximum 5 actions. Chacune doit être spécifique et attribuée. Les actions vagues ne sont pas des actions.

## Ce que nous ne corrigerons pas
[Tout ce que vous avez délibérément déprioritisé après évaluation du coût vs. risque]
```

---

## Préparation à l'astreinte (avant votre rotation)

### Liste de contrôle pré-rotation

Exécutez cela 2 jours avant le début de votre période d'astreinte :

```
/oncall-runbook

Préparation pré-rotation pour la période d'astreinte commençant le [DATE] :

Mes services à couvrir : [liste]

Pour chaque service, vérifiez :
1. Le runbook est-il à jour ? (Mis à jour au cours des 90 derniers jours ?)
2. Ai-je accès à tous les outils nécessaires ? (Console cloud, Kubernetes, base de données, journaux)
3. Mes notifications PagerDuty sont-elles correctement configurées ? (Testez en déclenchant manuellement une alerte de faible sévérité)
4. Est-ce que je connais le chemin d'escalade ? (Nom, téléphone, Slack pour chaque niveau)

Lacunes trouvées : [listez tout ce qui manque]
Actions avant le début de la période : [liste]

Également :
- Lisez les 3 derniers post-mortems — comprenez ce qui a récemment posé problème
- Vérifiez si des déploiements sont prévus pendant ma période — coordonnez avec l'équipe
- Connaissez le contexte métier : des périodes de fort trafic, des lancements ou des événements prévus cette semaine ?
```

---

## Indicateurs de référence

| Métrique | Objectif | Signe d'alerte |
|---|---|---|
| De l'alerte à la décision de triage | < 5 minutes | > 10 min : qualité de l'alerte ou lacune dans le runbook |
| Salle de guerre P1 constituée | < 10 minutes | > 20 min : problème de communication ou de pagination |
| Délai avant la première tentative de mitigation | < 20 minutes | > 30 min : chemin d'investigation peu clair |
| MTTR (P1) | < 45 minutes | > 60 min : lacune dans le runbook ou les compétences |
| MTTR (P2) | < 2 heures | > 4 heures : triage inexact ou investigation inefficace |
| Post-mortem publié | Dans les 48 heures | > 72 heures : leçons perdues |
| Actions réalisées | 100 % dans les 30 jours | < 70 % : les actions ne sont pas de vrais engagements |
| Incidents par mois (tendance) | En baisse | Stable ou en hausse : problèmes systémiques non résolus |

---
