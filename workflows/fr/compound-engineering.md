# Ingénierie composée

Transformation d'erreur en leçon qui rend les sessions Claude Code futures progressivement plus intelligentes. Chaque erreur commise dans une session devient une entrée structurée dans `LESSONS.md`. Les sessions futures chargent ce fichier et évitent les mêmes erreurs sans être informées.

---

## Quand utiliser

- Tout projet long avec des sessions récurrentes Claude Code
- Bases de code avec des conventions non évidentes ou des pièges qui trébuchent constamment Claude
- Équipes utilisant Claude Code sur un repo partagé — les leçons écrites une fois s'appliquent à tous les contributeurs
- Toute situation où vous vous trouvez à corriger la même classe d'erreur plus d'une fois

---

## Idée centrale

La connaissance se compose. Une seule erreur, une fois documentée, n'est jamais répétée. Dix sessions plus tard, Claude entre dans la base de code conscient de chaque piège découvert dans les neuf avant. Le coût est quelques secondes par leçon ; le payoff est cumulatif.

---

## Structure

### `LESSONS.md` — journal ajout-seul

Vit à la racine du projet (ou où CLAUDE.md vit). Référencé dans CLAUDE.md pour qu'il soit chargé au début de chaque session :

```markdown
<!-- In CLAUDE.md -->
@LESSONS.md
```

### Format d'entrée de leçon

```markdown
## [Date] — [Titre bref]
**Erreur :** [Ce qui s'est mal passé — spécifique, pas « Claude a fait une erreur »]
**Cause racine :** [Pourquoi c'est arrivé — contexte manquant, mauvaise hypothèse, convention ambiguë]
**Approche correcte :** [Quoi faire à la place — concret et exploitable]
**Contexte :** [Portée — ceci est-il spécifique à la base de code, spécifique à la langue, ou universel ?]
```

---

## Flux de travail

### Pendant une session

Quand Claude commet une erreur et la corrige, écrivez la leçon immédiatement :

```
"Mettre à jour LESSONS.md : essayé d'importer UserService de lib/users — le chemin correct est services/users/UserService.ts (les exports barrel ne sont pas utilisés dans ce projet)."
```

Claude ajoute l'entrée dans le format standard. La leçon est active pour le reste de la session et toutes les sessions futures.

### À la fin de la session (optionnel mais de grande valeur)

Avant de fermer une session longue, demandez à Claude de passer en revue la session pour les erreurs non documentées :

```
"Passez en revue cette session pour les erreurs non encore dans LESSONS.md et ajoutez des entrées pour elles."
```

Claude scanne la conversation, identifie les corrections et changements de direction, et ajoute des entrées structurées pour chacune. Cela prend 30–60 secondes et capture les leçons qui ont glissé dans le flux de travail.

### Au démarrage de la session

Parce que CLAUDE.md référence `@LESSONS.md`, Claude lit le journal complet des leçons avant de répondre au premier message. Aucun chargement manuel requis.

---

## Exemple LESSONS.md

```markdown
# Leçons

## 2026-05-10 — Emplacement du schéma Prisma
**Erreur :** Recherché schema.prisma à la racine du projet.
**Cause racine :** Hypothèse Prisma par défaut — le projet utilise une disposition non standard.
**Approche correcte :** Le schéma vit à infra/db/schema.prisma. La configuration du client pointe là via prisma.schema dans package.json.
**Contexte :** Ce projet uniquement.

## 2026-05-14 — Enveloppe de réponse API
**Erreur :** Retourné { data: result } directement des gestionnaires de route.
**Cause racine :** Convention REST générique supposée. Cette API utilise { ok: true, payload: result }.
**Approche correcte :** Tous les gestionnaires de route doivent retourner l'enveloppe standard. Voir les aides src/lib/response.ts.
**Contexte :** Ce projet uniquement.

## 2026-05-18 — Base de données de test
**Erreur :** Les tests écrivaient à la base de données de développement.
**Cause racine :** DATABASE_URL non remplacée dans la configuration de test.
**Approche correcte :** vitest.setup.ts définit process.env.DATABASE_URL à TEST_DATABASE_URL. Vérifiez que TEST_DATABASE_URL est défini avant d'exécuter les tests.
**Contexte :** Ce projet uniquement.
```

---

## Règles

- **Ajout seul.** Ne jamais supprimer ou remplacer les entrées. Si une leçon est remplacée, ajoutez une nouvelle entrée notant la correction et la date.
- **Spécifique, pas générique.** « Ne pas faire de suppositions » n'est pas une leçon. « Les réponses API utilisent `{ ok, payload }` pas `{ data }` » est une leçon.
- **La portée de contexte est requise.** Marquez si la leçon s'applique à cette base de code, cette langue, ou universellement. Cela empêche le surajustement sur les conventions spécifiques au projet.
- **Écrivez immédiatement.** Les leçons écrites au moment de la correction sont plus précises que les résumés rétrospectifs.

---
