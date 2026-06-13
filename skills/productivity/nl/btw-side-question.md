# /btw — Zijvragen zonder stroom te breken

## Wanneer activeren
- Gebruiker wil midden-sessie een snelle vraag stellen zonder dat deze in de gespreksgeschiedenis verschijnt
- Gebruiker wil iets opzoeken terwijl Claude actief aan het werk is, zonder de hoofdtaak te onderbreken
- Gebruiker vraagt hoe je een zijvraag stelt, iets stilletjes controleert, of een eenmalig antwoord krijgt zonder context te vervuilen
- Gebruiker wil de `/btw`-opdracht gebruiken of vraagt naar het side-chat-overlay
- Gebruiker wil een naam, pad, variabele, branch of config-waarde controleren midden-taak zonder het gesprek af te leiden

## Wanneer NIET gebruiken
- De vraag vereist tool-toegang (bestand lezen, Bash-opdrachten, web-zoeken) — `/btw`-reacties hebben geen tool-toegang
- Het antwoord moet beïnvloeden wat Claude vervolgens in het hoofdgesprek doet — gebruik een normaal prompt zodat het antwoord in context terechtkomt
- De gebruiker wil een multi-turn zijdiscussie — `/btw` is alleen single response, geen gespreksthread
- De gebruiker is op de Claude-webinterface — `/btw` is alleen een CLI-functie

## Instructies

### Basisgebruik

```
/btw <question>
```

De vraag ziet de volledige gesprekscontext — alles wat Claude weet over de huidige sessie is beschikbaar. Het antwoord verschijnt als een overlay. Het laat geen spoor in de chatgeschiedenis: geen gebruikersbericht, geen assistentbericht, niets. Zodra het is gesloten, is het weg.

**Het overlay sluiten:** Druk op Space, Enter of Escape.

**Desktopequivalent:** `Cmd+;` opent een zijchat-paneel met hetzelfde gedrag.

### Wat /btw kan en niet kan doen

| Mogelijkheid | Beschikbaar |
|---|---|
| Volledige gesprekscontext | Ja |
| Prompt cache hergebruik | Ja (zeer lage kosten) |
| Tool-toegang (Read, Bash, enz.) | Nee |
| Multi-turn uitwisseling | Nee |
| Blijft in geschiedenis | Nee |
| Werkt tijdens actieve Claude-beurt | Ja — non-blocking overlay |

### Kosten

`/btw` hergebruikt de prompt cache uit het huidige gesprek. De incrementele kosten zijn alleen de output-tokens voor het antwoord — geen opnieuw coderen van context. Voor snelle vragen is dit effectief verwaarloosbaar.

### Goede vragen voor /btw

- "Wat heette die config-variabele ook alweer?"
- "Welke branch zit ik in deze sessie?"
- "Wat is de naam van het bestand dat we eerder refactoriseerden?"
- "Herinner me hoe de Stripe webhook env var in dit project heet."
- "Wat is de standaardwaarde van `OTEL_EXPORTER_OTLP_ENDPOINT`?"
- "Leg uit wat de decorator die we eerder toevoegden doet — snelle versie."
- "Wat was het foutbericht van die mislukte test?"
- "Hoeveel bestanden hebben we tot nu toe gewijzigd?"

### Vragen die in het hoofdgesprek thuishoren

- "Lees `config/database.yml` en zeg me de grootte van de verbindingspool." — vereist Read tool
- "Wat toont `git log --oneline -10`?" — vereist Bash
- "Nu u weet X, update de benadering." — het antwoord moet Claude's volgende actie beïnvloeden

## Voorbeeld

**Scenario:** Claude is halverwege het extraheren van een serviceklasse. U leest het originele bestand op een tweede monitor en kunt zich niet herinneren welke interfacenaam eerder in de sessie werd afgesproken.

In plaats van een bericht in te typen (dat in de geschiedenis zou verschijnen en Claude potentieel zou afleiden van zijn huidige werk), typt u:

```
/btw what did we name the new interface for the payment processor abstraction?
```

Claude reageert in een overlay:

```
PaymentGateway — defined in the interfaces section around turn 12.
```

Druk op Space om te sluiten. De hoofdtaak gaat ononderbroken door. Niets verschijnt in de gespreksgeschiedenis.

---

**In contrast met een normaal prompt:**

Als u dezelfde vraag als een normaal bericht stelde, zou het:
1. In het gesprek als een gebruikersfase verschijnen
2. Potentieel Claude's huidige redeneringsketen onderbreken
3. In context blijven voor alle toekomstige beurten (ruis toevoegen)
4. Bijdragen aan de gespreksgeschiedenis die volgende reacties informeert

Voor pure lookups zonder downstreameffect is `/btw` het juiste gereedschap.

---
