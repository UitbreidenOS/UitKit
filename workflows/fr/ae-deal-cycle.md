# Flux de travail du cycle de vente AE

Un flux de travail étape par étape pour gérer un cycle de vente B2B depuis la première réunion jusqu'au contrat signé — avec des invites Claude Code à chaque étape.

---

## Quand exécuter ce flux de travail

- Vous avez planifié une première réunion avec un compte qualifié
- Vous reprenez un deal en cours et devez vous mettre à jour rapidement
- Vous souhaitez standardiser votre processus de gestion des deals sur un territoire
- Vous vous préparez pour une poussée de fin de trimestre sur les opportunités en phase avancée

---

## Étapes du deal et critères de sortie

Chaque étape a une définition claire et des critères de sortie. Ne faites pas avancer un deal tant que les critères ne sont pas remplis.

| Étape | Définition | Critères de sortie (passage à l'étape suivante) |
|---|---|---|
| Découverte | Comprendre la situation, la douleur et l'adéquation de l'acheteur | Douleur confirmée, parties prenantes identifiées, existence du budget qualifiée |
| Démo/Évaluation | Démontrer la solution par rapport aux besoins exprimés | L'acheteur a vu le produit, l'adéquation technique confirmée, plan d'évaluation convenu |
| Proposition | Offre commerciale entre les mains de l'acheteur | Proposition examinée par le décideur économique, questions répondues |
| Négociation | Termes en cours de discussion | Termes commerciaux et juridiques alignés, processus d'achat en cours |
| Verbal | Engagement verbal ou écrit de procéder | Le décideur économique confirme l'intention, le processus contractuel est en marche |
| Fermé Gagné | Contrat signé | DocuSign terminé, transfert CS initié |

---

## Étape 1 — Découverte

### Préparation avant l'appel (15 minutes avant chaque appel de découverte)

```
/deal-desk (for initial fit check)

Pre-discovery brief for [company name].

Product I sell: [one line]
ICP: [company size / industry / role]

What I know about this company: [paste anything from LinkedIn, website, or your research]

Tell me:
1. ICP fit signal: do they look like a good fit based on what I can see?
2. The most likely pain point I should probe based on their profile
3. The 3 discovery questions I should prioritise for a 30-minute first call
4. The one question I must get answered to decide if this is worth advancing
```

### Exécution de l'appel de découverte

Menez un appel de découverte structuré en utilisant ce cadre :

**Séquence de vente SPIN :**
1. **Questions de situation** (comprendre l'état actuel) : « Expliquez-moi comment votre équipe gère actuellement [processus]. »
2. **Questions sur le problème** (faire émerger la douleur) : « Où ce processus se grippe-t-il ? Quel en est le coût lorsque cela se produit ? »
3. **Questions d'implication** (amplifier la douleur) : « Que se passe-t-il en aval quand [problème] survient ? Qui d'autre cela affecte-t-il ? »
4. **Questions sur le bénéfice recherché** (les amener à formuler la valeur) : « Si vous pouviez [résoudre le problème], qu'est-ce que cela signifierait pour [leur objectif] ? »

### Mise à jour MEDDPICC post-appel (immédiatement après l'appel)

```
/deal-review

Update MEDDPICC from this discovery call.

Company: [name]
Deal size estimate: $[X] (if discussed) / unknown
Stage: Discovery → Demo

What I learned on the call:
[paste your rough notes — bullet points are fine]

For each MEDDPICC dimension: what did I confirm, what's still missing?
Flag the dimension with the most risk.
Tell me: should I advance this to Demo stage, or do I need another discovery call?
```

**Porte d'étape :** Ne passez PAS à la Démo tant que vous n'avez pas :
- [ ] Confirmé la douleur (exprimée par l'acheteur, non supposée)
- [ ] Identifié qui est le décideur économique (même si vous ne l'avez pas encore rencontré)
- [ ] Confirmé qu'il existe au moins un budget potentiel ou l'intention d'en trouver un
- [ ] Convenu d'une prochaine étape à laquelle l'acheteur s'engage

---

## Étape 2 — Démo / Évaluation

### Préparation de la démo

```
Build a demo plan for [company name].

What we learned in discovery:
- Primary pain: [what they said]
- Desired outcome: [what they want to achieve]
- Technical environment: [what systems they use]
- Stakeholders attending the demo: [names and titles]

Demo structure:
1. Open with their pain (2 min) — reference their exact words from discovery
2. Show the before state (1 min) — what the problem looks like today
3. Demo the solution (15-20 min) — focused on their specific use case, not a feature tour
4. Show the outcome (2 min) — what success looks like for them, in their numbers
5. Next steps (5 min) — propose evaluation plan

For [specific use case they described]:
- Which features to show (and which to skip — most features are irrelevant for this call)
- The one "aha moment" to build toward
- Technical questions they will likely ask
- How to handle "can you also show X" questions that aren't in scope
```

### Plan d'évaluation (à convenir à la fin de la démo)

```
/mutual-success-plan

Create a lightweight evaluation plan for [company] — early stage version.

Current stage: Demo → Evaluation
Champion: [name, title]
Economic buyer: [known / not yet met]
Deal size estimate: $[X]
Target close date: [if discussed]

Evaluation plan contents:
- What they need to validate (technical / security / business case)
- Trial or POC parameters (if applicable)
- Who from their side will be involved
- Timeline from evaluation to decision
- The single most important question this evaluation must answer

Output: a 1-page evaluation plan I can send after the demo — not a full MSP yet.
```

### Support pour l'évaluation technique

```
/rfp-responder

Answer this technical evaluation question from [company].

Question: [paste their question]
Context: [what you know about their technical environment]
Answer: [paste or describe what you know — don't invent; ask your SE if uncertain]

Format: direct answer first, then supporting evidence. Under 200 words.
```

---

## Étape 3 — Proposition

### Préparation de la proposition

Avant d'envoyer une proposition, assurez-vous que :
- [ ] Le décideur économique a été présenté et sait que le deal est en cours
- [ ] Les termes commerciaux ont été pré-approuvés verbalement (pas de surprises dans la proposition)
- [ ] Vous connaissez leur processus d'achat (ont-ils besoin que le service juridique examine avant ou après les termes commerciaux ?)
- [ ] Vous avez un champion qui va activement recevoir et défendre la proposition

```
/deal-desk

Structure the commercial proposal for [company].

Customer: [name, size]
Deal type: [new logo / expansion]
Products requested: [list]
Requested ACV: $[X] (target) / list price is $[Y]
Term: [12 / 24 / 36 months]
Special requirements: [any non-standard elements]

Validate:
1. Is this within my discount authority, or do I need manager approval?
2. What's the recommended term structure (payment terms, multi-year pricing)?
3. Are there any commercial red flags I should address before sending?
4. What's the recommended proposal format for this deal size?
```

### Suivi de la proposition (48 heures après l'envoi)

```
Write a follow-up email for [company] — sent the proposal 48 hours ago, no response yet.

Proposal contents: [1-line summary of what was proposed]
Champion: [name]
Context: [any signals from the demo or recent communications]

Goal: light-touch check-in that creates a reason to reconnect (not "just checking in").
Provide a piece of value or a relevant insight alongside the nudge.
Length: under 100 words.
```

---

## Étape 4 — Négociation

### Revue du deal avant les appels de négociation

```
/deal-review

Full MEDDPICC review before entering negotiation with [company].

Deal: [name, $ACV, current stage]
Negotiation dynamics:
- What they're pushing on: [price / terms / timeline / features]
- What we've already conceded: [any discounts or commitments made]
- Their stated deadline: [date if given]
- Competitive pressure: [who else is in the deal]

MEDDPICC status:
[paste what you know about each dimension]

Tell me:
1. Where are we strong enough to hold our position?
2. Where are we weak and at risk?
3. What's the one concession I should be willing to make to close?
4. What's my BATNA (best alternative to a negotiated agreement)?
5. What are the red lines — what I should NOT concede?
```

### Révision des termes du contrat

```
/deal-desk

Review these negotiated contract terms for commercial risks.

[Paste any redlines, counter-proposals, or term sheets from the buyer's legal team]

Flag: RED (reject or escalate) / YELLOW (flag but potentially acceptable) / GREEN (standard).
For each RED and YELLOW: explain the risk and recommend a counter-position.

HUMAN LEGAL REVIEW REQUIRED before finalising contract.
```

### Activation du Plan de Réussite Mutuel

```
/mutual-success-plan

Create a full mutual success plan for [company] — now in Negotiation.

[Paste all deal context: champion, economic buyer, deal size, close date, what's left]

This MSP must cover:
- All remaining milestones to signature (legal, security, procurement, executive alignment)
- Specific dates for each milestone, working backward from close date
- Mutual commitments (what each side commits to)
- Risk register (what could delay each milestone)

I'll share this with the champion today and review it with the economic buyer next week.
```

---

## Étape 5 — Verbal / Clôture

### Briefing du champion avant la clôture

```
/champion-builder

Prepare [champion name] for the final close conversation.

Deal context: [ACV, terms, close date]
Economic buyer: [name, title]
Open issues: [any unresolved commercial or legal questions]

Give me:
1. What the champion should say to the economic buyer to get final approval
2. The most likely last-minute objection and how to handle it
3. The specific ask: "Can you get me a signed contract by [date]?"
4. What I do if the answer is "we need more time" — how to respond without losing urgency
```

### Suivi de la confirmation verbale

Dans l'heure suivant un engagement verbal :

```
Write a verbal confirmation summary email.

Context: [company] just gave us a verbal commitment to proceed.
Agreed terms: [ACV, term, payment terms, start date]
Open items: [anything still pending — e.g. legal, security sign-off]
Next step: [what needs to happen next — e.g. "legal review of the MSA, target signature by [date]"]

Email should:
- Confirm what was agreed (their commitment in writing)
- Document any open items with owners and dates
- Propose the next concrete step with a specific date
- Set the tone: excited but not done until signed

Send to: [economic buyer + champion]
```

### Bloqué au verbal — relancer la dynamique

```
/champion-builder

This deal has been at verbal for [N] days. Help me get to signature.

Company: [name]
Verbal given: [date]
Open items: [what's blocking signature]
Champion status: [engaged / quiet]
Economic buyer: [last contact date and what was said]

Diagnosis: which of these is the real blocker?
1. Legal is slow (process stall — not a deal risk)
2. Budget has been frozen (financial event)
3. Someone above the champion is second-guessing the decision
4. Competitive re-engagement (another vendor stepped in)
5. My own process (something I haven't done)

For the most likely blocker: give me the specific action to take today.
```

---

## Étape 6 — Fermé Gagné

### CRM et transfert CS (dans les 24 heures suivant la signature)

```
/hubspot

Log the closed won deal in HubSpot.

Company: [name]
ACV: $[X]
Term: [months]
Products: [list]
Champion: [name, email]
Economic buyer: [name, email]
Close date: [date]
Start date: [date]
Notes: [anything CS needs to know for a smooth handoff]

Create a CS handoff task assigned to [CSM name] due [date].
```

**E-mail de transfert CS :**
```
Write a CS handoff email for [company].

What to include:
- Why they bought (the primary pain and expected outcome)
- Who the key stakeholders are (champion, economic buyer, day-to-day contacts)
- Any commitments made during the sale (specific features, integrations, timeline promises)
- Known risks or concerns to monitor
- The success criterion we defined in the MSP

This email is from me (the AE) to the assigned CSM. It should give them everything they need
to run the kickoff call without asking me for context.
```

### Post-mortem (analyse des victoires)

Après chaque deal Fermé Gagné supérieur à 50 000 $, effectuez une analyse de victoire de 20 minutes :

```
Run a deal win analysis for [company].

Deal: $[ACV], [N] days to close
Key events: [list the 3-5 moments that most influenced the outcome — good or bad]
What worked: [what you'd replicate]
What almost killed it: [the biggest risk that materialised — and how you recovered]
Champion quality: [how strong was the champion, in retrospect]
Competitive dynamic: [how competition influenced the deal]

Output: 5 bullet points I can share at team review to help other AEs.
```

---

## Liste de contrôle hebdomadaire de gestion des deals

Exécutez ceci chaque lundi matin avant votre revue de pipeline :

```
/commercial-forecaster

Weekly pipeline health check.

My open pipeline: [paste deal list — company, ACV, stage, close date, last activity]

Flag:
- Commit deals with no activity in 7+ days
- Deals where close date is this month but MSP hasn't been created
- Deals stuck in the same stage for > [25 days Discovery / 45 days Evaluation / 30 days Proposal]
- Best Case deals that could move to Commit this week with the right action
- Deals to mark as Closed Lost (be honest)

For each flagged deal: the one action to take today.
```

---
