# Flux de travail de lancement de fonctionnalité

Processus de bout en bout pour lancer une fonctionnalité de produit — du développement final à la communication et la surveillance.

## Quand utiliser

Utilisez ce flux de travail pour tout lancement de fonctionnalité qui:
- Affecte plus de 10% de votre base d'utilisateurs
- Affecte les flux de paiement, l'authentification ou la fonctionnalité de produit principal
- Implique des intégrations externes ou des API sur lesquelles d'autres services dépendent
- N'importe quoi avec une annonce marketing attachée

## Phase 1: Préparation au lancement (1 semaine avant)

**Liste de vérification d'ingénierie:**
- [ ] Tous les critères d'acceptation de la spécification sont satisfaits
- [ ] Le code a été examiné et approuvé
- [ ] Tests unitaires et d'intégration réussis
- [ ] Tests E2E réussis en staging
- [ ] Performances testées: aucune régression de la latence p99
- [ ] Drapeau de fonctionnalité configuré pour le déploiement progressif
- [ ] Événements d'analyse instrumentés et vérifiés
- [ ] Plan de restauration documenté et testé
- [ ] Alertes de surveillance configurées pour les nouveaux chemins de code

**Liste de vérification du produit:**
- [ ] Fonctionnalité testée par PM en staging par rapport aux critères d'acceptation
- [ ] Cas limites testés (état vide, état d'erreur, mobile)
- [ ] Documentation d'aide écrite ou mise à jour
- [ ] Conseils intégrés ou intégration pour la nouvelle interface utilisateur (le cas échéant)
- [ ] Mesures de succès définies et base de référence capturée

**Liste de vérification de conception:**
- [ ] La mise en œuvre finale correspond aux conceptions approuvées
- [ ] Responsive sur mobile (si web)
- [ ] Accessibilité: navigation au clavier, lecteur d'écran, contraste des couleurs
- [ ] États de chargement et d'erreur mis en œuvre

## Phase 2: Préparation de la communication (3-5 jours avant)

**Communication interne:**
- [ ] Équipe d'ingénierie informée de ce qui se lance et quand
- [ ] Équipe de réussite client informée (quoi de neuf, questions attendues des clients)
- [ ] Équipe de vente informée si cela affecte ce qu'ils peuvent démontrer ou vendre
- [ ] Équipe de support dispose de documentation pour gérer les questions courantes

**Communication externe (si orientée client):**
- [ ] Entrée de journal des modifications écrite
- [ ] Annonce in-app rédigée (si nécessaire)
- [ ] Email aux utilisateurs affectés rédigé (si nécessaire)
- [ ] Article de blog ou média social préparé (si important)
- [ ] Presse / PR coordonnées (si lancement majeur)

## Phase 3: Exécution du lancement

**Jour du lancement:**

```
1. Confirmer que tous les éléments de la liste de vérification de pré-lancement sont terminés
2. Notifier l'équipe dans Slack: "Lancement [Fonctionnalité] à [heure]"
3. Activer le drapeau de fonctionnalité pour [X]% des utilisateurs (commencer petit: 5-10%)
4. Surveiller pendant 30 minutes:
   - Taux d'erreur sur les nouveaux chemins de code
   - La latence p99 inchangée
   - Les métriques métier principales ne régressent pas
5. Si sain: augmenter à 50%, attendre 30 min
6. Si sain: augmenter à 100%
7. Annoncer dans Slack: "Fonctionnalité en direct pour 100% des utilisateurs ✅"
8. Publier l'entrée du journal des modifications / article de blog si préparé
```

**Déclencheur de restauration:** Si le taux d'erreur augmente > 2x la ligne de base ou les erreurs orientées utilisateur augmentent → désactiver immédiatement le drapeau de fonctionnalité et enquêter.

## Phase 4: Surveillance après lancement (24-72 heures)

**Suivre pendant 48 heures après le lancement:**
- [ ] Le taux d'erreur revient à la normale
- [ ] La latence p99 revient à la normale
- [ ] La mesure de succès principale se déplace dans la bonne direction
- [ ] Volume de tickets d'assistance: aucune augmentation liée à la fonctionnalité
- [ ] Commentaires des utilisateurs (le cas échéant): NPS, réactions in-app

**Traiter rapidement:**
- Les bogues que les utilisateurs signalent dans les 24 premières heures (les clients sont plus indulgents immédiatement après le lancement)
- Les modèles d'interface utilisateur confus signalés par le support
- Les cas limites qui ont échappé aux tests

## Phase 5: Révision (1 semaine après)

**Rétrospective des fonctionnalités (15 minutes asynchrone ou synchrone):**
1. La fonctionnalité a-t-elle atteint les mesures de succès que nous avons définies?
2. Quel retour d'information avons-nous reçu des utilisateurs?
3. Qu'est-ce qui a bien fonctionné dans le processus de lancement?
4. Qu'aurions-nous fait différemment la prochaine fois?
5. Des travaux de suivi identifiés (bogues, améliorations, idées v2)?

**Mettre à jour la feuille de route:**
- Archivez la spécification de fonctionnalité avec le résultat réel par rapport au résultat prédit
- Ajouter les éléments de suivi au backlog
- Publier les apprentissages internes (surtout si quelque chose de surprenant s'est produit)

## Types de lancement et processus approprié pour chacun

| Type | Public | Déploiement | Communication | Surveillance |
|---|---|---|---|---|
| **Majeur** | Tous les utilisateurs, flux principal | Drapeau de fonctionnalité, 5→50→100% | Email + in-app + blog | Surveillance active 72h |
| **Modéré** | Segment spécifique | Progressif | In-app ou email | Surveillance active 48h |
| **Mineur** | Tous les utilisateurs, non-core | Direct vers 100% | Journal des modifications uniquement | Passif 24h |
| **Interne** | Équipe uniquement | Direct | Slack | Surveillance standard |
| **Beta** | Utilisateurs opt-in | Invite uniquement | Email d'invitation | Vérification hebdomadaire |

---
