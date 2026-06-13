---
name: dsar-response
description: "DSAR-respons werkstroom GDPR/CCPA: verzoek classificeren, identiteit verifiëren, systemen doorlopen, uitzonderingen toepassen, bevestiging en substantieel antwoord opstellen"
---

# DSAR-respons vaardigheid

## Wanneer activeren
- Een klant of medewerker dient een verzoek in voor datentoegang, verwijdering, portabiliteit of correctie
- U moet ontvangst binnen de wettelijke termijn bevestigen
- Alle persoonlijke gegevens voor deze persoon identificeren
- GDPR- of CCPA-uitzonderingen toepassen voordat u reageert
- Het antwoordschrijven opstellen

## Wanneer NIET gebruiken
- Massale meldingen van gegevensinbreuken — ander wettelijk kader (Art. 33/34 GDPR)
- Regelgevingsonderzoeken — betrek uw DPO en juridisch advies
- Verzoeken zijn duidelijk vaag pesterijen zonder legitiem doel — nog steeds passende behandeling nodig

## ⚠️ Belangrijk

Termijnen zijn strikt: **GDPR: 1 maand (verlengbaar tot 3 maanden voor complexe verzoeken). CCPA: 45 dagen.** Het missen van de termijn is zelf een compliance-schending. Claude helpt het proces te structureren — uw DPO of juridisch advies moet controleren voordat u antwoord stuurt.

## Instructies

### Stap 1 — Verzoek classificeren

```
Een betrokkene heeft dit bericht gestuurd: „[verzoek plakken]"

Classificeren:
1. Wat voor type verzoek is dit?
   - Toegang (Artikel 15 GDPR / CCPA recht om te weten)
   - Wissen (Art. 17 GDPR / CCPA recht om te verwijderen)
   - Portabiliteit (Art. 20 GDPR — gestructureerd, machine-readable)
   - Correctie (Art. 16 GDPR)
   - Verwerkingsbeperking (Art. 18 GDPR)
   - Verwerkingstegenstand (Art. 21 GDPR)
   - Meerdere rechten gecombineerd

2. Welke regelgeving is van toepassing?
   - GDPR (EU/UK bewoner of EU operaties)
   - CCPA (Californië bewoner)
   - Beiden / Overig

3. Wat is de termijn?
   - GDPR: [vandaag + 30 dagen] = [datum]
   - CCPA: [vandaag + 45 dagen] = [datum]
```

## Voorbeeld

**Klant e-mailt:** „Ik wil weten welke gegevens u over mij hebt en ik wil dat u deze verwijdert."

**Claude-werkstroom output:**

**Classificatie:** Gecombineerd toegangs- + wisverzoek onder GDPR (EU-klant geïdentificeerd via e-maildomein).

**Termijn:** 30 dagen vanaf vandaag = [datum].

**Identiteitsverificatie:** E-mail komt overeen met account in bestand — laag risico, geen extra verificatie nodig voor bekende klant.

**Systemen om te controleren:** CRM (HubSpot), betalingsverwerkingsmodule (Stripe), e-mailplatform (Mailchimp), analyses (Mixpanel), ondersteuningstickets (Intercom), back-up/archiefingssystemen.

**Bevestigingsontwerp** (vandaag verzenden): Bevestigt ontvangst, referentienummer, 30-daagse antwoordtermijn, DPO-contact.

**Verwijderingsanalyse:** Verkoop-/marketinggegevens kunnen onmiddellijk worden verwijderd. Betalingsgegevens 7 jaar onder UK belastingwetgeving (juridische verplichting uitzondering, Art. 17(3)(b)). Bevestig uitzondering voordat u verwijdert.

**Antwoordconcept:** Bevestigt gevonden gegevenscategorieën, bevestigt verwijdering van marketinggegevens, legt 7-jaar bewaring van betalingsgegevens uit met juridische basis, bevat recht om bij ICO klacht in te dienen.

---
