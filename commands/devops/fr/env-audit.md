---
description: Auditer l'utilisation des variables d'environnement dans la base de code pour les problèmes de sécurité et d'hygiène
argument-hint: "[chemin ou glob de fichier à scanner]"
---
Auditer l'utilisation des variables d'environnement dans : $ARGUMENTS (par défaut : le projet entier)

Scanner tous les fichiers source, fichiers de configuration, Dockerfiles, fichiers de composition, définitions CI/CD et manifestes de déploiement.

Signaler les résultats dans ces catégories :

**1. Secrets à risque**
- Identifiants codés en dur, jetons, clés API ou mots de passe dans tout fichier suivi par git
- Fichiers `.env` qui ne sont pas dans `.gitignore`
- Secrets interpolés directement dans les étapes shell `run:` en CI (risque d'injection)
- Instructions Docker `ARG`/`ENV` qui intègrent des secrets dans les couches d'image

**2. Variables manquantes**
- Variables référencées dans le code (process.env.X, os.environ["X"], os.Getenv("X"), etc.) sans entrée correspondante dans `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap, ou valeurs par défaut documentées
- Variables requises sans fallback qui causeraient une panique à l'exécution si non définies

**3. Variables inutilisées**
- Variables déclarées dans `.env`, `.env.example`, Compose ou manifestes qui ne sont jamais lues dans le code

**4. Inconsistances**
- Noms de variables différents entre les environnements (par exemple, `DATABASE_URL` en compose vs `DB_URL` en k8s)
- Variables avec des valeurs par défaut dans un environnement mais requises dans un autre
- Déclarations dupliquées dans plusieurs fichiers avec potentiellement des valeurs différentes

**5. Hygiène**
- Nommage non standard (devrait être `SCREAMING_SNAKE_CASE`)
- Variables contenant des données sensibles mais non marquées `sensitive` en Terraform ou `type: kubernetes.io/Opaque` dans les Secrets k8s
- Fichiers `.env` validés avec des valeurs réelles

Format de sortie :
- Grouper les résultats par catégorie ci-dessus
- Pour chaque résultat : chemin du fichier + numéro de ligne, sévérité (`critical` / `warning` / `info`) et remédiation sur une ligne
- Terminer par un résumé du nombre de résultats par sévérité et une liste des correctifs priorisée (éléments critiques d'abord)

Ne pas imprimer les contenus de fichier verbatim — citer les emplacements et citer uniquement la ligne pertinente.
