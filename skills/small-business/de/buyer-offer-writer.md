---
name: buyer-offer-writer
description: "Käufer-Angebotsbrief und persönliches Anschreiben: auf die Situation des Verkäufers abstimmen, Stärken des Käufers hervorheben, für wettbewerbsintensive Mehrfach-Angebots-Szenarien und emotionale Verkäufer verfassen"
---

# Buyer Offer Writer Skill

## Wann aktivieren
- Dein Käufer möchte einen persönlichen Brief zusammen mit seinem Angebot einreichen (besonders bei emotionalen Verkäufen oder Familienheimen)
- Bei einem Mehrfach-Angebots-Szenario und du deinen Käufer jenseits des Preises differenzieren musst
- Verfassen des Angebots-Zusammenfassungs-Anschreibens vom Makler zum Listing-Makler
- Vorbereitung eines Briefes für einen Verkäufer, der jahrzehntelang in dem Haus gelebt hat und sich um sein Erbe sorgt
- Dein Käufer verzichtet auf Vorbehalte und muss seine finanzielle Stärke überzeugend kommunizieren

## Wann NICHT verwenden
- Der Listing-Makler oder Verkäufer hat keine Briefe angefordert — respektiere dies; manche Verkäufer lehnen ab, um Fair-Housing-Haftung zu vermeiden
- Gewerbliche oder Investmentimmobilientransaktionen — Entscheidungen sind finanziell, nicht emotional
- Der Brief würde Informationen zu geschützten Klassen preisgeben (Familiengröße, nationale Herkunft, Religion) — Claude wird dies kennzeichnen und entfernen
- Notverkäufe (Zwangsvollstreckung, Nachlass), bei denen der Entscheidungsträger eine Bank oder ein Gericht ist

## Hinweis zum Fair-Housing-Gesetz

Käuferbriefe können unbeabsichtigt Fair-Housing-Haftung erzeugen, wenn sie auf Familienstatus, nationale Herkunft, Religion, Rasse oder Behinderung hinweisen. Claude wird:
- Alle von dir angegebenen Details kennzeichnen, die auf geschützte Klassenmerkmale hindeuten
- Konforme Alternativen vorschlagen, die die gleiche emotionale Verbindung vermitteln
- Niemals Details über die Anzahl der Kinder, religiöse Praktiken, nationale Herkunft oder Behinderungsstatus aufnehmen

Du bist für die abschließende Prüfung vor der Einreichung verantwortlich.

## Anweisungen

### Persönliches Anschreiben (Käufer an Verkäufer)

```
Write a personal offer letter from a buyer to a home seller.

BUYER DETAILS (provide only what's relevant and Fair Housing compliant):
- Buyer name(s): [first names only]
- Connection to the property or neighborhood: [why this specific home — describe without protected class info]
- What they love about the property: [specific features — fireplace, garden, workshop, layout]
- Their story (Fair Housing compliant): [career, lifestyle, connection to community — not family structure]
- Their commitment: [cash offer / pre-approved / flexible closing / no contingencies]

SELLER DETAILS (what you know about them):
- Seller's relationship to the home: [long-time owner, raised family here, inherited, etc.]
- Seller's known priorities: [speed, price, certainty, right buyer]
- Any known emotional ties: [garden they planted, custom woodwork, neighborhood legacy]

OFFER CONTEXT:
- Offer price: $[X] (vs. list price $[X])
- Offer type: [at list / above list / with escalation clause]
- Strength of offer: [pre-approval amount $[X], cash, [X]% down, flexible close date]
- Contingencies: [financing / inspection / appraisal — or specify waivers]
- Competitive context: [multiple offers expected / single offer / deadline]

Write a letter that:
1. Opens with a genuine, specific connection to this property (not generic "we love your home")
2. Tells the buyer's story in 1-2 sentences (lifestyle, not demographics)
3. Highlights 2-3 specific features of the home they love (shows they've been there)
4. Communicates financial strength without sounding clinical
5. Addresses the seller's known priorities directly
6. Closes with warmth and confidence — not desperation
Keep it under 300 words. No Fair Housing red flags.
```

---

### Makler-Anschreiben (Makler an Makler)

