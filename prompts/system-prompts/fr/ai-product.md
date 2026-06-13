> 🇫🇷 This is the French translation. [English version](../ai-product.md).

# Starter CLAUDE.md — Produit IA

Déposez ceci dans le `CLAUDE.md` de votre projet et remplissez les sections entre crochets.

---

```markdown
# [Nom du Projet] — Instructions Claude Code

## Ce que c'est
[Un paragraphe : ce que fait le produit IA, quel modèle il utilise, qui sont les utilisateurs]

## Stack
- Langage : [TypeScript / Python]
- Framework : [Next.js / FastAPI]
- IA : [API Claude via Anthropic SDK / OpenAI / Gemini]
- Modèle : [claude-sonnet-4-6 / claude-opus-4-7 / claude-haiku-4-5]
- Base de données : [PostgreSQL / Supabase]
- Vector DB : [Pinecone / pgvector / Weaviate] (si applicable)
- Déploiement : [Vercel / AWS / Railway]

## Structure du projet
src/
├── app/          ← App router Next.js / routes FastAPI
├── ai/           ← Tout le code lié à l'IA : prompts, chains, outils
│   ├── prompts/  ← System prompts et templates de prompts
│   ├── tools/    ← Définitions d'outils pour le function calling
│   └── agents/   ← Définitions d'agents et orchestration
├── db/           ← Requêtes de base de données et migrations
├── services/     ← Logique métier
└── utils/        ← Utilitaires purs

## Conventions IA
- Tous les system prompts vivent dans src/ai/prompts/ — jamais inline dans les route handlers
- Toujours épingler la version du modèle — ne jamais utiliser l'alias "latest"
- Toujours activer le prompt caching sur les system prompts (cache_control: ephemeral)
- Logger l'utilisation des tokens par requête pour le suivi des coûts
- Réponses en streaming : utiliser SSE pour les réponses > 1000 tokens
- Ne jamais passer les PII utilisateur au modèle sauf si la fonctionnalité le requiert explicitement
- Les définitions d'outils vivent dans src/ai/tools/ — un fichier par outil

## Configuration du prompt caching
- Les system prompts doivent utiliser cache_control pour activer le caching
- Cache read = $0.30/MTok vs non caché = $3/MTok — toujours mettre en cache
- Invalider le cache quand le system prompt change (automatique au changement de contenu)

## Contrôles de coût
- Modèle par défaut : [claude-haiku-4-5] pour les tâches simples, [claude-sonnet-4-6] pour les complexes
- Max tokens : définir max_tokens explicite sur chaque requête — jamais illimité
- Rate limit : [X] requêtes par utilisateur par minute
- Alerte budget : logger quand une seule session dépasse $[X]

## Décisions (ne pas re-discuter)
- [Justification de la sélection du modèle]
- [Pourquoi streaming vs. non-streaming]
- [Stratégie de fenêtre de contexte : résumer à N tokens]
- [Tool calling vs. génération directe pour la sortie structurée]

## Tests
- Tests unitaires pour la construction des prompts et le parsing des sorties
- Tests d'intégration avec des réponses API enregistrées (VCR / fixtures)
- Ne jamais faire de vrais appels API dans les tests — coûte de l'argent et est lent
- Tester les entrées adversariales : injection de prompt, tentatives de jailbreak, cas limites

## Commandes
- [commande dev]
- [commande test]
- [commande déploiement]

## Ne jamais faire
- Ne jamais inline les system prompts dans les route handlers
- Ne jamais faire des appels IA non bornés sans max_tokens
- Ne jamais logger les réponses IA complètes en production (peut contenir des PII utilisateur)
- Ne jamais coder en dur des clés API — utiliser des variables d'environnement
- Ne jamais appeler le modèle IA directement depuis les composants UI
```

---
