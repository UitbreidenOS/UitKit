---
description: Mettre en place un pipeline RAG prêt pour la production pour une source de données et une pile technologique donnée
argument-hint: "[data source description and preferred stack]"
---
Vous concevez un pipeline de génération augmentée par récupération basé sur : $ARGUMENTS

Si aucune préférence de pile n'est donnée, utilisez par défaut : Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` pour la génération, `text-embedding-3-small` via OpenAI pour les embeddings (passer à Voyage AI si l'utilisateur spécifie Anthropic uniquement).

**Étape 1 — Comprendre les données**

Identifier à partir de $ARGUMENTS :
- Type de source : PDFs, pages web, lignes de base de données, fichiers de code, Notion/Confluence, emails, ou mélange
- Fréquence de mise à jour : corpus statique, ajout uniquement, ou mutation fréquente
- Estimation de la taille : <1 k documents, 1 k–100 k, ou 100 k+
- Sensibilité : PII présente ? Air-gapped requis ?

Énoncez vos hypothèses explicitement si non données.

**Étape 2 — Choisir une stratégie de chunking**

Sélectionnez et justifiez une des options :
- Taille fixe avec chevauchement (rapide, baseline)
- Sémantique / fenêtre de phrase (meilleure cohérence pour la prose)
- Fractionnement récursif par caractère selon la structure du document (code, markdown)
- Récupérateur de document parent (récupérer petit chunk, retourner contexte parent)

Montrez la configuration exacte du chunker : `chunk_size`, `chunk_overlap`, liste de séparateurs.

**Étape 3 — Générer le pipeline d'ingestion**

Écrivez un script Python (`ingest.py`) qui :
- Charge les documents à partir du type de source identifié ci-dessus
- Nettoie et normalise le texte (supprime le boilerplate, normalise les espaces, gère l'encodage)
- Divise les documents en chunks selon la stratégie choisie
- Incorpore les chunks par lots (max 512 par appel API)
- Effectue une opération upsert dans le magasin vectoriel avec des métadonnées : `source`, `chunk_index`, `ingested_at`
- Est idempotente — réexécuter sur des documents inchangés ne réembed pas

**Étape 4 — Générer la chaîne de récupération + génération**

Écrivez un module Python (`rag_chain.py`) qui :
- Accepte une chaîne de requête utilisateur
- Incorpore la requête et récupère les top-K chunks (K=5 par défaut) avec re-ranking MMR
- Construit une invite système qui instruit le modèle à répondre uniquement à partir du contexte récupéré et à citer les sources par champ de métadonnées `source`
- Appelle `claude-sonnet-4-6` avec cache des prompts sur le bloc de contexte (utiliser `cache_control: {"type": "ephemeral"}` sur les messages de contexte)
- Retourne : `{"answer": str, "sources": list[str], "tokens_used": int}`

**Étape 5 — Checklist opérationnelle**

Listez comme cases à cocher :
- [ ] Stratégie de fraîcheur de l'index (réingestion planifiée vs. déclenchement webhook)
- [ ] Pinning de version du modèle d'embedding
- [ ] Métriques de qualité de récupération à suivre (MRR, recall@K)
- [ ] Fallback quand la confiance de récupération est faible
- [ ] Suppression PII si applicable

Sortie : `ingest.py`, `rag_chain.py`, checklist opérationnelle. Aucun stub.
