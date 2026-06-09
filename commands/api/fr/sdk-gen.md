---
description: Générer un SDK client typé à partir d'une spec OpenAPI ou de routes API existantes
argument-hint: "[language] [spec-file-or-base-url]"
---
Générer un SDK client pour : $ARGUMENTS

Analyser comme : langage cible (TypeScript, Python, Go, etc.) et soit un chemin vers un fichier spec OpenAPI, soit une URL de base. Si aucun fichier spec n'existe, générer d'abord une spec à partir du codebase avant de générer le SDK.

Exigences du SDK par langage :

TypeScript:
- Sortie double ESM + CommonJS via le champ `exports` de `package.json`
- Types génériques complets — pas de `any`, pas d'assertions de type sans justification
- Utiliser `fetch` nativement ; accepter une implémentation fetch personnalisée optionnelle pour les mocks de test
- Schémas Zod pour la validation de réponse au runtime (optionnel mais inclure si le projet utilise Zod)
- Tree-shakeable : chaque ressource en tant qu'export nommé, pas une classe avec tout dedans

Python:
- `httpx` pour l'async, `requests` pour le sync — fournir les deux ou demander lequel
- Modèles Pydantic pour tous les types de requête/réponse
- Indications de type partout, marqueur `py.typed` pour la conformité PEP 561
- Client async en tant qu'interface principale, sync en tant que wrapper mince

Go:
- Go idiomatique : méthodes sur une struct `Client`, contexte comme premier paramètre, pattern de retour `(T, error)`
- Paquet de types séparé pour les modèles générés
- Pas de dépendances externes au-delà de `net/http` sauf si le projet en utilise déjà une

Tous les langages:
- Une classe client/struct par groupe de ressources (reflète les `tags` OpenAPI)
- Le constructeur accepte : URL de base, token d'authentification/clé API, client HTTP optionnel
- Toutes les méthodes correspondent 1:1 avec les valeurs `operationId` d'OpenAPI
- Retourner des objets de réponse typés — jamais des chaînes brutes ou des maps non typées
- Propager toutes les erreurs HTTP en tant qu'objets d'erreur typés avec `status`, `code` et `message`
- README avec installation, initialisation et un exemple par ressource

Afficher le SDK en tant que listage de structure de répertoire, puis le contenu complet du fichier pour chaque fichier. Si la spec a plus de 20 opérations, générer l'infrastructure client principale et le premier groupe de ressources, puis lister les groupes restants à générer à la demande.
