---
name: code-review
description: "Structured code review: correctness, security, performance, maintainability — with severity and actionable feedback per finding"
---

# Code Review Skill

## Wanneer activeren
- Een PR beoordelen voordat u deze goedkeurt
- Uw eigen code zelf controleren voordat u een PR opent
- Een grondige beoordeling van een kritieke of security-gevoelige wijziging doen
- Een junior-ontwikkelaar onboarden en gestructureerde feedback geven
- Pre-merge checklist voor een feature voordat u naar productie gaat

## Wanneer NIET gebruiken
- Geautomatiseerde linting — gebruik ESLint, Ruff, golangci-lint voor stijl/opmaak
- Kwetsbaarheidsscan voor afhankelijkheden — gebruik `npm audit`, Snyk, Dependabot
- Prestatieprofiling — gebruik een profiler, niet een code review

## Instructies

### De review aanroepen

```
/code-review

PR: [paste diff, or describe what changed]
Context: [what this PR is for, any specific concerns]
Focus: [correctness / security / performance / all]
```

Of voor een specifiek bestand:
```
/code-review

File: src/billing/checkout.py
Concerns: payment processing, error handling, idempotency
```

### Review-checklist die Claude doorloopt

**Juistheid**
- [ ] Doet de code wat de PR-beschrijving zegt?
- [ ] Worden edge cases behandeld? (lege input, null, nul, zeer grote waarden)
- [ ] Worden fouttoestanden behandeld en zijn fouten informatief?
- [ ] Is foutafhandeling op het juiste niveau? (vang en onderdruk fouten niet stilletjes)
- [ ] Worden async-bewerkingen gewacht? Zijn race conditions mogelijk?
- [ ] Is de logica correct voor alle branches van voorwaarden?

**Beveiliging**
- [ ] Wordt gebruikersinvoer gevalideerd en gezuiverd voorafgaand aan gebruik?
- [ ] Worden SQL-query's geparametriseerd?
- [ ] Worden geheimen / referenties correct afgehandeld (env vars, niet hardcoded)?
- [ ] Wordt autorisatie gecontroleerd (niet alleen authenticatie)?
- [ ] Worden bestandspaden gevalideerd? (path traversal)
- [ ] Worden externe URL's gevalideerd? (SSRF)

**Prestatie**
- [ ] Zijn er N+1 querypatronen? (loop met een DB-oproep erin)
- [ ] Worden dure bewerkingen waar nodig gecacht?
- [ ] Worden database-query's geïndexeerd op de filterkolommen?
- [ ] Worden grote payloads gepagineerd of gestreamd?
- [ ] Verbergen zich O(n²)-bewerkingen in de logica?

**Onderhoudbaarheid**
- [ ] Doen functies één ding? (< 30 regels als ruwe richtlijn)
- [ ] Zijn variabele- en functienamen beschrijvend?
- [ ] Is de code leesbaar zonder commentaar? (goed naming > commentaar)
- [ ] Wordt duplicatie geïntroduceerd die kan worden geëxtraheerd?
- [ ] Zijn er magische nummers die benoemde constanten zouden moeten zijn?
- [ ] Wordt de wijziging gedekt door tests?

**API / Interface design**
- [ ] Is de openbare API consistent met bestaande patronen?
- [ ] Worden breaking changes gedocumenteerd?
- [ ] Staan parameters in een zinvolle volgorde?
- [ ] Communiceert de functiehandtekening zijn bedoeling?

### Uitvoerformaat

Claude produceert bevindingen in prioriteitsvolgorde:

```
🔴 BLOCKING — {title}
File: {path}:{line}
Issue: {what's wrong and why it matters}
Fix:
  {specific code change}

🟠 IMPORTANT — {title}
...

🟡 SUGGESTION — {title}
...

ℹ️ NITS — {list of minor style/naming items}

Summary: X blocking, Y important, Z suggestions
Overall: [Approve / Request changes / Needs discussion]
```

