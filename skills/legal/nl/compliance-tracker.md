---
name: compliance-tracker
description: "Beheer van regelgevingsverplichtingen, deadlines en bewijsvereisten voor GDPR, SOC2, ISO27001"
---

# Compliance Tracker Vaardigheid

## Wanneer activeren
- Bij het opbouwen of auditeren van een register van nalevingsverplichtingen over meerdere kaders
- Bij het bijhouden van deadlines voor bewijsverzameling voor SOC2-, ISO 27001- of GDPR-audits
- Bij het in kaart brengen van welke controls van toepassing zijn op welke kaders om dubbel werk te vermijden
- Bij het monitoren van regelgevingsdeadlines (reactietijden DSAR, tijdlijnen voor breukmelding, verlengingen van certificeringen)
- Bij het inwerken van een nieuwe compliance officer die een overzicht van huidige verplichtingen nodig heeft
- Bij de voorbereiding op een audit met een hiatenanalyse ten opzichte van vereist bewijs

## Wanneer NIET gebruiken
- Jurisdictiespecifiek juridisch advies — dit identificeert verplichtingen; een advocaat interpreteert ze
- Realtime monitoring van regelgeving — Claude werkt vanuit bekende kaders, niet vanuit live-wetfeeds
- Het opstellen van feitelijke indiendocumenten — dit is een tracking- en planningshulpmiddel
- Als vervanging van een GRC-platform (Vanta, Drata, Secureframe) — gebruik die voor geautomatiseerde bewijsverzameling

## BELANGRIJK

Nalevingsvereisten veranderen. Alle verplichtingenlijsten moeten worden gevalideerd aan de hand van de actuele versie van elk standaard (GDPR: zoals gewijzigd; SOC2: AICPA 2017 Trust Services Criteria; ISO 27001: ISO/IEC 27001:2022). Valideer deze uitvoer altijd bij uw juridisch adviseur en externe auditors voordat u deze als gezaghebbend beschouwt.

## Instructies

### Prompt voor verplichtingenregister

```
Maak een register van nalevingsverplichtingen voor [BEDRIJF].

Bedrijfscontext:
- Sector: [sector]
- Jurisdicties: [lijst — bijv. EU/EEA, VK, VS, Californië]
- Verwerkte gegevenstypen: [persoonsgegevens / financiële gegevens / gezondheidsgegevens / etc.]
- Bedrijfsmodel: [SaaS / marktplaats / diensten / etc.]
- Toepasselijke kaders: [GDPR / UK GDPR / SOC2 Type II / ISO 27001 / CCPA / HIPAA / PCI-DSS]
- Huidige certificeringen: [lijst met vervaldatums, of "geen"]
- Jaarlijkse omzet (voor materialiteitsdrempels): [optioneel]

Stel een verplichtingenregister op met:

Per kader:
1. Kernverplichtingen (bondig — wat u moet doen, niet de volledige wettekst)
2. Vereist bewijstype (beleid / record / logboek / audit / rapport)
3. Verantwoordelijke eigenaar (rol, niet naam)
4. Frequentie (doorlopend / jaarlijks / per gebeurtenis / per verzoek)
5. Deadline of SLA (indien tijdgebonden)
6. Huidige status: [Conform / Hiaat / In Uitvoering / Niet Gestart]

Uitvoerformaat: één tabel per kader.
```

### GDPR-verplichtingentracker

