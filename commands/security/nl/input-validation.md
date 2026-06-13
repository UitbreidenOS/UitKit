---
description: Controleer inputvalidatie en sanitisatie over alle vertrouwensgrenzen
argument-hint: "[bestand, route, of module]"
---
Controleer inputvalidatie en sanitisatie in `$ARGUMENTS` (standaard: alle requesthandlers en gegevensinvoerpunten) op injectiekwetsbaarheden, typeverwarring en ontbrekende grenzenhandhaving.

**1. Vind alle vertrouwensgrenzen**

Vind elke plaats waar externe gegevens in de applicatie binnenkomen:
- HTTP-requesthandlers (body, queryparameters, padparameters, headers, cookies)
- Bestandsuploads en multipart-formuliergegevens
- WebSocket-messagehandlers
- Achtergrondtaakpayloads (wachtrijen, cron-invoer)
- Externe API-antwoorden behandeld als vertrouwd
- Omgevingsvariabelen gebruikt in codielogica

**2. SQL-injectie**

- Vind alle databasequery's. Zijn ze geparametriseerd/voorbereide instructies, of met tekenreeks samengevoegd?
- Controleer ORM-gebruik — zijn er raw query escape hatches (`.raw()`, `query()`, `execute()`) met ongereinigde invoer?
- Kijk naar second-order injectie: gebruikersinvoer opgeslagen in DB en later gebruikt in een raw query.

**3. Commando-injectie**

- Vind alle toepassingen van `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` en equivalenten.
- Is door gebruiker geleverde invoer geïnterpoleerd in shell-commando's? Zelfs met escaping, de voorkeur geven aan argumentarrays boven shelltekenreeksen.

**4. Sjabloon-injectie (SSTI)**

- Identificeer server-side sjabloonengines in gebruik (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Worden door gebruiker beheerde gegevens weergegeven binnen sjabloonexpressies (`{{ }}`, `<%= %>`)?

**5. Padverstuiving**

- Vind alle bestandslees-/schrijfbewerkingen met door gebruiker geleverde bestandsnamen of paden.
- Wordt het opgeloste pad gevalideerd tegen een toegestane basismap (bijv. `os.path.abspath` + prefixcontrole)?

**6. Type- en schemavalidatie**

- Wordt elk binnenkomend object gevalideerd tegen een strikt schema vóór gebruik?
- Worden numerieke invoeren grenzen gecontroleerd? Worden enums gevalideerd tegen een allowlist?
- Is er prototypepollutierisico (Node.js `Object.assign`, `merge` met onvertrouwde invoer)?

**7. Uitvoer**

Voor elke bevinding:
```
[ERNST] [bestand:regel] — kwetsbaarheidstype
Invoerbron: waar de onvertrouwde gegevens vandaan komen
Sink: waar het onveilig wordt gebruikt
PoC: minimale payload of request die het probleem aantoont
Fix: specifieke remedie (parametriseren, allowlist, schema valideren, enz.)
```

Probeer bevindingen niet uit te buiten — beschrijf alleen de aanvalsvector en fix.
