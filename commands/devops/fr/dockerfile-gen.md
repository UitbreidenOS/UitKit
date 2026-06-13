---
description: Générer un Dockerfile prêt pour la production pour le projet actuel
argument-hint: "[language/runtime] [optionnel: base-image]"
---
Analyser le projet actuel et générer un Dockerfile prêt pour la production. Utiliser $ARGUMENTS pour déduire le langage/runtime cible et le remplacement optionnel de l'image de base.

Étapes :
1. Inspecter la racine du projet pour les fichiers manifestes (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, etc.) afin de détecter automatiquement la pile technologique. Si $ARGUMENTS fournit un langage ou un runtime, privilégier celui-ci.
2. Identifier le point d'entrée de l'application et les étapes de build.
3. Choisir l'image de base la plus petite appropriée (alpine, distroless, slim) sauf si $ARGUMENTS spécifie autrement.
4. Appliquer un build multi-stage s'il y a une étape de compilation/build — séparer les étapes builder et runtime.
5. Définir un USER non-root. Assigner un UID numérique explicite (par exemple, 1001) pour la compatibilité Kubernetes.
6. Copier uniquement ce dont le runtime a besoin ; exclure les dépendances de développement, les fixtures de test et les secrets.
7. Définir WORKDIR, EXPOSE, ENV, et ENTRYPOINT/CMD correctement.
8. Ajouter une instruction HEALTHCHECK en utilisant le endpoint health probable de l'app ou une simple vérification de processus.
9. Épingler toutes les balises d'image de base à un digest spécifique ou une version — ne jamais utiliser `latest`.
10. Ajouter des commentaires en ligne uniquement là où le choix n'est pas évident (par exemple, pourquoi une image de base ou un flag spécifique a été choisi).
11. Afficher un fichier `.dockerignore` aux côtés du Dockerfile qui exclut : `.git`, `node_modules`, `__pycache__`, les répertoires de test, `.env*`, les artefacts de build locaux.

Après génération, lister les suppositions faites (par exemple, port déduit, point d'entrée supposé) et signaler les étapes manuelles que le développeur doit compléter (par exemple, injection de secrets, valeurs build-arg).

Ne pas ajouter d'ARGs ou de variables ENV de remplissage qui n'ont aucun but. Ne pas produire de commentaires marketing ou de prose explicative en dehors des commentaires de code en ligne.
