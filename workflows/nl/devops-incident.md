# DevOps Incident Workflow

Een gestructureerde workflow voor DevOps- en SRE-engineers die Claude Code gebruiken — van het eerste alarm tot triage, war room-coördinatie, oplossing en postmortem.

---

## Overzicht

**Tijdsbesparing:** Gestructureerde incidentrespons met Claude vermindert cognitieve belasting tijdens stressvolle gebeurtenissen, verlaagt de schrijftijd voor postmortems met 60% en zorgt ervoor dat hiaten in runbooks worden vastgelegd voor het volgende incident.

**Wat deze workflow omvat:**
- Alarm activeert → triage → ernstbeoordeling
- P1 war room-coördinatie
- Parallelle onderzoekssporen
- Stakeholdercommunicatie tijdens het incident
- Oplossing en verificatie
- Postmortemproces

**Vereiste:** `/incident-response` en `/oncall-runbook` geïnstalleerd. Aanbevolen: PagerDuty of OpsGenie MCP verbonden, runbooks toegankelijk vanuit Claude.

---

## Fase 1: Alarm activeert (0-5 minuten)

### Eerste 60 seconden — ernststriage

Page niemand en start geen war room voordat je 60 seconden hebt besteed aan een beoordeling.

```
/incident-response

Alarm: [alarmnaam van PagerDuty/Datadog]
Service: [welke service]
Tijdstip: [alarm geactiveerd om UU:MM]

Snelle triage:
1. Wat vertelt dit alarm me werkelijk? (kopieer de alarmtekst + drempelwaarde)
2. Is dit alarm nieuw, of heeft het de laatste tijd al geactiveerd? (controleer: laatste 7 dagen van dit alarm)
3. Is er een recente implementatie in de laatste 30-60 minuten? (controleer: implementatielog)
4. Activeren ook gerelateerde services alarm? (controleer: andere services in de afhankelijkheidsgraph)
5. Is er een runbook voor dit alarm? (controleer: runbookbibliotheek)

Initiële beoordeling: P1 / P2 / P3?

P1-criteria: klantgerichte service uitgevallen, risico op dataverlies, betalingsverwerkingsfout, > 10% van gebruikers getroffen
P2-criteria: verminderde prestaties, verhoogde foutrate, < 10% van gebruikers getroffen
P3-criteria: achtergrondtaak vertraagd, niet-klantgerichte service, prestaties verminderd maar SLO nog steeds gehaald
```

**Beslissingsregel:**
- P1 → ga onmiddellijk naar Fase 2 (war room)
- P2 → onderzoek 10 minuten zelf voordat je anderen paget; als het niet oploste, escaleer dan
- P3 → onderzoek en los op tijdens normale uren; page jezelf een herinnering, niet anderen

---

## Fase 2: War room opzetten (alleen P1 — 5-10 minuten)

### Pageer en vergader

```
/incident-response

P1 bevestigd: [korte beschrijving van wat er gebeurt]

War room opzetten:

1. Maak incidentkanaal aan: #inc-[JJJJ-MM-DD]-[korte-beschrijving]
2. Post initieel bericht in het kanaal:

--- SJABLOON ---
🔴 P1 INCIDENT — [SERVICENAAM] — [UU:MM]

Status: ONDERZOEKEN
Ernst: P1
Getroffen services: [lijst]
Klantimpact: [beschrijf — bijv. "checkout geeft 500-fouten voor alle gebruikers"]
Incident commander: [jouw naam]
Piketdienst: [piketingenieur]

Alle updates in deze thread. Maak geen zijgesprekken.
War room: [Zoom/Meet-link]
Runbook: [link]
Dashboard: [link]
--- EINDE SJABLOON ---

3. Wie te pageren voor dit incidenttype:
- Engineering lead: [naam] — als P1 > 15 minuten aanhoudt
- Databaseteam: [contact] — als databasegerelateerd
- Beveiliging: [contact] — als er enige indicatie is van een inbreuk of blootstelling van data
- Customer Success: [contact] — voor klantcommunicatie
- CEO: [contact] — als klantomzetimpact > $X of uitval > 30 minuten

Pageer [lijst wie te pageren] nu.
```

### Rol van incident commander

Bij een P1 is één persoon incident commander. Zij onderzoeken niet — zij coördineren.

