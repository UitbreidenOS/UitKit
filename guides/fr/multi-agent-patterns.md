# Guide des motifs multi-agents

Modèles de conception pour construire des systèmes fiables multi-agents avec Claude Code.

## Quand utiliser les motifs multi-agents

Utilisez plusieurs agents quand :
- Une tâche a des sous-tâches véritablement indépendantes qui peuvent s'exécuter en parallèle
- Différentes sous-tâches nécessitent une expertise ou un contexte différents
- La tâche est trop grande pour tenir dans une seule fenêtre contextuelle
- Vous avez besoin de vérifications redondantes (plusieurs agents examinant la même sortie)
- Différentes parties de la tâche nécessitent différents niveaux d'accès aux outils

N'utilisez pas plusieurs agents quand :
- Un seul agent peut gérer la tâche — la surcharge d'orchestration n'est pas gratuite
- Les sous-tâches ont des dépendances complexes (mieux d'utiliser le promptage séquentiel)
- La tâche nécessite un état partagé continu (les agents ne peuvent pas partager la mémoire facilement)

## Motif 1 : Travailleurs parallèles

**Quand :** Plusieurs tâches indépendantes du même type.

```typescript
// Claude Code — générer des agents en parallèle pour des tâches indépendantes
// Exemple : traduire un fichier de compétence en 4 langues simultanément

const translationTasks = ['fr', 'de', 'nl', 'es'].map(lang =>
  Agent({
    description: `Traduire en ${lang}`,
    model: 'haiku',  // utiliser le modèle plus petit pour la traduction
    prompt: `Traduire ce fichier de compétence en ${lang} : [contenu]`
  })
)

// Les 4 s'exécutent en parallèle — 4 fois plus rapide que séquentiel
const [fr, de, nl, es] = await Promise.all(translationTasks)
```

**Règles :**
- Chaque agent doit être complètement autonome (tout le contexte dans l'invite)
- Aucun agent ne doit dépendre de la sortie d'un autre
- Utilisez les modèles moins chers pour les tâches plus simples

## Motif 2 : Pipeline (transfert séquentiel)

**Quand :** La sortie de chaque étape est l'entrée de l'étape suivante.

```
Agent de recherche → Agent d'analyse → Agent d'écriture → Agent d'examen
```

```typescript
// Étape 1 : recherche
const research = await Agent({
  prompt: 'Rechercher le paysage concurrentiel pour [sujet]. Résultats structurés de sortie.'
})

// Étape 2 : analyse (utilise la sortie de l'étape 1)
const analysis = await Agent({
  prompt: `Analyser ces résultats de recherche et identifier les points clés stratégiques :
  ${research.output}`
})

// Étape 3 : écrire (utilise la sortie de l'étape 2)
const draft = await Agent({
  prompt: `Écrire un document stratégique basé sur cette analyse :
  ${analysis.output}`
})

// Étape 4 : examen (vérification indépendante)
const reviewed = await Agent({
  prompt: `Examiner ce document pour l'exactitude, la clarté et les lacunes stratégiques :
  ${draft.output}`
})
```

**Règles :**
- Chaque étape valide la sortie de l'étape précédente avant de continuer
- Inclure des critères réussite/échec explicites à chaque transfert
- Définir que faire si une étape échoue (réessayer, ignorer, alerter)

## Motif 3 : Spécialiste + Généraliste

**Quand :** Une tâche générale mais certaines parties nécessitent une expertise approfondie.

```
Agent généraliste (coordonne)
├── Agent spécialiste en sécurité (code d'auth)
├── Agent spécialiste en performance (requêtes de base de données)
└── Agent spécialiste UX (texte destiné aux utilisateurs)
```

```typescript
const [securityReview, perfReview, uxReview] = await Promise.all([
  Agent({
    description: 'Examen de sécurité',
    prompt: `Examiner ce code pour les vulnérabilités de sécurité. Se concentrer sur : auth, injection, exposition de données.
    Code : ${authCode}`
  }),
  Agent({
    description: 'Examen de performance', 
    prompt: `Examiner ces requêtes de base de données pour les problèmes de performance. Se concentrer sur : N+1, index manquants.
    Code : ${dbCode}`
  }),
  Agent({
    description: 'Examen UX',
    prompt: `Examiner ce texte pour la clarté et la conversion. Se concentrer sur : texte CTA, messages d'erreur.
    Texte : ${uiCopy}`
  })
])

// Synthétiser les résultats
const synthesis = await Agent({
  prompt: `Combiner ces examens spécialisés en une liste d'actions prioritaires :
  Sécurité : ${securityReview}
  Performance : ${perfReview}
  UX : ${uxReview}`
})
```

## Motif 4 : Vérification redondante

**Quand :** La correction est critique et les erreurs sont coûteuses.

```typescript
// Même tâche, deux agents indépendants, comparer les sorties
const [agent1Result, agent2Result] = await Promise.all([
  Agent({ prompt: reviewPrompt }),
  Agent({ prompt: reviewPrompt })
])

// Comparer l'accord
if (agent1Result.verdict !== agent2Result.verdict) {
  // Désaccord — escalade à l'humain ou utiliser un troisième agent comme arbitre
  const tiebreaker = await Agent({
    prompt: `Deux examinateurs ne sont pas d'accord. Réconcilier :
    Examinateur 1 : ${agent1Result}
    Examinateur 2 : ${agent2Result}
    Fournir la conclusion correcte.`
  })
}
```

**Quand utiliser :** Examens de sécurité, évaluations de risques juridiques, calculs financiers, informations médicales.

## Motif 5 : Map-Reduce

**Quand :** Traiter un grand ensemble de données en parallèle, puis regrouper.

```typescript
// Map : traiter chaque segment indépendamment
const chunks = splitIntoChunks(largeDocument, chunkSize)
const chunkResults = await Promise.all(
  chunks.map(chunk => Agent({
    model: 'haiku',
    prompt: `Extraire les entités et les réclamations clés de cette section : ${chunk}`
  }))
)

// Réduire : regrouper tous les résultats des segments
const finalSummary = await Agent({
  model: 'sonnet',
  prompt: `Synthétiser ces analyses de section en un résumé unifié :
  ${chunkResults.join('\n\n')}`
})
```

## Meilleures pratiques de communication des agents

**Concevoir pour l'absence d'état :**
- Chaque agent reçoit tout le contexte dont il a besoin dans l'invite
- Les agents ne partagent pas la mémoire ou l'état entre les invocations
- La sortie est le seul canal de communication entre les agents

**Contrats de sortie explicites :**
```typescript
// Dire aux agents exactement quel format mettre en sortie
prompt: `
Analyser ce code pour les bogues.

Sortir SEULEMENT JSON valide dans ce format exact :
{
  "bugs": [{"severity": "high|medium|low", "description": "string", "line": number}],
  "summary": "string"
}
`

// Puis valider la sortie
const result = outputSchema.parse(JSON.parse(agentOutput))
```

**Gestion des erreurs :**
```typescript
try {
  const result = await Agent({ prompt })
  return parseOutput(result)
} catch (error) {
  // L'agent a échoué — décider : réessayer, utiliser fallback, ou escalader
  if (isRetryable(error)) {
    return await retryWithBackoff(() => Agent({ prompt }), 3)
  }
  throw new AgentError(`Agent a échoué pour la tâche : ${taskDescription}`, { cause: error })
}
```

## Gestion des coûts

- Utiliser Haiku pour extraction, traduction, classification (volume élevé, tâches simples)
- Utiliser Sonnet pour raisonnement, écriture, analyse (par défaut pour la plupart des tâches)
- Utiliser Opus pour les décisions critiques, examen de code complexe (uniquement enjeux élevés)
- Exécuter les agents chers une seule fois — mettre en cache ou stocker leurs sorties

---
