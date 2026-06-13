---
name: product-manager-toolkit
description: "Boîte à outils du gestionnaire de produit : priorisation RICE, modèles PRD, rédaction de spécifications de fonctionnalités, alignement des parties prenantes, liste de contrôle go-to-market et flux de découverte à livraison"
---

# Compétence Boîte à Outils du Gestionnaire de Produit

## Quand l'activer
- Prioriser un carnet de commandes de fonctionnalités avec un cadre structuré
- Rédiger un PRD (Product Requirements Document) ou une spécification de fonctionnalité
- Préparer un plan go-to-market pour le lancement d'une nouvelle fonctionnalité
- Animer une séance d'alignement des parties prenantes avant la construction
- Synthétiser la découverte client en exigences actionnables
- Rédiger des histoires utilisateur avec les critères d'acceptation appropriés

## Quand NE PAS utiliser
- Feuille de route stratégique du produit — utilisez la compétence product-roadmap
- Recherche utilisateur et création de personas — utilisez la compétence ux-researcher
- Conception de tests A/B — utilisez la compétence experiment-designer
- Configuration de Jira et planification de sprint — utilisez la compétence jira-expert

## Instructions

### Priorisation RICE

```
Priorisez ce carnet de commandes de fonctionnalités avec la notation RICE.

Fonctionnalités à noter : [liste]
Capacité de l'équipe : [X semaines-ingénieur par sprint]
Horizon temporel : [ce trimestre / ce sprint / ce mois]

Formule RICE :
Score = (Portée × Impact × Confiance) / Effort

PORTÉE — utilisateurs affectés par trimestre :
- Comptez les utilisateurs qui utiliseront réellement cette fonctionnalité dans une fenêtre de 3 mois
- Non : « tous les utilisateurs pourraient théoriquement en bénéficier »
- Oui : « 23 % de notre DAU qui utilisent le flux de paiement »
- Exprimer en nombre (p. ex., 1 500 utilisateurs)

IMPACT — impact par utilisateur (échelle 1-3) :
- 3 : Massif — change fondamentalement la façon dont les utilisateurs travaillent avec le produit
- 2 : Élevé — amélioration significative d'un flux de travail important
- 1 : Moyen — amélioration notable
- 0,5 : Faible — amélioration mineure de la commodité
- 0,25 : Minimal — cosmétique ou cas limite uniquement

CONFIANCE — à quel point êtes-vous certain (0-100 %) :
- 100 % : Validé avec données et recherche
- 80 % : Quelques recherches, hypothèses raisonnables
- 50 % : Intuition, aucune recherche encore
- 20 % : Hypothèse pure, non testée

EFFORT — semaines-ingénieur pour construire (y compris conception, test, déploiement) :
- Soyez honnête. Doublez votre première estimation.
- Inclure : conception, développement, tests, docs, instrumentation d'analyse

Tableau de notation :
| Fonctionnalité | Portée | Impact | Confiance | Effort | Score RICE | Notes |
|---|---|---|---|---|---|---|
| [Fonctionnalité A] | 2500 | 2 | 80% | 3w | (2500×2×0,8)/3 = 1333 | |
| [Fonctionnalité B] | 800 | 3 | 50% | 6w | (800×3×0,5)/6 = 200 | |

Résultat : liste classée + top 3 à construire ce sprint avec capacité [X].
```

### Modèle PRD

