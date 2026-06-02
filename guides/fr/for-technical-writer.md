# Claude pour les Rédacteurs Techniques et Ingénieurs de Documentation

Tout ce dont un Rédacteur Technique ou un Ingénieur de Documentation a besoin pour exécuter des workflows de documentation augmentés par l'IA — docs API, READMEs, runbooks, journaux des modifications, ADRs, architecture de site de documentation, guides de style et audits de contenu.

---

## À qui s'adresse ce guide

Vous êtes rédacteur technique, ingénieur de documentation ou développeur advocate dont le travail consiste à rendre des produits techniques complexes compréhensibles. Vous rédigez de la documentation API, des guides d'intégration, des runbooks et des journaux des modifications. Vous relisez les PRs pour vérifier l'exactitude de la documentation. Vous maintenez un site de documentation. Vous luttez pour maintenir l'information à jour. Claude Code rend les tâches mécaniques de ce métier rapides et cohérentes afin que vous puissiez vous concentrer sur la rédaction et le jugement éditorial qui nécessitent réellement de l'expertise.

**Avant Claude Code :** 4 heures pour documenter un endpoint API de zéro. 30 minutes pour rédiger une entrée de journal des modifications qui sera lue pendant 30 secondes. 2 heures pour produire un runbook à partir d'un post-mortem d'incident. Attendre qu'un ingénieur explique ce que fait une nouvelle fonctionnalité avant de pouvoir commencer à écrire.

**Après :** Endpoint API documenté en 10 minutes à partir du code ou de la spec. Journal des modifications généré depuis un git log en 5 minutes. Runbook à partir d'une timeline d'incident en 20 minutes. Revue de l'architecture d'information du site de docs en 30 minutes.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences Rédacteur Technique
npx claudient add skills productivity

# Ou choisir à la carte :
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/runbook-generator
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/changelog-writer
npx claudient add agents roles/changelog-narrator
```

---

## Votre stack de documentation Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/readme-generator` | README complet à partir du code ou d'une description | Nouveau projet, nouvelle version open-source |
| `/runbook-generator` | Runbook opérationnel à partir d'un incident ou d'une description de processus | Après chaque incident, pour chaque processus opérationnel |
| `/adr-writer` | Architecture Decision Record à partir d'une décision technique | Lorsqu'une décision architecturale significative est prise |
| `/doc-site-builder` | Architecture d'information du site de docs : structure de navigation, modèles, taxonomie de contenu, stratégie de recherche | Lancement ou restructuration d'un site de docs |
| `/api-doc-writer` | Docs API à partir d'une spec OpenAPI ou du code : endpoints, exemples, codes d'erreur, SDKs | Modifications d'API, nouveaux endpoints, guides de migration |
| `/changelog-writer` | Journal des modifications orienté utilisateur à partir du git log ou d'une liste de PRs | Chaque version, digest hebdomadaire |

### Agents

| Agent | Modèle | Quand l'invoquer |
|---|---|---|
| `changelog-narrator` | Haiku | Génération de journaux des modifications en lot sur plusieurs versions |

---

## Workflow quotidien

### Matin — Résultats du standup d'ingénierie → tâches de documentation

**Transformer les PRs d'hier en tâches de documentation :**
```
/changelog-writer

Ces PRs ont été mergées hier. Classifiez chacune comme : nécessite une nouvelle doc / nécessite une mise à jour de doc /
nécessite une entrée de journal des modifications / interne uniquement (pas de doc nécessaire).

Liste des PRs :
[collez les titres et descriptions des PRs mergées]

Pour chacune nécessitant une doc ou une entrée de journal des modifications : donnez-moi un brief d'une ligne sur ce qu'il faut écrire.
```