```typescript
interface GDPRObligation {
  article: string             // bijv. "Art. 13", "Art. 30"
  obligation: string          // beschrijving in begrijpelijke taal
  evidenceRequired: string[]  // wat naleving aantoont
  owner: string               // DPO / Legal / IT / HR / Marketing
  frequency: 'ongoing' | 'annual' | 'per-event' | 'per-request'
  sla: string | null          // tijdslimiet indien van toepassing
  status: 'compliant' | 'gap' | 'in-progress' | 'not-started'
}

const GDPR_CORE_OBLIGATIONS: GDPRObligation[] = [
  {
    article: 'Art. 13-14',
    obligation: 'Provide privacy notices to data subjects at point of collection',
    evidenceRequired: ['Privacy policy', 'Cookie notice', 'Sign-up flow screenshots'],
    owner: 'Legal / Marketing',
    frequency: 'ongoing',
    sla: 'At time of collection',
    status: 'gap', // tijdelijk — bijwerken naar werkelijke status
  },
  {
    article: 'Art. 30',
    obligation: 'Maintain Records of Processing Activities (RoPA)',
    evidenceRequired: ['RoPA document', 'Last review date and sign-off'],
    owner: 'DPO / Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 32',
    obligation: 'Implement appropriate technical and organisational measures (TOMs)',
    evidenceRequired: ['Security policy', 'Encryption standards doc', 'Access control records', 'Pen test reports'],
    owner: 'CISO / IT',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 33',
    obligation: 'Report personal data breaches to supervisory authority within 72 hours',
    evidenceRequired: ['Incident response plan', 'Breach notification template', 'Breach log'],
    owner: 'DPO / Legal / IT',
    frequency: 'per-event',
    sla: '72 hours from awareness',
    status: 'gap',
  },
  {
    article: 'Art. 35',
    obligation: 'Conduct DPIA for high-risk processing activities',
    evidenceRequired: ['DPIA register', 'Completed DPIAs for high-risk activities'],
    owner: 'DPO',
    frequency: 'per-event',
    sla: 'Before processing begins',
    status: 'gap',
  },
  {
    article: 'Art. 37',
    obligation: 'Appoint a DPO if required (public authority / large-scale processing)',
    evidenceRequired: ['DPO appointment letter', 'DPO contact published on website'],
    owner: 'Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
]
```

### SOC2-controltracker

```
Maak een SOC2 Type II-controltracker.

Trust Services Criteria in scope: [TSC — Security (verplicht) + Privacy / Availability / Confidentiality / Processing Integrity]

Vermeld per controlecategorie:
- Controledoelstelling
- Controleactiviteit (wat we feitelijk doen)
- Bewijstype (het artefact dat een auditor zal opvragen)
- Verzamelingsmethode (geautomatiseerd / handmatig)
- Frequentie
- Eigenaar
- Status (aanwezig / gedeeltelijk / hiaat)

Veelvoorkomende beveiligingscontroles om bij te houden:

CC6 — LOGISCHE EN FYSIEKE TOEGANG:
CC6.1: Logische toegangsbeveiliging ter bescherming tegen bedreigingen
  Bewijs: Toegangsbeveiligingsbeleid, SSO/MFA-schermafbeeldingen, kwartaallijkse toegangsreviews
  Eigenaar: IT / Security | Frequentie: Doorlopend + kwartaalreview | Status: [?]

CC6.2: Registratie en autorisatie voor nieuwe interne gebruikers
  Bewijs: Procesbeschrijving gebruikersprovisioning, Jira-tickets of HRIS-records
  Eigenaar: IT / HR | Frequentie: Per gebeurtenis | Status: [?]

CC6.3: Intrekking van toegang wanneer autorisatie vervalt
  Bewijs: Offboardingchecklist, records van toegangsintrekking
  Eigenaar: IT / HR | Frequentie: Per gebeurtenis | Status: [?]

CC7 — SYSTEEMOPERATIES:
CC7.1: Detectie en monitoring van configuratiewijzigingen
  Bewijs: Wijzigingsbeheerbeleid, wijzigingslogboekrecords, SIEM-meldingen
  Eigenaar: IT / DevOps | Frequentie: Doorlopend | Status: [?]

CC7.2: Monitoring van systeemcomponenten op afwijkingen
  Bewijs: Schermafbeeldingen monitoringstool (Datadog, CloudWatch, etc.), meldingsconfiguratie
  Eigenaar: Engineering | Frequentie: Doorlopend | Status: [?]

[Doorgaan voor alle toepasselijke controls]
```

### ISO 27001-clausuletracker

