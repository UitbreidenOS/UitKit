# MCP-Verbindungen & Integrationsleitfaden

## Übersicht

Sales Operations Stack integriert sich mit mehreren MCPs für Echtzeit-Pipeline-Daten, Analysen und Reporting.

---

## Schnelleinstieg

### Option 1: Salesforce

Ihre Salesforce-Organisation ist Ihre einzige verlässliche Quelle für Pipeline-Daten.

**Setup:** Folgen Sie der `salesforce.md` in diesem Verzeichnis.

**Was Sie erhalten:**
- Echtzeit-Abfragen von Opportunities
- Automatisches Activity-Logging zu Opportunities
- Deal-Daten in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quota-Tracking direkt aus dem CRM

### Option 2: HubSpot

Ihr HubSpot-Konto ist Ihre einzige verlässliche Quelle für Deals.

**Setup:** Folgen Sie der `hubspot.md` in diesem Verzeichnis.

**Was Sie erhalten:**
- Echtzeit-Deal-Abfragen
- Automatisches Activity-Logging zu Deals
- Deal-Daten in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quota-Tracking direkt aus dem CRM

---

## Welche Lösung sollten Sie wählen?

| Faktor | Salesforce | HubSpot |
|--------|-----------|---------|
| **Enterprise-Organisationen** | ✓ (Standardwahl) | ✓ (wachsende Option) |
| **Mittelstandsunternehmen** | ✓ (häufig) | ✓ (sehr häufig) |
| **Setup-Komplexität** | Mittel (OAuth) | Gering (API-Schlüssel) |
| **Benutzerdefinierte Felder** | Hochgradig anpassbar | Anpassbar |
| **Berichte** | Erweitertes Reporting-System | Gutes Reporting |
| **Preisgestaltung** | Normalerweise höher | Normalerweise niedriger |

**Entscheidung:** Fragen Sie Ihr Sales-/Revenue-Ops-Team, welches CRM Sie verwenden. Konfigurieren Sie dieses.

---

## Setup-Checkliste

- [ ] **CRM wählen:** Salesforce oder HubSpot?
- [ ] **Anmeldedaten abrufen:** API-Schlüssel oder OAuth (abhängig vom CRM)
- [ ] **Zu settings.json hinzufügen:** Kopieren Sie die Konfiguration aus der entsprechenden .md-Datei
- [ ] **Claude Code neu starten:** Damit der MCP-Server aktiviert wird
- [ ] **Verbindung testen:** Führen Sie `/pipeline-review` aus (sollte CRM-Tools in der Liste anzeigen)
- [ ] **Daten validieren:** Exportieren Sie ein kleines Pipeline-Beispiel und überprüfen Sie, ob Abfragen funktionieren

---

## Datenzugriffsberechtigung

### Salesforce

Stellen Sie sicher, dass Ihr API-Benutzer über folgende Berechtigungen verfügt:
- Lesezugriff auf das Opportunity-Objekt
- Lesezugriff auf das Account-Objekt
- Lesezugriff auf das Contact-Objekt (falls für Buying-Committee-Zuordnung verwendet)
- Schreibzugriff auf das Task-Objekt (für Activity-Logging)

### HubSpot

Stellen Sie sicher, dass Ihre private App folgende Scopes hat:
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.objects.contacts.read`
- `crm.objects.companies.read`

---

## Optional: Dual-CRM-Setup

Wenn Sie sowohl Salesforce als auch HubSpot verwenden (z. B. Salesforce für Enterprise, HubSpot für KMU-Pipeline):

```json
{
  "mcpServers": {
    "salesforce": { ... },
    "hubspot": { ... }
  }
}