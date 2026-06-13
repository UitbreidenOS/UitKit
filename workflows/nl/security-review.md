# Werkstroom voor veiligheidsevaluatie

Gestructureerd proces voor het uitvoeren van een veiligheidsevaluatie van een codebasis, API of systeem vóór de lancering of na aanzienlijke wijzigingen.

## Wanneer gebruiken

Voer deze werkstroom uit:
- Alvorens een nieuw product of een grote functie te lanceren
- Wanneer een nieuwe ingenieur het team toetreedt en een codebasis erft
- Na een beveiligingsincident om gerelateerde kwetsbaarheden te vinden
- Driemaandelijks voor beveiligingskritieke codepaden (betalingen, authenticatie, PII-verwerking)
- Bij het wijzigen van authenticatie-, autorisatie- of gegevenstoegangspatronen

## Fase 1: Bedreigingsmodellering (30-60 minuten)

Voordat u naar code kijkt, bepaalt u wat u beschermt:

**Te beschermen activa:**
- Persoonlijke gegevens van gebruikers (naam, e-mailadres, adres, betalingsinformatie)
- Authenticatiegegevens (wachtwoorden, tokens, API-sleutels)
- Bedrijfsgegevens (propriëtair, klantgegevens)
- Systeemtoegang (beheerdersmogelijkheden, infrastructuur)

**Bedreigingsactoren:**
- Externe aanvallers (niet-geverifieerde gebruikers, geautomatiseerde bots)
- Geverifieerde gebruikers die proberen gegevens van andere gebruikers te openen
- Kwaadwillende insiders met rechtmatige toegang
- Toeleveringsketen (gecompromitteerde afhankelijkheden)

**Aanvalsoppervlakken:**
- API-eindpunten (openbaar en geverifieerd)
- Bestandsupload en -verwerking
- Authenticatie- en sessiebeheer
- Integraties van derden (OAuth, webhooks)
- Beheerinterfaces

**Prioriteren op basis van impact × waarschijnlijkheid.**

## Fase 2: Geautomatiseerde scan (30 minuten)

Voer eerst deze tools uit — ze vinden snel de voor de hand liggende problemen:

```bash
# 1. Kwetsbaarheden in afhankelijkheden
npm audit --audit-level=high        # Node.js
pip-audit                           # Python
cargo audit                         # Rust

# 2. Detectie van geheimen in code
gitleaks detect --source . --verbose

# 3. Statische analyse (indien beschikbaar voor uw taal)
# Node.js:
npx eslint --ext .ts,.tsx . --rulesdir security-rules/
# Python:
bandit -r src/ -ll

# 4. OWASP-afhankelijkheidcontrole
docker run --rm owasp/dependency-check \
  --scan /path/to/project \
  --format HTML --out /output

# 5. Containerscanning (indien Docker):
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image my-image:latest
```

## Fase 3: Handmatige codebeoordeling

Concentreer u op de risicovolle gebieden:

**Authenticatie en sessiebeheer:**
- [ ] Inlogpunt heeft snelheidsbeperking
- [ ] Wachtwoorden gehasht met bcrypt/argon2 (niet MD5/SHA1)
- [ ] Sessietokens zijn cryptografisch willekeurig (niet sequentiële ID's)
- [ ] Sessie ongeldig gemaakt bij afmelding (serverzijde)
- [ ] JWT: handtekening geverifieerd, vervaldatum gecontroleerd, algoritme vastgesteld
- [ ] Tokens voor wachtwoordherstel verlopen (< 1 uur) en zijn eenmalig bruikbaar

**Autorisatie:**
- [ ] Elk API-eindpunt controleert verificatie
- [ ] Controles op hulpbronnen controleren eigendom (niet alleen "ingelogd")
- [ ] Beheerdersfuncties vereisen expliciete beheerdersrolcontrole
- [ ] Horizontale escalatie van rechten getest: kan gebruiker A resources van gebruiker B openen?

**Invoervalidatie:**
- [ ] Alle gebruikersinvoer geverifieerd voordat deze wordt gebruikt
- [ ] SQL-query's met parameters (geen string-interpolatie)
- [ ] Bestandsuploads: typevalidatie, groottelimits, inhoudscan
- [ ] Bescherming tegen padtraverse bij bestandsbewerkingen
- [ ] HTML-uitvoer ontsnapt (geen ruwe gebruikersininhoud weergegeven als HTML)

**Gevoelige gegevens:**
- [ ] Persoonlijke gegevens niet in logboeken (zoeken naar e-mail-, telefoon-, SSN-patronen)
- [ ] Geheimen niet in client-zijdige omgevingsvariabelen
- [ ] Geen geheimen in code, opmerkingen of testfixtures
- [ ] HTTPS afgedwongen (geen HTTP-terugval)
- [ ] Gevoelige gegevens versleuteld in rust (niet alleen gehasht)

**Integraties van derden:**
- [ ] Webhooks geverifieerd met handtekening (Stripe-webhookgeheim, enz.)
- [ ] OAuth-statusparameter geverifieerd (CSRF-preventie)
- [ ] Omleidings-URL's geverifieerd tegen whitelist
- [ ] API-sleutels gedraaid van die welke verlopen of blootgesteld zijn

## Fase 4: Penetratietests (licht)

Test de applicatie rechtstreeks op veelvoorkomende kwetsbaarheden:

```bash
# SQL-injectie snelle test (verzend deze in formuliervelden en URL-parameters):
' OR '1'='1
1; DROP TABLE users; --

# XSS snelle test:
<script>alert('xss')</script>
"><script>alert('xss')</script>

# Padtraverse:
../../../etc/passwd
%2e%2e%2f%2e%2e%2fetc%2fpasswd

# Omzeiing van authenticatie:
# Probeer geverifieerde eindpunten zonder token te openen
# Probeer verlopen tokens
# Probeer tokens van een ander gebruiker
```

Gebruik OWASP ZAP of Burp Suite Community Edition voor geautomatiseerde scanning van uw draaiende applicatie.

## Fase 5: Rapport en herstel

**Ernstig graad van bevindingen:**
- **Kritiek**: uitbuitbaar zonder verificatie, gegevenseinfiltratierisico → herstel vóór lancering
- **Hoog**: vereist verificatie maar leidt tot aanzienlijke gegevenslek → herstel binnen 48u
- **Gemiddeld**: beperkte impact of moeilijk uit te buiten → herstel binnen sprint
- **Laag**: diepte verdediging, kleine problemen → herstel in volgende onderhoudsvenster

**Rapportformat:**
```markdown
## Veiligheidsevaluatie — [Datum]
Evaluator: [naam]
Bereik: [wat is geverifieerd]

### Kritieke bevindingen
1. [Bevinding]: [beschrijving, locatie, proof of concept, herstel]

### Hoge bevindingen
...

### Gemiddelde bevindingen
...

### Herstelplan
| Bevinding | Eigenaar | Doeldatum | Status |
|---|---|---|---|
```

## Gerelateerde inhoud

- `/skills/productivity/ship-gate` — beveiligingschecklist vóór implementatie
- `/prompts/system-prompts/security-auditor` — Claude-veiligheidsaudit-prompt
- `/rules/common/api-design` — richtlijnen voor veilig API-ontwerp
- `/agents/roles/red-team` — geverifieerde tegenstander-simulatie

---
