# MCP Verbindingen & Integratiegids

## Overzicht

Sales Operations Stack integreert met meerdere MCP's voor real-time pipelinedata, analyses en rapportage.

---

## Snelle start

### Optie 1: Salesforce

Uw Salesforce-organisatie is uw single source of truth voor de pipeline.

**Setup:** Volg `salesforce.md` in deze map.

**Wat u krijgt:**
- Real-time opportunity-queries
- Automatische activiteitenregistratie naar opportunities
- Deal-gegevens in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quotatracking rechtstreeks vanuit CRM

### Optie 2: HubSpot

Uw HubSpot-account is uw single source of truth voor deals.

**Setup:** Volg `hubspot.md` in deze map.

**Wat u krijgt:**
- Real-time deal-queries
- Automatische activiteitenregistratie naar deals
- Deal-gegevens in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quotatracking rechtstreeks vanuit CRM

---

## Welke moet u kiezen?

| Factor | Salesforce | HubSpot |
|--------|-----------|---------|
| **Enterprise-organisaties** | ✓ (standaardkeuze) | ✓ (groeiende optie) |
| **Middelgrote markt** | ✓ (gebruikelijk) | ✓ (zeer gebruikelijk) |
| **Setup-complexiteit** | Gemiddeld (OAuth) | Laag (API-sleutel) |
| **Aangepaste velden** | Zeer aanpasbaar | Aanpasbaar |
| **Rapporten** | Geavanceerde rapportagemotor | Goed rapportage |
| **Pricing** | Meestal hoger | Meestal lager |

**Besluit:** Vraag uw sales/rev-ops-team welke CRM u gebruikt. Configureer die ene.

---

## Setup-checklist

- [ ] **Kies CRM:** Salesforce of HubSpot?
- [ ] **Haal credentials op:** API-sleutel of OAuth (afhankelijk van CRM)
- [ ] **Voeg toe aan settings.json:** Kopieer config uit toepasselijk .md-bestand
- [ ] **Herstart Claude Code:** Voor activering van MCP-server
- [ ] **Test verbinding:** Voer `/pipeline-review` uit (moet CRM-tools in lijst tonen)
- [ ] **Valideer gegevens:** Exporteer klein pipelinevoorbeeld en verifieer dat queries werken

---

## Gegevensrechten

### Salesforce

Zorg ervoor dat uw API-gebruiker het volgende heeft:
- Leestoegang tot Opportunity-object
- Leestoegang tot Account-object
- Leestoegang tot Contact-object (als gebruikt voor toewijzing van inkoopcommissie)
- Schrijftoegang tot Task-object (voor activiteitenregistratie)

### HubSpot

Zorg ervoor dat uw privé-app de volgende scopes heeft:
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.objects.contacts.read`
- `crm.objects.companies.read`

---

## Optioneel: Dual CRM-setup

Als u zowel Salesforce als HubSpot gebruikt (bijvoorbeeld Salesforce voor enterprise, HubSpot voor SMB-pipeline):

```json
{
  "mcpServers": {
    "salesforce": { ... },
    "hubspot": { ... }
  }
}