```
Write a cover letter from buyer's agent to listing agent to accompany an offer.

OFFER SUMMARY:
- Property: [address]
- Offer price: $[X]
- Earnest money: $[X] ([X]% of purchase price)
- Down payment: [X]%
- Loan type: [conventional / FHA / VA / jumbo / cash]
- Pre-approval: [pre-approved with [lender], up to $[X], verified income and assets]
- Close date: [X days from acceptance / flexible]
- Possession: [at close / [X] days after]

CONTINGENCIES:
- Inspection: [yes / waived / information-only]
- Financing: [yes / waived — cash / strong approval]
- Appraisal: [yes / waived / gap coverage up to $[X]]
- HOA docs: [yes / waived]

BUYER STRENGTH POINTS:
[List 3-4 reasons this offer is clean and will close]

OFFER STRATEGY CONTEXT:
- Is this a multiple-offer situation? [yes/no — if yes, what's the competitive angle?]
- Any special accommodations to seller? [flexible close, rent-back, personal property items]
- Escalation clause? [yes — up to $[X] in $[X] increments, with proof of competing offer]

Write a professional agent-to-agent letter that:
1. Summarizes the offer terms clearly in the first paragraph
2. Establishes buyer credibility (lender name, financial strength)
3. Highlights what makes this offer clean (low risk to seller)
4. States any seller accommodations
5. Provides your contact information and availability
Tone: Professional, collegial, confident. Not pushy.
Under 250 words.
```

---

### Erläuterung der Eskalationsklausel

```
Draft a plain-English escalation clause explanation for my buyers to understand, and a professional disclosure for the listing agent.

Escalation details:
- Base offer price: $[X]
- Escalation increment: $[X] above any competing bona fide offer
- Escalation cap: $[X] (maximum we will pay)
- Proof required: [yes — copy of competing offer / no proof required]
- Appraisal gap coverage: [yes, up to $[X] above appraised value / no]

Write two versions:
1. BUYER EXPLANATION (plain English, how it works in practice, 100 words max)
2. AGENT DISCLOSURE (for the listing agent, precise terms, 80 words max)
```

---

### Strategie-Prompt für wettbewerbsintensive Mehrfach-Angebots-Szenarien

```
My buyer is competing in a multiple-offer situation. Help me build the strongest possible offer package.

Property: [address]
List price: $[X]
Offer deadline: [date/time]
Number of competing offers (if known): [X]
Estimated competition: [all conventional / likely cash offers / FHA buyers]

My buyer's situation:
- Pre-approved: $[X] with [lender name]
- Down payment: [X]%
- Flexibility: [close date range, move-out accommodation, etc.]
- Contingencies they'll keep: [inspection / financing / appraisal]
- Contingencies they'll waive: [list]
- Cash reserves after close: $[X] (can document)
- Maximum price: $[X]

Generate:
1. Recommended offer price and rationale
2. Escalation clause structure (if appropriate)
3. Which contingencies to waive and what risk that carries
4. 3 non-price ways to strengthen this offer
5. One-paragraph letter strategy (emotional vs. financial focus based on seller profile)
6. Red lines — what NOT to do even in competition (overextend, blind escalation cap, etc.)
```

---

### Antwort auf ein Gegenangebot

```
My buyer received a counter-offer. Help me draft the response letter and advise on strategy.

Original offer: $[X], [contingencies], close [date]
Counter-offer: $[X], [changes to terms], close [date]
Difference: $[X] / [what changed]

My buyer's position:
- Maximum they'll pay: $[X]
- Non-negotiables: [what they won't change]
- What they can offer in return for a better price: [close date flexibility, larger earnest money, etc.]

Generate:
1. Counter-proposal terms (what to offer back)
2. Brief letter accepting the counter / proposing a middle ground (under 150 words)
3. Walk-away recommendation: at what price or terms should my buyer decline?
```

---

### Nachfass nach dem Angebot

```
My buyer's offer was not selected. Write a follow-up message to the listing agent.

Context: [offer price, why it may not have been chosen, any intel on what won]
Goal: [stay in backup position / get feedback / keep relationship]

Write a brief, gracious message that:
1. Thanks the listing agent for the opportunity
2. Asks for feedback on what the winning offer looked like (agents often share this)
3. Positions the buyer as a backup if the first deal falls through
Under 100 words. Professional and warm.
```

## Beispiel

**Nutzer:** My buyers (a couple, first names Sarah and Tom) are offering $715K on a $699K list in Denver. The sellers are a retired couple who've lived there 25 years. Sellers' agent says they care about the home going to someone who will love it, not flip it. My buyers are both teachers, love the backyard garden, and want to stay in the neighborhood long-term. Conventional loan, 20% down, pre-approved to $800K with Chase. Waiving appraisal gap up to $20K.

**Erwartete Ausgabe:** Ein 280-Wörter persönlicher Brief von Sarah und Tom, der mit einem spezifischen Detail über den Garten beginnt („die Hochbeete entlang des Südzauns"), ihre Berufe als etwas erwähnt, das sie mit der Gemeinschaft verbindet, ihre Absicht zum Bleiben und zur Erhaltung des Charakters des Hauses zum Ausdruck bringt und warmherzig schließt. Keine Erwähnung von Kindern, Religion oder nationaler Herkunft. Makler-Anschreiben separat — fasst das $715K-Angebot zusammen, 20% Anzahlung, Conventional mit Chase, Gutachten-Lückendeckung bis $20K, flexibles Closing und positioniert das Angebot als risikoarm für die Verkäufer.

---
