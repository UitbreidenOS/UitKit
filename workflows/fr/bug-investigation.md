# Flux de travail d'investigation de bugs

Débogage à plusieurs hypothèses parallèles — quand la cause racine d'un bug est peu claire, exécutez plusieurs agents simultanément enquêtant sur différentes théories. Considérablement plus rapide que le débogage séquentiel.

## Quand utiliser

Utilisez ce flux de travail quand:
- Un bug a plusieurs causes probables et vous ne savez pas laquelle
- Un problème de production nécessite une identification rapide de la cause racine
- Vous déboguez le même bug depuis plus de 30 minutes
- Le bug est intermittent et difficile à reproduire de façon déterministe

## Phase 1: Génération d'hypothèses (5 minutes)

Avant d'exécuter des agents, définissez 3-5 hypothèses mutuellement exclusives:

```
Bug: [décrivez le symptôme — erreur exacte ou comportement]
Contexte: [ce qui a changé récemment, quel environnement, quelles conditions le déclenchent]

Générez 3-5 hypothèses distinctes de cause racine classées par probabilité.
Chaque hypothèse doit être:
- Spécifique (nomme une cause concrète, pas "quelque chose ne va pas avec l'auth")
- Testable (peut être confirmée ou exclue en lisant du code spécifique)
- Mutuellement exclusive (pas "peut-être le cache ou peut-être la base de données")

Format:
H1 (très probable): [hypothèse] — preuve: [pourquoi vous le pensez]
H2: [hypothèse] — preuve: [...]
H3: [hypothèse] — preuve: [...]
```

**Exemple d'hypothèses pour "le paiement échoue par intermittence":**
```
H1: Condition de course — deux requêtes simultanées créant des commandes dupliquées
    Preuve: l'erreur ne se produit qu'à concurrence élevée, les logs montrent des IDs de commande dupliqués
H2: Limite de débit Stripe — atteindre la limite de 100 req/s au trafic de pointe
    Preuve: les erreurs augmentent exactement aux pics de trafic, 429 dans certains logs d'erreur
H3: Épuisement de la connexion DB — le pool expire pendant une charge élevée
    Preuve: le message d'erreur "connection timeout" apparaît dans certains cas
H4: Collision de relance de webhook — Stripe renvoyant un webhook précédemment échoué
    Preuve: certains frais dupliqués remontent au même ID d'événement webhook
```

## Phase 2: Enquête parallèle

Générez un agent par hypothèse. Chaque agent obtient exactement une théorie à enquêter et rien d'autre:

```
[Exécutez ces agents en parallèle, pas séquentiellement]

Agent 1 (H1 — Condition de course):
"Enquêtez si une condition de course provoque des commandes dupliquées.
Regardez: src/api/orders/create.ts, niveau d'isolement des transactions DB,
tout mécanisme de mutex ou de verrouillage en place.
Objectif: confirmer ou exclure cette hypothèse avec preuve de code spécifique."

Agent 2 (H2 — Limite de débit Stripe):
"Enquêtez si nous avons atteint les limites de débit de l'API Stripe.
Regardez: src/services/stripe.ts, logs de requêtes, tableau de bord Stripe si accessible,
toute logique de relance ou queue pour les appels Stripe.
Objectif: confirmer ou exclure avec preuve."

Agent 3 (H3 — Pool de connexions DB):
"Enquêtez si l'épuisement du pool de connexions DB provoque des échecs de paiement.
Regardez: config de connexion DB, taille du pool vs requêtes concurrentes,
tous les logs d'erreur de connexion.
Objectif: confirmer ou exclure avec preuve."

Agent 4 (H4 — Relance de webhook):
"Enquêtez si les relances de webhook Stripe provoquent un traitement dupliqué.
Regardez: src/webhooks/stripe.ts, implémentation de la clé d'idempotence,
déduplication d'ID d'événement webhook.
Objectif: confirmer ou exclure avec preuve."
```

## Phase 3: Synthèse (après que tous les agents rapportent)

```
Étant donné ces résultats d'enquête: [collez toutes les sorties des agents]

1. Quelle hypothèse a été confirmée et pourquoi?
2. Quelles preuves excluent les autres hypothèses?
3. Quel est le correctif spécifique?
4. Quels tests empêcheraient cette régression?
```

## Phase 4: Correctif et vérification

Implémentez le correctif uniquement pour l'hypothèse confirmée.

Exécutez le cas de test spécifique qui aurait attrapé ce bug:
```bash
# Ajouter d'abord un test de régression
# Puis implémenter le correctif
# Puis confirmer que le test passe
```

## Alternative: Triage rapide (< 15 min de bugs)

Pour les bugs plus simples avec un coupable évident, ignorez les agents parallèles et utilisez cette liste de vérification rapide:

```
1. Qu'est-ce qui a changé lors du dernier déploiement? (git log --since="2 hours ago")
2. L'erreur est-elle reproductible en isolation? (reproduction minimale)
3. Que dit la trace de pile? (lire la ligne réelle, ne pas deviner)
4. Y a-t-il un test qui aurait dû attraper cela? (si non, l'écrire avant de corriger)
5. Correctif → vérifier test → déployer
```

## Contenu connexe

- `/agents/roles/incident-commander` — pour les incidents de production nécessitant des communications
- `/skills/productivity/debug` — compétence de débogage pour une enquête à un seul agent
- `/skills/productivity/self-eval` — évaluer la qualité de votre processus de débogage

---
