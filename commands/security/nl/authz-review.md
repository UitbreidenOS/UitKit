---
description: Autorisatielogica controleren op escalatie van rechten, verbroken toegangscontrole en IDOR-flaws
argument-hint: "[bestand of module]"
---
Controleer de autorisatie- en toegangscontrolimplementatie in `$ARGUMENTS` (standaard: volledige codebase) op verbroken toegangscontrole, paden voor escalatie van rechten en IDOR-kwetsbaarheden.

**1. Maak kaart van het machtigingsmodel**

Identificeer en documenteer:
- Verificatiemechanisme (sessie, JWT, API-sleutel, OAuth)
- Rol-/machtigingsdefinities — waar ze worden opgeslagen en hoe ze worden geladen
- Middleware of decorators die autorisatie afdwingen (bijv. `@require_permission`, `isAdmin` guards)
- Resources die worden beveiligd versus die dat niet zijn

**2. Controleer op verbroken toegangscontrole (OWASP A01)**

- Worden autorisatiecontroles consistent toegepast, of alleen in enkele codepadpaden die naar dezelfde resource leiden?
- Kan een gebruiker met lagere rechten hogere endpoint-rechten bereiken door het verzoek te manipuleren (methodevervanging, parametertampering, pad traversal)?
- Zijn er admin-only routes die uitsluitend vertrouwen op een Booleaanse vlag in gebruikersgecontroleerde invoer (bijv. `?admin=true`)?
- Verbergt het frontend UI-elementen voor niet-geautoriseerde gebruikers, maar faalt het om dezelfde regels server-side af te dwingen?

**3. Controleer op IDOR (Insecure Direct Object Reference)**

- Zoek elk eindpunt dat een door de gebruiker opgegeven ID accepteert (pad param, query param, body-veld) en haalt een record op.
- Verifieer dat elke zoekopdracht een eigendoms- of lidmaatschapscontrole bevat — niet alleen dat de record bestaat.
- Markeert patronen als: `GET /invoices/:id` waarbij de query `SELECT * FROM invoices WHERE id = ?` is zonder `AND user_id = current_user`.

**4. Controleer op escalatie van rechten**

- Kan een normale gebruiker hun eigen rol/machtigingen wijzigen via een API-eindpunt?
- Zijn er kwetsbaarheden met massatoewijzing waarbij een `PATCH /users/:id` een `role`-veld accepteert?
- Is er een gebruikersmaakt- of uitnodigingsstroom waarin de aanroeper willekeurige rollen op het nieuwe account kan instellen?

**5. JWT / sessiespécifieke controles** (indien van toepassing)

- Wordt het algoritme server-side gevalideerd? (`alg: none` aanval, algoritmeconfusie RS256→HS256)
- Worden JWT's op vervaltijd, uitgever en publiek op elke beveiligde route geverifieerd?
- Worden sessietokens ongeldig gemaakt bij afmelding en wachtwoordwijziging?

**6. Uitvoer**

Voor elke bevinding:
```
[ERNST] [bestand:regel] — beschrijving
Aanvalsscenario: één zin die uitlegt hoe een aanvaller dit exploiteert
Oplossing: specifieke codewijziging of patroon om toe te passen
```

Ernst: Kritiek (directe dataschending of accountovernaming), Hoog (escalatie van rechten), Gemiddeld (informatievatting), Laag (verdedigingsgat).
