# Live Artifacts — Data-Connected Interactive Outputs

Live Artifacts sind Claude-Ausgaben, die sich mit Live-Datenquellen verbinden und automatisch aktualisieren, wenn sie geöffnet werden. Anders als statische Artifacts — die einmal generiert und eingefroren sind — ziehen Live Artifacts zum Anzeigezeitpunkt Daten von APIs, MCP-Servern, Datenbanken und Tabellenkalkulationen ab, um aktuelle Daten zu zeigen.

---

## Was ein Artifact live macht

Ein Live Artifact unterscheidet sich von einem statischen Artifact auf eine grundlegende Weise: Es ruft Daten zum Öffnen ab, nicht zur Erstellungszeit.

- **Verbindung beim Öffnen**: Jedes Mal, wenn die Artifact-URL geöffnet wird, fragt es die konfigurierten Datenquellen ab
- **Automatische Aktualisierung beim Anzeigen**: Daten sind aktuell zum Zeitpunkt des Artifact-Renderns — nicht zum Zeitpunkt der ersten Erstellung
- **Persistiert in Cowork-Seitenleiste**: Live Artifacts werden gespeichert und neben anderen Artifacts aufgelistet; statische werden automatisch gelöscht, es sei denn, sie werden gepinnt
- **Shareable URL**: Jedes Live Artifact erhält eine stabile URL; die Zugriffskontrolle wird pro Artifact gesetzt
- **iframe einbettbar**: Fügen Sie das Einbettungssnippet in Notion, Confluence oder jedes Tool, das Iframes akzeptiert, ein

---

## Datenquellen-Typen

| Quellen-Typ | Wie Claude sich verbindet | Beispiel |
|---|---|---|
| MCP-Server | Alle verbundenen MCP-Tools sind als Datenquelle verfügbar | Postgres MCP → Live-Abfrageergebnisse |
| REST API | Beschreiben Sie den Endpoint; Claude generiert den Fetch-Aufruf | GitHub API → offene PR-Anzahl |
| Datenbank (via MCP) | SQL-Abfrage im Artifact eingebettet | Supabase → Benutzer-Metriken |
| Google Sheets / CSV | Via Google Drive Connector anfügen (Cowork) | Budget Tracker → Live-Chart |
| GitHub | Repository-Daten via GitHub API oder MCP | Commit-Aktivität, Issue-Zählungen |

Die Datenquelle muss zugänglich bleiben, damit sich das Artifact aktualisiert. Wenn ein MCP-Server offline geht oder ein API-Schlüssel abläuft, zeigt das Artifact das zuletzt zwischengespeicherte Ergebnis mit einer Warnung über veraltete Daten.

---

## Ein Live Artifact erstellen

Beschreiben Sie die gewünschte Ausgabe und referenzieren Sie explizit die Datenquelle in Ihrer Aufforderung. Claude generiert das Artifact und verkabelt die Datenverbindung.

**Beispiel einer einzelnen Quelle:**

```
"Create a live artifact showing the current open issue count by label 
from our GitHub repo (owner: acme, repo: api-service). 
Show as a bar chart, refresh on every open."
```

**Beispiel eines Multi-Source-Dashboards:**

```
"Create a live dashboard artifact with three panels:
1. Open PR count from GitHub (acme/api-service)
2. Current row count from the 'users' table via the Postgres MCP
3. Last 7 days of signups from the Google Sheet at [URL]

Refresh all three panels on open. Layout: horizontal, equal-width panels."
```

Claude generiert das Artifact, bettet die Daten-Abruf-Logik ein und registriert die Datenquellen-Verbindungen. Das Artifact erscheint sofort in Ihrer Seitenleiste.

---

## Freigeben und Einbetten

**Share-Link:**

Jedes Live Artifact hat einen Share-Button. Durch Klicken generiert es eine öffentliche URL (oder eine auf den Arbeitsbereich beschränkte URL für private Artifacts). Jeder, der den Link hat, sieht das Artifact mit Live-Daten, wenn er es öffnet — kein Claude-Konto erforderlich für öffentliche Artifacts.

**Iframe-Einbettung:**

```html
<!-- Fügen Sie in Notion, Confluence, Linear oder jedes iFrame-fähige Tool ein -->
<iframe
  src="https://claude.ai/artifacts/live/a1b2c3d4"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

**Zugriffskontrolle:**

| Zugriffsstufe | Wer kann anzeigen | Erforderlicher Plan |
|---|---|---|
| Öffentlich | Jeder mit dem Link | Pro+ |
| Arbeitsbereich | Mitglieder Ihres Claude-Teams | Team oder Enterprise |
| Privat | Nur Sie | Pro+ |

---

## Live Artifact vs. Statisches Artifact

| Eigenschaft | Live Artifact | Statisches Artifact |
|---|---|---|
| Datenfrist | Aktuell beim Öffnen | Snapshot zur Erstellungszeit |
| Persistenz | In Seitenleiste gespeichert | Automatisch gelöscht, es sei denn gepinnt |
| Freigabe | Stabile URL, teilbar | Copy/Paste-Inhalt nur |
| Datenquellen | APIs, MCP, Datenbanken, Sheets | Keine — nur generierte Inhalte |
| Erforderlicher Plan | Pro+ (Live-Verbindungen) | Alle Pläne |
| Refresh-Trigger | Beim Öffnen (+ optionales Intervall) | N/A |

---

## Einschränkungen

- Die zugrunde liegende Datenquelle muss zugänglich bleiben — Artifacts speichern zwischen Ansichten keinen vollständigen Daten-Cache
- Komplexe Multi-Source-Dashboards mit vielen Live-Abfragen laden langsamer als Single-Source-Artifacts
- Live-Datenverbindungen erfordern einen Pro oder höheren Plan; Free-Tier-Artifacts sind immer statisch
- Kein BI-Tool-Ersatz — keine Drill-Downs, gespeicherten Filter oder Zugriffskontrolle pro Datenfeld
- Iframe-Einbettung erfordert, dass das Host-Tool Drittanbieter-Iframes erlaubt (Notion und Confluence tun dies; einige Enterprise-Intranets blockieren sie)
- Google Sheets-Datenquelle erfordert, dass der Google Drive Connector in Cowork autorisiert wird

---
