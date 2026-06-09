---
description: Ajouter la limitation de débit aux points de terminaison API avec des stratégies configurables et des réponses 429 appropriées
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implémenter la limitation de débit pour: $ARGUMENTS

Analyser comme: chemin du point de terminaison cible ou du routeur, limite de requêtes (par exemple 100), fenêtre de temps (par exemple 1m, 1h). Si non spécifié, appliquer les valeurs par défaut appropriées: 100 req/min pour les points de terminaison publics, 1000 req/min pour les points de terminaison authentifiés.

Exigences de mise en œuvre:
- Identifier l'infrastructure de limitation de débit existante (Redis, en mémoire, bibliothèque middleware) — l'utiliser plutôt que d'introduire un deuxième système
- Si aucun limiteur de débit n'existe, choisir en fonction du déploiement: backend Redis pour multi-instance, en mémoire avec un avertissement pour single-instance
- Clés par: IP pour les routes non authentifiées, ID utilisateur/locataire pour les routes authentifiées, clé API pour les routes authentifiées par clé API
- Appliquer les limites au niveau middleware/décorateur — ne pas éparpiller les vérifications de limite dans la logique métier
- Retourner `429 Too Many Requests` avec ces en-têtes:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Corps de la réponse: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Fenêtre glissante préférée à la fenêtre fixe — évite les pics à la limite de la fenêtre
- Supporter le remplacement par route des limites sans toucher à la configuration globale

Configuration:
- Les limites doivent être configurables via des variables d'environnement ou un fichier de configuration — pas de nombres magiques dans le middleware
- Documenter les noms des variables d'environnement dans un commentaire au site de définition

Écrire des tests pour:
- Requête dans la limite (réussit)
- Requête à la limite exacte (réussit)
- Requête dépassant la limite (429 avec les en-têtes corrects)
- Réinitialisation de la limite après l'expiration de la fenêtre
