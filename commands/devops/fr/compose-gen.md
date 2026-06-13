---
description: Générer un docker-compose.yml prêt pour la production pour le projet actuel
argument-hint: "[nom-du-service ou description de la pile]"
---
Générer un `docker-compose.yml` prêt pour la production pour : $ARGUMENTS

Inspecter le répertoire de travail actuel — lire tout Dockerfile existant, package.json, pyproject.toml, go.mod, ou manifestes similaires pour déduire la pile.

Exigences :
- Utiliser des volumes nommés, pas des montages de liaison (bind mounts), pour les données persistantes
- Définir `restart: unless-stopped` sur tous les services de longue durée
- Injecter les secrets via les variables d'environnement référençant un fichier `.env` — ne jamais coder les identifiants en dur
- Inclure un bloc `healthcheck` pour chaque service qui expose un port
- Définir un réseau bridge dédié ; ne pas utiliser le réseau par défaut
- Épingler les balises d'image — ne jamais utiliser `:latest`
- Ajouter un `depends_on` avec `condition: service_healthy` pour les services avec dépendances de démarrage
- Séparer les profils `dev` et `prod` le cas échéant en utilisant la clé `profiles`
- Pour les bases de données : définir explicitement `POSTGRES_DB` / `MYSQL_DATABASE` / etc. et exposer les ports uniquement à localhost (`127.0.0.1:<port>:<port>`)

Résultat :
1. Le `docker-compose.yml` complet
2. Un `docker-compose.override.yml` avec les remplacements de montage source et port de débogage pour le développement local
3. Un `.env.example` listant chaque variable requise sans valeurs réelles

Après les fichiers, lister :
- Chaque variable d'environnement que l'opérateur doit fournir
- Tous les volumes qui nécessitent une pré-population ou des scripts d'initialisation
- Commandes pour démarrer la pile et vérifier la santé :
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Si la pile a un proxy inverse (nginx/traefik/caddy), l'inclure avec la configuration de terminaison TLS structurellement correcte mais commentée.

Ne pas générer un Dockerfile sauf demande explicite — composition uniquement.
