---
name: referral-program
description: "Ontwerp van verwijzingsprogramma: stimulansstructuur, verwijzingsmechanica, tracking opzetten, e-mail/in-app prompts, fraude voorkoming — voor SaaS, ecommerce en consumentenproducten"
---

# Referral Program Skill

## Wanneer activeren
- Een verwijzings- of mond-tot-mond-programma helemaal opnieuw ontwerpen
- Verbeteren van conversie of deelname in een bestaand verwijzingsprogramma
- Kiezen tussen stimulatiemodellen voor verwijzingen (geven/krijgen, eenzijdig, contanten, krediet)
- Verwijzings-e-mailuitnodigingen en landingspagina kopie schrijven
- Verwijzingstracking opzetten en fraude voorkomen

## Wanneer NIET gebruiken
- Affiliate marketing (partnerkanaal, commissie) — verschillende mechanica en contracten
- Influencer campagnes — gebruik de brand-guidelines of social-media-manager skill
- Partner-/reseller-programma's — kanaalverkoop, geen verwijzingen

## Instructies

### Ontwerp verwijzingsprogramma

```
Ontwerp een verwijzingsprogramma voor [product].

Producttype: [SaaS / ecommerce / consumentenapp / marktplaats]
Bedrijfsmodel: [abonnement / eenmalige aankoop / freemium]
Gemiddelde klant LTV: $[X]
Huiden CAC (verwervingskosten): $[X]
Primaire verwervingsdoel: [nieuwe aanmeldingen / eerste aankopen / betaalde conversies]

Ontwerp raamwerk:

1. Wie vragen naar verwijzingen:
   - Timing: vragen na het aha-moment, niet bij aanmelding
   - Beste triggers: na eerste succesvol moment / na positieve review / bij upgrade
   - Segment: power users verwijzen meer dan gemiddelde gebruikers; filteren voor betrokken cohort

2. Stimulusstructuur (kiezen op basis van product economie):
   a. Geven/Krijgen (beide partijen winnen):
      Verwijzer krijgt: [X krediet / X maanden gratis / contanten]
      Verwezenlijking krijgt: [X krediet / verlengde trial / korting]
      Beste voor: SaaS, abonnementproducten
   
   b. Eenzijdig (alleen verwijzer):
      Verwijzer krijgt: geldcommissie of krediet per conversie
      Beste voor: hoge-marge producten, affiliate-achtige modellen
   
   c. Liefdadige donatie:
      Verwijzer kiest een liefdadige organisatie; je doneert $X per verwijzing
      Beste voor: B2B, waar contanten transactioneel aanvoelen

3. Stimuluskalibratie:
   - Verwijs verwijzingskosten tot 20-30% van LTV voor levensduur
   - Indien LTV = $[X], maximale verwijzingskosten = $[X × 0.25]
   - Payout trigger alleen bij betaalde conversie, niet aanmelding (fraude voorkoming)

4. Verwijzingsmechanica:
   - Unieke verwijzingslink per gebruiker (niet alleen code — links tracken beter)
   - E-mail + social sharing sjablonen vooraf geschreven
   - Dashboard: verwijzer kan zien wie hij/zij heeft uitgenodigd en status

Aanbevolen programmaontwerp voor mijn product met specifieke prikkelaantal.
```

### Verwijzings-e-mailsjablonen

```
Schrijf verwijzingsprogramma e-mails voor [product].

Product: [beschrijf]
Prikkel: [verwijzer krijgt X, verwezen persoon krijgt Y]
Verwijzingslink placeholder: [REFERRAL_URL]
Merktoon: [professioneel / casual / speels]

E-mail 1 — Verwijzingsuitnodiging (van verwijzer naar verwezen):
Onderwerp: [persoonlijk-voelend, niet bedrijf — vanuit het perspectief van de verwijzer]
Voorvertoning: [wat ze krijgen]
Lichaam:
- Persoonlijke opener (geschreven alsof van de verwijzer, niet het bedrijf)
- 1-zin productbeschrijving met sociale bewijstaal
- Het aanbod: "Krijg [X] wanneer je je aanmeldt met mijn link"
- [REFERRAL_URL]
- Houd onder 100 woorden

E-mail 2 — Verwijzingsprogramma aankondiging (aan bestaande gebruikers):
Onderwerp: [Geef [X], Krijg [X] — deel [product] met je team]
Doel: stimuleer deelname van huiden gebruikersbasis
Lichaam:
- Begin met hun beloning (niet het voordeel van het product)
- Eenvoudige uitleg hoe het werkt (max 3 stappen)
- CTA: "Krijg mijn verwijzingslink" → link naar dashboard
- Social sharing buttons vooraf geconfigureerd

E-mail 3 — Herinnering aan niet-deelnemers (14 dagen na lancering):
Onderwerp: [Je hebt ons verwijzingsprogramma nog niet geprobeerd]
Doel: converteer niet-deelnemers met sociaal bewijs
Lichaam:
- "[X] gebruikers hebben al [beloning] deze maand verdiend"
- Friectie-verlossing: "Het kost 30 seconden om je link te krijgen"
- CTA: hetzelfde als E-mail 2

E-mail 4 — Verwijzing ontvangen melding (aan verwijzer):
Onderwerp: [[First name] heeft zich zojuist aangemeld met je link]
Doel: versterk deelname, stimuleer tweede verwijzing
Lichaam:
- Bevestiging: "[Name] heeft zich aangemeld! Je krijgt [beloning] wanneer ze [converteren]."
- Voortgang indien van toepassing: "Je hebt [X] verwezen — [Y meer] tot [bonusniveau]"
- "Ken je iemand anders?" — secundaire CTA

Schrijf alle 4 e-mails voor mijn product.
```

