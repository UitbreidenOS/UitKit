---
description: Voeg gestructureerde logging toe aan een bestand of functie met passende logniveaus en context
argument-hint: "[file or function path]"
---
Voeg logging van productiëkwaliteit toe aan de doelcode.

Doel: $ARGUMENTS

Lees het doelbestand of de doelfunctie. Vervolgens:

1. **Controleer bestaande logging** — identificeer wat al gelogd wordt, welke logbibliotheek of framework in gebruik is (stdlib logging, structlog, Winston, pino, slog, zerolog, enz.), en de lognivelconventies van het project. Introduceer geen tweede logging-afhankelijkheid.

2. **Identificeer logpunten** — bepaal waar logging ontbreekt of onvoldoende is:
   - Invoer en uitgang van niet-triviale functies (met relevante argumenten en retourwaarden, geredacteerd als deze PII of geheimen kunnen bevatten)
   - Vertakkingsbeslissingen die gedrag beïnvloeden (log welke vertakking werd gekozen en waarom)
   - Externe oproepen (HTTP, DB, wachtrij, cache) — log de bedoeling vóór de oproep en het resultaat erna, altijd inclusief duur
   - Fout- en uitzondeingspaden — log volledige context, niet alleen het bericht
   - Statusovergangen in langlevende objecten of statusmachines

3. **Kies juiste logniveaus** — pas deze regels strikt toe:
   - DEBUG: interne staat, luscyclussen, opgeloste configuratiewaarden
   - INFO: betekenisvolle mijlpalen die een menselijke operator in productie zou willen zien
   - WARN: herstelbare afwijkingen, afgeschafte paden, verslechterde werking
   - ERROR: fouten die aandacht vereisen; bevat altijd het uitzonderingsobject/stack

4. **Voeg gestructureerde velden toe** — log sleutel=waardeparen of JSON-velden, geen geïnterpoleerde strings. Inclusief: aanvraag-/trace-/correlatie-id's indien beschikbaar in bereik, relevante entiteit-id's, timing, omgevingscontext.

5. **Pas de wijzigingen toe** — schrijf het bijgewerkte bestand. Wijzig geen logica, opmaak buiten de toegevoegde regels of variabelenamen. Voeg alleen invoer toe als dit vereist is en nog niet aanwezig.

6. **Toon een samenvatting** — vermeld elk toegevoegd logstatement met het niveau en een eenregels-rationale.

Log geen geheimen, tokens, wachtwoorden, volledige verzoeklichamen of PII. Als dergelijke waarden binnen bereik zijn, log hun aanwezigheid of een hash, nooit hun inhoud.