**Ernstniveaus:**
- 🔴 **BLOCKING** — moet voor merge worden opgelost: bug, security issue, data loss risk
- 🟠 **IMPORTANT** — moet voor merge worden opgelost: significant quality of reliability issue
- 🟡 **SUGGESTION** — waard te bespreken: design choice, alternative approach
- ℹ️ **NIT** — minor stijl, naming of opmaak (batch deze aan het einde)

### Gebieden met hoog signaal per wijzigingstype

**Nieuw API-eindpunt:**
- Input validation op alle parameters
- Authentication en authorization
- Rate limiting
- Consistency van foutreactieformat
- Logging van belangrijke events

**Database schema-wijziging:**
- Migratie is veilig voor zero-downtime deployment
- Nieuwe kolommen zijn nullable of hebben standaardwaarden
- Indexen toegevoegd voor nieuwe querypatronen
- Buitenlandse sleutels hebben passend ON DELETE gedrag

**Betaling / billing-code:**
- Idempotentie-sleutels gebruikt voor chargeer-bewerkingen
- Webhook-handtekeningvalidatie
- Restitutie/terugdraai-afhandeling
- Valutaafhandeling (gehele getallen/cents, niet floats)
- Testmodus versus productie-modusscheiding

**Authentificatiewijziging:**
- Sessie-ongeldigverklaring bij afmelden
- Wachtwoord-hashalgoritme (bcrypt/argon2, niet MD5/SHA1)
- Token-vervaldatum en verversinglogica
- CSRF-bescherming op toestandswijzigende eindpunten

### Feedback effectief geven

**Wees specifiek, niet vaag:**
```
# Slechte feedback
"This could be more efficient"

# Goede feedback
🟠 IMPORTANT — N+1 query in de gebruikersobjectlijst
Lijn 47: `orders = [get_orders(user.id) for user in users]` voert één query per gebruiker uit.
Vervang met een enkele JOIN-query of gebruik `select_related('orders')`.
```

**Stel de fix voor, niet alleen het probleem:**
```
🔴 BLOCKING — Gebruikersinvoer direct gebruikt in SQL-query
Lijn 23: f"SELECT * FROM products WHERE name = '{search_term}'"
SQL-injectierisico. Vervang met een geparametriseerde query:
  cursor.execute("SELECT * FROM products WHERE name = %s", (search_term,))
```

**Erken goede besluiten:**
```
✅ Goed besluit om UPSERT hier in plaats van SELECT + INSERT te gebruiken — vermijdt race condition.
```

## Voorbeeld

**PR:** Voeg gebruiker search-eindpunt toe

**Diff (vereenvoudigd):**
```python
@app.get("/users/search")
def search_users(query: str):
    results = db.execute(f"SELECT * FROM users WHERE email LIKE '%{query}%'")
    return [dict(r) for r in results]
```

**Verwachte review-output:**
```
🔴 BLOCKING — SQL injection via geparametriseerde query
File: api/users.py:3
Issue: Gebruiker-geleverde `query` wordt rechtstreeks in SQL geïnterpoleerd. Een aanvaller kan
alle gegevens extraheren of tabellen verwijderen.
Fix:
  results = db.execute(
      "SELECT * FROM users WHERE email LIKE %s",
      (f"%{query}%",)
  )

🟠 IMPORTANT — Geen authenticatie- of autorisatiecontrole
File: api/users.py:1
Issue: Eindpunt retourneert gebruikersgegevens zonder te verifiëren dat de aanroeper is geverifieerd.
Fix: Voeg `user = Depends(get_current_user)` toe en verifieer dat de aanroeper search-machtigingen heeft.

🟠 IMPORTANT — Geen paginering — retourneert alle gebruikers
File: api/users.py:3
Issue: `SELECT *` zonder LIMIT kan duizenden rijen retourneren.
Fix: Voeg `LIMIT 50` toe en een `page` parameter.

🟡 SUGGESTION — SELECT * retourneert password_hash en andere gevoelige velden
Overweeg expliciet alleen veilige kolommen te selecteren: id, email, name, created_at.

Summary: 2 blocking, 2 important
Decision: Request changes — security issues must be fixed before merge.
```

---
