# RIPER — gestructureerde agentische coderingframework

RIPER is een 5-fase framework voor complexe functie-ontwikkeling: Research, Innovate, Plan, Execute, Review. Elke fase heeft een strikte modus, gedefinieerde invoer en uitvoer en een expliciete grens die niet kan worden overschreden totdat de fase voltooid is.

---

## Waarom RIPER

Scoop creep is de primaire foutmodus voor agentische codering. Zonder expliciete fasegrenzen springt Claude van het lezen van één bestand naar het voorstellen van een volledige refactor naar het starten van implementatie — allemaal in één bericht. Het resultaat ziet er als vooruitgang uit maar produceert code die niet overeenkomt met vereisten, bevat niet-gereviewde architectuurbeslissingen en is moeilijk om de richting te wijzigen omdat de redenering impliciet gebeurde.

RIPER forceert expliciete faseverklaringen. Elke fase heeft precies één taak. Het schenden van een fasegrens is een protocolkunde — niet een stijlvoorkeur.

---

## Modeverkalkering

Elke fase begint met een expliciete modeverkalkering:

```
I am now in RESEARCH mode.
```

Deze verklaring is niet ceremonieel. Het is een toezegging: in deze modus doe ik precies wat deze fase vereist en niets anders. Modeverklaringen maken faseopdrachten zichtbaar in het gesprek en dwingen de vraag "ben ik eigenlijk klaar met de vorige fase?"

---

## Fase 1: Research

**Één taak:** context verzamelen. Geen oplossingen, geen voorstellen, geen meningen.

### Wat te verzamelen

- Codebase structuur: relevante bestanden, bestaande patronen, invoerpunten
- Beperkingen: bestaande interfaces die moeten worden behouden, prestatie vereisten, veiligheid grenzen
- Afhankelijkheden: waar deze feature van afhangt; wat ervan afhangt
- Prior art: soortgelijke functies al gebouwd; patronen gebruikt elders in de codebase

### Output

Een **context summary document** bevat:
- Lijst met relevante bestanden met beschrijvingen van één regel
- Sleutelpatronen in gebruik (naamgevingsconventies, foutafhandeling, gegevensstroom)
- Geïdentificeerde beperkingen
- Open vragen (dingen die niet uit de codebase alleen kunnen worden beantwoord)

### Anti-patroon

Oplossingen voorstellen tijdens Research. Op het moment dat een gedachte begint met "we zouden kunnen..." of "de beste aanpak zou zijn...", Research-modus is verbroken. Log de gedachte als open vraag en ga door met verzamelen.

**Verkeerd:**
```
I see the payment module uses Stripe. We could add a webhook handler at /api/webhooks/stripe
that validates the signature and routes events to the appropriate handler.
```

**Juist:**
```
Payment module location: src/payments/
Stripe SDK present: yes (package.json line 23)
Existing webhook infrastructure: none found
Open question: where does the codebase register API routes?
```

---

## Fase 2: Innovate

**Één taak:** genereer opties. Geen implementatie, geen diepe toezegging aan één aanpak.

### Formaat

Een genummerde lijst van benaderingen, elk met:
- Eénzins beschrijving
- Sleutel trade-offs (2–3 bullet points)
- Ruwe complexiteitsschatting

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

### Output

Een **opties document** met alle viabele benaderingen vermeld.

### Anti-patroon

Te diep gaan op één optie tijdens Innovate. Als één aanpak een volledige implementatieschets krijgt, Innovate-modus is voortijdig in Plan-modus gebroken. Vermeld de optie op trade-off-niveau en ga door.

---

## Fase 3: Plan

**Één taak:** selecteer één optie en produceer een genummerde checkliste van acties.

### Output

Een **genummerd plan** waarbij elk item een actie is, geen beschrijving. Elke stap moet in isolatie uitvoerbaar zijn.

