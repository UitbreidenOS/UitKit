# Capture d'apprentissage de session

Flux de travail de fin de session qui extrait les leçons, les décisions et les découvertes d'une session Claude Code et les persiste avant la fermeture de la fenêtre de contexte. Empêche l'évaporation des connaissances entre les sessions.

---

## Quand l'utiliser

- À la fin de toute session durant plus de 30 minutes
- Après avoir pris une décision architecturale au cours d'une session de codage
- Quand vous avez résolu un problème non évident et voulez que les futures sessions Claude bénéficient de la solution
- Avant de fermer une session autonome longue pour préserver ce qui a été appris
- Chaque fois que vous vous trouvez en train de penser "je me souviendrai de ceci" — vous ne vous en souviendrez pas, pas plus que Claude

---

## Phases

### Phase 1 — Résumé de session

Commencez cette phase avant que le contexte ne soit trop compressé.

```
Nous terminons cette session. Avant de la fermer :

Résumez ce qui s'est passé dans cette session :
1. Quel était l'objectif original ?
2. Qu'est-ce qui a été réellement construit ou changé ?
3. Quelles approches ont été essayées et abandonnées — et pourquoi ?
4. Quelles choses non évidentes avons-nous découvertes ? (pièges, comportements non documentés, contraintes)
5. Qu'est-ce qui n'est toujours pas terminé et quelle est la prochaine étape concrète ?

Gardez-le factuel. Pas de remplissage.
```

Révisez le résumé pour l'exactitude avant de procéder. Corrigez tout ce que Claude a mal compris sur ce qui a été décidé.

---

### Phase 2 — Extraction de règle

```
Basé sur ce résumé de session, identifiez les instructions qui devraient être ajoutées à CLAUDE.md.

Une règle appartient à CLAUDE.md si :
- Elle est spécifique à ce projet (pas du conseil de programmation général)
- Claude prendrait une décision différente sans être dit
- Elle venait d'une vraie décision prise dans cette session

Pour chaque candidat à la règle :
  - Texte proposé (une ou deux lignes, ton directif)
  - Section de CLAUDE.md où elle appartient
  - Pourquoi elle importerait dans une session future

Ne proposez pas de règles déjà présentes dans CLAUDE.md.
Ne proposez pas de conseil générique ("écrire du code propre", "gérer les erreurs").
```

Révisez chaque règle proposée. Acceptez, rejetez ou modifiez chacune. N'ajoutez pas de règles avec lesquelles vous n'êtes pas d'accord — Claude les suivra littéralement dans les sessions futures.

---

### Phase 3 — Capture de décision architecturale

```
Cette session a-t-elle impliqué des décisions architecturales ?

Une décision se qualifie en tant qu'ADR si :
- Elle a été difficile à annuler (ou coûteuse à changer plus tard)
- Le raisonnement ne serait pas évident pour quelqu'un lisant le code
- Il y avait une vraie alternative qui a été considérée et rejetée

Pour chaque décision qualifiante :
  - Titre de décision (une ligne)
  - Contexte (quel problème a forcé cette décision)
  - Décision prise (une phrase, voix active)
  - Alternatives qui ont été rejetées et pourquoi
  - Conséquences (ce que cela rend plus facile, ce que cela rend plus difficile)

Si aucune décision digne d'ADR n'a été faite, dites-le explicitement.
```

Si les ADRs sont identifiées, générez-les en utilisant le format ADR de `skills/productivity/adr-writer.md` et enregistrez à `docs/decisions/`.

---

### Phase 4 — Mise à jour de LESSONS.md

```
Mettez à jour LESSONS.md avec ce qui a été appris dans cette session.

Si LESSONS.md n'existe pas, créez-le avec cette structure :
# Leçons apprises
Un enregistrement vivant de choses non évidentes découvertes pendant le développement.

## [Date] — [Sujet de session en 5 mots]
### Ce que nous avons appris
[2–5 puces de conclusions concrètes et spécifiques]
### Quoi faire la prochaine fois
[1–3 points d'action]

Si LESSONS.md existe, ajoutez une nouvelle entrée datée — ne réécrivez pas les entrées existantes.

Important : incluez uniquement les choses qui étaient réellement non évidentes.
Ne remplissez pas avec les choses qui se sont déroulées comme prévu.
```

---

### Phase 5 — Confirmation avant écriture

Montrez à l'utilisateur un résumé de tous les écritures proposées avant de toucher un fichier :

```
Voici ce que je m'apprête à écrire :

1. Additions CLAUDE.md : [listez les règles acceptées]
2. Nouveaux fichiers ADR : [listez les chemins de fichiers et les résumés d'une ligne]
3. Additions LESSONS.md : [aperçu de la nouvelle entrée]

Confirmez pour procéder, ou dites-moi ce à changer.
```

Écrivez uniquement les fichiers après la confirmation explicite de l'utilisateur. Ne mettez jamais silencieusement à jour CLAUDE.md.

---

## Exemple

Session : "Debuggué pourquoi les requêtes Prisma expirait en production"

Phase 1 résumé : découvert que les défauts du pool de connexions de Prisma à 5 connexions, la charge de production nécessitait 20, la correction était `DATABASE_CONNECTION_LIMIT=20` dans env + `connection_limit=20` dans l'URL de base de données.

Phase 2 extraction de règle :
- Règle CLAUDE.md proposée : "Toujours vérifier `DATABASE_CONNECTION_LIMIT` quand debugguer les requêtes DB lentes en production — le défaut du pool Prisma de 5 est trop petit pour n'importe quelle charge réelle."
- Section : `## Base de données`

Phase 3 ADR : aucune décision au niveau architecturale, juste une correction de configuration → aucun ADR.

Phase 4 entrée LESSONS.md :
```
## 2026-05-23 — Pool de connexions Prisma trop petit
### Ce que nous avons appris
- Prisma défaut à 5 connexions DB quel que soit le plan ou la taille du serveur
- L'épuisement du pool ressemble à des requêtes lentes, pas à des erreurs de connexion
- La correction est `connection_limit=N` dans DATABASE_URL, pas le code de l'application
### Quoi faire la prochaine fois
- Définir connection_limit explicitement dans DATABASE_URL sur chaque nouveau projet
- Surveiller `pg_stat_activity` pour les connexions inactives avant de supposer les problèmes de performance de requête
```

---
