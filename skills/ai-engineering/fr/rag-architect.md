---
name: rag-architect
description: "Conception de système RAG : stratégies de chunking, sélection du modèle d'embedding, choix du vector store, modèles de récupération, reranking, évaluation — récupération augmentée par génération de qualité production"
---

# Compétence Architecte RAG

## Quand l'activer
- Concevoir un système de récupération augmentée par génération (RAG) à partir de zéro
- Choisir entre les stratégies de chunking pour votre type de document
- Sélectionner un modèle d'embedding et un vector store
- Améliorer la précision du RAG (réduire les hallucinations, améliorer la pertinence)
- Configurer les métriques d'évaluation pour votre pipeline RAG
- Décider entre RAG naïf vs. modèles avancés (HyDE, multi-query, etc.)

## Quand NE PAS l'utiliser
- Bots FAQ simples avec < 50 documents — l'ingénierie des prompts est suffisante
- Quand vos données s'intègrent dans la fenêtre de contexte — suffit de les mettre
- Données en temps réel qui changent chaque minute — RAG sur des index obsolètes n'aidera pas

## Instructions

### Concevoir l'architecture

```
Concevoir une architecture RAG pour ce cas d'usage :

Données : [décrivez — PDF / pages web / dossiers de base de données / code / emails / etc.]
Volume : [X documents, total ~XMB/GB]
Types de requêtes : [recherche factuelle / synthèse / comparaison / analyse]
Exigence de latence : [réponse < Xs]
Exigence de précision : [quel est le coût d'une mauvaise réponse ?]
Stack : [Python / Node.js / cloud préféré]
Budget : [auto-hébergé / service géré / pas de limite]

Concevoir :
1. Pipeline d'ingestion (comment les données arrivent)
2. Stratégie de chunking (comment fractionner les documents)
3. Modèle d'embedding (ce qui convertit le texte en vecteurs)
4. Vector store (où vivent les vecteurs)
5. Stratégie de récupération (comment trouver les chunks pertinents)
6. Reranking (optionnel mais puissant)
7. Génération (prompt + modèle + assemblage de contexte)
8. Évaluation (comment mesurer si ça marche)
```

### Stratégies de chunking

```
Recommander une stratégie de chunking pour ce type de document.

Type de document : [rapports PDF / code / contrats juridiques / logs de chat / articles d'actualités / docs techniques]
Longueur moyenne du document : [X pages / X mots]
Modèles de requête : [fait unique / multi-étapes / exige contexte du document entier]

Options à évaluer :
1. Taille fixe : [X tokens] avec [Y token] de chevauchement
2. Fractionnement par phrase : fractionner aux limites des phrases
3. Fractionnement caractère récursif : essayer paragraphes → phrases → caractères
4. Chunking sémantique : intégrer et fractionner où la similarité cosinus baisse
5. Document-spécifique : structure d'en-têtes (pour PDF/docs avec sections claires)
6. Parent-enfant / hiérarchique : stocker petits chunks pour récupération, récupérer parent pour contexte

Recommandation pour mon cas + exemple d'implémentation.
```

### Sélection du modèle d'embedding

```
M'aider à choisir un modèle d'embedding.

Cas d'usage : [décrivez le type de contenu et de requêtes]
Langue : [anglais seulement / multilingue]
Exigence de latence : [temps réel / batch OK]
Budget : [sensibilité du coût par jeton]
Exigence auto-hébergée : [oui / non]

Comparer :
- OpenAI text-embedding-3-small : qualité forte, bon marché ($0.02/1M tokens), hébergé
- OpenAI text-embedding-3-large : meilleure qualité OpenAI, plus cher
- Anthropic (Claude via API) : utiliser pour la cohérence si Claude génère aussi
- Cohere embed-v3 : multilingue fort, 1,024 dimension par défaut
- Voyage AI voyage-3 : excellent pour le code et les docs techniques
- Local : nomic-embed-text, all-MiniLM-L6-v2 (rapide, gratuit, qualité inférieure)
- Google text-embedding-004 : meilleur multilingue à grande échelle

Recommandation basée sur mes contraintes.
```