```
/incident-response

Ik ben incident commander voor deze P1. Wijs onderzoekssporen toe.

Incident: [beschrijf]
Beschikbare engineers: [lijst wie er in de war room is]

Parallelle onderzoekssporen:
Spoor A — Grondoorzaakonderzoek: [naam engineer]
  - Onderzoekt: [servicelogs, database, recente implementatie]
  - Rapporteer terug binnen: 5 minuten met bevindingen of "nog aan het onderzoeken"

Spoor B — Mitigatie: [naam engineer]
  - Probeert: [terugdraaien / herstarten / feature flag uit / handmatig schalen]
  - ETA: [X minuten]

Spoor C — Klantimpactbeoordeling: [naam engineer]
  - Meet: [hoeveel gebruikers getroffen, welke geografieën, foutrate]
  - Uitvoer: gekwantificeerde klantimpact voor stakeholderupdate

Mijn taak als IC: statusupdates elke 5 minuten ontvangen, beslissingen nemen, extern communiceren.

Genereer een sjabloon voor de 5-minuten-updatecadans die ik in het kanaal zal posten.
```

---

## Fase 3: Onderzoek (parallelle sporen)

### Logonderzoek

```
/incident-response

Onderzoek: [incidentbeschrijving]

Beschikbare logs (plak of beschrijf):
[plak relevante logregels — filter tot het tijdvenster van het incident]

Help me identificeren:
1. Eerste optreden van de fout — exacte tijdstempel en logregel
2. Patroon: is dit één specifiek fouttype, of meerdere?
3. Eventuele stacktrace of upstream-fout die de grondoorzaak aangeeft
4. Eventuele correlatie: correleert dit met een specifieke gebruiker, eindpunt of aanvraagpatroon?
5. Foutrate in de loop van de tijd — wordt het erger, stabiel, of herstelt het?

Op basis van de logs: wat zijn de top 2-3 hypothesen voor de grondoorzaak?
```

### Statistiekenonderzoek

```
/incident-response

Statistieken tijdens incidentvenster [UU:MM tot UU:MM]:

[Plak of beschrijf wat je ziet in je dashboard]
- CPU: [trend tijdens incident]
- Geheugen: [trend]
- Foutrate: [trend]
- Latentie: [trend]
- Doorvoer (RPS): [trend]
- Databaseverbindingen: [trend]
- Eventuele andere relevante statistieken]

Interpreteer:
1. Wat veranderde als eerste — welke statistiek bewoog voor de anderen?
2. Is dit een resource-uitputting (CPU/geheugen) of een applicatiefout?
3. Is er een "knik" in de statistiek — een punt waar dingen plotseling verslechterden?
4. Welke statistiek moet ik volgen om te weten of de mitigatie werkt?
```

### Mitigatiebeslissing

```
/incident-response

Mitigatieopties voor: [beschrijf hypothese grondoorzaak of bevestigde grondoorzaak]

Beschikbare opties:
A. Terugdraaien laatste implementatie (implementatie [X] om [UU:MM]) — geschat herstel: [X min] — risico: [Y]
B. Pods herstarten: `kubectl rollout restart deployment/[service] -n [namespace]` — herstel: 2-3 min — risico: lopende verzoeken worden verbroken
C. Feature flag uit: [vlaggnaam] — herstel: 1-2 min — risico: [functionaliteit verwijderd voor alle gebruikers]
D. Opschalen: N replica's toevoegen — herstel: 3-5 min — risico: kosten; lost grondoorzaak niet op
E. [Andere optie]

Aanbeveling: welke mitigatie is het beste voor deze situatie?
Criteria: snelste tijd om klantimpact te herstellen, laagste risico op verslechtering, omkeerbaar.

Wat volg ik de 5 minuten na het toepassen van de mitigatie om te bevestigen dat het werkt?
```

---

## Fase 4: Communicatie tijdens incident

### Update statuspagina voor klanten

