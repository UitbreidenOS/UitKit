---
description: Générer un SDK client typé à partir d'une spécification OpenAPI ou de routes API existantes
argument-hint: "[langage] [fichier-spec-ou-url-de-base]"
---
Générer un SDK client pour : $ARGUMENTS

Analyser comme : langage cible (TypeScript, Python, Go, etc.) et soit un chemin vers un fichier de spécification OpenAPI, soit une URL de base. Si aucun fichier de spec n'existe, en générer d'abord un à partir de la base de code avant de générer le SDK.

Exigences du SDK par langage :

TypeScript :
- Sortie double ESM + CommonJS via le champ `exports` dans `package.json`
- Types génériques complets — pas de `any`, pas d'assertions de type sans justification
- Utiliser `fetch` en natif ; accepter une implémentation fetch personnalisée optionnelle pour le test de simulation
- Schémas Zod pour la validation des réponses au moment de l'exécution (optionnel mais à inclure si le projet utilise Zod)
- Tree-shakeable : chaque ressource comme export nommé, pas une classe avec tout dedans

Python :
- `httpx` pour l'asynchrone, `requests` pour le synchrone — fournir les deux ou demander lequel
- Modèles Pydantic pour tous les types de requête/réponse
- Indices de type partout, marqueur `py.typed` pour la conformité PEP 561
- Client asynchrone comme interface principale, synchrone comme mince enveloppe

Go :
- Go idiomatique : méthodes sur une struct `Client`, contexte comme premier paramètre, motif de retour `(T, error)`
- Package de types séparé pour les modèles générés
- Pas de dépendances externes au-delà de `net/http` sauf si le projet en utilise déjà une

Tous les langages :
- Une classe/struct client par groupe de ressources (miroir les `tags` OpenAPI)
- Le constructeur accepte : URL de base, token d'authentification/clé API, client HTTP optionnel
- Toutes les méthodes correspondent 1:1 avec les valeurs OpenAPI `operationId`
- Renvoyer des objets réponse typés — jamais de chaînes brutes ou de maps sans type
- Propager toutes les erreurs HTTP comme objets d'erreur typés avec `status`, `code` et `message`
- README avec installation, initialisation et un exemple par ressource

Afficher le SDK comme une liste de structure de répertoires, puis le contenu complet du fichier pour chaque fichier. Si la spec a plus de 20 opérations, générer l'infrastructure client de base et le premier groupe de ressources, puis lister les groupes restants à générer à la demande.