```markdown
## Plan: Webhook handler as a dedicated route

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

Elke stap is specifiek genoeg dat een ander ingenieur het kan uitvoeren zonder vragen te stellen.

### Poort

Het plan moet worden gereviewd voordat Execute begint. Dit is het laatste moment om scope-problemen, ontbrekende stappen of architectuur problemen te vangen zonder implementatiekosten. Claude reviewt het; een mens reviewt het voor transacties met hoog inzet.

### Anti-patroon

Plan stappen schrijven als beschrijvingen in plaats van acties.

**Verkeerd (beschrijving):** "The webhook handler should validate the Stripe signature"  
**Juist (actie):** "Create `src/payments/webhook-handler.ts` with a `validateSignature(payload, secret)` function using Stripe's `constructEvent` method"

---

## Fase 4: Execute

**Één taak:** implementeer het plan precies zoals geschreven. Controleer elke stap af.

### Het blocker-protocol

De belangrijkste regel in Execute: als u iets onverwachts tegenkomt dat het plan niet rekening mee houdt, **stop onmiddellijk**.

Improviseert niet. Maak geen architectuurbeslissingen on the fly. Voeg niet "net nog iets toe."

Het blocker-protocol:
1. Stop met uitvoeren
2. Let op de blocker: wat werd gevonden, waarom blokkeert het de huidige stap
3. Keer terug naar Plan-modus
4. Update het plan om rekening te houden met de blocker
5. Hervatten Execute van de laatste voltooide stap

```
[BLOCKER — returning to PLAN mode]
Found: `src/api/router.ts` uses a different route registration pattern than documented.
Routes are registered via a decorator, not a direct call.
Plan step 4 needs to be revised to match the decorator pattern.
```

### Stap tracking

Markeer elke stap naarmate deze voltooid:

```markdown
1. [x] Add `StripeWebhookPayload` type to `src/types/payments.ts`
2. [x] Create `src/payments/webhook-handler.ts`
3. [x] Add route `POST /api/webhooks/stripe`
4. [ ] Register route in `src/api/router.ts`   ← current step
```

### Anti-patroon

Improviseert tijdens Execute. Elke wijziging niet in het plan — zelfs een "kleine verbetering" — is een scoop wijziging. Log het als toekomstige taak en blijf het plan uitvoeren zoals geschreven. Afwijken van het plan breekt de garantie dat Execute precies bouwt wat Plan ontworpen.

---

## Fase 5: Review

**Één taak:** vergelijk de implementatie met het plan en originele vereisten. Produceer een afwijkingsrapport.

### Wat te controleren

- Elke planstap: geïmplementeerd zoals gespecificeerd? (controleer elk `[x]`)
- Elk acceptatiecriterium uit Research: voldoet de implementatie eraan?
- Non-functionele vereisten: prestatie, veiligheid, foutafhandeling — zijn ze aanwezig?
- Tests: testen tests werkelijk het gedrag beschreven in vereisten?

### Output

Een **afwijkingsrapport + vereisten pass/fail**:

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

### Wat doen als afwijkingen worden gevonden

Kleine afwijkingen (typos, naamgeving): fix in plaats, opmerking in afwijkingsrapport.  
Ontbrekende stappen: terugkeer naar Execute voor het specifieke ontbrekende item.  
Vereistenfalen: terugkeer naar Plan — dit is een scoop-probleem dat planupdate nodig heeft vóór heruitvoering.  
Architectuurafwijkingen: escaleer. Dit is een signaal dat Execute geïmproviseerd — bepaal wat veranderd is en of het aanvaardbaar is.

---

## Anti-Patterns-tabel

| Fase | Anti-patroon | Gevolg |
|-------|-------------|-------------|
| Research | Oplossingen voorstellen | Slaat optiebeoordeling over; ankers op eerste idee |
| Research | Onvolledige contextvergroting | Plan is gebouwd op verkeerde aannames |
| Innovate | Te vroeg toezegging aan één optie | Mist betere benaderingen |
| Innovate | Trade-off analyse overslaan | Opties zien er gelijk uit; keuze is willekeurig |
| Plan | Beschrijvende stappen in plaats van acties | Execute wordt dubbelzinnig; blocker rate stijgt |
| Plan | Poort review overslaan | Architectuurproblemen ontdekt tijdens Execute |
| Execute | Improviseert | Plan valt niet langer samen met implementatie; Review heeft niets om tegen vergelijken |
| Execute | Verder gaan voorbij een blocker | Plan wordt ongeldig; volgende stappen kunnen fout zijn |
| Review | Overslaan | Afwijkingen gaan onopgemerkt; vereistenfalen schip |
| Review | Zachte pedaal bevindingen | "Minor" afwijkingen stapelen over functies |

---

## Wanneer RIPER versus gewoon coderen te gebruiken

**RIPER gebruiken voor:**
- Functies die meer dan 3 dagen duren
- Transacties met hoog inzet (auth, payments, data migraties, openbare API's)
- Onbekende codebases waarbij architectuurassumpties niet geverifieerd zijn
- Werk waar onjuiste implementatie duur is om na-deployment te repareren

**RIPER overslaan voor:**
- Hotfixes en incident response (ga rechtstreeks naar Fix + Review)
- Taken onder 2 uur met duidelijk implementatiepad
- Additieve wijzigingen zonder architectuurbeslissingen (configuratievlag toevoegen, afhankelijkheid bijwerken)
- Werk waarbij alle vijf fasen langer zouden duren dan gewoon coderen

RIPER heeft overhead. De overhead betaalt zich terug op complexe werk; het betaalt zich niet terug op klein werk. De vuistregel: als u de volledige implementatie in uw hoofd kunt houden zonder dit op te schrijven, RIPER is overkill.

---
