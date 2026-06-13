---
description: Générer un README.md complet et de production pour le projet actuel
argument-hint: "[output-path]"
---
Analyser ce projet et générer un README.md de qualité production.

Étapes:
1. Scanner la structure du repo : lire package.json / pyproject.toml / Cargo.toml / go.mod ou équivalent pour déterminer le langage, le framework et les dépendances.
2. Identifier le(s) point(s) d'entrée, le système de build et le test runner.
3. Lire tout README existant, CONTRIBUTING et fichiers docs/ pour le contexte — ne pas dupliquer, améliorer.
4. Inspecter la config CI (.github/workflows/, .gitlab-ci.yml, etc.) pour les badges et les noms de workflows.

Écrire le README avec ces sections (inclure seulement les sections pertinentes — omettre les vides) :

- **Nom du projet + tagline d'une phrase** — commencer par la valeur, pas la tech stack.
- **Badges** — statut de build, couverture, licence, version (utiliser les vraies URLs shield si CI existe).
- **Présentation** — 2–4 phrases : quel problème il résout, pour qui, ce qui le rend distinct.
- **Prérequis** — versions minimum de runtime/compiler, contraintes OS.
- **Installation** — commandes exactes, copy-pasteable. Couvrir tous les package managers supportés si applicable.
- **Quick start** — le code minimal ou la commande pour obtenir un résultat fonctionnant en moins de 2 minutes.
- **Utilisation** — flags CLI clés, surface API ou options de configuration. Utiliser les vrais exemples du codebase.
- **Configuration** — variables env, format fichier config, défauts. Référencer les vraies noms de variables trouvées dans le code.
- **Architecture** (si non-triviale) — un court paragraphe ou diagramme ASCII montrant les composants majeurs.
- **Développement** — comment cloner, installer les deps de dev, lancer les tests, lint et build.
- **Contribution** — lien vers CONTRIBUTING.md s'il existe; sinon écrire deux phrases.
- **Licence** — nom de la licence et lien vers le fichier LICENSE.

Contraintes :
- Chaque bloc de code doit spécifier sa fence de langage.
- Ne pas inventer de features ou APIs — documenter seulement ce qui existe dans le codebase.
- Écrire pour un développeur qui n'a jamais vu ce projet.
- Utiliser les headings ATX (##), pas le style underline.
- Garder le ton direct et neutre — pas de langage marketing.

Chemin de sortie : $ARGUMENTS (défaut : README.md à la racine du repo).
Écrire le fichier. Ne pas imprimer le contenu au terminal — juste confirmer le chemin écrit.
