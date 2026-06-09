---
description: Générer un Dockerfile prêt pour la production pour le projet actuel
argument-hint: "[language/runtime] [optional: base-image]"
---
Analysez le projet actuel et générez un Dockerfile prêt pour la production. Utilisez $ARGUMENTS pour déduire le langage/runtime cible et la base image optionnelle à substituer.

Étapes :
1. Inspectez la racine du projet pour les manifestes de packages (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, etc.) pour détecter la pile automatiquement. Si $ARGUMENTS fournit un langage ou un runtime, préférez cela.
2. Identifiez le point d'entrée de l'application et les étapes de build.
3. Choisissez la plus petite base image appropriée (alpine, distroless, slim) sauf si $ARGUMENTS spécifie autrement.
4. Appliquez un build multi-stage s'il y a une étape de compilation/build — séparez les étapes builder et runtime.
5. Définissez un USER non-root. Assignez un UID numérique explicite (par exemple, 1001) pour la compatibilité Kubernetes.
6. Copiez uniquement ce que le runtime a besoin ; excluez les dépendances dev, les fixtures de test, et les secrets.
7. Définissez correctement WORKDIR, EXPOSE, ENV, et ENTRYPOINT/CMD.
8. Ajoutez une instruction HEALTHCHECK utilisant le point de terminaison santé probable de l'app ou une simple vérification de processus.
9. Épinglez tous les tags des base images à un digest spécifique ou une version — ne jamais utiliser `latest`.
10. Ajoutez des commentaires en ligne uniquement où le choix n'est pas évident (par exemple, pourquoi une base image ou un flag spécifique a été choisi).
11. Générez un fichier `.dockerignore` aux côtés du Dockerfile qui exclut : `.git`, `node_modules`, `__pycache__`, les répertoires de test, `.env*`, les artefacts de build locaux.

Après la génération, listez les hypothèses faites (par exemple, port déduit, point d'entrée supposé) et signalez les étapes manuelles que le développeur doit compléter (par exemple, injection de secrets, valeurs de build-arg).

Ne pas ajouter de ARGs ou de variables ENV de remplissage qui ne servent aucun but. Ne pas émettre de commentaires marketing ou de prose explicative en dehors des commentaires en ligne du code.
