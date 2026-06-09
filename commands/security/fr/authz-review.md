---
description: Examinez la logique d'autorisation pour les escalades de privilèges, les contrôles d'accès cassés et les failles IDOR
argument-hint: "[file or module]"
---
Examinez l'implémentation de l'autorisation et du contrôle d'accès dans `$ARGUMENTS` (par défaut : l'ensemble du codebase) pour les contrôles d'accès cassés, les chemins d'escalade de privilèges et les vulnérabilités IDOR.

**1. Cartographier le modèle de permissions**

Identifier et documenter :
- Mécanisme d'authentification (session, JWT, clé API, OAuth)
- Définitions des rôles/permissions — où elles sont stockées et comment elles sont chargées
- Middleware ou décorateurs qui appliquent l'authz (par ex. `@require_permission`, gardes `isAdmin`)
- Ressources protégées par rapport à celles qui ne le sont pas

**2. Vérifier les contrôles d'accès cassés (OWASP A01)**

- Les vérifications d'autorisation sont-elles appliquées de manière cohérente, ou seulement dans certains chemins de code menant à la même ressource ?
- Un utilisateur avec des droits inférieurs peut-il accéder à des endpoints avec des droits supérieurs en manipulant la requête (override de méthode, falsification de paramètre, traversée de répertoires) ?
- Y a-t-il des routes réservées aux administrateurs qui reposent uniquement sur un indicateur booléen en entrée contrôlée par l'utilisateur (par ex. `?admin=true`) ?
- L'interface frontale masque-t-elle les éléments d'interface utilisateur pour les utilisateurs non autorisés, mais échoue à appliquer les mêmes règles côté serveur ?

**3. Vérifier les IDOR (Insecure Direct Object Reference)**

- Trouvez chaque endpoint qui accepte un identifiant fourni par l'utilisateur (paramètre de chemin, paramètre de requête, champ du corps) et récupère un enregistrement.
- Vérifiez que chaque recherche inclut une vérification de propriété ou d'appartenance — pas seulement que l'enregistrement existe.
- Signaler les modèles comme : `GET /invoices/:id` où la requête est `SELECT * FROM invoices WHERE id = ?` sans `AND user_id = current_user`.

**4. Vérifier l'escalade de privilèges**

- Un utilisateur ordinaire peut-il modifier son propre rôle/ses propres permissions via un endpoint API ?
- Y a-t-il des vulnérabilités d'attribution en masse où un `PATCH /users/:id` accepte un champ `role` ?
- Y a-t-il un flux de création ou d'invitation d'utilisateur où l'appelant peut définir des rôles arbitraires sur le nouveau compte ?

**5. Vérifications spécifiques JWT / session** (le cas échéant)

- L'algorithme est-il validé côté serveur ? (attaque `alg: none`, confusion d'algorithme RS256 → HS256)
- Les JWT sont-ils vérifiés pour l'expiration, l'émetteur et l'audience sur chaque route protégée ?
- Les tokens de session sont-ils invalidés à la déconnexion et au changement de mot de passe ?

**6. Résultat**

Pour chaque constatation :
```
[SEVERITY] [file:line] — description
Attack scenario: one sentence explaining how an attacker exploits this
Fix: specific code change or pattern to apply
```

Severity: Critical (direct data breach or account takeover), High (privilege escalation), Medium (info disclosure), Low (defense in depth gap).