**Documentation API rapide pour un nouvel endpoint :**
```
/api-doc-writer

Documentez cet endpoint API à partir du code :

[collez le code du gestionnaire de route, le snippet OpenAPI, ou une description simple]

Résultat : doc de référence complète de l'endpoint avec tableaux requête/réponse, tous les paramètres,
codes d'erreur et exemples de code en curl, Python et TypeScript.
```

---

### Cycle de revue de contenu

**Auditer une section de documentation pour détecter l'obsolescence :**
```
/doc-site-builder

Auditez cette section de notre documentation pour détecter les problèmes de contenu.

Pages (titre et date de dernière mise à jour) :
[liste des pages]

Modifications récentes du produit qui peuvent avoir rendu ces pages obsolètes :
[liste des modifications du produit des 90 derniers jours — à récupérer depuis le journal des modifications ou les notes de version]

Identifiez : les pages probablement obsolètes / les pages avec du contenu manquant / les pages à diviser ou fusionner.
Résultat : backlog de mise à jour de contenu priorisé.
```

**Revue de style d'une page de documentation :**
```
Relisez cette page de documentation pour vérifier la clarté, l'exhaustivité et le style.

Page : [collez le contenu]

Vérifiez :
1. L'objectif de l'utilisateur est-il clair rien qu'à partir du titre ?
2. La page commence-t-elle par ce que l'utilisateur peut accomplir, pas par ce qu'est la fonctionnalité ?
3. Les exemples de code sont-ils exécutables tels quels (sans valeurs fictives qui les cassent) ?
4. Les messages d'erreur sont-ils expliqués avec leurs causes et leurs corrections, pas seulement listés ?
5. Est-ce rédigé à la deuxième personne ("vous") tout au long ?
6. Y a-t-il des sections inutiles qui pourraient être supprimées ?

Résultat : modifications précises au niveau de la ligne avec explication.
```

---

### Cycle de version — Rédaction du journal des modifications

**À chaque version :**
```
/changelog-writer

Convertissez ce git log en journal des modifications orienté utilisateur pour la v[X.Y.Z].

Public : [utilisateurs finaux / développeurs / administrateurs]
Date de version : [date]

git log :
[collez la sortie git log --oneline pour cette version]

Filtrez : les mises à jour de dépendances, les refactorisations internes, les modifications de tests uniquement.
Regroupez par : Changements incompatibles → Nouvelles fonctionnalités → Améliorations → Corrections.
Rédigez pour un public [développeur / utilisateur non technique].
Incluez des liens vers la documentation pour toute nouvelle fonctionnalité documentée.
```

---

### Documentation d'incident — Runbooks

**Post-incident : capturer la réponse sous forme de runbook :**
```
/runbook-generator

Créez un runbook à partir de cette timeline d'incident.

Service : [nom du service]
Type d'incident : [ce qui s'est mal passé]
Timeline d'incident :
[collez depuis votre outil de suivi d'incidents ou le fil Slack]

Produisez un runbook couvrant :
- Symptômes et critères de détection
- Procédure de diagnostic étape par étape
- Étapes de remédiation (numérotées, avec les commandes exactes)
- Chemin d'escalade
- Checklist de prévention (ce qu'il faut vérifier avant que cela se reproduise)

Format : runbook opérationnel qu'un ingénieur d'astreinte qui n'a jamais vu cet incident peut suivre.
```

---

### Décisions d'architecture — ADRs

**Capturer une décision technique avant qu'elle ne soit perdue :**
```
/adr-writer

Rédigez un Architecture Decision Record pour [décision].

Décision : [ce qui a été décidé]
Contexte : [la situation qui nécessitait une décision — pourquoi était-elle nécessaire ?]
Options envisagées : [listez les alternatives qui ont été évaluées]
Justification de la décision : [pourquoi cette option a été choisie plutôt que les alternatives]
Conséquences : [les compromis — ce que cette décision facilite et ce qu'elle rend plus difficile]
Statut : [Accepté / Proposé / Déprécié / Remplacé par ADR-N]

Utilisez le format Nygard. Incluez : titre, date, statut, contexte, décision, conséquences.
```