```
/incident-response

Schrijf een statuspagina-update.

Doelgroep: klanten / publiek
Toon: eerlijk, kalm, niet alarmerend
Vermijd: technisch jargon, schuldtoewijzing, interne onderzoeksdetails delen

Status: [Onderzoeken / Geïdentificeerd / Bewaken / Opgelost]
Getroffen component: [welke service / functie]
Klantimpact: [wat zij ervaren — "sommige gebruikers kunnen problemen ondervinden bij het afrekenen"]
Wanneer begon het: [UU:MM tijdzone]
Wat we doen: [kort — "ons team heeft het probleem geïdentificeerd en is bezig een oplossing te implementeren"]

ZEG NIET: "We apologize for any inconvenience." — overgebruikt en hol.
ZEG WEL: specifieke impact, wat je doet, en wanneer je weer een update geeft.

Sjabloon:
[STATUS]: [Korte kop van wat er gebeurt]
We [onderzoeken / hebben geïdentificeerd / bewaken] een probleem dat [component] treft.
[Wat klanten ervaren — specifiek].
Ons team is [welke actie wordt ondernomen — bijv. een oplossing implementeren / een wijziging terugdraaien].
We werken deze pagina bij om [tijdstip volgende update].
```

### Interne stakeholderupdate (elke 15-30 minuten tijdens P1)

```
/incident-response

Schrijf een interne stakeholderupdate voor P1-incident [NAAM].

Tijd verstreken sinds incident begon: [X minuten]
Laatste update gepost: [UU:MM]

Huidige status:
- Grondoorzaak: [geïdentificeerd / nog aan het onderzoeken]
- Mitigatiestatus: [toegepast / in uitvoering / nog niet]
- Klantimpact: [huidig — bijv. "50% van afrekenverzoeken mislukt, rest gezond"]
- ETA tot oplossing: [X minuten / onbekend]

Doelgroep: [Slack-kanaal met directieteam, CS, sales]
Lengte: maximaal 5-6 zinnen — niemand leest een muur van tekst tijdens een crisis.

Format:
[TIJDSTIP] P1-update — [SERVICE]:
Status: [één woord]
Impact: [huidige staat van klantimpact]
Grondoorzaak: [gevonden/niet gevonden]
Actie: [wat er nu gebeurt]
ETA: [schatting of "verder onderzoeken"]
Volgende update: [UU:MM]
```

---

## Fase 5: Oplossing en verificatie

### Verificatiechecklist oplossing

```
/incident-response

Verifieer incidentoplossing voor [SERVICE].

Toegepaste mitigatie: [wat er is gedaan]
Tijdstip toegepast: [UU:MM]

Verifieer herstel op deze dimensies:

1. Foutrate: huidige foutrate vs. baseline (moet terug zijn op SLO)
   Huidig: [X%] | Baseline: [X%] | SLO-drempelwaarde: [X%]

2. Latentie: p99-latentie terug naar normaal
   Huidig: [Xms] | Baseline: [Xms] | SLO-drempelwaarde: [Xms]

3. Doorvoer: RPS herstelt naar niveaus van voor het incident
   Huidig: [X] | Voor incident: [X]

4. Klantgerichte controle: synthetische test uitvoeren of echte gebruikersdata controleren
   Kan een klant [de getroffen flow] succesvol voltooien?

5. Downstream-services: eventuele cascading-effecten op afhankelijke services?
   [Controleer elke service die afhankelijk is van deze]

Als alle controles slagen: incident als opgelost verklaren.
Als een controle mislukt: niet als opgelost verklaren — ga verder met onderzoek.

Stel het "alles vrij"-bericht op voor het incidentkanaal en de statuspagina.
```

### Alles vrij-bericht

```
/incident-response

Schrijf het alles vrij-bericht voor:

Incident: [naam]
Duur: [X minuten totaal]
Grondoorzaak (kort): [wat er is gebeurd]
Toegepaste oplossing: [wat het heeft opgelost]
Eventuele vervolgacties die het team moet weten: [bewakingswijzigingen, aangemaakt ticket, enz.]

Kanaal: #inc-[naam] (kopieer naar #engineering en statuspagina)

Format: 3-4 zinnen. Specifiek. Vermeld tijdstip van oplossing.

Schrijf niet: "We're pleased to announce the incident is resolved." Te zakelijk.
Schrijf wel: "Vanaf [UU:MM] is [service] volledig hersteld. De grondoorzaak was [X]. We hebben [Y] gedaan en een ticket aangemaakt om [terugkeer te voorkomen]."
```

---

## Fase 6: Postmortem

### Postmortem binnen 48 uur na incident

