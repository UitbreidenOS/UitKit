# RIPER — Cadre de codage agentic structuré

RIPER est un cadre en 5 phases pour le développement de fonctionnalités complexes : Recherche, Innover, Planifier, Exécuter, Examiner. Chaque phase a un mode strict, des entrées et des sorties définis, et une limite explicite qui ne peut pas être franchie jusqu'à ce que la phase soit terminée.

---

## Pourquoi RIPER

L'expansion de portée est le mode d'échec principal du codage agentic. Sans limites de phase explicites, Claude saute de la lecture d'un fichier à la proposition d'une refactorisation complète au début de l'implémentation — tout dans un message. Le résultat ressemble à un progrès mais produit du code qui ne correspond pas aux exigences, contient des décisions architecturales non examinées, et est difficile à corriger car le raisonnement s'est produit implicitement.

RIPER force les déclarations de phase explicites. Chaque phase a exactement un travail. Violer une limite de phase est une erreur de protocole — pas une préférence de style.

---

## Déclaration de mode

Chaque phase commence par une déclaration de mode explicite :

```
I am now in RESEARCH mode.
```

Cette déclaration n'est pas cérémonielle. C'est un engagement : dans ce mode, je fais exactement ce que cette phase nécessite et rien d'autre. Les déclarations de mode rendent les transitions de phase visibles dans la conversation et forcent la question « suis-je vraiment fait avec la phase précédente ? »

---

## Phase 1 : Recherche

**Un travail :** rassembler le contexte. Pas de solutions, pas de propositions, pas d'opinions.

### Quoi rassembler

- Structure de la base de code : fichiers pertinents, modèles existants, points d'entrée
- Contraintes : interfaces existantes qui doivent être conservées, exigences de performance, limites de sécurité
- Dépendances : sur quoi dépend cette fonctionnalité ; ce qui dépend d'elle
- Art antérieur : fonctionnalités similaires déjà construites ; modèles utilisés ailleurs dans la base de code

### Sortie

Un **document de résumé de contexte** contenant :
- Liste des fichiers pertinents avec descriptions d'une ligne
- Modèles clés en usage (conventions de nommage, gestion des erreurs, flux de données)
- Contraintes identifiées
- Questions ouvertes (choses qui ne peuvent pas être répondues à partir de la base de code seule)

### Anti-modèle

Proposer des solutions lors de la Recherche. Au moment où une pensée commence par « nous pourrions... » ou « la meilleure approche serait... », le mode Recherche a été rompu. Enregistrez la pensée comme une question ouverte et continuez à rassembler.

**Faux :**
```
I see the payment module uses Stripe. We could add a webhook handler at /api/webhooks/stripe
that validates the signature and routes events to the appropriate handler.
```

**Juste :**
```
Payment module location: src/payments/
Stripe SDK present: yes (package.json line 23)
Existing webhook infrastructure: none found
Open question: where does the codebase register API routes?
```

---

## Phase 2 : Innover

**Un travail :** générer les options. Pas de mise en œuvre, pas d'engagement profond envers une approche.

### Format

Une liste numérotée d'approches, chacune avec :
- Description d'une phrase
- Compromis clés (2–3 points)
- Estimation approximative de la complexité

```markdown
## Options

**1. Webhook handler as a dedicated route**
Single endpoint that receives Stripe events, validates signature, and dispatches to handlers.
- Pro: simple to implement, follows existing route patterns
- Con: all event types share one endpoint — grows complex over time
- Complexity: low

**2. Event bus with typed handlers**
Webhook endpoint publishes to an internal bus; each event type has a registered handler.
- Pro: separation of concerns, easy to add new event types
- Con: over-engineered for <5 event types
- Complexity: medium

**3. Queue-based processing**
Webhook endpoint enqueues raw event; worker processes asynchronously.
- Pro: decoupled, survives downstream failures
- Con: adds operational complexity (queue infrastructure required)
- Complexity: high
```

