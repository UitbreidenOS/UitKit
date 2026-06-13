---
name: changelog-writer
description: "Changelog orienté utilisateur à partir de l'historique git ou des PRs : regroupement par impact, langage simple, liens vers la documentation"
---

# Compétence : Rédacteur de changelog

## Quand activer
- Vous préparez une release et devez transformer un git log ou une liste de PRs en changelog orienté utilisateur
- Votre équipe livre en continu et vous devez rédiger un condensé hebdomadaire ou mensuel des changements
- Le CHANGELOG.md technique de l'ingénierie est trop technique pour être partagé avec les clients
- Vous devez produire des notes de version pour une annonce produit, un email, ou une notification in-app
- Vous souhaitez classer les changements par impact utilisateur (nouvelle fonctionnalité / amélioration / correctif / changement cassant)

## Quand NE PAS utiliser
- Vous rédigez des notes de version techniques internes pour les ingénieurs — celles-ci peuvent rester plus proches du log de commits
- Vous avez besoin d'un article de blog complet annonçant une fonctionnalité majeure — c'est du texte marketing, pas une entrée de changelog
- Vous voulez un guide de migration pour les changements cassants — utilisez `/api-doc-writer` pour le guide de migration ; l'entrée du changelog doit pointer vers lui, pas le remplacer
- Vous n'avez encore rien livré — rédigez le changelog après que le code soit en production, pas avant

## Instructions

### Git log → changelog orienté utilisateur

```
Convertis cet historique git / cette liste de PRs en une entrée de changelog orientée utilisateur.

## Contexte de la release
Produit : [nom]
Version : [v2.4.0 / "Release juin 2026" / digest hebdomadaire]
Date de release : [date]
Audience : [utilisateurs finaux / développeurs / admins / mixte]

## Entrée brute
[Collez l'une des options suivantes : sortie git log / liste de PRs fusionnées / release Jira / milestone Linear / liste de changements en format libre]

Exemple de format git log :
abc1234 feat: add bulk invite flow for workspace admins (#1203)
def5678 fix: pagination breaks when filter is active (#1188)
ghi9012 chore: upgrade React to 18.3 (#1201)  ← ignorer ceci
jkl3456 feat(api): add cursor-based pagination to /v1/events (#1195)
mno7890 fix: email notifications sent twice on plan upgrade (#1179)
pqr2345 perf: reduce dashboard initial load time by 40% (#1197)
stu6789 BREAKING: remove deprecated /v1/users/bulk endpoint (#1200)

## Instructions

1. FILTRER : Ignorer les changements internes uniquement :
   - Mises à jour de dépendances sans impact visible pour l'utilisateur (`chore: upgrade X`)
   - Refactorisations sans changement visible pour l'utilisateur (`refactor:`)
   - Changements de tests uniquement (`test:`)
   - Changements CI/CD (`ci:`, `build:`)
   - Outillage interne

2. CLASSER chaque changement restant :
   - Nouvelle fonctionnalité : nouvelle capacité que l'utilisateur n'avait pas avant
   - Amélioration : une fonctionnalité existante fonctionne mieux (plus rapide, plus simple, étendue)
   - Correctif : quelque chose qui était cassé fonctionne maintenant
   - Changement cassant : quelque chose qui nécessite une action de l'utilisateur pour continuer à fonctionner
   - Sécurité : correctif lié à la sécurité

3. RÉÉCRIRE en langage simple :
   - Rédiger pour [l'audience] — pas pour les ingénieurs qui lisent le code
   - Pas de hachages de commit, de noms de branches, ou de numéros de tickets internes dans la sortie
   - Voix active : "Vous pouvez maintenant..." / "Nous avons corrigé..." / "Nous avons amélioré..."
   - Une phrase par entrée pour les correctifs et améliorations ; 2-3 phrases pour les nouvelles fonctionnalités
   - Lien vers la documentation quand c'est pertinent : "(Voir [lien vers la documentation])"

4. TRIER par impact :
   - Les changements cassants en premier (pour que les utilisateurs les voient immédiatement)
   - Les nouvelles fonctionnalités
   - Les améliorations
   - Les correctifs

## Format de sortie

---

## [Version / Nom de la release] — [Date]

### Changements cassants
> Action requise avant la mise à niveau

- **[Titre du changement] :** [Description en langage simple de ce qui a changé et ce que l'utilisateur doit faire.] [Guide de migration →](#)

### Nouvelles fonctionnalités
- **[Nom de la fonctionnalité] :** [Ce qu'elle fait et pour qui. Quel problème elle résout.]
- **[Nom de la fonctionnalité] :** [...]

### Améliorations
- [Description en langage simple de l'amélioration et de son bénéfice pour l'utilisateur]
- [...]

### Correctifs
- Correction [description de ce qui était cassé et quel est maintenant le comportement correct]
- [...]

---
```

### Digest de release continue (hebdomadaire/mensuel)

```
Rédige une mise à jour produit [hebdomadaire / mensuelle] à partir de cette liste de changements livrés.

Période : [plage de dates]
Audience : [clients dans une newsletter produit / développeurs / admins enterprise]
Ton : [conversationnel / formel / technique]

Changements livrés durant cette période :
[liste ou collez git log / PRs]

Format :
- Commencer par le changement le plus impactant (1-2 phrases — l'accroche)
- Regrouper par zone produit ou thème, pas par date de livraison
- Utiliser le "nous" pour les changements ("Nous avons rendu X plus rapide..."), "vous" pour les bénéfices ("Vous pouvez maintenant...")
- Terminer par une section "à venir" si vous avez des éléments de feuille de route engagés à annoncer

Sortie : un digest de changelog prêt à coller dans un email, une notification in-app, ou un article de blog.
Longueur : [bref (moins de 200 mots) / standard (200-400 mots) / détaillé (400+ mots pour les releases majeures)]
```

