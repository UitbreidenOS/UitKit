---
description: Générer un cadre de test pour évaluer un prompt ou une chaîne LLM par rapport à un ensemble de données
argument-hint: "[fichier prompt ou description de la tâche à évaluer]"
---
Vous construisez un cadre d'évaluation LLM pour la tâche décrite dans $ARGUMENTS.

Lisez tous les chemins de fichiers fournis. Si une simple description est donnée, déduisez la tâche.

**Étape 1 — Identifier les exigences d'évaluation**

Déterminez :
- Type de tâche : classification, extraction, génération, RAG, utilisation d'outils, multi-tour, ou autre
- À quoi ressemble « correct » : correspondance exacte, correspondance sémantique, score de rubrique, validation de schéma structuré, ou intervention humaine
- Modes de défaillance à détecter : hallucination, refus, violation de format, latence, dépassement de tokens

**Étape 2 — Concevoir le schéma de l'ensemble de données de test**

Produisez un schéma JSONL pour les cas de test. Chaque enregistrement doit inclure :
- `id` : chaîne unique
- `input` : le message utilisateur ou le contexte du prompt complet (incluez le prompt système si pertinent)
- `expected` : vérité fondamentale ou rubrique (adaptez la forme au type de tâche)
- `tags` : tableau de chaînes pour filtrer (par exemple `["edge-case", "language:fr"]`)

Montrez 3–5 enregistrements d'exemple représentatifs couvrant : cas nominal, cas limite, entrée adversariale.

**Étape 3 — Générer le script du cadre**

Écrivez un script Python autonome utilisant le SDK Anthropic (package `anthropic`). Exigences :
- Charger les cas de test depuis `evals.jsonl`
- Appeler le modèle pour chaque cas (par défaut : `claude-sonnet-4-6`, remplaçable via `--model`)
- Évaluer chaque résultat en utilisant l'évaluateur approprié :
  - Correspondance exacte/regex pour les sorties structurées
  - Similarité cosinus d'intégration pour les tâches sémantiques (utilisez `sentence-transformers` si disponible, sinon ignorez)
  - Notation de rubrique par LLM-as-judge pour la génération en boucle ouverte (autonome, utilisez `claude-haiku-4-5-20251001`)
- Produire un JSONL de résultats et un tableau récapitulatif sur stdout
- Supporter le flag `--sample N` pour exécuter sur N cas aléatoires
- Utiliser `asyncio` + `AsyncAnthropic` pour exécution parallèle avec une limite de concurrence configurable

**Étape 4 — Extrait d'intégration CI**

Montrez une étape GitHub Actions qui :
- Exécute le cadre sur chaque PR
- Échoue la vérification si le taux de réussite tombe en dessous d'un seuil configurable (90% par défaut)
- Poste un commentaire récapitulatif avec ventilations par étiquette

**Format de sortie :**
1. Schéma de l'ensemble de données + enregistrements d'exemple (JSONL)
2. Cadre Python complet (`eval_harness.py`)
3. Extrait YAML GitHub Actions
4. Bloc `README` d'utilisation en une ligne

Pas de commentaires de substitution. Chaque fonction doit être implémentée.