### Sortie

Un **document d'options** avec toutes les approches viables listées.

### Anti-modèle

Aller trop en profondeur sur une option pendant Innover. Si une approche obtient un croquis de mise en œuvre complet, le mode Innover s'est brisé dans le mode Plan prématurément. Énumérez l'option au niveau du compromis et continuez.

---

## Phase 3 : Planifier

**Un travail :** sélectionner une option et produire une liste de contrôle numérotée d'actions.

### Sortie

Un **plan numéroté** où chaque élément est une action, pas une description. Chaque étape doit être exécutée de manière isolée.

```markdown
## Plan : Webhook handler as a dedicated route

**Selected from:** Innovate options, option 1
**Rationale:** Matches existing route patterns; event volume does not justify a bus.

1. Add `StripeWebhookPayload` type to `src/types/payments.ts`
2. Create `src/payments/webhook-handler.ts` — validates Stripe signature, parses event type
3. Add route `POST /api/webhooks/stripe` in `src/api/routes/payments.ts`
4. Register route in `src/api/router.ts`
5. Add `STRIPE_WEBHOOK_SECRET` to env schema in `src/config/env.ts`
6. Write unit tests for signature validation in `tests/payments/webhook-handler.test.ts`
7. Write integration test for route registration in `tests/api/routes/payments.test.ts`
```

Chaque étape est assez spécifique pour qu'un autre ingénieur puisse l'exécuter sans poser de questions.

### Porte

Le plan doit être examiné avant l'Exécution. C'est le dernier point pour attraper les problèmes de portée, les étapes manquantes, ou les problèmes d'architecture sans payer le coût de l'implémentation. Claude l'examine ; un humain l'examine pour les changements à enjeux élevés.

### Anti-modèle

Écrire les étapes du plan comme des descriptions plutôt que des actions.

**Faux (description) :** « Le gestionnaire webhook doit valider la signature Stripe »  
**Juste (action) :** « Créer `src/payments/webhook-handler.ts` avec une fonction `validateSignature(payload, secret)` utilisant la méthode `constructEvent` de Stripe »

---

## Phase 4 : Exécuter

**Un travail :** implémenter le plan exactement tel qu'écrit. Cocher chaque étape.

### Le protocole de bloquant

La règle la plus importante d'Exécution : si vous rencontrez quelque chose d'inattendu que le plan ne tient pas compte, **arrêtez immédiatement**.

Ne pas improviser. Ne pas faire de décisions architecturales à la volée. Ne pas « juste ajouter une chose de plus ».

Le protocole de bloquant :
1. Arrêtez l'exécution
2. Notez le bloquant : ce qui a été trouvé, pourquoi cela bloque l'étape actuelle
3. Retournez au mode Plan
4. Mettez à jour le plan pour tenir compte du bloquant
5. Reprenez Exécuter à partir de la dernière étape complétée

```
[BLOCKER — returning to PLAN mode]
Found: `src/api/router.ts` uses a different route registration pattern than documented.
Routes are registered via a decorator, not a direct call.
Plan step 4 needs to be revised to match the decorator pattern.
```

### Suivi des étapes

Marquer chaque étape au fur et à mesure de sa réalisation :

```markdown
1. [x] Add `StripeWebhookPayload` type to `src/types/payments.ts`
2. [x] Create `src/payments/webhook-handler.ts`
3. [x] Add route `POST /api/webhooks/stripe`
4. [ ] Register route in `src/api/router.ts`   ← current step
```

### Anti-modèle

Improviser pendant Exécution. Tout changement non dans le plan — même une « petite amélioration » — est un changement de portée. Enregistrez-le comme une tâche future et continuez à exécuter le plan tel qu'écrit. Dévier du plan casse la garantie qu'Exécuter produit exactement ce que Plan a conçu.

---

## Phase 5 : Examiner

**Un travail :** comparer l'implémentation contre le plan et les exigences d'origine. Produire un rapport de déviation.

