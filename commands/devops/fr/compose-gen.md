---
description: Générer un docker-compose.yml prêt pour la production pour le projet actuel
argument-hint: "[service-name or stack description]"
---
Générer un `docker-compose.yml` prêt pour la production pour : $ARGUMENTS

Inspecter le répertoire de travail actuel — lire les Dockerfiles existants, package.json, pyproject.toml, go.mod ou manifestes similaires pour déduire la pile technologique.

Exigences :
- Utiliser des volumes nommés, pas des montages bind, pour les données persistantes
- Définir `restart: unless-stopped` sur tous les services de longue durée
- Injecter les secrets via des variables d'environnement référençant un fichier `.env` — ne jamais coder les identifiants en dur
- Inclure un bloc `healthcheck` pour chaque service qui expose un port
- Définir un réseau bridge dédié ; ne pas utiliser le réseau par défaut
- Épingler les balises d'image — ne jamais utiliser `:latest`
- Ajouter une `depends_on` avec `condition: service_healthy` pour les services ayant des dépendances au démarrage
- Séparer les profils `dev` et `prod` le cas échéant en utilisant la clé `profiles`
- Pour les bases de données : définir explicitement `POSTGRES_DB` / `MYSQL_DATABASE` / etc. et exposer les ports uniquement sur localhost (`127.0.0.1:<port>:<port>`)

Sortie :
1. Le `docker-compose.yml` complet
2. Un `docker-compose.override.yml` avec des montages source et des surcharges de port de débogage pour le dev local
3. Un `.env.example` répertoriant chaque variable requise sans valeurs réelles

Après les fichiers, répertorier :
- Chaque variable d'environnement que l'opérateur doit fournir
- Tous les volumes qui nécessitent une pré-population ou des scripts d'initialisation
- Commandes pour démarrer la pile et vérifier la santé :
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Si la pile a un proxy inverse (nginx/traefik/caddy), l'inclure avec une configuration de terminaison TLS structurellement correcte mais commentée.

Ne pas générer de Dockerfile sauf demande explicite — composition uniquement.
