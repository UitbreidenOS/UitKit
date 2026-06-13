# AI Writing Detection

## Wanneer activeren
Documentatie, blogposts of marketing-copy controleren op AI-patroon tekst; wanneer de gebruiker wilt dat inhoud menselijker klinkt; een README of openbaar document beoordelen voorafgaand aan publicatie.

## Wanneer NIET gebruiken
- Technische specificaties of API-docs waar precisie meer uitmaakt dan stem
- Interne tooling-docs waar het publiek niet geeft om register
- Inhoud die al is gereviseerd en goedgekeurd — heropen niet

## Instructies

### Veelvoorkomende AI-tekstpatronen om aan te geven

**Filler hedges — volledig verwijderen:**
- "It's worth noting that..."
- "It's important to understand that..."
- "Certainly!" / "Absolutely!" / "Of course!" (opener responses)
- "I'd be happy to help with that."

**Transition-overgebruik — vervangen met een directe zin of niets:**
- "In conclusion, ..." — stop gewoon de paragraaf
- "Furthermore, ..." — zeg gewoon het volgende
- "Moreover, ..." — hetzelfde
- "Additionally, ..." — hetzelfde
- "In summary, ..." — alleen geldig bij samenvatting > 5 items

**Em-dash-overgebruik:** meer dan één em-dash per paragraaf is een sterk signaal; gebruik een punt of komma in plaats daarvan.

**Onverdiend enthousiasme:** zinnen die uitroeptekens gebruiken voor opmerkelijke verklaringen ("This makes development faster!"). Reserve `!` voor werkelijk verrassende resultaten.

**Voorspel voordat u antwoordt:** de vraag herhalen voordat u antwoordt ("You asked about X. X is an important topic because..."). Ga recht op het antwoord af.

**Buzzword stacking zonder inhoud:**
- "leveraging cutting-edge AI-powered solutions"
- "synergistic value-add for stakeholders"
- "robust and scalable architecture"
Deze zinnen bevatten geen informatie. Vervangen met een concrete claim of verwijderen.

**Over-kwalificering:** "might potentially", "could possibly", "may perhaps". Kies één hedge of geen.

### Herschrijfprincipes

1. **Voer aan met het feit.** Slecht: "It's important to note that authentication requires a valid token." Goed: "Requests require a valid token."

2. **Snij voorspel af.** Verwijder elke zin die context herhaalt die de lezer al heeft.

3. **Voorkeur voor concrete zelfstandige naamwoorden.** Slecht: "the system processes the data." Goed: "the API validates and stores the request body."

4. **Actieve stem.** Slecht: "The configuration is loaded by the application on startup." Goed: "The application loads configuration on startup."

5. **Match vocabulaire voor de lezer.** Een ontwikkelaars publiek heeft geen "in other words"-verklaringen van REST of JSON nodig. Een niet-technisch publiek heeft geen onverklaard acroniemen nodig.

6. **Snij alles wat geen informatie toevoegt.** Lees elke zin en vraag: als ik dit zou verwijderen, zou de lezer minder weten? Zo nee, verwijder het.

### Wat niet te veranderen

- Technische termen, zelfs als ze formeel klinken — "idempotent", "deserialization", "mutex" zijn nauwkeurig
- Code-voorbeelden — herschrijf nooit code als onderdeel van een prose-opruiming
- Accurate feiten — herschrijf alleen de prose eromheen, niet de beweringen zelf
- Gestructureerde lijsten — als een lijst duidelijk en correct is, laat deze; converteer niet naar prose

### Detectie-checklist
Voer deze lijst uit bij het beoordelen van een document:
- [ ] Begint een zin met "It's worth noting" of "It's important to"?
- [ ] Zijn er meer dan 2 em-dashes per pagina?
- [ ] Beginnen paragrafen met "Certainly", "Absolutely" of "Of course"?
- [ ] Is "In conclusion" ergens gebruikt behalve na een multi-item samenvatting?
- [ ] Worden "furthermore", "moreover" of "additionally" meer dan eenmaal per sectie gebruikt?
- [ ] Zijn er uitroeptekens op opmerkelijke verklaringen?
- [ ] Herhaalt de openingsparagraaf de documenttitel of de vraag die wordt beantwoord?
- [ ] Zijn er zinnen als "robust", "scalable", "cutting-edge", "powerful" zonder ondersteunend bewijs?

### Ernstverhaal

- **Verwijderen:** hedges, voorspel, onverdiend enthousiasme, buzzwords zonder inhoud — deze voegen geen waarde toe
- **Herschrijven:** over-gekwalificeerde verklaringen, passieve stem, begraven feiten — herstructureer de zin
- **Beoordelen:** em-dashes, transitiewoorden — één per sectie kan prima zijn; overgebruik is het probleem

## Voorbeeld

**Origineel (AI-patroon tekst):**
> It's worth noting that our platform leverages cutting-edge AI to deliver robust and scalable solutions. Furthermore, the system is designed to handle large volumes of data efficiently. In conclusion, this makes it an excellent choice for enterprise customers.

**Na het toepassen van deze skill:**
> The platform processes up to 10,000 requests per second and scales horizontally across regions. Enterprise customers can deploy it without infrastructure changes.

Changes made: removed "it's worth noting", replaced "cutting-edge AI / robust / scalable" with a concrete throughput number, removed "furthermore" and "in conclusion", converted to active voice, and cut the redundant closing sentence.

---