---

### Architecture du site de documentation

**Restructurer un site de documentation :**
```
/doc-site-builder

Concevez l'architecture d'information de notre site de documentation.

Produit : [nom et description]
Public : [développeurs / utilisateurs finaux / administrateurs / tous]
État actuel : [migration depuis Notion / restructuration du site existant / démarrage de zéro]
Types de documents nécessaires : [prise en main, référence API, guides pratiques, docs conceptuelles, notes de version]
Volume de contenu : [nombre approximatif de pages]
Plateforme : [Docusaurus / MkDocs / Mintlify / pas encore choisie]

Produisez :
- Structure de navigation de premier niveau avec justification
- Classification du contenu selon Diátaxis (Tutoriel / Pratique / Référence / Explication)
- Modèles de page pour chaque type de contenu
- Analyse des lacunes de contenu
- Checklist de préparation au lancement
```

---

## Plan d'intégration sur 30 jours (nouveaux rédacteurs techniques)

### Semaine 1 — Installation et audit de documentation
- Installer toutes les compétences de productivité : `npx claudient add skills productivity`
- Exécuter la classification Diátaxis de `/doc-site-builder` sur toute la documentation existante — identifier les lacunes et les pages de type mixte
- Lire chaque document existant dans votre domaine principal — noter ce qui est obsolète (comparer aux PRs récentes)
- Assister à 2-3 standups d'ingénierie — entendre ce qui sera livré dans le prochain sprint

### Semaine 2 — Documentation API et rédaction de référence
- Choisir 3 endpoints API sans bonne documentation
- Utiliser `/api-doc-writer` pour rédiger chacun à partir du code — revoir avec l'ingénieur qui l'a écrit
- Mesurer le temps entre le brouillon et l'approbation — suivre les cycles d'édition pour améliorer vos prompts
- Mettre en place le processus de revue de PR docs-as-code avec l'ingénierie

### Semaine 3 — Journal des modifications et notes de version
- Obtenir l'accès au git log ou au flux de PRs mergées
- Rédiger le prochain journal des modifications de version avec `/changelog-writer` — comparer aux journaux précédents pour le ton et la profondeur
- Rédiger 3 runbooks pour les incidents d'astreinte courants qui n'ont pas encore de documentation
- Revoir votre archive d'ADRs — les décisions prises sont-elles documentées ?

### Semaine 4 — Stratégie de contenu
- Effectuer un audit de contenu complet : quels docs ont le plus de pages vues ? Le taux de sortie le plus élevé ? La plus grande corrélation avec les tickets de support ?
- Utiliser les analytics pour identifier les 5 pages principales sur lesquelles les utilisateurs atterrissent et qui les déçoivent (sortie élevée + faible satisfaction)
- Proposer un sprint d'amélioration de la documentation à l'ingénierie : 5 pages, objectif mesurable
- Présenter les résultats de votre audit de contenu à l'équipe

---

## Intégrations d'outils

### GitHub / GitLab (docs-as-code)

Exécuter des vérifications CI sur chaque PR de documentation :

```yaml
# .github/workflows/docs.yml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1

- name: Spell check
  uses: streetsidesoftware/cspell-action@v2

- name: Lint markdown
  uses: DavidAnson/markdownlint-cli2-action@v9
```

Claude Code peut aider à rédiger la prose — le CI assure la cohérence et détecte les liens cassés avant qu'ils n'atteignent les utilisateurs.

### OpenAPI / Swagger (specs API)

Si votre équipe utilise OpenAPI :
- Commettez la spec dans le même dépôt que la documentation
- Utilisez `/api-doc-writer` pour générer une documentation lisible par les humains à partir de la spec
- Régénérez à chaque modification de la spec — ne maintenez pas manuellement une référence API qui peut être générée

