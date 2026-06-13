# MCP: Stripe

Query Stripe-gegevens, beheer klanten, producten en abonnementen rechtstreeks vanuit Claude Code — zonder naar het Stripe-dashboard te schakelen of eenmalige scripts te schrijven.

## Waarom je dit nodig hebt

Stripe bevat de bedrijfskritieke datalaag: wie betaalt, waarvoor ze betalen en of betalingen slagen. Zonder MCP betekent toegang krijgen context-switching naar een dashboard of eenmalige scripts schrijven. Met Stripe MCP:
- Inkomstenvragen, churn-analyse en betalingsfout-onderzoeken draaien in de codesessie
- Product- en prijswijzigingen gebeuren zonder de terminal te verlaten
- Claude kan codewijzigingen correleren met echte facturingsgegevens — mismatches vangen voordat ze production bereiken
- Routineondersteuningstaken (klanten opzoeken, abonnementstatus controleren) duren seconden in plaats van minuten

## Installatie

```bash
npm install -g @stripe/mcp
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

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

Gebruik een beperkte sleutel die alleen op de resources is gericht die je workflow aanraakt. Gebruik nooit `sk_live_` in development-configuratie.

## Sleuteltools / Wat het doet

- `list_customers` — lijst klanten met optionele filters (e-mail, aanmaakdatumbereik, metagegevens)
- `get_customer` — haal een enkele klant op met volledig profiel en metagegevens
- `create_customer` — maak een nieuwe klant aan met naam, e-mail en metagegevens
- `list_products` — lijst alle producten met hun actieve/inactieve status
- `create_product` — maak een nieuw product aan met naam, beschrijving en metagegevens
- `list_prices` — lijst prijzen voor een product of in alle producten
- `create_price` — maak een nieuwe prijs (terugkerend of eenmalig) voor een product
- `list_subscriptions` — lijst abonnementen met filters (klant, status, prijs)
- `get_subscription` — haal een abonnement op met huidige periode, status en items
- `create_payment_link` — genereer een gehoste betalingslink voor een product/prijs
- `list_invoices` — lijst facturen met filters (klant, status, datumbereik)
- `retrieve_balance` — haal het huidige Stripe-accountsaldo op (beschikbaar en hangend)
- `list_charges` — lijst aanklachten met filters (klant, resultaat, datumbereik)
- `list_payment_intents` — lijst betalingsintentie met statusfilters (mislukt, geslaagd, verwerking)

## Gebruiksvoorbeelden

```
Toon me alle klanten die in de afgelopen 30 dagen zijn afgehaakt —
abonnementen die naar geannuleerde status zijn verplaatst. Voeg hun e-mail in,
plannaam en hoe lang ze waren geabonneerd.
```

```
Maak een nieuw product genaamd "Pro Plan" aan en voeg een terugkerende maandelijkse
prijs van $49 en een jaarlijkse prijs van $490 toe. Retourneer de prijs-ID's
zodat ik de frontend-configuratie kan bijwerken.
```

```
Lijst alle mislukte betalingsintentie uit de afgelopen 24 uur,
groepeer ze op mislukkingsreden en vat de top 3-oorzaken samen.
```

```
Genereer een inkomstensamenvatting voor Q1 2026 — totaal MRR, nieuwe abonnementen,
geannuleerde abonnementen en nettowijziging in inkomsten maand na maand.
```

```
Zoek alle klanten op het "Starter"-plan en list hun
e-mailadressen, abonnementsbegin-datums en maandelijkse uitgaven. Ik heb dit
nodig voor een plan-migratiecampagne.
```

## Verificatie

1. Ga naar **dashboard.stripe.com → Developers → API keys**
2. Klik op **Create restricted key** (niet de volledige secret key)
3. Geef het een naam (bijv. `claude-code-readonly`) en verleen alleen de machtigingen die je workflow nodig hebt:
   - Voor alleen-lezen analyse: **Read** op Customers, Products, Prices, Subscriptions, Invoices, Payment Intents, Charges, Balance
   - Voor product-/prijscreatie: voeg **Write** op Products en Prices toe
4. Kopieer de sleutel (begint met `sk_test_` voor testmodus, `sk_live_` voor production)
5. Stel deze in als `STRIPE_SECRET_KEY` in de config hierboven

Gebruik altijd testmodus-sleutels (`sk_test_`) in development en lokale configuratiebestanden. Gebruik alleen live-sleutels in production-implementaties met omgevingsvariabelen die bij runtime worden geïnjecteerd — nooit in gecommiteerde configuratie.

## Tips

**Beperkte sleutels boven volledige secret keys:** Een beperkte sleutel beperkt de impact-radius als de sleutel wordt blootgesteld. Beperk het tot de minimale machtigingen die je workflow werkelijk gebruikt en verleen geen schrijftoegang tenzij je gegevens moet maken of wijzigen.

**Testmodus versus live-modus:** Sleutels beginnend met `sk_test_` werken met je testgegevens. Sleutels beginnend met `sk_live_` raken echte klantgegevens en echt geld. Houd deze strikt gescheiden — gebruik testsleutels in alle lokale en CI-configuratie.

**Paginering op lijstendpunten:** De meeste lijstendpunten retourneren maximum 100 items per aanroep. Voor grote datasets, gebruik de `limit`-parameter en `starting_after` met de ID van het laatste item om resultaten door te bladeren. Claude zal dit automatisch verwerken als je om "alle" resultaten vraagt.

**Webhook-verificatie is buiten bereik:** MCP kan webhook-handtekeningen niet verifiëren — gebruik de Stripe CLI (`stripe listen`) of het dashboard voor webhook-testen. MCP is voor query- en beheersgegevens, niet voor het afhandelen van binnenkomende gebeurtenissen.

**Metagegevensvelden zijn querybaar:** Als je applicatie gestructureerde metagegevens naar klanten of abonnementen schrijft (bijv. `plan_tier`, `internal_user_id`), zijn die velden filterbaar in `list_customers` en `list_subscriptions` — handig voor gerichte queries.

---
