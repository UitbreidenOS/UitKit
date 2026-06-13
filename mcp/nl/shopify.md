# MCP: Shopify AI Toolkit

Beheer een Shopify-winkel vanuit Claude Code — query-producten, -bestellingen, -klanten, -analytica en -metavelden zonder het dashboard te openen.

## Waarom je dit nodig hebt

Winkelbewerkingen die normaal gesproken de Shopify-beheer-UI of aangepaste scripts vereisen — bulkproductupdates, order-queries, analytics-pulls, collectiebeheer — worden eenmalige gespreksverzoeken. Claude kan echte winkelgegevens lezen, er op handelen en bewerkingen ketenen: zoek producten met lage inventaris → werk beschrijvingen bij → voeg toe aan een verkoopverzameling, alles in één sessie.

## Installatie

```bash
npx -y @shopify/ai-toolkit-mcp
```

Het pakket draait on-demand via `npx` — geen globale installatie vereist.

## Configuratie

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

`SHOPIFY_STORE_URL` moet je `.myshopify.com`-subdomein zijn — niet een aangepast domein. `SHOPIFY_ADMIN_TOKEN` is je aangepast app Admin API-toegangstoken (zie Verificatie).

## Sleuteltools

| Tool | Wat het doet |
|---|---|
| `list_products` | Query-producten met filters (status, inventaris, tags, leverancier) |
| `get_product` | Volledige productdetails inclusief varianten, metavelden en afbeeldingen |
| `create_product` | Maak een nieuw product aan met varianten en prijzen |
| `update_product` | Werk titel, beschrijving, prijs, tags of status bij |
| `list_orders` | Query-orders met filters (datumbereik, waarde, vervullingsstatus) |
| `get_order` | Volledige orderdetails inclusief regelitems, klant en vervulling |
| `list_customers` | Query-klanten op aankoopsgeschiedenis, tags of locatie |
| `get_customer` | Klantprofiel inclusief ordergeschiedenis en levensduurwaarde |
| `get_analytics` | Inkomsten-, sessie- en conversiegegevens op datumbereik en opsplitsing |
| `list_collections` | Lijst alle slimme en aangepaste verzamelingen |
| `add_to_collection` | Voeg een of meer producten toe aan een verzameling |
| `list_metafields` | Lijst metavelden op een product, variant of klant |
| `update_metafield` | Schrijf een metaveld-waarde |

## Gebruiksvoorbeelden

```
Lijst alle producten met inventaris onder de 5 eenheden

Toon me bestellingen van de afgelopen 7 dagen over $200

Werk de beschrijving bij voor SKU SHIRT-BLK-L

Voeg alle producten getagd 'summer-sale' toe aan de Summer Collection

Wat was de inkomsten per producttype vorige maand?

Zoek klanten die Product X hebben gekocht maar niet Product Y

Lijst alle actieve discountcodes en hun gebruikstellingen
```

## Verificatie

1. Ga in je Shopify-beheer naar **Instellingen → Apps → Develop apps**
2. Klik op **Create an app** en geef het een naam (bijv. `claude-mcp`)
3. Onder **Configuration → Admin API integration**, schakel je deze toegangsbereiken in:
   - `read_products`, `write_products`
   - `read_orders`
   - `read_customers`
   - `read_analytics`
4. Klik op **Install app** — Shopify genereert de Admin API-toegangstoken
5. Kopieer het token (weergegeven eenmaal) en gebruik het als `SHOPIFY_ADMIN_TOKEN`

Voor alleen-lezen analytics en rapportage, laat je `write_products` weg uit de bereiklijst.

## Tips

- Winkel-URL moet het `.myshopify.com`-domein zijn — aangepaste domeinen worden niet geaccepteerd in de omgevingsvariabele.
- Standaard plan-tarieflimiet: 2 aanvragen/seconde. Shopify Plus: 4 aanvragen/seconde. Bulkbewerkingen worden automatisch afgehandeld door de toolkit.
- Metavelden zijn de meest ondergebruikte feature via MCP — Claude kan aangepaste kenmerken op elke resource lezen en schrijven, waardoor CMS-achtige gegevensbeheer mogelijk is zonder headless CMS.
- `get_analytics` retourneert gegevens in dezelfde structuur als de Shopify Analytics-API — specificeer `date_preset` (`today`, `last_7_days`, `last_30_days`) of een expliciet datumbereik.
- Filter voor grote productcatalogi `list_products` op `status=active` en `vendor` om resultaatsets beheersbaar te houden voordat je bewerkingen koppelt.

---