### Modèles de récupération

```
Concevoir la stratégie de récupération pour ce système RAG.

Types de requête que nous recevons : [décrivez]
Modes de défaillance connus dans la récupération naïve : [trop littéral / manque paraphrases / requêtes multi-sauts]

Modèles de base :
1. Similarité sémantique : intégrer requête, similitude cosinus top-k — ligne de base
2. MMR (Maximal Marginal Relevance) : récupération aware-diversité, réduit redondance
3. Hybride (BM25 + sémantique) : mot-clé + sémantique, fort pour entités nommées

Modèles avancés :
4. HyDE (Hypothetical Document Embeddings) : générer une « fausse réponse » et l'intégrer
5. Multi-query : générer 3-5 reformulations, récupérer pour chaque, dédupliquer
6. Compression contextuelle : récupérer → compresser aux phrases pertinentes → générer
7. Step-back prompting : abstraire la question à niveau supérieur, récupérer à partir de cela
8. FLARE : générer itérativement, récupérer quand la confiance baisse

Quels modèles s'appliquent à mon cas d'usage ? Ordre d'implémentation ?
```

### Framework d'évaluation

```
Concevoir un framework d'évaluation RAG pour ce système.

Ce que « bon » signifie pour mon cas d'usage : [décrivez — précision / complétude / fidélité]

Métriques à suivre :
1. Qualité de récupération :
   - Precision@k : les chunks récupérés sont-ils pertinents ?
   - Recall@k : tous les chunks pertinents sont-ils récupérés ?
   - MRR (Mean Reciprocal Rank) : le meilleur chunk est-il classé en premier ?

2. Qualité de génération :
   - Fidélité : la réponse respecte-t-elle le contexte récupéré ? (pas d'hallucination)
   - Pertinence de réponse : la réponse adresse-t-elle la question ?
   - Pertinence du contexte : les chunks récupérés sont-ils réellement utilisés ?

Outils d'évaluation :
- RAGAS : framework d'évaluation RAG automatisé (ragas.io)
- LangChain Evaluators : vérifications fidélité + correction intégrées
- Ensemble doré manuel : [X] paires question-réponse, Claude ou humain comme juge

Créer un ensemble de test de [10] paires question-réponse pour mon domaine.
Configurer : quand mon RAG échoue-t-il et comment le saurai-je ?
```

## Exemple

**Utilisateur :** Construire RAG pour une base de connaissances interne de 5 000 pages (pages Notion, PDF, threads Slack). Les requêtes sont principalement « comment faire X » et « quelle est notre politique sur Y ».

**Architecture Claude :**

**Chunking :** Fractionnement caractère récursif avec chunks 512-tokens et chevauchement 50-tokens. Pour threads Slack : grouper par thread (traiter comme un chunk), pas de messages individuels.

**Embedding :** text-embedding-3-small — coût équilibré et qualité, anglais seulement est fine ici.

**Vector store :** Qdrant (auto-hébergé) ou Pinecone (géré) — à 5 000 pages (~250K chunks), les deux gèrent facilement.

**Récupération :** BM25 hybride + sémantique. Les requêtes « politique sur Y » bénéficient de la correspondance par mot-clé (BM25) ; « comment faire » bénéficie de sémantique. Combiner avec RRF (Reciprocal Rank Fusion).

**Reranking :** Cohere rerank-v3 — exécuter top-20 à travers reranker pour obtenir top-5 pour la génération. Plus grand gain de qualité pour l'effort.

**Évaluation :** Créer 50 paires Q&A gold-standard à partir de vos questions les plus courantes. Utiliser le score de fidélité RAGAS — cible > 0.85 avant l'expédition.

**Précision attendue :** Hybride + reranking atteint généralement 75-85% d'exactitude de réponse sur les bases de connaissances internes. Sémantique pur sans reranking : ~55-65%.

---
