---
description: Auditer l'utilisation des variables d'environnement dans la base de code pour les problèmes de sécurité et d'hygiène
argument-hint: "[path or file glob to scan]"
---
Auditer l'utilisation des variables d'environnement dans : $ARGUMENTS (par défaut : projet entier)

Analyser tous les fichiers source, fichiers de configuration, Dockerfiles, fichiers compose, définitions CI/CD et manifests de déploiement.

Rapporter les résultats dans ces catégories :

**1. Secrets à risque**
- Identifiants codés en dur, jetons, clés API ou mots de passe dans tout fichier suivi par git
- Fichiers `.env` qui ne sont pas dans gitignore
- Secrets interpolés directement dans les étapes `run:` shell en CI (risque d'injection)
- Instructions Docker `ARG`/`ENV` qui intègrent des secrets dans les couches d'image

**2. Variables manquantes**
- Variables référencées dans le code (process.env.X, os.environ["X"], os.Getenv("X"), etc.) qui n'ont pas d'entrée correspondante dans `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap, ou défauts documentés
- Variables requises sans fallback qui provoquent une panique/crash à l'exécution si non défini

**3. Variables inutilisées**
- Variables déclarées dans `.env`, `.env.example`, Compose, ou manifests qui ne sont jamais lues dans le code

**4. Incohérences**
- Noms de variables qui diffèrent entre les environnements (par exemple, `DATABASE_URL` dans compose vs `DB_URL` dans k8s)
- Variables avec des défauts dans un environnement mais requises dans un autre
- Déclarations dupliquées dans plusieurs fichiers avec des valeurs potentiellement différentes

**5. Hygiène**
- Nommage non-standard (devrait être `SCREAMING_SNAKE_CASE`)
- Variables qui contiennent des données sensibles mais ne sont pas marquées `sensitive` dans Terraform ou `type: kubernetes.io/Opaque` dans les Secrets k8s
- Fichiers `.env` engagés avec des valeurs réelles

Format de sortie :
- Grouper les résultats par catégorie ci-dessus
- Pour chaque résultat : chemin du fichier + numéro de ligne, sévérité (`critical` / `warning` / `info`), et correction d'une ligne
- Terminer par un nombre récapitulatif par sévérité et une liste de corrections priorisées (éléments critiques en premier)

Ne pas imprimer le contenu des fichiers littéralement — citer les emplacements et citer uniquement la ligne pertinente.
