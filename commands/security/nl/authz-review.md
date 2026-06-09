---
description: Beoordeel autorisatielogica op privilege escalation, verbroken toegangscontrole en IDOR-fouten
argument-hint: "[file or module]"
---
Controleer de autorisatie- en toegangscontroleimplementatie in `$ARGUMENTS` (standaard: gehele codebase) op verbroken toegangscontrole, privilege escalation-paden en IDOR-kwetsbaarheden.

**1. Wijs het machtigingsmodel in kaart**

Identificeer en documenteer:
- Verificatiemechanisme (sessie, JWT, API-sleutel, OAuth)
- Rol-/machtigingsdefinities — waar ze worden opgeslagen en hoe ze worden geladen
- Middleware of decorators die authz afdwingen (bijv. `@require_permission`, `isAdmin` guards)
- Resources die zijn beveiligd versus die niet zijn beveiligd

**2. Controleer op verbroken toegangscontrole (OWASP A01)**

- Zijn autorisatiecontroles consistent toegepast, of alleen in bepaalde codepaden naar dezelfde bron?
- Kan een gebruiker met lagere bevoegdheden eindpunten met hogere bevoegdheden bereiken door het verzoek te manipuleren (methodeverandering, parameterwijziging, padtraversering)?
- Zijn er admin-only routes die alleen vertrouwen op een booleaanse vlag in gebruiker-gecontroleerde invoer (bijv. `?admin=true`)?
- Verbergt de frontend UI-elementen voor ongeautoriseerde gebruikers maar faalt de server-side dezelfde regels af te dwingen?

**3. Controleer op IDOR (Insecure Direct Object Reference)**

- Zoek elk eindpunt dat een door de gebruiker geleverde ID accepteert (padparameter, queryparameter, bodyveldt) en haalt een record op.
- Controleer of elke opzoeken een eigendoms- of lidmaatschapscontrole bevat — niet alleen dat de record bestaat.
- Markeer patronen zoals: `GET /invoices/:id` waarbij de query `SELECT * FROM invoices WHERE id = ?` is zonder `AND user_id = current_user`.

**4. Controleer op privilege escalation**

- Kan een normale gebruiker zijn eigen rol/machtigingen wijzigen via een API-eindpunt?
- Zijn er mass-assignment-kwetsbaarheden waarbij een `PATCH /users/:id` een `role`-veld accepteert?
- Is er een stroom voor het maken of uitnodigen van gebruikers waarbij de oproeper willekeurige rollen op het nieuwe account kan instellen?

**5. JWT / sessie-specifieke controles** (indien van toepassing)

- Wordt het algoritme server-side gevalideerd? (`alg: none` attack, algoritmeconfusie RS256→HS256)
- Worden JWT's op elke beveiligde route geverifieerd op vervaldatum, uitgever en publiek?
- Worden sessietokens ongeldig gemaakt bij afmelden en wachtwoordwijziging?

**6. Output**

Voor elke bevinding:
```
[SEVERITY] [file:line] — description
Attack scenario: one sentence explaining how an attacker exploits this
Fix: specific code change or pattern to apply
```

Severity: Critical (direct data breach or account takeover), High (privilege escalation), Medium (info disclosure), Low (defense in depth gap).