```
Rédigez un PRD pour [fonctionnalité].

Fonctionnalité : [décrire]
Problème qu'il résout : [le problème utilisateur, pas la description de la fonctionnalité]
Qui l'a demandé : [clients / interne / basé sur les données]
Priorité : [P0 critique / P1 élevée / P2 moyen]
Publication cible : [sprint / trimestre]

Structure PRD :

## Vue d'ensemble
**Fonctionnalité :** [Nom]
**Auteur :** [nom du PM] | **Date :** [date] | **Statut :** [Brouillon / Révision / Approuvé]
**Propriétaire de l'ingénierie :** [nom] | **Propriétaire de la conception :** [nom]

## Énoncé du problème
[2-3 phrases : qui a ce problème, quel est le coût du problème et pourquoi résoudre cela importe maintenant. Pas de langage de solution ici.]

## Métriques de succès
Métrique principale : [le KPI unique qui change si cela est livré]
Métriques secondaires : [1-2 métriques de soutien]
Contre-métriques : [ce que nous surveillons pour nous assurer que nous ne cassons rien d'autre]

## Histoires utilisateur
Format : « En tant que [type d'utilisateur], je veux [action], afin que [résultat]. »

Chemin heureux :
- En tant que [utilisateur], je veux [action principale], afin que [valeur principale].

Cas limites :
- En tant que [utilisateur], quand [condition limite], je veux [action], afin que [résultat].

États d'erreur :
- En tant que [utilisateur], quand [l'erreur se produit], je veux [retours], afin que [action de récupération].

## Critères d'acceptation
□ [Condition spécifique et testable — doit être binaire réussi/échoué]
□ [Une autre condition]
□ [Condition de gestion d'erreur]

## Champ d'application

Dans le champ d'application :
- [Comportement spécifique 1]
- [Comportement spécifique 2]

Hors du champ d'application (explicite) :
- [Chose que nous ne construisons PAS dans cette version]
- [Cas limite reporté à v2]

## Notes de conception et techniques
[Lien vers Figma / spécification de conception]
[Toute contrainte technique dont le PM est conscient]
[Implications du modèle d'API ou de données]

## Questions ouvertes
- [ ] [Question qui doit être résolue avant le début de la construction] — propriétaire : [nom] — échéance : [date]

## Plan de lancement
- [ ] Instrumentation analytique : [événements à déclencher]
- [ ] Drapeau de fonctionnalité : [oui — plan de déploiement / non]
- [ ] Comms : [client ? / interne uniquement ?]
- [ ] Mise à jour de docs nécessaire : [oui/non]

Générez le PRD pour ma fonctionnalité en utilisant cette structure.
```

### Spécification de fonctionnalité

```
Rédigez une spécification de fonctionnalité détaillée pour [fonctionnalité].

Fonctionnalité : [nom]
PRD : [lien ou collez les exigences clés]
Audience : [équipe d'ingénierie]

Structure de spec (plus technique que PRD) :

## Fonctionnalité : [Nom]
**Version :** 1.0 | **Statut :** Prêt pour le développement

## Exigences fonctionnelles

### [Sous-fonctionnalité ou nom du flux utilisateur]
**Déclencheur :** [ce qui initie ce flux]
**Acteur :** [qui effectue cette action]

Étapes :
1. L'utilisateur [action] → Système [réponse]
2. L'utilisateur [action] → Système [réponse]

Exigences de données :
- Entrée : [quelles données sont nécessaires]
- Sortie : [quelles données sont retournées/stockées]
- Validation : [règles qui régissent les entrées valides]

**États d'erreur :**
| Condition | Réponse du système | L'utilisateur voit |
|---|---|---|
| [condition d'erreur] | [ce qui se passe] | [message d'erreur] |

## Exigences non fonctionnelles
- Performance : [cible de temps de réponse, p. ex., < 200 ms p99]
- Disponibilité : [même SLA que le reste du produit]
- Rétention des données : [combien de temps ces données sont-elles conservées ?]
- Sécurité : [considérations de stockage, d'autorisation ou d'informations personnelles]

## Conception d'API (le cas échéant)
Point de terminaison : [MÉTHODE /chemin]
Corps de la demande : [schéma]
Réponse : [schéma]
Codes d'erreur : [liste]

## Événements d'analyse à déclencher
| Événement | Quand | Propriétés |
|---|---|---|
| [event_name] | [quand il se déclenche] | [propriétés clés] |

## Plan de déploiement
- [ ] Clé du drapeau de fonctionnalité : [feature.flag.name]
- [ ] Test interne : [quelle équipe + quand]
- [ ] Canary : [X % des utilisateurs, commençant quand]
- [ ] Sortie complète : [date ou sprint]

Rédigez la spécification pour ma fonctionnalité.
```

### Liste de contrôle Go-to-Market