```
Maak een ISO 27001:2022-nalevingstracker.

Toepasselijke Bijlage A-controls: [gebruik alle / of vermeld specifieke domeinen in scope]

Formaat per clausule:

Clausule [X.X]: [Naam clausule]
Vereiste: [In begrijpelijke taal — wat ISO vereist]
Hiatenanalyse: [Huidige stand versus vereiste]
Benodigd bewijs: [Beleid / procedure / record / technische control]
Eigenaar: [Rol]
Streefdatum: [Wanneer wordt dit afgerond]
Status: [Conform / In Uitvoering / Hiaat]

Prioriteitsclausules om bij te houden (ISO 27001:2022):

A.5 — Beleid voor informatiebeveiliging:
  A.5.1: Beleid voor informatiebeveiliging → Bewijs: IS-beleid ondertekend door het topmanagement, jaarlijkse review
  A.5.2: Rollen en verantwoordelijkheden voor informatiebeveiliging → Bewijs: RACI, organogram met beveiligingseigenaarschap

A.6 — Personeelscontroles:
  A.6.1: Screening → Bewijs: Proces voor achtergrondcontrole, records (GDPR-conform)
  A.6.3: Bewustzijn voor informatiebeveiliging → Bewijs: Trainingsrecords, voltooiingspercentages

A.8 — Technologische controls:
  A.8.2: Bevoorrechte toegangsrechten → Bewijs: Inventaris van bevoorrechte accounts, PAM-toolschermafbeeldingen
  A.8.5: Veilige authenticatie → Bewijs: MFA-handhavingsbeleid, SSO-configuratie
  A.8.8: Beheer van technische kwetsbaarheden → Bewijs: Kwetsbaarheidscanrapporten, patchrecords
  A.8.24: Gebruik van cryptografie → Bewijs: Versleutelingsstandaardendocument, sleutelbeheer-procedure
  A.8.29: Beveiligingstesten in ontwikkeling → Bewijs: SAST/DAST-configuratie, penetratietestrapportages

[Genereer resterende clausules op basis van scope]
```

### Prompt voor hiatenanalyse

```
Voer een nalevingshiatenanalyse uit.

Kader: [GDPR / SOC2 / ISO 27001 / CCPA / HIPAA]
Bevestigd aanwezig bewijs: [vermeld wat er is]
Bekende hiaten: [vermeld wat u weet dat ontbreekt]
Auditdatum: [wanneer vindt de volgende audit / certificering plaats]

Stel op:
1. Hiatenlijst — wat ontbreekt versus wat het kader vereist
2. Inspanningsschatting — hoe lang het kost om elk hiaat te dichten (dagen/weken)
3. Prioriteitsrangschikking — welke hiaten leiden tot auditfaling als ze niet worden gedicht
4. Eigendomsaanbevelingen — welk team elk hiaat moet dichten
5. Herstelplan — een actieoverzicht voor 90 dagen gesorteerd op prioriteit

Formaat:
| Hiaat | Kader | Ernst | Inspanning | Eigenaar | Streefdatum sluiting | Status |
|---|---|---|---|---|---|---|
| [Hiaat] | [Kader] | [Kritiek/Hoog/Gemiddeld/Laag] | [X dagen] | [Rol] | [Datum] | [Open] |
```

### Prompt voor deadlinetracker

```
Maak een nalevingsdeadlinetracker.

Neem alle tijdgebonden verplichtingen op uit mijn toepasselijke kaders:

REGELGEVINGSDEADLINES (niet onderhandelbaar):
- GDPR Art. 33: Persoonlijk datalek → toezichthouder: 72 uur na bewustwording
- GDPR Art. 34: Datalek → hoogrisicopersonen: "zonder onnodige vertraging"
- GDPR Art. 12: DSAR-reactie: 30 dagen (verlengbaar tot 90 met kennisgeving)
- UK GDPR: Gelijk aan GDPR (72 uur breuk, 30 dagen DSAR)
- CCPA: DSAR-reactie: 45 dagen (verlengbaar tot 90)
- HIPAA-breuk (>500 personen): 60 dagen na ontdekking; HHS + media inlichten
- HIPAA-breuk (<500): Jaarlijkse rapportage aan HHS (binnen 60 dagen na jaareinde)

CERTIFICERINGSDEADLINES:
- SOC2 Type II: Jaarlijkse rapportageperiode — [onze auditstartdatum]: [datum]
- ISO 27001: Surveillance-audit: [datum] | Hercertificering: [datum]
- PCI-DSS: Jaarlijkse beoordeling verschuldigd: [datum]

INTERNE DEADLINES:
- Kwartaallijkse toegangsreviews: [volgende datum]
- Jaarlijkse beleidsreviews: [volgende datum]
- Beveiligingstraining medewerkers: [voltooiingsdeadline]
- Leveranciersrisicobeoordeling: [volgende batch verschuldigd]

Formatteer als kalenderoverzicht per kwartaal, met RAG-status:
🔴 Rood: <30 dagen weg
🟡 Amber: 30-90 dagen weg
🟢 Groen: >90 dagen weg
```

