---
description: Générer un README.md complet pour le projet actuel
argument-hint: "[output-path]"
---
Analysez ce projet et générez un README.md de qualité production.

Étapes :
1. Analysez la structure du dépôt : lisez package.json / pyproject.toml / Cargo.toml / go.mod ou équivalent pour déterminer le langage, le framework et les dépendances.
2. Identifiez le ou les points d'entrée, le système de build et le test runner.
3. Lisez tout README existant, CONTRIBUTING et les fichiers docs/ pour le contexte — ne dupliquez pas, améliorez.
4. Inspectez la config CI (.github/workflows/, .gitlab-ci.yml, etc.) pour les badges et les noms de workflows.

Rédigez le README avec ces sections (incluez uniquement les sections pertinentes — omettez les vides) :

- **Nom du projet + un slogan d'une phrase** — commencez par la valeur, pas la stack technologique.
- **Badges** — statut de build, coverage, licence, version (utilisez les URLs shield réelles si CI existe).
- **Aperçu** — 2–4 phrases : quel problème il résout, pour qui il est, ce qui le distingue.
- **Exigences** — versions runtime/compiler minimales, contraintes OS.
- **Installation** — commandes exactes, copiables-collables. Couvrez tous les gestionnaires de paquets supportés si applicable.
- **Démarrage rapide** — le code ou la commande minimale pour obtenir un résultat fonctionnant en moins de 2 minutes.
- **Utilisation** — flags CLI clés, surface API ou options de configuration. Utilisez les vrais exemples du codebase.
- **Configuration** — variables env, format de fichier config, défauts. Référencez les vrais noms de variables trouvés dans le code.
- **Architecture** (si non triviale) — un court paragraphe ou un diagramme ASCII montrant les composants majeurs.
- **Développement** — comment cloner, installer les dépendances dev, exécuter les tests, linter et builder.
- **Contribution** — lien vers CONTRIBUTING.md s'il existe ; sinon rédigez deux phrases.
- **Licence** — nom de la licence et lien vers le fichier LICENSE.

Contraintes :
- Chaque bloc de code doit spécifier sa barrière de langage.
- N'inventez pas de fonctionnalités ou d'APIs — documentez uniquement ce qui existe dans le codebase.
- Rédigez pour un développeur qui n'a jamais vu ce projet.
- Utilisez les en-têtes ATX (##), pas le style souligné.
- Gardez le ton direct et neutre — pas de langage marketing.

Chemin de sortie : $ARGUMENTS (défaut : README.md à la racine du dépôt).
Écrivez le fichier. N'imprimez pas le contenu au terminal — confirmez simplement le chemin écrit.
