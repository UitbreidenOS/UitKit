# MCP: Stripe

Frage Stripe-Daten ab, verwalte Kunden, Produkte und Subscriptions direkt von Claude Code aus — ohne zum Stripe-Dashboard zu wechseln oder One-Off-Skripte zu schreiben.

## Warum du das brauchst

Stripe hält die Business-Critical-Datenschicht: wer zahlt, wofür sie zahlen und ob Zahlungen erfolgreich sind. Ohne MCP bedeutet Zugriff Kontext-Wechsel zu einem Dashboard oder das Schreiben von Wegwerf-Skripten. Mit Stripe MCP:
- Revenue-Abfragen, Churn-Analyse und Payment-Fehler-Untersuchungen laufen in der Coding-Session
- Produkt- und Pricing-Änderungen passieren ohne Terminal zu verlassen
- Claude kann Code-Änderungen gegen echte Billing-Daten korrelieren — Mismatches vor Production aufdecken
- Routine-Support-Aufgaben (Kunden suchen, Subscription-State prüfen) brauchen Sekunden statt Minuten

## Installation

```bash
npm install -g @stripe/mcp
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your-restricted-key-here"
      }
    }
  }
}
```

Verwende einen Restricted-Key, der nur auf die Ressourcen deines Workflows scoped ist. Verwende `sk_live_` nie in Development-Konfiguration.

## Schlüssel-Tools / Was es tut

- `list_customers` — liste Kunden mit optionalen Filtern auf (E-Mail, Created Date Range, Metadata)
- `get_customer` — rufe einen einzelnen Kunden mit vollständigem Profil und Metadata ab
- `create_customer` — erstelle einen neuen Kunden mit Name, E-Mail und Metadata
- `list_products` — liste alle Produkte mit ihrem Active/Inactive-Status auf
- `create_product` — erstelle ein neues Produkt mit Name, Beschreibung und Metadata
- `list_prices` — liste Preise für ein Produkt oder alle Produkte auf
- `create_price` — erstelle einen neuen Preis (recurring oder One-Time) für ein Produkt
- `list_subscriptions` — liste Subscriptions mit Filtern auf (Customer, Status, Price)
- `get_subscription` — rufe eine Subscription mit aktuellem Period, Status und Items ab
- `create_payment_link` — generiere einen gehosteten Payment-Link für ein Produkt/Price
- `list_invoices` — liste Invoices mit Filtern auf (Customer, Status, Date Range)
- `retrieve_balance` — hole den aktuellen Stripe-Account-Balance (Available und Pending)
- `list_charges` — liste Charges mit Filtern auf (Customer, Outcome, Date Range)
- `list_payment_intents` — liste Payment Intents mit Status-Filtern auf (Failed, Succeeded, Processing)

## Verwendungsbeispiele

```
Zeige mir alle Kunden, die in den letzten 30 Tagen churnten —
Subscriptions, die zu Canceled-Status bewegten. Schließe ihre E-Mail,
Plan-Name und wie lange sie subscribed waren, ein.
```

```
Erstelle ein neues Produkt namens "Pro Plan" und füge einen Recurring-Monthly-Preis
von $49 und einen Annual-Preis von $490 hinzu. Gib die Price-IDs zurück,
damit ich die Frontend-Konfiguration aktualisieren kann.
```

```
Liste alle fehlgeschlagenen Payment Intents aus den letzten 24 Stunden auf,
gruppiere sie nach Fehler-Grund und fasse die Top-3-Ursachen zusammen.
```

```
Generiere eine Revenue-Zusammenfassung für Q1 2026 — Total MRR, neue Subscriptions,
gechurnte Subscriptions und Net-Revenue-Änderung Month-over-Month.
```

```
Finde alle Kunden, die gerade im "Starter"-Plan sind und liste ihre
E-Mails, Subscription-Start-Daten und monatlichen Spend auf. Ich brauche das
für eine Plan-Migration-Kampagne.
```

## Authentifizierung

1. Gehe zu **dashboard.stripe.com → Developers → API keys**
2. Klicke auf **Create restricted key** (nicht den vollen Secret-Key)
3. Nenne es (z.B. `claude-code-readonly`) und erteile nur die Berechtigungen, die dein Workflow braucht:
   - Für Read-Only-Analyse: **Read** auf Customers, Products, Prices, Subscriptions, Invoices, Payment Intents, Charges, Balance
   - Für Produkt/Price-Erstellung: füge **Write** auf Products und Prices hinzu
4. Kopiere den Key (beginnt mit `sk_test_` für Test-Mode, `sk_live_` für Production)
5. Setze ihn als `STRIPE_SECRET_KEY` im Konfig oben

Verwende immer Test-Mode-Keys (`sk_test_`) in Development und lokaler Konfiguration. Verwende Live-Keys nur in Production-Deployments mit Env-Variablen, die zur Runtime injiziert werden — nie in committeter Konfiguration.

## Tipps

**Restricted Keys über Full Secret Keys:** Ein Restricted Key limitiert den Blast-Radius, wenn der Key exposed ist. Scope ihn auf die minimalen Berechtigungen, die dein Workflow tatsächlich nutzt und erteile Write-Zugang nur wenn nötig.

**Test vs Live Mode:** Keys, die mit `sk_test_` beginnen, operieren gegen deine Test-Daten. Keys, die mit `sk_live_` beginnen, berühren echte Kunden-Daten und echtes Geld. Halte diese strikt separat — verwende Test-Keys in all lokalen und CI-Konfiguration.

**Paginierung auf List-Endpoints:** Die meisten List-Endpoints geben maximal 100 Items pro Anruf zurück. Für große Datasets, verwende den `limit`-Parameter und `starting_after` mit der letzten Item-ID, um durch Ergebnisse zu paginieren. Claude handelt das automatisch, wenn du nach "all" Ergebnissen fragst.

**Webhook-Verifikation ist out of scope:** MCP kann Webhook-Signaturen nicht verifizieren — verwende die Stripe-CLI (`stripe listen`) oder das Dashboard für Webhook-Tests. MCP ist zum Abfragen und Verwalten von Daten, nicht zum Handeln eingehender Events.

**Metadata-Felder sind abfragbar:** Wenn deine Anwendung strukturierte Metadata zu Kunden oder Subscriptions schreibt (z.B. `plan_tier`, `internal_user_id`), sind jene Felder in `list_customers` und `list_subscriptions` filterbar — nützlich für gezielte Abfragen.

---