```
/incident-response

Schrijf het postmortem voor [INCIDENTNAAM] — [DATUM].

Invoer:
- Geschiedenis incidentkanaal: [plak of vat samen]
- Tijdlijn zoals je die kent:
  [UU:MM] — [wat er is gebeurd]
  [UU:MM] — [wat er is gebeurd]
  [UU:MM] — [oplossing]
- Gevonden grondoorzaak: [beschrijf]
- Bijdragende factoren: [alles wat het erger of moeilijker te detecteren/oplossen maakte]
- Impact: [duur, getroffen services, klantimpact, omzetimpact indien bekend]

Postmortemstructuur:

## Samenvatting
[3-4 zinnen: wat er is gebeurd, impact, oplossing]

## Tijdlijn
[Nauwkeurige tijdlijn met tijdstippen — eerste teken, eerste alarm, triage, onderzoeksstappen, oplossing toegepast, verificatie]

## Grondoorzaak
[Specifieke technische grondoorzaak — niet "de service ging neer" maar wat ervoor zorgde dat het neerging]

## Bijdragende factoren
[Dingen die het erger maakten: langzame detectie, ontbrekend runbook, geen geteste terugrolprocedure, falende test die de bug heeft gemist]

## Impact
[Kwantificeer: N minuten uitval, X% van gebruikers getroffen, Y supporttickets aangemaakt, $Z omzetimpact]

## Wat goed ging
[Wees specifiek — wat werkte in de respons dat we moeten bewaren]

## Actiepunten
Format: [WAT] | Eigenaar: [NAAM] | Vervaldatum: [DATUM]
- [ ] [Actie 1 — bijv. voeg alarm toe voor [X] dat dit 10 minuten eerder had gedetecteerd] | Eigenaar: [naam] | Vervaldatum: [datum]
- [ ] [Actie 2] | Eigenaar: [naam] | Vervaldatum: [datum]
- [ ] [Actie 3 — werk het runbook bij met de vandaag gebruikte oplossingsstappen] | Eigenaar: [naam] | Vervaldatum: [datum]

Regel: maximaal 5 actiepunten. Elk moet specifiek en toegewezen zijn. Vage acties zijn geen acties.

## Wat we niet gaan oplossen
[Alles wat je bewust hebt gedeprioriteerd na evaluatie van kosten vs. risico]
```

---

## Voorbereiding piketdienst (voor je rotatie)

### Checklist voor rotatie

Voer dit 2 dagen uit voordat je piketdienst begint:

```
/oncall-runbook

Voorbereiding voor piketdienst die begint op [DATUM]:

Mijn te bestrijken services: [lijst]

Controleer voor elke service:
1. Is het runbook actueel? (Bijgewerkt in de laatste 90 dagen?)
2. Heb ik toegang tot alle benodigde tools? (Cloudconsole, Kubernetes, database, logs)
3. Zijn mijn PagerDuty-meldingen correct geconfigureerd? (Test door handmatig een laag-ernstig alarm te activeren)
4. Ken ik het escalatiepad? (Naam, telefoon, Slack voor elk niveau)

Gevonden hiaten: [lijst alles wat ontbreekt]
Acties voor aanvang dienst: [lijst]

Ook:
- Lees de laatste 3 postmortems — begrijp wat er recent is misgegaan
- Controleer of er implementaties zijn gepland tijdens mijn dienst — coördineer met het team
- Ken de bedrijfscontext: zijn er periodes met veel verkeer, lanceringen of gebeurtenissen tijdens mijn week?
```

---

## Benchmarks

| Statistiek | Doelstelling | Waarschuwingssignaal |
|---|---|---|
| Alarm tot triageebeslissing | < 5 minuten | > 10 min: alarmkwaliteit of runbook-hiaat |
| P1 war room samengesteld | < 10 minuten | > 20 min: communicatie- of pageringprobleem |
| Tijd tot eerste mitigatiepoging | < 20 minuten | > 30 min: onderzoekspad onduidelijk |
| MTTR (P1) | < 45 minuten | > 60 min: runbook- of vaardigheidskloof |
| MTTR (P2) | < 2 uur | > 4 uur: triage onnauwkeurig of onderzoek ineffectief |
| Postmortem gepubliceerd | Binnen 48 uur | > 72 uur: lessen gaan verloren |
| Actiepunten voltooid | 100% binnen 30 dagen | < 70%: actiepunten zijn geen echte verplichtingen |
| Incidenten per maand (trend) | Afnemend | Gelijk of toenemend: systemische problemen worden niet opgelost |

---
