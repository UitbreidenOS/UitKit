# Pre-Human-Review Pipeline

Een sequentiële drie-agent pipeline die een pull-request voorbereidt voor mensenreview. Voert codevereenvoudiging, beveiligingsscanning en uiteindelijke kwaliteitsbeoordeling in volgorde uit — elke agent moet slagen voordat de volgende draait. Het resultaat is een PR die bij mensenreview aankomt die al schoon, geauditeerd en geannoteerd is.

---

## Wanneer te gebruiken

- Voor aanvragen van codeherziening van teamgenoot of indiening bij main
- Na snelle AI-geassisteerde bouwsessie waar snelheid boven finishing was geprioriteerd
- Elke PR die authentificatie, betalingen of gegevenstoegang raakt — waar beveiligingscontrole niet ter discussie staat
- Teams met beperkte mensenherzienbandwijdte die willen dat AI eerst het lawaai filtert

---

## Fasen

### Fase 0 — Vereiste controle

Voor agentgeneratie verifiëren:

```
Lees PR-diff (git diff main...HEAD of bestandslijst).

Vertel mij:
1. Hoeveel bestanden zijn gewijzigd?
2. Is een van deze aanwezig: authenticatie, betalingen, migraties, secrets, omgevingsconfiguratie?
3. Is diff onder 500 regels? (Meer dan 2000 regels, adviseer PR eerst splitsen)

Niet tot Fase 1 gaan tot ik bevestig.
```

Poort: als diff 2000 regels overschrijdt, stoppen en gebruiker vragen PR te splitsen. Grote diffs verslaan doel van gestructureerde review.

---

### Fase 1 — Codevereenvoudiger

**Agent:** `agents/code-simplifier.md`
**Doel:** Verwijder over-engineering, dode code en onnodige complexiteit voordat andere agenten tokens erop spenderen.

```
Code-vereenvoudiger agent genereren.

Bereik: [lijst gewijzigde bestanden]
Taak: Herzie dit diff op over-engineering. Identificeer:
  - Functies die kunnen worden vervangen door standaard-bibliotheekoproepen
  - Abstracties die complexiteit zonder hergebruik toevoegen (YAGNI-schendingen)
  - Dode code of opmerking-blokken geïntroduceerd in deze PR
  - Herhaalde logica die eenmaal moet worden geëxtraheerd

Voor elke bevinding: toon voor, voorgestelde na, en reden.
Maak GEEN wijzigingen — maak alleen rapport met bevindingen.
```

**Poort:** Herzie bevindingen van vereenvoudiger. Accepteer of wijs af elke bevinding. Alleen geaccepteerde bevindingen worden toegepast vóór Fase 2. Als vereenvoudiger meldt niets te vereenvoudigen — groen licht, ga direct verder.

Pas geaccepteerde vereenvoudigingen toe:
```
Pas volgende geaccepteerde vereenvoudigingen van code-vereenvoudiger rapport toe:
[plak geaccepteerde bevindingen]

Maak minimale wijzigingen nodig. Voer geen nieuwe patronen of refactoring in buiten wat was vermeld.
```

---

### Fase 2 — Beveiligingsauditor

**Agent:** `agents/security-reviewer.md`
**Doel:** Markeer kwetsbaarheden geïntroduceerd in PR-diff — niet reeds bestaande codebase-problemen.

```
Security-reviewer agent genereren.

Bereik: alleen bestanden gewijzigd in deze PR — controleer niet bestaande code.
Diff: [voeg diff toe of zet bestanden op lijst]

Controleer op:
  - Injectiekwetsbaarheden (SQL, command, template)
  - Verificatie- en autorisatiegaten
  - Secrets of inloggegevens in code of opmerkingen
  - Onveilige deserialisering of eval-equivalente patronen
  - Ontbrekende invoervalidatie op door gebruiker beheerde gegevens
  - Verbroken toegangsbeheer (horizontale of verticale escalatie)

Voor elke bevinding: ernst (KRITIEK / HOOG / MIDDELMATIG / LAAG), bestand + lijn, beschrijving, matiging.
KRITIEK en HOOG blokkeren samenvoegen. MIDDELMATIG en LAAG zijn advisief.
```

**Poort:** Elke KRITIEK- of HOOG-bevinding blokkeert Fase 3. Gebruiker moet probleem repareren of risico expliciet schriftelijk accepteren vóór voortgang. LAAG en MIDDELMATIG bevindingen worden toegevoegd aan PR-beschrijving als adviesnota's.

---

### Fase 3 — Codereviewer

**Agent:** `agents/code-reviewer.md`
**Doel:** Uiteindelijke kwaliteitscontrole — logicacorrectie, testdekking, documentatie en algemene gereedheid.

```
Code-reviewer agent genereren.

Context: Dit diff is al vereenvoudigings- en beveiligingscontrole gepasseerd.
Concentreer uw herziening op:
  - Logicacorrectie: doet code wat PR-beschrijving beweert?
  - Randgevallen: welke inputs of staten zouden dit breken?
  - Testdekking: zijn tests betekenisvol of testen ze implementatiedetails?
  - Foutafhandeling: worden fouten op juist niveau afgehandeld?
  - Documentatie: hebben nieuwe openbare API's docstrings of JSDoc?

Verhef niet opnieuw problemen al aangeroerd door beveiligings- of vereenvoudigingsdoorgang.
Maak: LGTM / BENODIGD WERK oordeel met genummerde probleemlijst (indien van toepassing).
```

**Poort:** LGTM → PR klaar voor mensenreview. BENODIGD WERK → pak problemen aan en hervoer Fase 3 alleen (geen heruitvoering Fasen 1 of 2 tenzij nieuwe code toegevoegd).

---

### Fase 4 — Uitvoerverpakking

Zodra alle drie agenten zijn gepasseerd:

```
Vat deze PR voor mensenreviewer samen.

Opnemen:
- Eenpargraafbeschrijving van wat deze PR doet
- Gewijzigde bestanden (gegroepeerd per zorg: functiescode, tests, config)
- Problemen aangeheven en opgelost gedurende pipeline
- Eventuele advieskennisgeving (LAAG/MIDDELMATIG) beveiligingsnota's
- Voorgestelde beoordelingsfocusgebieden voor mens

Opmaken als PR-beschrijvingsupdate — ik zal het in GitHub PR-body plakken.
```

---

## Voorbeeld

PR: "OAuth2-login met Google toevoegen"

- Fase 0: 8 bestanden gewijzigd, authenticatielogica aanwezig → ga verder met verplichte beveiligingstest
- Fase 1 (Vereenvoudiger): 2 problemen gevonden — inline-tokenvalidatie dubbelt `validateToken()` utility, en dood import. Beide aanvaard en toegepast.
- Fase 2 (Beveiliging): 1 HOOG gevonden — statusparameter niet gevalideerd in OAuth callback (CSRF-risico). Gebruiker reparatie vóór Fase 3.
- Fase 3 (Reviewer): LGTM met 1 advies — test voor vervallen token-case ontbreekt. Advies aan PR-beschrijving gehecht.
- Fase 4: PR-beschrijving bijgewerkt met samenvatting en adviesnota.

Mensenreviewer ontvangt diff die al vereenvoudigd, beveiligd gecontroleerd en geannoteerd is.

---
