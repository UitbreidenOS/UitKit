# Règles Docker

## S'applique à
Tous les fichiers `Dockerfile`, `docker-compose.yml`, `.dockerignore` et les fichiers de configuration liés aux conteneurs.

## Règles

1. **Épinglez les versions des images de base — n'utilisez jamais `latest`** — `FROM node:20.14-alpine3.19` et non `FROM node:latest`. Les images non épinglées cassent silencieusement la reproductibilité lors de la mise à jour du tag en amont.

2. **Utilisez des builds multi-étapes pour minimiser la taille de l'image finale** — compilez/installez dans une étape de construction, copiez uniquement les artefacts vers l'étape d'exécution. L'image d'exécution ne doit pas contenir de compilateurs, de dépendances de développement ou de caches de construction.

3. **Exécutez en tant qu'utilisateur non-root** — ajoutez `RUN addgroup -S app && adduser -S app -G app` et `USER app` avant le `CMD` final. Root à l'intérieur du conteneur est root sur l'hôte si l'isolation du conteneur se casse.

4. **Un processus par conteneur** — les conteneurs ne sont pas des VM. Si vous avez besoin d'un sidecar (collecteur de journaux, agent de métriques), utilisez un conteneur séparé et un réseau partagé.

5. **Gardez les couches minimales et ordonnées par fréquence de changement** — copiez `package.json` et installez les dépendances avant de copier le code source. Les couches stables sont mises en cache; les couches volatiles invalident tout ce qui est en dessous.

6. **Utilisez `.dockerignore`** — excluez `node_modules/`, `.git/`, `*.log`, les fixtures de test et les secrets. Sans cela, `COPY . .` envoie tout le contexte de construction, ralentissant les builds et risquant les fuites d'identifiants.

7. **Ne cuirez jamais de secrets dans les images** — pas de `ENV API_KEY=...`, pas de `RUN curl -H "Authorization: ..."`. Utilisez les secrets Docker, les secrets au moment de la construction (`--secret`) ou l'injection d'environnement à l'exécution.

8. **Définissez `WORKDIR` explicitement** — utilisez toujours un chemin absolu : `WORKDIR /app`. N'exécutez pas les commandes à partir de `/` ou de chemins relatifs.

9. **Préférez `COPY` à `ADD`** — `ADD` a un comportement surprenant (auto-extraction d'archives, récupération d'URL). Utilisez `COPY` pour les fichiers locaux. Utilisez `RUN curl` explicitement quand vous avez besoin de fichiers distants.

10. **Spécifiez `HEALTHCHECK`** — définissez comment l'orchestrateur doit déterminer la vivacité : `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1`.

11. **Définissez les limites de ressources dans `docker-compose.yml`** — `mem_limit`, `cpus`. Les conteneurs sans limites affament les voisins sur les hôtes partagés.

12. **Utilisez des volumes nommés, pas des bind mounts, pour les données persistantes en production** — les bind mounts couplent le conteneur à la structure du chemin hôte. Les volumes nommés sont portables et gérés par Docker.

13. **Étiquetez les images avec le SHA du commit git en CI, pas seulement un nom de branche** — `myapp:abc1234` est immuable. `myapp:main` ne l'est pas. Les étiquettes de branche sont des alias utiles, pas des identifiants fiables.

14. **Analysez les images pour les vulnérabilités en CI** — `docker scout cves` ou `trivy image`. Échouez la construction sur les CVE critiques de l'étape finale.

15. **Évitez `CMD` avec la forme shell pour la gestion des signaux** — `CMD ["node", "server.js"]` (forme exec) reçoit SIGTERM directement. `CMD node server.js` (forme shell) envoie SIGTERM au shell, pas au processus.


---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