### Entrée de changement cassant (détaillée)

```
Rédige une entrée de changement cassant pour le changelog.

Changement : [décrire le changement cassant en termes techniques]
Ce qui fonctionnait avant : [l'ancien comportement]
Ce qui se passe maintenant : [le nouveau comportement]
Pourquoi nous l'avons changé : [la raison — soyez honnête si c'est pour de la dette technique, pas juste "améliorations"]
Utilisateurs affectés : [qui est impacté — tout le monde / uniquement les utilisateurs de la fonctionnalité X / uniquement sur le plan X]
Ce qu'ils doivent faire : [étapes d'action spécifiques numérotées 1, 2, 3]
Échéance : [date à laquelle l'ancien comportement est supprimé / quand ils doivent migrer]
Guide de migration : [lien vers la documentation]
Support : [où obtenir de l'aide]

Sortie : une entrée de changelog suffisamment alarmante pour que les utilisateurs la lisent, mais sans provoquer de panique.
Inclure : un en-tête clairement marqué "Action requise".
Ne pas : noyer l'action requise dans le corps du texte.
```

### Revue qualité du changelog

```
Examine ce changelog pour sa qualité et son exhaustivité.

[Collez l'entrée de changelog existante]

Vérifier selon ces critères de qualité :

EXHAUSTIVITÉ :
- [ ] Tous les changements cassants listés et clairement marqués ?
- [ ] Chaque entrée a une description en langage simple (pas de jargon, pas de hachages de commit) ?
- [ ] Liens vers la documentation pour les nouvelles fonctionnalités majeures ?
- [ ] Les correctifs expliquent ce qui était cassé, pas juste "correction d'un bug" ?

LANGAGE :
- [ ] Rédigé pour [utilisateurs finaux / développeurs] — pas pour l'équipe interne ?
- [ ] Voix active tout au long ?
- [ ] Entrées triées par impact utilisateur (cassant → nouveau → amélioration → correctif) ?
- [ ] Pas de numéros de tickets internes (JIRA-1234) visibles pour les lecteurs externes ?

CHANGEMENTS CASSANTS :
- [ ] Clairement séparés des autres changements ?
- [ ] Incluent l'action spécifique que l'utilisateur doit entreprendre ?
- [ ] Incluent l'échéance et le lien vers la documentation de migration ?

Pour chaque lacune : réécrire l'entrée correctement.
```

### Conseils de versionnage sémantique

```
Compte tenu de ces changements, recommander la bonne incrémentation de version sémantique.

Version actuelle : [vX.Y.Z]
Changements dans cette release :
[lister les changements]

Règles de versionnage sémantique :
- MAJEUR (X) : changements cassants — modification d'API incompatible, fonctionnalité supprimée, comportement modifié qui casse l'utilisation existante
- MINEUR (Y) : nouvelles fonctionnalités — ajouts rétrocompatibles
- PATCH (Z) : corrections de bugs — corrections rétrocompatibles uniquement

Recommandation : passer à v[X.Y.Z]
Raison : [quel changement a déclenché ce niveau d'incrémentation]

Si incrémentation MAJEURE : rappel de mettre à jour le guide de migration et de communiquer clairement le calendrier.
```

## Exemple

**Utilisateur :** Voici notre git log pour le dernier sprint. Rédige le changelog pour v3.2.0.

```
a1b2c3d feat: workspace members can now export their own data (#445)
d4e5f6a feat(api): add filtering by date range to GET /v1/reports (#441)
g7h8i9j fix: CSV export includes duplicate rows when >1000 records (#438)
k1l2m3n fix: notifications not sent when user is on legacy plan (#436)
o4p5q6r perf: report generation 3x faster for large datasets (#440)
s7t8u9v chore: upgrade lodash to 4.17.21 (#443)
w1x2y3z docs: update API authentication guide (#444)
a4b5c6d BREAKING: /v1/exports now returns 202 Accepted instead of 200 OK for async exports (#439)
```

**Sortie :**

```markdown
## v3.2.0 — 2 juin 2026

### Changements cassants
> Action requise : mettez à jour votre intégration si vous utilisez l'API Exports

- **L'API Exports retourne maintenant 202 pour les exports asynchrones :** `POST /v1/exports` retournait précédemment `200 OK` avec l'URL d'export. Elle retourne maintenant `202 Accepted` immédiatement, et vous interrogez `GET /v1/exports/{id}` pour l'état. Cela permet aux exports de s'exécuter de façon asynchrone sans bloquer votre requête. Mettez à jour tout code qui vérifie un code de statut `200` lors de la création d'un export. [Guide de migration →](https://docs.example.com/guides/exports-migration)

### Nouvelles fonctionnalités
- **Export de données en libre-service :** Les membres d'espace de travail peuvent maintenant exporter leurs propres données depuis les paramètres de leur compte, sans avoir besoin d'un administrateur pour le faire à leur place.
- **Filtrage par plage de dates dans l'API Reports :** `GET /v1/reports` accepte maintenant les paramètres de requête `start_date` et `end_date` pour filtrer les résultats par une plage de dates personnalisée. [Voir la référence →](https://docs.example.com/api/reports)

### Améliorations
- La génération de rapports est maintenant 3 fois plus rapide pour les grands ensembles de données. Les rapports qui prenaient précédemment plus de 30 secondes se terminent maintenant en moins de 10 secondes.

### Correctifs
- Correction d'un bug où les exports CSV incluaient des lignes dupliquées lorsque l'export contenait plus de 1 000 enregistrements.
- Correction d'un problème où les notifications par email n'étaient pas envoyées aux utilisateurs sur des plans legacy.
```

---
