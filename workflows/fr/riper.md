# Flux de travail RIPER

Cadre de codage agentique structuré en cinq phases. Chaque phase a un mode strict, des entrées définies et une sortie d'artefact concrète. Passer à la phase suivante nécessite terminer la phase actuelle.

---

## Quand l'utiliser

- Fonctionnalités complexes où le glissement de portée est un risque prévisible
- Codebases non familiers où sauter à la mise en œuvre trop tôt cause des reworks coûteux
- Tâches où la justesse importe plus que la vitesse de la première tentative
- Toute situation où un collaborateur (humain ou agent) doit examiner avant que le travail ne continue

---

## Phases

### 1. Recherche

**Déclaration de mode :** "Je suis en mode RESEARCH."

**Ce qui se passe :** Rassemblez uniquement des informations. Lisez les fichiers pertinents, consultez la documentation, identifiez les inconnues. Posez des questions clarifiantes si nécessaire. Ne proposez pas de solutions. N'écrivez pas de code.

**Interdit dans cette phase :** Suggérer des approches, écrire du code de mise en œuvre, modifier les fichiers.

**Sortie :** Un résumé de contexte — ce qui a été trouvé, ce qui reste inconnu et la question concrète que la phase suivante doit répondre.

```
Résumé du contexte :
- Fichiers pertinents : [listez]
- Comportement actuel : [description]
- Inconnu : [lacunes spécifiques]
- Question pour la phase Innovate : [question précise]
```

---

### 2. Innovate

**Déclaration de mode :** "Je suis en mode INNOVATE."

**Ce qui se passe :** Brainstormez les approches possibles basées sur la sortie de recherche. Listez chaque approche avec ses compromis. Pas de mise en œuvre. Pas de code. Pas de modification des fichiers du projet.

**Interdit dans cette phase :** Écrire du code de mise en œuvre, sélectionner une approche, modifier les fichiers du projet.

**Sortie :** Une liste numérotée d'approches, chacune avec pros, cons et évaluation d'ajustement au contexte.

```
Options :
1. [Approche] — pros : [...] cons : [...] ajustement : [haut/moyen/bas]
2. ...
```

---

### 3. Plan

**Déclaration de mode :** "Je suis en mode PLAN."

**Ce qui se passe :** Sélectionnez une approche à partir de la sortie Innovate et produisez un plan de mise en œuvre étape par étape. Chaque étape doit être atomique : un changement de fichier, une fonction, une migration de base de données — pas "implémenter la fonctionnalité". Numérotez chaque étape. Identifiez toutes les étapes prérequises.

**Porte :** Le plan doit être approuvé (par l'utilisateur ou un agent de révision) avant que la Phase 4 ne commence.

**Sortie :** Une liste de contrôle numérotée sans ambiguïté.

```
Plan de mise en œuvre :
[ ] 1. Créer src/lib/export.ts avec exportToCsv(rows: Row[]): string
[ ] 2. Ajouter la route GET /api/export dans src/routes/export.ts appelant exportToCsv
[ ] 3. Ajouter le bouton Exporter au composant OrdersTable dans src/components/OrdersTable.tsx
[ ] 4. Écrire des tests unitaires dans src/lib/export.test.ts couvrant les cas vides, une seule ligne et plusieurs lignes
```

---

### 4. Exécuter

**Déclaration de mode :** "Je suis en mode EXECUTE."

**Ce qui se passe :** Mettez en œuvre le plan exactement tel qu'écrit, une étape à la fois. Cochez chaque étape après l'avoir terminée. Ne pas improviser. N'ajoutez pas de fonctionnalités pas dans le plan. Si quelque chose d'inattendu est rencontré — un fichier qui n'existe pas, un conflit de type, une dépendance manquante — arrêtez, documentez le bloquant et revenez au mode Plan pour le résoudre.

**Interdit dans cette phase :** Sauter les étapes, ajouter de la portée, prendre des décisions de conception non couvertes par le plan.

**Protocole de blocage :** Si bloqué, sortie :

```
BLOQUÉ à l'étape N : [description du problème]
Retour au mode PLAN pour résoudre.
```

Puis mettez à jour le plan pour adresser le bloquant et reprenez Execute.

**Sortie :** Mise en œuvre fonctionnelle avec chaque étape du plan cochée.

---

### 5. Révision

**Déclaration de mode :** "Je suis en mode REVIEW."

**Ce qui se passe :** Comparez la mise en œuvre au plan original ligne par ligne. Identifiez toute déviation (ajouts, omissions ou substitutions). Vérifiez que chaque critère d'acceptation de la phase Plan est rempli. Documentez les conclusions.

**Sortie :** Un rapport de révision.

```
Rapport de révision :
- Étapes complétées : [N/N]
- Déviations : [listez ou "aucune"]
- Exigences remplies : [oui / partiel — détails]
- Éléments de suivi : [listez ou "aucun"]
```

---

## Règles

1. Ne jamais sauter les phases. La séquence est toujours Recherche → Innovate → Plan → Exécuter → Révision.
2. Déclarez le mode explicitement au début de la réponse de chaque phase.
3. Dans Execute : faites uniquement ce que le plan dit. Les conclusions inattendues reviennent à Plan, pas à Innovate ou Recherche.
4. Chaque phase produit un artefact concret avant que la suivante ne commence.
5. L'approbation entre Plan et Exécuter est requise — soit une signature utilisateur explicite soit un agent de révision.

---

## Exemple

```
Utilisateur : Utilisez RIPER pour ajouter le rate limiting à l'API.

Claude : Je suis en mode RESEARCH.
[lit la pile middleware, les routes existantes, le pipeline de requête...]
Résumé du contexte : Aucun middleware de rate limiting présent. express-rate-limit est déjà dans package.json mais inutilisé. Inconnu : limites par route vs globales. Question : les limites doivent-elles être globales ou par route ?

Utilisateur : Par route, 100 req/min pour les endpoints publics, 1000 pour authentifiés.

Claude : Je suis en mode INNOVATE.
[liste les approches : fabrique middleware, motif décorateur, pilotée par config...]

Utilisateur : Utilisez l'approche de fabrique middleware.

Claude : Je suis en mode PLAN.
[produit une liste de contrôle numérotée de 6 étapes...]

Utilisateur : Approuvé.

Claude : Je suis en mode EXECUTE.
[met en œuvre étape par étape, cochant chacune...]

Claude : Je suis en mode REVIEW.
[compare au plan, confirme 6/6 étapes complètes, pas de déviations, exigences remplies]
```

---