```bash
# Générer la documentation à partir de la spec
npx claudient run api-doc-writer --input openapi.yaml --audience developers
```

### Mintlify / Docusaurus / MkDocs (plateformes de documentation)

Toutes ces plateformes supportent MDX ou Markdown avec frontmatter. Claude Code génère du Markdown ; vous gérez la configuration de la plateforme.

Modèle de frontmatter recommandé :
```yaml
---
title: "Comment configurer l'authentification"
description: "Mettre en place l'authentification OAuth 2.0, par clé API, ou SSO pour votre intégration"
last_updated: "2026-06-02"
tags: [authentication, security, setup]
---
```

### Linear / Jira (backlog de documentation)

Suivez les tâches de documentation comme des tickets d'ingénierie de premier ordre. Étiquettes : `docs`, `docs-api`, `docs-runbook`.

Claude Code génère le brouillon — le ticket suit la revue et la publication. Ne sautez pas le cycle de revue.

### Slack / Teams (collaboration avec l'ingénierie)

Mettez en place un canal `#docs-updates` où :
- Les PRs mergées avec des modifications visibles par les utilisateurs déclenchent une notification
- Les rédacteurs techniques peuvent demander du contexte aux ingénieurs dans un fil (consultable pour référence future)
- Les journaux des modifications de version sont publiés pour revue avant publication

---

## Métriques à suivre

| Métrique | Cible |
|---|---|
| Couverture de documentation des endpoints API | 100% des endpoints publics documentés |
| Délai de livraison du journal des modifications après la version | Le jour même de la version |
| Couverture des ADRs | Un ADR existe pour chaque décision architecturale significative |
| Couverture des runbooks | Un runbook existe pour chaque type d'incident P1 |
| Liens cassés dans la documentation de production | 0 (appliqué par le CI) |
| Score de feedback de la documentation ("Est-ce utile ?") | >70% positif |
| Délai entre le merge de la PR et la publication de la doc | <24 heures pour les modifications mineures, <72 heures pour les fonctionnalités majeures |
| Pages obsolètes (non mises à jour depuis >6 mois par rapport aux modifications du produit) | <10% de la documentation |

---

## Erreurs courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Documentation API rédigée comme si elle était pour vous, pas pour l'intégrateur**
`/api-doc-writer` rédige toujours du point de vue de l'intégrateur, inclut des exemples de code fonctionnels dans plusieurs langages et explique les codes d'erreur avec leurs causes et corrections — pas seulement un tableau de codes de statut.

**Erreur 2 : Journaux des modifications qui ressemblent à des messages de commit**
`/changelog-writer` réécrit les messages de commit en langage de bénéfices orienté utilisateur, filtre le bruit interne et regroupe par impact utilisateur.

**Erreur 3 : Documentation qui mélange tutoriel, pratique et contenu de référence sur une seule page**
`/doc-site-builder` effectue une classification Diátaxis et signale les pages de type mixte. Divisez-les avant qu'elles ne deviennent ingérables.

**Erreur 4 : Runbooks jamais utilisés parce qu'ils sont obsolètes**
Rédigez les runbooks immédiatement après les incidents avec `/runbook-generator` pendant que le contexte est frais. Ajoutez une date de "dernière validation" et validez-les lors de journées de simulation.

**Erreur 5 : ADRs qui ne sont jamais rédigés**
La rédaction des ADRs doit se faire au moment de la décision — pas six mois plus tard. Utilisez `/adr-writer` dans la même PR où atterrit le changement architectural.

---

## Ressources

- [Prise en main de Claude Code](../getting-started.md)
- [Workflow de sprint de documentation](../workflows/docs-sprint.md)
- [Agent narrateur de journal des modifications](../agents/roles/changelog-narrator.md)
- [Compétence rédacteur d'ADR](../skills/productivity/adr-writer.md)
- [Compétence générateur de runbook](../skills/productivity/runbook-generator.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
