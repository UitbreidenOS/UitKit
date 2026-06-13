# Réduction des coûts en tokens de 30 à 50 %

Stratégies pratiques pour réduire les dépenses en tokens de Claude Code et de l'API Claude, chacune avec son mécanisme, ses étapes d'implémentation et une estimation réaliste des économies. Aucun conseil spéculatif — chaque stratégie ici a un effet mesurable.

---

## Base de référence : où vont les tokens

Avant d'optimiser, sachez ce que vous payez. Les dépenses en tokens dans une session Claude Code typique se répartissent ainsi :

| Source | Part approximative |
|---|---|
| Message système + CLAUDE.md (à chaque tour) | 10–30 % |
| Historique de conversation (croît par tour) | 20–40 % |
| Contenu de fichiers chargés en contexte | 20–40 % |
| Tokens de sortie | 10–20 % |

Les stratégies à plus fort levier ciblent d'abord les plus grandes catégories.

---

## Stratégie 1 : Mise en cache des prompts

**Mécanisme :** Marquer le contenu statique (message système, CLAUDE.md, grands documents de référence) comme cacheable. Claude les stocke pendant 5 minutes (éphémère) ou 1 heure (étendu). Les accès au cache coûtent 0,1× le prix normal des tokens d'entrée.

**Économies :** 60–90 % sur les tokens mis en cache pour les appels répétés. En pratique, 20–40 % du coût total de session.

