# Guide d'optimisation des coûts

Stratégies pratiques pour réduire les coûts de l'API Claude et de Claude Code sans sacrifier la qualité.

## Comprendre ce qui entraîne les coûts

La tarification de Claude est basée sur les **jetons** (entrée + sortie). Coût = jetons × prix par jeton.

**Ce qui augmente les coûts :**
- Les longs messages système répétés à chaque appel
- Les grands contenus de fichiers passés en contexte
- Les longs historiques de conversation
- Les réponses verbouses et multi-paragraphes
- Les appels d'outils répétés qui relisent les mêmes fichiers
- L'utilisation d'Opus quand Sonnet suffisait

**Tarification du modèle Claude (approximatif, mai 2026) :**
| Modèle | Entrée | Sortie | Meilleur pour |
|---|---|---|---|
| Haiku 4.5 | le moins cher | le moins cher | Tâches simples, volume élevé |
| Sonnet 4.6 | moyen | moyen | La plupart du travail — choix par défaut |
| Opus 4.7 | le plus cher | le plus cher | Raisonnement complexe, tâches critiques |

**Règle empirique :** Utilisez le modèle le moins cher qui produit une qualité acceptable pour votre tâche.

## Mise en cache des prompts

L'API Claude supporte la mise en cache des prompts — mettez en cache votre message système et le contexte statique afin de ne pas payer le prix complet à chaque appel.

```typescript
// Sans mise en cache : prix d'entrée complet à chaque appel
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: longSystemPrompt,  // facturé à chaque fois
  messages: [{ role: 'user', content: query }],
})

// Avec mise en cache : message système mis en cache après le premier appel (remise de 90 % sur les jetons mis en cache)
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' }  // mettre ceci en cache pendant jusqu'à 5 minutes
    }
  ],
  messages: [{ role: 'user', content: query }],
})
```

**Quand utiliser la mise en cache :**
- Le même message système est utilisé pour plusieurs demandes (chatbot, conversations multi-tours)
- Grand document que plusieurs requêtes référencent
- Définitions d'outils qui ne changent pas entre les appels

**Économies :** Remise de 90 % sur les jetons d'entrée mis en cache. TTL de 5 minutes (cache éphémère).

## Taille appropriée du modèle

La plupart du travail n'a pas besoin d'Opus. Un guide pratique :

| Tâche | Modèle recommandé |
|---|---|
| Traductions | Haiku |
| Résumé | Haiku ou Sonnet |
| Classification | Haiku |
| Génération de code (simple) | Sonnet |
| Révision de code | Sonnet |
| Décisions architecturales | Sonnet ou Opus |
| Raisonnement complexe | Opus |
| Débogage de problèmes délicats | Opus |
| Analyse de sécurité | Opus |

**Motif de routage (à utiliser dans les applications IA de production) :**
```typescript
function selectModel(task: string, complexity: 'low' | 'medium' | 'high') {
  if (complexity === 'low') return 'claude-haiku-4-5-20251001'
  if (complexity === 'medium') return 'claude-sonnet-4-6'
  return 'claude-opus-4-7'
}
```

## Réduire le contexte par appel

**Récupération fragmentée au lieu de document complet :**
```typescript
// CHER : passer le document complet à chaque appel
const response = await claude.generate({ context: fullDocument, query })

// MOINS CHER : récupérer uniquement les fragments pertinents (motif RAG)
const relevantChunks = await vectorSearch(query, { topK: 5 })
const response = await claude.generate({ context: relevantChunks.join('\n'), query })
```

**Demander des réponses plus courtes :**
```typescript
// Ajouter au message système :
"Soyez concis. Répondez en 2-3 phrases à moins qu'une plus grande détail ne soit explicitement demandée."

// Ou définir max_tokens :
max_tokens: 256  // limiter la longueur de la réponse pour les requêtes simples
```

**Éviter de relire les fichiers inchangés :**
Dans les sessions Claude Code, ne demandez pas à Claude de relire un fichier qu'il a déjà en contexte. Le contenu du fichier est déjà là — le relire double le coût de ce contexte.

## Traitement par lot

Pour les tâches en masse (traduction de 100 documents, génération de 500 descriptions), utilisez l'API Batch :
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

// Créer un lot au lieu de 500 appels individuels
const batch = await client.beta.messages.batches.create({
  requests: documents.map((doc, i) => ({
    custom_id: `doc-${i}`,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: `Translate: ${doc.text}` }],
    },
  })),
})

// Interroger les résultats
const results = await client.beta.messages.batches.retrieve(batch.id)
```

**Économies :** Remise de 50 % sur la tarification de l'API batch par rapport à l'API en temps réel.

## Coût de la session Claude Code

Claude Code facture par session. Réduire le coût de la session :

1. **Utiliser `/lean-claude`** — active le mode efficace en jetons, réponses plus courtes
2. **Utiliser `/compact`** — compresse l'historique de conversation quand il devient long
3. **Pré-charger le contexte via CLAUDE.md** — une lecture ponctuelle vs exploration répétée
4. **Sessions focalisées** — une tâche par session, moins de contexte non pertinent
5. **Sélection du modèle** — Claude Code utilise Sonnet par défaut ; passer à Haiku pour les tâches simples avec `/model haiku`

## Surveillance des coûts

```typescript
// Suivre les dépenses en production
const response = await claude.messages.create({ ... })

const cost = calculateCost(
  response.usage.input_tokens,
  response.usage.output_tokens,
  model
)

// Alerter si un appel unique dépasse le budget
if (cost > COST_ALERT_THRESHOLD) {
  logger.warn('high_cost_llm_call', { cost, tokens: response.usage })
}

// Suivi du budget quotidien
await redis.incrbyfloat(`daily_llm_cost:${today}`, cost)
const dailyTotal = await redis.get(`daily_llm_cost:${today}`)
if (Number(dailyTotal) > DAILY_BUDGET) {
  alertOncall('Daily LLM budget exceeded')
}
```

## Repères de coût typiques

| Cas d'utilisation | Coût typique/demande | Potentiel d'optimisation |
|---|---|---|
| Réponse de chatbot simple | $0.001-0.01 | Élevé (cache système prompt, utiliser Haiku) |
| Génération de code | $0.01-0.05 | Moyen (modèle de taille appropriée) |
| Analyse de document | $0.05-0.50 | Élevé (récupération fragmentée, cache document) |
| Raisonnement complexe | $0.10-1.00 | Bas (Opus peut être requis) |
| Traduction par lot | $0.0005/doc | Très élevé (API batch + Haiku) |

---