### Ce à vérifier

- Chaque étape du plan : implémentée comme spécifiée ? (vérifier chaque `[x]`)
- Chaque critère d'acceptation de Recherche : l'implémentation le satisfait-elle ?
- Exigences non fonctionnelles : performance, sécurité, gestion des erreurs — sont-elles présentes ?
- Tests : les tests testent-ils vraiment le comportement décrit dans les exigences ?

### Sortie

Un **rapport de déviation + réussite/échec d'exigences** :

```markdown
## Review Report

### Plan completion
- Steps 1–6: complete as specified
- Step 7 (integration test): MISSING — not implemented

### Requirements pass/fail
- [x] Webhook receives and parses Stripe events
- [x] Invalid signatures return 400
- [ ] FAIL: Webhook does not handle `payment_intent.payment_failed` event — not in plan but present in requirements

### Deviations from plan
- Step 3: route registered at `/api/webhooks/stripe-v2` not `/api/webhooks/stripe` — naming inconsistency

### Recommended actions
1. Add integration test (step 7)
2. Add handler for `payment_intent.payment_failed` — return to Plan
3. Align route path with plan or update plan to reflect actual path
```

### Quoi faire si des déviations sont trouvées

Déviations mineures (typos, nommage) : corriger sur place, noter dans le rapport de déviation.  
Étapes manquantes : retourner à Exécuter pour l'élément spécifique manquant.  
Défaillances d'exigences : retourner au Plan — ceci est un problème de portée qui nécessite une mise à jour du plan avant la réexécution.  
Déviations d'architecture : escalader. C'est un signal que Exécuter a improvisé — déterminer ce qui a changé et si c'est acceptable.

---

## Tableau des anti-modèles

| Phase | Anti-modèle | Conséquence |
|-------|-------------|-------------|
| Recherche | Proposer des solutions | Saute l'évaluation des options; s'ancre sur la première idée |
| Recherche | Rassemblement de contexte incomplet | Le plan est construit sur de mauvaises hypothèses |
| Innover | S'engager trop tôt sur une option | Manque les meilleures approches |
| Innover | Ignorer l'analyse des compromis | Les options semblent équivalentes; le choix est arbitraire |
| Planifier | Étapes descriptives au lieu d'actions | Exécuter devient ambigu; taux de bloquant augmente |
| Planifier | Ignorer la révision porte | Les problèmes d'architecture découverts pendant Exécuter |
| Exécuter | Improviser | Le plan ne correspond plus à l'implémentation; Examiner n'a rien à comparer |
| Exécuter | Continuer au-delà d'un bloquant | Le plan devient invalide; les étapes suivantes peuvent être fausses |
| Examiner | Ignorer | Les déviations ne sont pas détectées; les défaillances d'exigences naviguent |
| Examiner | Soft-pédaler les constatations | Les déviations « mineures » s'accumulent entre les fonctionnalités |

---

## Quand utiliser RIPER vs juste coder

**Utiliser RIPER pour :**
- Les fonctionnalités prenant plus de 3 jours
- Les changements à enjeux élevés (authentification, paiements, migrations de données, API publiques)
- Les bases de code non familières où les hypothèses architecturales ne sont pas vérifiées
- Le travail où l'implémentation incorrecte est chère à corriger après déploiement

**Ignorer RIPER pour :**
- Les correctifs d'urgence et la réponse aux incidents (aller droit au Fix + Examiner)
- Les tâches sous 2 heures avec un chemin d'implémentation clair
- Les changements additifs sans décisions architecturales (ajouter un drapeau de config, mettre à jour une dépendance)
- Le travail où les cinq phases prendraient plus de temps que juste le coder

RIPER a un surcoût. Le surcoût se rembourse sur le travail complexe ; il ne se rembourse pas sur le travail petit. La règle de base : si vous pouvez tenir l'implémentation complète dans votre tête sans l'écrire, RIPER est excessif.

---