```
Construisez une liste de contrôle go-to-market pour [lancement de fonctionnalité].

Fonctionnalité : [décrire]
Type de lancement : [majeur / mineur / interne]
Audience : [tous les utilisateurs / segment / nouvelles inscriptions / clients B2B]
Date de lancement : [cible]

Liste de contrôle go-to-market par rôle :

PRODUIT (propriétaire) :
□ Fonctionnalité entièrement testée et sans bugs sur la mise en scène
□ Événements d'analyse vérifiés en train de se déclencher correctement (vérifier en mode débogage)
□ Drapeau de fonctionnalité configuré avec le % de déploiement correct
□ Plan de restauration documenté (comment désactiver le drapeau en cas de problème)
□ Test A/B configuré (le cas échéant)

INGÉNIERIE (chef) :
□ Tous les critères d'acceptation sont respectés
□ Performance testée à la charge attendue
□ Surveillance des erreurs configurée pour les nouveaux chemins de code
□ Les migrations de base de données sont complètes et testées
□ Le commutateur de désactivation du drapeau de fonctionnalité a été testé

CONCEPTION :
□ Les conceptions finales sont implémentées correctement (vérification ponctuelle avec le concepteur)
□ Réactivité mobile vérifiée
□ Test d'accessibilité réussi
□ Les états vides et d'erreur sont implémentés

MARKETING (si client visible) :
□ Annonce dans l'application ou info-bulle rédigée et examinée
□ E-mail aux utilisateurs affectés rédigé (si nécessaire)
□ Article de blog ou entrée de journal de modification prête à être publiée
□ Documentation d'aide mise à jour ou rédigée
□ L'équipe commerciale a été briefée sur la nouvelle capacité

SUCCÈS CLIENT (si entreprise) :
□ Les gestionnaires de réussite client sont briefés sur la fonctionnalité et ses cas d'usage clés
□ Les clients à contact direct notifiés à l'avance
□ FAQs préparées pour l'équipe d'assistance

JOUR DU LANCEMENT :
□ Drapeau de fonctionnalité activé à [X] % (ou 100 % pour mineur)
□ Moniteur : taux d'erreur sur les nouveaux points de terminaison pendant les 30 premières minutes
□ Moniteur : latence p99 inchangée
□ Annonce publiée (dans l'application / e-mail / blog)
□ Message de mise à jour #launches posté sur Slack

POST-LANCEMENT (1 semaine) :
□ Métrique principale : amélioration de [X] % par rapport à la ligne de base
□ Taux d'erreur : retour à la normale
□ Volume des tickets d'assistance : pas de pic sur cette fonctionnalité
□ Qualitatif : y a-t-il des commentaires des utilisateurs sur la fonctionnalité ?

Générez la liste de contrôle pour votre type de lancement et votre structure d'équipe.
```

## Exemple

**Utilisateur :** PM dans une entreprise SaaS. L'ingénierie me demande de prioriser entre : (A) l'export CSV, (B) l'intégration Slack, (C) le mode sombre, (D) les webhooks personnalisés. Nous avons 4 semaines-ingénieur le prochain sprint. Comment décider ?

**Analyse RICE de Claude :**

Je vais noter ceux-ci en votre nom avec des hypothèses raisonnables — vous devez valider les chiffres, mais cette structure rendra la décision justifiable.

**Hypothèses que j'ai faites (corrigez-moi si je me trompe) :**
- Vous êtes un SaaS B2B, ~500 MAU utilisant les fonctionnalités en question
- Aucune recherche ou donnée antérieure sur ceux-ci spécifiquement

| Fonctionnalité | Portée | Impact | Confiance | Effort | RICE | Verdict |
|---|---|---|---|---|---|---|
| Export CSV | 400 | 2 | 70% | 1w | 560 | **Construire** |
| Intégration Slack | 200 | 3 | 60% | 3w | 120 | Peut-être |
| Mode sombre | 500 | 0,5 | 50% | 2w | 62 | Reporter |
| Webhooks personnalisés | 80 | 3 | 80% | 4w | 48 | Reporter |

**Recommandation : l'export CSV ce sprint, reporter le reste.**

**Pourquoi l'export CSV gagne :** Presque tous les utilisateurs d'un produit B2B ont finalement besoin d'exporter des données. Portée élevée, rapide à construire, confiance élevée qu'elle est nécessaire (si les clients ne la demandent pas encore, ils le feront dans les 6 mois de maturité du produit).

**Pourquoi l'intégration Slack score faible :** L'intégration elle-même peut prendre 3 semaines, mais le parcours Slack-à-valeur est long — les utilisateurs doivent le configurer, configurer les notifications et changer les habitudes. La portée réelle est probablement 30-40 % de votre estimation une fois que l'adoption est prise en compte. Inscrivez-la jusqu'à ce que vous ayez la validation des clients.

**Pourquoi le mode sombre score faible :** C'est une fonctionnalité de base qui n'est presque jamais la raison pour laquelle quelqu'un achète ou se retire. Déployez-le finalement, mais pas au détriment des fonctionnalités de rétention ou d'acquisition.

**Pourquoi les webhooks personnalisés score faible :** Impact élevé par utilisateur, mais seuls les utilisateurs avancés en ont besoin. Les 80 utilisateurs qui en ont besoin sont probablement bruyants mais représentent une petite part de votre levier de croissance.

---