### Checklist bewijsverzameling

```
Genereer een checklist voor bewijsverzameling ter voorbereiding van een [KADER]-audit.

Per vereist bewijsitem:
- Wat het is (begrijpelijke taal)
- Waar het te vinden (systeem, tool of proceseigenaar)
- Formaat dat auditors verwachten (schermafbeelding / export / ondertekend document / logbestand)
- Vereiste bewaartermijn
- Wie verantwoordelijk is voor het verzamelen

Groepeer op controlecategorie. Markeer items die automatisering versus handmatige verzameling vereisen.

Voorbeelduitvoerformaat:
| Bewijsitem | Bron | Formaat | Eigenaar | Bewaring | Verzamelingsmethode |
|---|---|---|---|---|---|
| MFA-handhavingsschermafbeelding | Okta-beheerconsole | PNG, gedateerd | IT | 12 maanden | Handmatig, maandelijks |
| Record voltooiing toegangsreview | HRIS + Jira | Ondertekend PDF | IT + HR | 12 maanden | Handmatig, kwartaal |
| Kwetsbaarheidscanrapport | Qualys / Nessus | PDF-export | Beveiliging | 12 maanden | Geautomatiseerd, maandelijks |
```

## Voorbeeld

**Gebruiker:** We zijn een Series B SaaS-bedrijf dat EU-persoonsgegevens verwerkt. GDPR is van toepassing; we werken toe naar SOC2 Type II. Onze audit is over 4 maanden. Wat zijn onze 10 meest kritieke nalevingshiaten?

**Verwachte uitvoer:**
```markdown
# Top 10 Kritieke Nalevingshiaten — GDPR + SOC2 Type II Voorbereiding
[VERIFIEER aan de hand van actuele kaderversies en uw juridisch adviseur]

Prioriteit | Hiaat | Kader | Auditrisico | Inspanning | Eigenaar
---|---|---|---|---|---
1 | Geen Register van Verwerkingsactiviteiten (RoPA) | GDPR Art.30 | Hoog — auditors vragen dit als eerste op | 3-5 dagen | DPO/Legal
2 | Geen DPA's met leveranciers voor externe verwerkers | GDPR Art.28 | Hoog — contractuele verplichting | 1-2 weken | Legal
3 | Ontbrekende privacyberichten op verzamelpunten | GDPR Art.13 | Hoog — zichtbaar voor auditor | 3-5 dagen | Legal + Marketing
4 | Geen formeel toegangsreviewproces (kwartaal) | SOC2 CC6.3 | Hoog — getest voor gehele periode | 2 weken om in te stellen | IT
5 | Geen wijzigingsbeheerlog voor productiesystemen | SOC2 CC7.1 | Hoog — vereist 12-maands-steekproef | Direct starten | DevOps
6 | Incidentresponsplan niet getest (geen tabletop) | SOC2 CC7.3 / GDPR Art.33 | Gemiddeld — bewijs van testen nodig | 1 dag tabletop | DPO + IT
7 | Geen formele DPIA voor hoog-risicoverwerking (ML-model) | GDPR Art.35 | Gemiddeld | 1-2 weken | DPO
8 | Beveiligingsbewustzijnstraining niet gedocumenteerd | SOC2 CC2.2 | Gemiddeld — voltooiingsrecords nodig | 2-3 dagen | HR + IT
9 | Versleuteling-in-rust niet bevestigd voor alle gegevensopslag | SOC2 CC6.7 | Gemiddeld — technisch bewijs | 1-2 dagen audit | Engineering
10 | Geen programma voor kwetsbaarheidsbeheer (scan + patch-SLA) | SOC2 CC7.1 | Gemiddeld — periodiek bewijs nodig | 2 weken om in te stellen | Beveiliging
```

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
