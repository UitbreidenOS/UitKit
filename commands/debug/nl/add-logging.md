---
description: Voeg gestructureerde logging toe aan een bestand of functie met passende logniveaus en context
argument-hint: "[bestandspad of functiepath]"
---
Voeg logging met productiekwaliteit toe aan de doelcode.

Doel: $ARGUMENTS

Lees het doelbestand of de doelfunctie. Vervolgens:

1. **Controleer bestaande logging** — identificeer wat al wordt gelogd, welke logbibliotheek of framework in gebruik is (stdlib logging, structlog, Winston, pino, slog, zerolog, enz.) en de logniveauconventies van het project. Introduceert u geen tweede logafhankelijkheid.

2. **Identificeer logpunten** — bepaal waar logging ontbreekt of onvoldoende is:
   - In- en uitgang van niet-triviale functies (met relevante argumenten en retourwaarden, geredacteerd indien ze persoonsgegevens of geheimen kunnen bevatten)
   - Vertakkingsbeslissingen die het gedrag beïnvloeden (log welke vertakking is genomen en waarom)
   - Externe aanroepen (HTTP, DB, wachtrij, cache) — log de bedoeling vóór de aanroep en het resultaat erna, altijd inclusief duur
   - Fout- en uitzonderingspaden — log volledige context, niet alleen het bericht
   - Toestandsovergangen in langlevende objecten of staatsautomaten

3. **Kies de juiste logniveaus** — pas deze regels strikt toe:
   - DEBUG: interne toestand, lusverhalen, opgeloste config-waarden
   - INFO: betekenisvolle mijlpalen die een operator in productie wil zien
   - WARN: herstelbare afwijkingen, verouderde paden, verslechterd gedrag
   - ERROR: fouten die aandacht vereisen; neem altijd het uitzonderingsobject/stack op

4. **Voeg gestructureerde velden toe** — log sleutel=waarde-paren of JSON-velden, geen geïnterpoleerde tekenreeksen. Neem op: aanvraag/trace/correlatieID's indien beschikbaar in bereik, relevante entiteits-ID's, timing, omgevingscontext.

5. **Pas de wijzigingen toe** — schrijf het bijgewerkte bestand. Wijzig niet de logica, opmaak buiten de toegevoegde regels of variabelnamen. Voeg alleen import's toe indien vereist en nog niet aanwezig.

6. **Toon een samenvatting** — vermeld elke toegevoegde logverklaring met het niveau en een eenregelige rationale.

Log geen geheimen, tokens, wachtwoorden, volledige aanvraagteksten of persoonsgegevens. Indien dergelijke waarden in bereik zijn, log hun aanwezigheid of een hash, nooit hun inhoud.
