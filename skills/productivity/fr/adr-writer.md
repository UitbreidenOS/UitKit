---
name: adr-writer
description: "Écrire des enregistrements de décision architecturale au format Nygard. Déclenche sur les choix architecturaux, les comparaisons d'approches ou les décisions passées non documentées."
---

# ADR Writer

## Quand l'activer

- Prendre une décision entre deux ou plusieurs approches techniques (par ex. choisir un ORM, une stratégie de cache, un système de file d'attente)
- Après une décision prise verbalement en réunion ou par chat nécessitant une documentation formelle
- Quand le code montre un motif inhabituel sans explication du choix
- Avant de s'engager dans un changement architectural difficile à inverser (schéma de base de données, modèle d'authentification, versioning d'API)
- Quand une décision affecte plusieurs équipes ou services et nécessite une traçabilité claire

## Quand ne pas l'utiliser

- Détails d'implémentation facilement modifiables sans impact (nommage de variables, structure de dossiers dans un module)
- Décisions purement stylistiques sans compromis
- Mises à jour de version de dépendances tierces sauf si elles introduisent des changements critiques
- Décisions entièrement inversibles en moins d'une heure sans effets en aval

## Instructions

### Qu'est-ce qui justifie un ADR

Une décision nécessite un ADR si ces trois critères sont tous vrais :
1. Elle est **difficile à inverser** — l'annuler demande un effort significatif ou a des impacts en aval
2. Elle serait **surprenante sans contexte** — un nouveau développeur lisant le code se demanderait pourquoi
3. Un **vrai compromis existait** — au moins une alternative plausible a été considérée et rejetée

En cas de doute, écrivez l'ADR. Le coût de documenter un non-événement est faible ; celui de manquer la documentation d'une décision critique est élevé.

### Format ADR (Nygard)

```markdown
# ADR-[NNNN]: [Titre court en forme nominale]

**Date:** [YYYY-MM-DD]
**Statut:** [Accepté | Remplacé par ADR-NNNN | Déprécié]
**Remplace:** [ADR-NNNN si applicable, sinon omettre]

## Contexte

[2–4 phrases : quelle situation ou problème a forcé cette décision?
Inclure les contraintes pertinentes : taille de l'équipe, délai, pile existante, exigences externes.]

## Décision

[Une phrase, voix active, présent.
"Nous utiliserons X pour Y parce que Z." Pas "Il a été décidé que..."]

## Justification

[Pourquoi cette option plutôt que les alternatives?
Concentrez-vous sur les facteurs spécifiques qui ont rendu ce choix approprié pour ce contexte.
Éviter les louanges génériques — "c'est populaire" n'est pas une justification.]

## Alternatives considérées

| Option | Raison du rejet |
|---|---|
| [Alternative A] | [Raison spécifique de l'élimination] |
| [Alternative B] | [Raison spécifique de l'élimination] |

## Conséquences

**Positives:**
- [Ce que cela rend plus facile ou meilleur]

**Négatives:**
- [Ce que cela rend plus difficile ou introduit comme nouvelle complexité]

**Neutres:**
- [Les changements qui sont ni bons ni mauvais, juste différents]

## Date de révision

[Date 6–12 mois à partir de maintenant, ou l'événement qui devrait déclencher une révision : "Réviser quand l'équipe dépasse 10 ingénieurs" ou "Réviser après le premier incident de production impliquant X"]
```

### Stockage et numérotation

- Stocker dans `docs/decisions/` ou `docs/adr/` — choisir un et ne jamais mélanger
- Nom de fichier : `ADR-0001-kebab-case-titre.md`, `ADR-0002-...`
- La numérotation est séquentielle et jamais réutilisée — même si un ADR est déprécié
- Quand remplacer un ADR : mettre à jour le statut de l'ancien ADR à `Remplacé par ADR-NNNN`, lier le nouvel ADR à l'ancien

### Lier les ADRs remplacés

Quand une décision change :
```markdown
# ADR-0007: Passer de REST à GraphQL pour l'API Client

**Statut:** Accepté
**Remplace:** ADR-0003 (Conception d'API REST-first)
```

Et mettre à jour l'ancien ADR :
```markdown
**Statut:** Remplacé par ADR-0007
```

### Ce qu'il ne faut PAS inclure

- Détails d'implémentation (version exacte de la bibliothèque, valeurs de configuration) — ceux-ci appartiennent au README ou aux commentaires internes
- Noms de membres d'équipe — utiliser les rôles ("équipe backend", "CTO") si l'attribution est nécessaire
- Prédictions sur l'avenir — rester à ce qui est connu maintenant
- Texte copié-collé du site web d'un fournisseur

## Exemple

**Scénario:** L'équipe a choisi Drizzle ORM plutôt que Prisma pour un nouveau projet TypeScript.

**ADR généré:**

```markdown
# ADR-0004: Drizzle ORM plutôt que Prisma pour la couche d'accès aux données

**Date:** 2026-05-23
**Statut:** Accepté

## Contexte

Sélection d'un ORM pour une nouvelle API TypeScript qui interagira avec PostgreSQL.
Le projet a une petite équipe (2 ingénieurs), des exigences de performance strictes sur les opérations d'insertion en masse, et un schéma existant déjà défini comme migrations SQL.
L'équipe a une expérience antérieure avec les deux options.

## Décision

Nous utiliserons Drizzle ORM pour tous les accès à la base de données car il nous donne des requêtes type-safe sans étape de génération de code et ne masque pas le SQL brut quand nous en avons besoin.

## Justification

Drizzle traite SQL comme la source de vérité, ce qui s'aligne avec nos fichiers de migration écrits à la main existants. Le modèle schema-first de Prisma nécessiterait de dupliquer les définitions de tables. Sur les benchmarks d'insertion en masse par rapport à notre taille de dataset cible (500k lignes/batch), Drizzle a été 2,3× plus rapide dans notre prototype.
Le client généré de Prisma ajoute ~100ms de démarrage à froid ce qui compte dans notre contexte de déploiement serverless.

## Alternatives considérées

| Option | Raison du rejet |
|---|---|
| Prisma 5 | L'étape de génération de code ajoute de la complexité CI ; schema-first entre en conflit avec nos migrations SQL existantes ; démarrage à froid plus lent |
| Client pg brut | Trop de boilerplate pour la construction de requêtes ; pas d'inférence de type sur les résultats de requête |
| Kysely | Concurrent solide — rejeté seulement car l'équipe n'a pas d'expérience antérieure avec Kysely et l'API de Drizzle est plus familière |

## Conséquences

**Positives:**
- Les résultats de requête sont typés sans étape de build
- Échappatoire SQL direct disponible sans quitter l'ORM
- Taille de bundle plus petite que Prisma

**Négatives:**
- L'écosystème de Drizzle est plus petit que celui de Prisma — moins de plugins communautaires
- Les outils de migration (drizzle-kit) sont moins matures que Prisma Migrate

**Neutres:**
- L'équipe doit apprendre la syntaxe du query builder de Drizzle

## Date de révision

2027-05-23, ou si une version Prisma 6 adresse significativement le problème de démarrage à froid.
```

---
