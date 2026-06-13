# MCP: Meta Ads

Verwalte Facebook- und Instagram-Ad-Kampagnen von Claude Code aus — erstelle Kampagnen, optimiere Audiences, analysiere A/B-Tests und handele basierend auf Performance-Daten, ohne Ads Manager zu öffnen.

## Warum du das brauchst

Ads Manager ist für menschliche Navigation gemacht, nicht für programmgesteuerte Analyse. Performance-Daten herausholen, unterlastete Ad-Sets finden und Bulk-Änderungen vornehmen erfordern wiederholte UI-Arbeit. Das Meta MCP setzt denen deinen kompletten Kampagnen-Baum — Kampagnen, Ad-Sets, Ads, Audiences und Insights — in Claudes Kontext, sodass du in klarer Sprache analysieren und handeln kannst.

## Installation

```bash
npx -y @meta/mcp-server-ads
```

Läuft auf Anfrage via `npx` — keine globale Installation erforderlich.

## Konfiguration

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@meta/mcp-server-ads"],
      "env": {
        "META_ACCESS_TOKEN": "your-system-user-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXXX"
      }
    }
  }
}
```

`META_AD_ACCOUNT_ID` beginnt immer mit `act_`. Finde es in Meta Business Manager unter **Business Settings → Ad Accounts**.

## Schlüssel-Tools

| Tool | Was es tut |
|---|---|
| `list_campaigns` | Liste alle Kampagnen mit Status, Objective und Spend auf |
| `get_campaign` | Komplette Kampagnen-Details inkl. Budget, Schedule und Performance |
| `create_campaign` | Erstelle eine neue Kampagne mit Objective und Budget |
| `update_campaign` | Aktualisiere Budget, Status, Schedule oder Bid-Strategie |
| `list_ad_sets` | Liste Ad-Sets mit Targeting, Placement und Delivery-Status auf |
| `create_ad_set` | Erstelle ein Ad-Set mit Audience- und Placement-Konfiguration |
| `list_ads` | Liste einzelne Ads mit Creative-Previews und Metriken auf |
| `create_ad` | Erstelle eine Ad mit Creative und Copy |
| `get_insights` | Hole Performance-Metriken mit Breakdowns und Date-Ranges |
| `list_audiences` | Liste Saved-, Custom- und Lookalike-Audiences auf |
| `create_custom_audience` | Baue eine Custom-Audience aus einer Customer-Liste oder Pixel-Events |
| `create_lookalike_audience` | Generiere eine Lookalike aus einer Seed-Audience |
| `get_ab_test_results` | Rufe A/B-Test-statistische Ergebnisse und die gewinnende Variante ab |

## Verwendungsbeispiele

```
Zeige alle aktiven Kampagnen mit Spend gegen Budget für diesen Monat

Welches Ad-Creative hatte die beste CTR diese Woche?

Erstelle eine Lookalike-Audience aus unseren Top-5%-Käufern

Pausiere alle Ad-Sets mit CPA über $40

Vergleiche Performance der zwei Varianten in A/B-Test #12345

Hole eine Aufschlüsselung des Spends nach Altersgruppe und Placement für die Retargeting-Kampagne

Welche Kampagnen sind unterlastig relativ zu ihrem täglichen Budget?
```

## Authentifizierung

1. In Meta Business Manager gehe zu **Business Settings → System Users**
2. Erstelle einen neuen System User (oder verwende einen bestehenden Admin System User)
3. Klicke auf **Generate New Token** und wähle das Ad Account, das du verwalten möchtest
4. Aktiviere diese Berechtigungen: `ads_management`, `ads_read`, `business_management`
5. Kopiere das Token und setze es als `META_ACCESS_TOKEN`
6. Finde deine Ad Account ID unter **Business Settings → Ad Accounts** — sie beginnt mit `act_`

System User Tokens verfallen nicht in einem 60-Tage-Zyklus wie User Tokens — verwende sie für persistenten MCP-Zugang.

## Tipps

- Verwende `get_insights` mit `breakdowns=["age","placement","device"]` für körnige Performance-Segmentierung in einem einzelnen Anruf.
- System User Tokens haben höhere Rate Limits als persönliche User Tokens und verfallen nicht — wähle sie immer für API-Zugang.
- Spezifiziere immer `date_preset` oder einen expliziten `time_range` auf Insights-Aufrufen — das Standard-Lookback-Fenster ist nur 7 Tage und kann Trends nicht aufdecken.
- Meta Ads MCP wurde im April 2026 als Teil von Metas offiziellem Developer MCP-Programm gestartet.
- `create_lookalike_audience` erfordert eine Seed-Audience von mindestens 100 Personen. Lookalikes brauchen 1-2 Stunden zum Füllen, bevor sie in Ad-Sets verwendet können.
- Um zu vermeiden, dass du während des Testens zu viel ausgibst, setze `status=PAUSED` beim Erstellen von Kampagnen via MCP — aktiviere sie manuell nach dem Überprüfen des Setups.

---
