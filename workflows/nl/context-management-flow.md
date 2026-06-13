# Contextbeslissingsstroom voor beheer

Een gestructureerd besluitvormingsproces voor het kiezen van de juiste actie op elke turngrenzen om contextkwaliteit en sessiekosten te behouden. De verkeerde keuze verslechtert de uitvoerkwaliteit; de juiste keuze houdt de sessie efficiënt.

---

## Wanneer te gebruiken

Pas dit raamwerk toe wanneer u een van de volgende signalen opmerkt:
- Antwoorden worden langzamer of repetitief
- Claude verliest het spoor van eerdere beslissingen
- Aantal tokens nadert een drempel waar compressie of een nieuwe sessie rendabel wordt
- Een grote taak afmaken en iets onafhankelijks beginnen

---

## De 5 opties

### 1. Doorgaan

**Standaardactie.** Geen speciale actie ondernemen — gewoon het volgende bericht verzenden.

**Gebruik wanneer:**
- Claude is op het juiste spoor en maakt voortgang
- Context is vers (richtlijn: onder 200k tokens)
- Geen mislukte implementatiepogingen hebben zich in de context opgehoopt
- De volgende taak is direct gerelateerd aan het huidige werk

**Kostenimplicatie:** Elke beurt verbruikt tokens evenredig aan het volledige contextvenster. Doorgaan is goedkoop per beurt wanneer context klein is; duur wanneer groot.

---

### 2. Terugspoelen (`Esc+Esc` of `/rewind`)

Maak de laatste of meerdere beurten ongedaan. Verwijdert het assistentantwoord maar behoudt eerdere contexttoestand — bestandsreaders, eerder redeneren en context vóór de slechte beurt blijven behouden.

**Gebruik wanneer:**
- Claude is in de laatste beurt een verkeerd pad ingegaan
- U wilt nuttige codebase-exploratie van eerder in de sessie behouden, maar een mislukte implementatiepoging afwijzen
- De fout is recent en oppervlakkig — terugspoelen van een of twee beurten is voldoende om te herstellen

**Wat het niet is:** een manier om bestandssysteemwijzigingen ongedaan te maken. Terugspoelen verwijdert assistentbeurten uit context maar maakt de schrijfacties niet ongedaan die Claude naar schijf heeft gedaan. Zet die apart terug als nodig.

**Het meest geschikt voor:** herstellen van een verkeerde benadering zonder verlies van nuttige verkenningscontext die eraan voorafging.

---

### 3. Gericht samendrukken (`/compact <hint>`)

Comprimeer de huidige context in een samenvatting en ga verder. De `<hint>` vertelt de compressiestap wat van belang is — zonder dit kan compressie kritieke context verliezen.

**Gebruik wanneer:**
- Context wordt lang (richtlijn: 300k+ tokens op 1M-token model), maar u bent midden in een taak en wilt in dezelfde sessie doorgaan
- U hebt veel tussentijds redeneren, bestandslezers en debug-uitvoer verzameld die niet meer nodig zijn
- Primaire taakstatus is nog actief en u wilt geen nieuwe sessie informeren

**Hint-voorbeelden:**
```
/compact keep auth refactor context, drop the test debugging
/compact preserve the data model decisions and API contract, drop the installation steps
/compact focus on the migration plan, nothing else matters now
```

**Zonder hint:** compressie gebruikt heuristieken die mogelijk nog relevante beslissingen afwijzen. Altijd een hint doorgeven voor complexe sessies.

**Empirische drempel:** contextskwaliteit op het 1M-model begint merkbaar te verslechteren rond 300–400k tokens voor taken die nauwkeurige herinnering aan eerdere beslissingen vereisen. Eronder doorgaan tenzij kosten een probleem zijn.

---

### 4. Nieuwe sessie

Start een nieuwe `claude`-aanroeping. Geen context overgedragen.

**Gebruik wanneer:**
- De huidige taak is voltooid en u begint iets onafhankelijks
- De sessie heeft te veel doodlopende wegen en mislukte pogingen verzameld — de ruis overschaduwt nuttige context
- U wilt een schoon lei met alleen CLAUDE.md en expliciet gerefenteerde bestanden als context
- Context is zeer groot en u kunt de benodigde staat sneller reconstrueren door een nieuwe sessie in te lichten dan door compressie

**Niet gebruiken:** om werk midden in een taak voort te zetten tenzij de huidige sessie onherstelbaar beschadigd is. De kosten voor herstel van context zijn niet triviaal voor complexe taken.

---

### 5. Subagent

Genereer een Agent-hulpprogrammaoproep voor een beperkte deeltaak. De subagent wordt uitgevoerd met zijn eigen contextvenster; tussentijds redeneren verschijnt niet in de bovenliggende sessie.

**Gebruik wanneer:**
- U hebt het resultaat van een specifieke bewerking nodig (bijv. "lees deze 10 bestanden en retourneer een samenvatting"), maar hebt de tussentijdse stappen niet nodig in uw hoofdcontext
- De taak heeft duidelijke begrensd input en goed gedefinieerde uitvoer
- U wilt de context van uw hoofdsessie schoon en gericht houden

**Wat het niet is:** een vervanging voor een volledige sessie wanneer de deeltaak voortdurend heen-en-weer gaat vereisen.

---

## Besluitvormingstabel

| Signaal | Aanbevolen actie |
|---|---|
| Laatste beurt is mislukt, rest van sessie is goed | Terugspoelen |
| Context > 300k tokens, midden in taak | `/compact <hint>` |
| Context > 300k tokens, taak voltooid | Nieuwe sessie |
| Nieuwe onafhankelijke taak starten | Nieuwe sessie |
| Geïsoleerd deeltaakresultaat nodig | Subagent |
| Geen van bovenstaande | Doorgaan |

---

## Kostenimplicaties

- **Doorgaan** — goedkoopste per beurt wanneer context klein is; duurste wanneer context groot is (elke beurt verstuurt volledig venster erneuw)
- **Comprimeer** — één dure compressiebeurte, dan goedkopere beurten op gecomprimeerde context; rendabel wanneer 5+ beurten resterend
- **Terugspoelen** — gratis; verwijdert gewoon context uit geheugen
- **Nieuwe sessie** — nul overboekosten; u betaalt alleen voor wat u expliciet laadt
- **Subagent** — geïsoleerde kosten; bovenliggende sessie wordt niet gefactureerd voor subagent-context

---

## Wanneer NIET comprimeren

- Debug-sessie in het midden waar foutspoor en eerdere hypothese beide nog relevant zijn — compressie kan deze samenvatten tot dubbelzinnigheid
- Wanneer u de taak toch binnenkort afmaakt (1–2 beurten resterend) — moeite niet waard van compressiekosten
- Wanneer de hint zo gedetailleerd moet zijn dat schrijven langer duurt dan een nieuwe sessie informeren

---