### Verwijzings landingspagina

```
Schrijf verwijzingslandingspagina kopie voor [product].

Pagina URL: /invite of /referral
Bezoekerscontext: aangekomen via verwijzingslink van vriend/collega
Hun bewustzijn van het product: nul tot laag
De aangeboden aanbieding: [X]
Productvoordeel in één regel: [beschrijf]

Paginastructuur:

Held:
- Kop: "[Vriendnaam] heeft je uitgenodigd voor [product]" (gepersonaliseerd via URL param)
- Ondertitel: wat het product doet in gewoon Engels
- Het aanbod: "[X] gratis wanneer je je vandaag aanmeldt"
- CTA: "Claim [X] en ga aan de slag" (actie-eerst knoptekst)

Sociaal bewijs (onder de vouw):
- [X] klanten / [X] teams / [X] bijgehouden omzet
- 1-2 korte testimonials

Hoe het werkt (3 stappen):
1. Maak je account aan (30 seconden)
2. [Eerste sleutelactie] om aan de slag te gaan
3. [Aha-moment] — [beloning ontgrendeld]

Veelgestelde vragen (2-3 vragen):
- "Wat krijg ik gratis?" → specifiek antwoord
- "Heb ik een creditcard nodig?" → antwoord
- "Wat gebeurt er na [proefperiode/beloningperiode]?" → antwoord

CTA (herhaald onderaan): hetzelfde als held

Schrijf volledige pagina kopie met alle secties.
```

### Fraude voorkoming

```
Ontwerp fraude voorkoming voor een verwijzingsprogramma.

Beloningstype: [accountkrediet / gelduitbetaling / gratis maanden]
Uitbetalingstrigger: [bij aanmelding / bij eerste aankoop / bij betaalde conversie na 30 dagen]
Risiconiveau: [gering-waarde beloning / hoog-waarde beloning]

Veelvoorkomende fraudepatronen:
1. Zelf-verwijzing: gebruiker maakt tweede account om zichzelf te verwijzen
2. Valse aanmeldingen: verwijzer maakt dummy accounts aan om beloningen te verzamelen
3. Chargeback fraude: aankoop voltooien → verwijzingsbeloning verzamelen → chargeback
4. Bulk account creatie: scripts maken honderden accounts aan

Preventiemaatregelen:

Identiteitschecks:
□ E-mail domein deduplicatie (blokkeer dezelfde domeinvariaties: user+1@, user+2@)
□ IP-adres: vlaggen meerdere aanmeldingen van dezelfde IP binnen 24u (niet blokkeren — vlaggen voor beoordeling)
□ Apparaat vingerafdruk: vlag dezelfde apparaat registreert meerdere keren
□ Telefoonverificatie voor beloningen boven $[X]

Uitbetalingsvertraging:
□ Vertraging beloningskrediet met [30-60 dagen] — voorbij chargeback venster
□ Niet uitbetalen totdat verwezen gebruiker [X dagen] actief is geweest of [X] acties heeft gedaan

Zelf-verwijzing:
□ Blokkeer dezelfde e-maildomein op beide accounts
□ Vlaggen als facturatieadres overeenkomt met bestaande klant

Uitbetalingslimieten:
□ Maximum [X] verwijzingen per gebruiker per maand
□ Handmatige beoordeling vereist boven [X] verwijzingen/maand

Implementeer deze controles gerangschikt op inspanning vs. frauderisico voor mijn programma.
```

## Voorbeeld

**Gebruiker:** Onze SaaS ($49/maand, gemiddelde 18-maands LTV = $882) heeft geen verwijzingsprogramma. Klanten vertellen ons regelmatig dat ze ons aan collega's aanbevelen. We laten geld op tafel liggen. Ontwerp er een.

**Claude's aanbeveling:**

Met $882 LTV kun je $220 in verwijzingskosten (25% van LTV) permitteren en bent nog steeds beter af dan de meeste betaalde kanalen.

**Programma ontwerp:**

**Geven/Krijgen: $50 krediet voor verwijzer + $50 krediet voor verwezen persoon**

Waarom krediet, niet contanten:
- Krediet kost jou ~0 (het wordt toegepast op toekomstig abonnement)
- Gebruikers blijven betrokken om het in te wisselen
- Contanten op $50 per conversie is echte P&L impact

**Mechanica:**
- Verwijzingslink (geen code) — genereert op Account Settings pagina
- Uitbetalingstrigger: verwezen persoon blijft 30 dagen op betaald plan (voorkomt chargeback fraude)
- Dashboard: "Je hebt X mensen verwezen → $Y verdient"
- Limiet: 10 beloonde verwijzingen per gebruiker per kwartaal

**Wanneer vragen:**
Niet bij aanmelding vragen. Vragen:
1. Nadat ze hun eerste rapport hebben geëxporteerd (aha-moment)
2. Na hun eerste NPS score ≥ 9
3. Na maand 3 van actief gebruik (loyaliteitssignaal)

**Geprojecteerde wiskunde:**
Als 5% van je gebruikersbasis 1 persoon verwijst en 40% van die conversies → kostenper verworven klant = $125 (goed onder je huiden CAC). Dit levert meestal 15-25% nieuwe groei op in rijpe verwijzingsprogramma's.

**Lanceringsvolgorde:**
1. Bouw verwijzingslink generatie (1 developer sprint)
2. E-mail bestaande klanten met programma aankondiging
3. Voeg in-app prompt toe bij de 3 triggermomenten hierboven
4. Meet deelnamesnelheid wekelijks; itereer de prikkel als < 5% deelneemt

---
