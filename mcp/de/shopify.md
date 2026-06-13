# MCP: Shopify-AI-Toolkit

Verwalte einen Shopify-Store von Claude Code aus — frage Produkte, Bestellungen, Kunden und Analytics ab und verwalte Metafields, ohne das Dashboard zu öffnen.

## Warum du das brauchst

Store-Operationen, die normalerweise die Shopify-Admin-UI oder Custom-Skripte erfordern — Bulk-Produkt-Updates, Bestellungs-Abfragen, Analytics-Pulls, Collection-Verwaltung — werden zu einzelnen konversationalen Anfragen. Claude kann echte Store-Daten lesen, auf sie handeln und Operationen verketten: finde Low-Inventory-Produkte → aktualisiere Beschreibungen → füge zu einer Sale-Collection hinzu, alles in einer Session.

## Installation

```bash
npx -y @shopify/ai-toolkit-mcp
```

Das Paket läuft auf Anfrage via `npx` — keine globale Installation erforderlich.

## Konfiguration

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/ai-toolkit-mcp"],
      "env": {
        "SHOPIFY_STORE_URL": "your-store.myshopify.com",
        "SHOPIFY_ADMIN_TOKEN": "shpat_..."
      }
    }
  }
}
```

`SHOPIFY_STORE_URL` muss deine `.myshopify.com`-Subdomain sein — nicht eine Custom-Domain. `SHOPIFY_ADMIN_TOKEN` ist dein Custom-App-Admin-API-Zugriffs-Token (siehe Authentifizierung).

## Schlüssel-Tools

| Tool | Was es tut |
|---|---|
| `list_products` | Frage Produkte mit Filtern ab (Status, Inventory, Tags, Vendor) |
| `get_product` | Komplette Produkt-Details inkl. Variants, Metafields und Images |
| `create_product` | Erstelle ein neues Produkt mit Variants und Pricing |
| `update_product` | Aktualisiere Titel, Beschreibung, Preis, Tags oder Status |
| `list_orders` | Frage Bestellungen mit Filtern ab (Date Range, Value, Fulfillment Status) |
| `get_order` | Komplette Bestellungs-Details inkl. Line Items, Kunde und Fulfillment |
| `list_customers` | Frage Kunden nach Kauf-Geschichte, Tags oder Standort ab |
| `get_customer` | Kunden-Profil inkl. Bestellungs-Verlauf und Lifetime Value |
| `get_analytics` | Revenue-, Session- und Konversions-Daten nach Date Range und Breakdown |
| `list_collections` | Liste alle Smart und Custom Collections auf |
| `add_to_collection` | Füge ein oder mehrere Produkte zu einer Collection hinzu |
| `list_metafields` | Liste Metafields auf einem Produkt, Variant oder Kunden auf |
| `update_metafield` | Schreibe einen Metafield-Wert |

## Verwendungsbeispiele

```
Liste alle Produkte mit Inventory unter 5 Units auf

Zeige mir Bestellungen aus den letzten 7 Tagen über $200

Aktualisiere die Beschreibung für SKU SHIRT-BLK-L

Füge alle Produkte mit Tag 'summer-sale' zur Summer-Collection hinzu

Wie sah der Revenue nach Produkt-Typ letzten Monat aus?

Finde Kunden, die Produkt X gekauft haben, aber nicht Produkt Y

Liste alle aktiven Discount-Codes und ihre Nutzungs-Zähler auf
```

## Authentifizierung

1. In deinem Shopify-Admin gehe zu **Settings → Apps → Develop apps**
2. Klicke auf **Create an app** und gib ihm einen Namen (z.B. `claude-mcp`)
3. Unter **Configuration → Admin API integration**, aktiviere diese Access-Scopes:
   - `read_products`, `write_products`
   - `read_orders`
   - `read_customers`
   - `read_analytics`
4. Klicke auf **Install app** — Shopify generiert das Admin-API-Zugriffs-Token
5. Kopiere das Token (wird einmal angezeigt) und verwende es als `SHOPIFY_ADMIN_TOKEN`

Für Read-only-Analytics und Reporting, lass `write_products` aus der Scope-Liste weg.

## Tipps

- Store-URL muss die `.myshopify.com`-Domain sein — Custom-Domains werden nicht in der Env-Var akzeptiert.
- Standard-Plan Rate Limit: 2 Requests/Sekunde. Shopify Plus: 4 Requests/Sekunde. Bulk-Operationen werden vom Toolkit automatisch gehändelt.
- Metafields sind das am meisten unterschätzte Feature via MCP — Claude kann Custom-Attribute auf jeder Ressource lesen und schreiben, was CMS-artige Daten-Verwaltung ohne ein Headless-CMS ermöglicht.
- `get_analytics` gibt Daten in derselben Struktur wie die Shopify-Analytics-API zurück — spezifiziere `date_preset` (`today`, `last_7_days`, `last_30_days`) oder einen expliziten Date Range.
- Für große Produkt-Kataloge, filtere `list_products` nach `status=active` und `vendor`, um Ergebnis-Sätze handhabbar zu halten, bevor du Operationen verkettestt.

---
