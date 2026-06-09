# Règles pour les APIs REST

Appliquez ces règles lors de la conception ou de la consommation de services HTTP/REST.

## Conception des requêtes

- Acceptez `Content-Type: application/json` par défaut ; supportez `application/x-www-form-urlencoded` uniquement si nécessaire (OAuth, formulaires)
- Traitez correctement les en-têtes `Accept` — retournez `406` si vous ne pouvez pas satisfaire le type de média demandé
- Analysez et validez strictement les paramètres de requête ; rejetez les paramètres inconnus avec `400` plutôt que de les ignorer
- Utilisez `If-Match` / `ETag` pour la concurrence optimiste sur les ressources mutables
- Supportez `Prefer: return=minimal` pour permettre aux clients de sauter le corps de la réponse lors des mutations

## Conception des réponses

- Enveloppe cohérente dans tous les points de terminaison — convenez d'une forme et n'en déviez jamais :
  ```json
  { "data": {}, "error": null, "meta": {} }
  ```
- Champs de date/heure : ISO 8601 avec fuseau horaire (`2025-01-15T14:30:00Z`)
- Champs booléens : utilisez les vrais `true`/`false`, jamais `"yes"`/`"no"` ou `1`/`0`
- Null vs. absent : choisissez une convention et appliquez-la partout — préférez omettre les champs optionnels absents

## Réponses d'erreur

- Chaque réponse d'erreur inclut : `code` (chaîne lisible par machine), `message` (lisible par humain), `details` optionnel
- Les valeurs de `code` sont stables — les clients s'en servent pour bifurquer ; `message` est pour les humains et peut changer
- Ne retournez jamais `500` pour les erreurs client ; classifiez correctement l'erreur avant de répondre
- Enregistrez l'erreur complète côté serveur ; retournez uniquement le résumé sûr au client

## Mise en cache

- Définissez `Cache-Control` sur chaque réponse `GET` — par défaut à `no-store` uniquement si vous avez une raison
- Utilisez `ETag` ou `Last-Modified` pour activer les requêtes conditionnelles
- L'en-tête `Vary` doit lister chaque en-tête qui affecte la forme de la réponse (par exemple, `Vary: Accept, Accept-Language`)
- Ne mettez jamais en cache les réponses contenant des données spécifiques à l'utilisateur sans la directive `private`

## Limitation de débit

- Retournez `429 Too Many Requests` avec l'en-tête `Retry-After`
- Exposez l'état de limitation de débit dans les en-têtes de réponse : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Appliquez des limites plus strictes aux points de terminaison d'authentification et aux opérations en masse
- Limitez le débit par identité authentifiée quand possible, par IP uniquement comme repli

## Consommation du client

- Traitez tous les champs non documentés comme instables — ne construisez pas de logique sur eux
- Implémentez une troncature exponentielle avec gigue pour les retentatives `429` et `5xx`
- Définissez des délais d'expiration de lecture et de connexion explicites sur chaque client HTTP — ne vous fiez jamais aux valeurs par défaut
- Vérifiez les certificats TLS dans tous les environnements ; ne désactivez jamais la validation des certificats
