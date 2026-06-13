---
name: context-engineering
description: "Ingénierie de contexte : optimiser comment le contexte est fourni à Claude, réduire l'utilisation de tokens, améliorer la qualité de réponse grâce à une meilleure conception du contexte"
---

# Context Engineering

## Quand activer
L'utilisateur veut optimiser la façon dont le contexte est fourni à Claude, réduire l'utilisation de tokens, améliorer la qualité de réponse grâce à une meilleure conception de contexte, ou atteint les limites de la fenêtre de contexte.

## Quand ne PAS utiliser
- Ingénierie de prompts pour la sortie stylistique (ton, format, persona) — c'est une préoccupation différente
- Architecture de système RAG — la conception du pipeline de récupération est séparée de la disposition du contexte
- Comptage de tokens pour les estimations de facturation — utiliser directement l'API tokenizer

## Instructions

### Progressive Disclosure
Fournir uniquement le contexte nécessaire pour l'étape actuelle. Charger du contexte supplémentaire quand la tâche l'exige.

Ne pas décharger une base de code entière au début d'une conversation. À la place :
1. Commencer par le fichier ou la fonction spécifique pertinent pour la tâche
2. Référencer les autres fichiers par nom : « Voir `utils/auth.ts` pour la logique de validation du token »
3. Ajouter du contexte quand Claude demande ou quand une sous-tâche l'exige

### Contexte structuré vs Prose
Claude analyse la structure plus fiablement que les paragraphes de prose. Préférer:
- Headers (`##`) pour séparer les préoccupations distinctes
- Puces pour les listes de contraintes, de spécifications ou de faits
- Blocs de code pour tout le code — même les courts extraits
- Tableaux pour les comparaisons ou les options de config

Éviter: les longs paragraphes de prose qui enterrent l'instruction clé au milieu.

### Ordre de priorité du contexte
Claude lit de début à fin mais a deux pics d'attention : **début** et **fin**.

- Mettre les contraintes critiques et la tâche principale au tout début
- Mettre l'instruction finale ou le détail le plus important à la fin
- Laisser le contexte de base/support occuper le milieu

Pour une fenêtre de contexte de 200k :
| Section | Token budget |
|---|---|
| System prompt | <5,000 |
| CLAUDE.md / project rules | <2,000 |
| Task description + constraints | <10,000 |
| Reference files / documents | remainder |
| Reserve for output | ~10,000 |

### Référencer, ne pas répéter
Pointer vers un fichier au lieu de le coller :
```
Lire `src/api/routes/user.ts` — se concentrer sur le gestionnaire `POST /users`.
```
Ceci utilise 10 tokens au lieu de 2 000 et évite un contexte stale si le fichier change en milieu de session.

Coller le contenu du fichier uniquement quand :
- Le fichier ne peut pas être lu (doc externe, screenshot, etc.)
- Vous avez besoin que Claude analyse une version spécifique qui diffère du disque
- Le contenu est très court (<30 lignes) et central pour chaque réponse dans la conversation

### Anti-patterns
- **Pâte de fichier complet pour une seule fonction:** coller uniquement la fonction plus ses imports immédiats
- **Répéter le contexte établi:** si Claude connaît déjà X, ne pas réénoncer X dans chaque message
- **Sur-expliquer ce que Claude connaît:** ne pas expliquer ce qu'est JSON, ce qu'est une API REST, etc.
- **Tâche vague + énorme contexte:** une instruction vague avec 50k tokens de contexte produit une sortie vague ; définir précisément la tâche d'abord
- **Injecter des dumps HTML/PDF bruts:** extraire et nettoyer le texte pertinent avant de l'inclure

### Gestion du contexte multi-tour
- Après 10+ tours, les faits clés du tour 1 peuvent recevoir moins d'attention — réénoncer les contraintes critiques dans le message où elles redeviennent pertinentes
- Utiliser CLAUDE.md ou une invite système épinglée pour les règles du projet invariant plutôt que de les répéter dans les messages
- Compaction (le `/compact` de Claude Code) résume l'historique — l'utiliser avant de commencer une nouvelle phase d'une tâche

### Chunking sémantique pour les grands documents
Quand vous devez inclure un grand document, chunk par unité sémantique, pas par compte de tokens:
- Docs API: une section par point de terminaison, pas des blocs arbitraires de 500 tokens
- Code: une classe ou une fonction par chunk, pas divisé à la ligne 500
- Prose: un argument ou un sujet par chunk

Étiqueter chaque chunk clairement pour que Claude puisse le citer : `### Section: Authentication (lines 45-89)`

## Exemple

**Mauvaise livraison de contexte:**
```
Voici mon projet entier (12 fichiers collés). Je veux que vous corrigiez le bug de connexion.
```

**Bonne livraison de contexte:**
```
J'ai un bug de connexion : les utilisateurs reçoivent un 401 même avec des identifiants valides.

Fichier pertinent : `src/auth/login.ts` (lisez-le)
La clé de signature JWT est chargée à partir de `process.env.JWT_SECRET`.
Le middleware qui valide les tokens est dans `src/middleware/auth.ts` (lisez-le).

Le bug a été introduit dans commit abc123. Concentrez-vous sur le chemin de validation des tokens.
```

La deuxième version donne à Claude les bons fichiers, le mode de défaillance, l'emplacement soupçonné et une ancre temporelle — sans waster de tokens sur du code non lié.

---
