---
description: Générer un harnais de test pour évaluer un prompt LLM ou une chaîne d'appels contre un ensemble de données
argument-hint: "[chemin du fichier de prompt ou description de la tâche à évaluer]"
---
Vous construisez un harnais d'évaluation LLM pour la tâche décrite dans $ARGUMENTS.

Lisez tous les chemins de fichiers fournis. Si une description brute est donnée, déduisez la tâche.

**Étape 1 — Identifier les exigences d'évaluation**

Déterminez:
- Type de tâche: classification, extraction, génération, RAG, utilisation d'outils, multi-tour, ou autre
- À quoi ressemble la "correction": correspondance exacte, correspondance sémantique, score de rubrique, validation de schéma structuré, ou boucle humaine
- Modes d'échec à détecter: hallucination, refus, violation de format, latence, dépassement de jetons

**Étape 2 — Concevoir le schéma de l'ensemble de données de test**

Produisez un schéma JSONL pour les cas de test. Chaque enregistrement doit inclure:
- `id`: chaîne unique
- `input`: le message utilisateur ou le contexte de prompt complet (inclure le prompt système si pertinent)
- `expected`: vérité de base ou rubrique (adapter la forme au type de tâche)
- `tags`: tableau de chaînes pour le filtrage (par exemple `["edge-case", "language:fr"]`)

Montrez 3–5 enregistrements d'exemple représentatifs couvrant: chemin heureux, cas limites, entrée adversariale.

**Étape 3 — Générer le script du harnais**

Écrivez un script Python autonome utilisant le SDK Anthropic (paquet `anthropic`). Exigences:
- Charger les cas de test à partir de `evals.jsonl`
- Appeler le modèle pour chaque cas (par défaut: `claude-sonnet-4-6`, modifiable via `--model`)
- Noter chaque résultat en utilisant l'évaluateur approprié:
  - Correspondance exacte/regex pour les sorties structurées
  - Similarité cosinus des embeddings pour les tâches sémantiques (utiliser `sentence-transformers` si disponible, sinon ignorer)
  - Notation de rubrique par LLM-as-judge pour la génération ouverte (autonome, utiliser `claude-haiku-4-5-20251001`)
- Produire un JSONL de résultats et un tableau récapitulatif vers stdout
- Support du drapeau `--sample N` pour exécuter sur N cas aléatoires
- Utiliser `asyncio` + `AsyncAnthropic` pour l'exécution parallèle avec une limite de concurrence configurable

**Étape 4 — Snippet d'intégration CI**

Montrez une étape GitHub Actions qui:
- Exécute le harnais sur chaque PR
- Échoue la vérification si le taux de réussite tombe en dessous d'un seuil configurable (par défaut 90%)
- Affiche un commentaire récapitulatif avec les ventilations par tag

**Format de sortie:**
1. Schéma de l'ensemble de données + enregistrements d'exemple (JSONL)
2. Harnais Python complet (`eval_harness.py`)
3. Snippet YAML GitHub Actions
4. Bloc README d'utilisation d'une seule ligne

Pas de commentaires d'espace réservé. Chaque fonction doit être implémentée.
