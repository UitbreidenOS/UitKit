---
description: Générer un harnais de test pour évaluer une invite LLM ou une chaîne par rapport à un ensemble de données
argument-hint: "[prompt file or description of the task being evaluated]"
---
Vous construisez un harnais d'évaluation LLM pour la tâche décrite dans $ARGUMENTS.

Lisez tous les chemins de fichier fournis. Si une description brute est donnée, déduisez la tâche.

**Étape 1 — Identifier les exigences d'évaluation**

Déterminez :
- Type de tâche : classification, extraction, génération, RAG, utilisation d'outils, multi-tours, ou autre
- Ce que « correct » signifie : correspondance exacte, correspondance sémantique, score rubrique, validation de schéma structuré, ou validation humaine
- Modes de défaillance à détecter : hallucination, refus, violation de format, latence, dépassement de tokens

**Étape 2 — Concevoir le schéma de l'ensemble de données de test**

Générez un schéma JSONL pour les cas de test. Chaque enregistrement doit inclure :
- `id` : chaîne unique
- `input` : le message utilisateur ou le contexte d'invite complet (incluez l'invite système si pertinent)
- `expected` : vérité terrain ou rubrique (adaptez la forme au type de tâche)
- `tags` : tableau de chaînes pour le filtrage (par ex. `["edge-case", "language:fr"]`)

Montrez 3–5 enregistrements d'exemple représentatifs couvrant : chemin heureux, cas limite, entrée adversariale.

**Étape 3 — Générer le script du harnais**

Écrivez un script Python autonome utilisant le SDK Anthropic (paquet `anthropic`). Exigences :
- Charger les cas de test à partir de `evals.jsonl`
- Appeler le modèle pour chaque cas (par défaut : `claude-sonnet-4-6`, remplaçable via `--model`)
- Noter chaque résultat en utilisant l'évaluateur approprié :
  - Correspondance exacte/regex pour les sorties structurées
  - Similitude cosinus d'intégration pour les tâches sémantiques (utilisez `sentence-transformers` si disponible, sinon ignorez)
  - Notation rubrique LLM-as-judge pour la génération ouverte (autonome, utilisez `claude-haiku-4-5-20251001`)
- Générer un JSONL de résultats et un tableau récapitulatif sur stdout
- Supporter le drapeau `--sample N` pour exécuter sur N cas aléatoires
- Utiliser `asyncio` + `AsyncAnthropic` pour une exécution parallèle avec une limite de concurrence configurable

**Étape 4 — Snippet d'intégration CI**

Montrez une étape GitHub Actions qui :
- Exécute le harnais sur chaque PR
- Échoue la vérification si le taux de réussite chute en dessous d'un seuil configurable (par défaut 90%)
- Publie un commentaire récapitulatif avec des ventilations par étiquette

**Format de sortie :**
1. Schéma d'ensemble de données + enregistrements d'exemple (JSONL)
2. Harnais Python complet (`eval_harness.py`)
3. Snippet YAML GitHub Actions
4. Bloc d'utilisation README d'une seule ligne

Pas de commentaires d'espace réservé. Chaque fonction doit être implémentée.