**Implémentation (API) :**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: grandMessageSystème,
      cache_control: { type: 'ephemeral' }  // TTL de 5 minutes
    }
  ],
  messages: historiqueConversation
})
```

**Placement des points de rupture du cache :**
- Placer les points de rupture à la fin du contenu qui reste statique entre les tours
- Message système → toujours cacheable
- Contenu de CLAUDE.md injecté comme contexte → cacheable
- Contenu de fichiers qui ne changera pas dans cette session → cacheable
- Historique de conversation → NE PAS mettre en cache (change à chaque tour)

**Cache étendu (TTL de 1 heure) :** Utiliser `{ type: 'ephemeral', ttl: 3600 }` pour les documents référencés sur plusieurs sessions (grandes bases de code, longues spécifications).

**Points d'attention :**
- Bloc minimum cacheable : 1024 tokens (Haiku) ou 2048 tokens (Sonnet/Opus)
- Le cache est par modèle — changer de modèle invalide le cache
- Le contenu doit être identique byte à byte pour toucher le cache — même un espace supplémentaire le rate

---

## Stratégie 2 : Haiku pour les tâches mécaniques

**Mécanisme :** Haiku coûte environ 60 % de moins que Sonnet par token. Les tâches nécessitant une transformation mécanique (traduction, classification, extraction, mise en forme) produisent une qualité équivalente sur Haiku sans dégradation significative.

**Économies :** 50–65 % sur les types de tâches ci-dessous par rapport à leur exécution sur Sonnet.

**Utiliser Haiku pour :**
- Les traductions (localisation linguistique)
- La classification d'une tâche ou le routage vers un spécialiste
- L'extraction de données structurées depuis du texte (JSON depuis du contenu non structuré)
- La simple reformatation (markdown → HTML, JSON → CSV)
- Les agents chiens de garde (observation, pas raisonnement)
- La génération de données de test ou de fichiers de fixtures

**Utiliser Sonnet pour :**
- La génération et la révision de code
- Le raisonnement architectural
- Le débogage de bugs non triviaux
- Toute tâche nécessitant un jugement sur les compromis

**Utiliser Opus pour :**
- Les décisions à enjeux élevés difficiles à annuler
- Le raisonnement complexe en plusieurs étapes sur de grandes bases de code
- La recherche nécessitant une synthèse approfondie

---

## Stratégie 3 : API Batch

**Mécanisme :** L'API Batch d'Anthropic traite les requêtes de manière asynchrone avec une remise de 50 %. Les requêtes se complètent dans les 24 heures (souvent beaucoup plus rapidement).

**Économies :** 50 % de remise forfaitaire sur le travail éligible au batch.

**Quand l'utiliser :**
- Traduction en masse de nombreux fichiers
- Exécuter le même prompt sur de nombreuses entrées (analyser 100 PRs, résumer 50 tickets)
- Extraction de données non urgentes
- Générer des fixtures de test ou des données de départ à grande échelle

**Quand NE PAS l'utiliser :**
- Sessions interactives (vous avez besoin d'une réponse maintenant)
- Tâches où la sortie d'une requête alimente la suivante
- Requêtes uniques — la surcharge du batch ne vaut pas la peine en dessous de ~10 requêtes

---

## Stratégie 4 : Appels d'outils programmatiques (PTC)

**Mécanisme :** Quand un agent fait plusieurs appels d'outils séquentiels, chaque aller-retour inclut l'intégralité de l'historique de conversation. Le PTC regroupe plusieurs appels d'outils en un seul tour, réduisant le nombre d'aller-retours chargés d'historique.

**Économies :** Jusqu'à 37 % moins de tokens d'entrée pour les workflows multi-outils.

**Quand applicable :**
- Agents qui lisent 3+ fichiers avant de faire quoi que ce soit
- Tâches d'investigation qui interrogent plusieurs sources de données
- Tout workflow avec une structure "rassembler puis agir"

**Dans Claude Code, c'est géré automatiquement** en demandant à Claude de lire plusieurs fichiers simultanément plutôt qu'un par un :
```
Lis tous les fichiers suivants avant de répondre : [liste de fichiers]
```

---

## Stratégie 5 : Chargement différé des outils

**Mécanisme :** Au lieu de charger le schéma complet de chaque outil au début d'une session, ne charger que les schémas nécessaires pour la tâche courante. Les schémas d'outils consomment des tokens d'entrée à chaque tour.

**Économies :** 85 % de réduction des tokens de surcharge liés aux schémas d'outils pour les grands catalogues.

**S'applique quand :** Vous avez plus de 10 outils MCP enregistrés ou un grand catalogue d'outils personnalisés.

Dans la config MCP, évitez d'enregistrer chaque serveur globalement — utilisez des configs MCP au niveau du projet afin que seuls les outils pertinents soient actifs par projet.

---

## Stratégie 6 : Contrôle de la longueur de sortie

**Mécanisme :** Les tokens de sortie coûtent autant que les tokens d'entrée (ou plus sur certains modèles). Les réponses verbeuses gaspillent de l'argent et ralentissent les sessions.

**Économies :** 15–30 % sur les sessions à forte sortie.

**Instructions CLAUDE.md à ajouter :**
```
Quand tu me réponds :
- Donne-moi la réponse, pas le raisonnement, sauf si je le demande
- Pas de préambule ("Bien sûr, je vais vous aider avec ça...")
- Pas de résumé final répétant ce qui vient d'être fait
- Blocs de code : pas de prose avant ou après sauf si elle ajoute de l'information
- Listes : à utiliser pour 3+ éléments ; prose pour 1-2
- Une phrase vaut mieux qu'un paragraphe quand les deux transmettent la même information
```

---

## Stratégie 7 : Élagage du contexte

**Mécanisme :** L'historique de conversation croît à chaque tour. Après une longue session, l'historique peut dominer le nombre de tokens d'entrée.

**Tactiques :**

`/compact` avec un indice (intégré à Claude Code) :
```
/compact Concentre-toi sur les changements d'authentification que nous avons faits — supprime tout sur la discussion UI
```

Isolation par sous-agent — lancer un sous-agent pour une sous-tâche afin qu'il commence avec une fenêtre de contexte fraîche.

Suppressions de contexte explicites :
```
Oublie l'analyse de fichier que nous avons faite sur orders.ts — elle n'est plus pertinente.
Concentrons-nous uniquement sur le module payments.
```

---

## Stratégie 8 : Impact de la taille de CLAUDE.md

**Mécanisme :** CLAUDE.md est chargé au début de chaque session Claude Code. Chaque ligne que vous ajoutez coûte des tokens à chaque démarrage de session.

**Cible :** Gardez CLAUDE.md sous 2000 tokens (environ 150–180 lignes de prose dense ou 250 lignes de contenu mixte).

Utilisez le prompt d'audit de contexte (`prompts/task-specific/context-auditor.md`) pour élaguer votre CLAUDE.md sans perdre les conseils genuinement utiles.

---

## Tableau de référence des coûts

Coûts approximatifs à la tarification de mai 2026. Vérifiez la page de tarification d'Anthropic pour les tarifs actuels.

| Modèle | Entrée ($/MTok) | Sortie ($/MTok) | Accès cache ($/MTok) |
|---|---|---|---|
| Haiku 4.5 | ~0,80 $ | ~4,00 $ | ~0,08 $ |
| Sonnet 4.6 | ~3,00 $ | ~15,00 $ | ~0,30 $ |
| Opus 4.7 | ~15,00 $ | ~75,00 $ | ~1,50 $ |

**Impact combiné des stratégies :**

| Stratégie | Économies | Complexité |
|---|---|---|
| Mise en cache des prompts | 20–40 % | Faible |
| Haiku pour les tâches mécaniques | 50–65 % sur les tâches éligibles | Faible |
| API Batch | 50 % forfaitaire | Moyenne |
| PTC / appels d'outils en parallèle | Jusqu'à 37 % sur les sessions riches en outils | Faible |
| Chargement différé des outils | Jusqu'à 85 % sur la surcharge des schémas | Moyenne |
| Contrôle de la longueur de sortie | 15–30 % | Faible |
| Élagage du contexte | 10–25 % sur les longues sessions | Faible |
| Réduction de CLAUDE.md | 5–15 % | Ponctuelle |

Appliquer toutes les stratégies à faible complexité ensemble permet généralement d'atteindre une réduction totale des coûts de 30 à 50 % sans changer la qualité des résultats.

---
