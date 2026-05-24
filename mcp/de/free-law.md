# MCP : Free Law Project (CourtListener)

Der CourtListener MCP des Free Law Project bietet kostenlos frei zugängliche US-Gerichtsurteile, Dockettendaten und Richter-Profile. Kein Abonnement erforderlich. Die Abdeckung umfasst Urteile von Bundesdistriktgericht, Berufungsgericht und Obersten Gerichtshof aus PACER und direkten Gerichtsströmen sowie viele Staatsgerichte. Die Datenbank enthält derzeit über 8,4 Millionen Urteile und wird kontinuierlich aktualisiert, wenn neue Entscheidungen veröffentlicht werden.

## Warum Sie dies brauchen

- 8,4 Millionen+ Gerichtsurteile, kostenlos zugänglich ohne Pro-Dokument-Gebühr
- Urteile von Bundesdistriktgericht, Berufungsgericht und Obersten Gerichtshof aus Jahrzehnten
- PACER-Docketndaten — vollständige Einreichungshistorien für aktive und geschlossene Bundesfälle
- Richter-Profile einschließlich Ernennungsgeschichte und Befangenheitsaufzeichnungen
- Mündliche Argumentaudio und Transkripte für Fälle, wo verfügbar
- Echtzeit-Feeds für neue Einreichungen und Entscheidungen

## Installation

```bash
npm install -g @freelawproject/courtlistener-mcp
```

Oder verwenden Sie direkt den Remote-SSE-Endpoint in Ihrer Konfiguration — keine lokale Installation erforderlich (siehe Konfiguration unten).

## Konfiguration

**Lokal (npx) :**

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    }
  }
}
```

API-Schlüssel: kostenlose Registrierung auf `courtlistener.com/sign-in/`. Der anonyme Zugriff funktioniert, ist aber Rate-limitiert. Ein kostenloses Konto erhöht das Limit erheblich und ist für die meisten Forschungs-Workflows ausreichend.

## Was es bereitstellt

| Werkzeug | Was es tut |
|---|---|
| `search_opinions` | Volltext-Suche über alle Gerichtsurteile mit Filtern |
| `get_opinion` | Rufen Sie vollständigen Urteilstext nach ID oder Zitat ab |
| `search_dockets` | Suchen Sie PACER-Dockets nach Fallname, Nummer oder Gericht |
| `get_docket` | Vollständiger Docket mit allen Einreichungseinträgen und Dokumentlinks |
| `get_judge` | Richter-Profil, Ernennungsgeschichte und Befangenheitsaufzeichnung |
| `search_oral_arguments` | Suchen Sie Audio und Transkripte mündlicher Argumente |
| `get_court_info` | Gerichtsmetadaten und Gerichtsbarkeitsdetails |
| `cite_count` | Wie oft ein Fall in späteren Urteilen zitiert wurde |

## Beispiel-Prompts

```
"Find all Second Circuit opinions on fair use in software copyright from 2018–2026"

"Get the docket for Oracle v. Google in the Federal Circuit"

"Who are the current district court judges in SDNY and when were they appointed?"

"How many times has Campbell v. Acuff-Rose been cited in circuit court opinions?"

"Find recent EDVA opinions on preliminary injunctions in trade secret cases"
```

## Mit Westlaw kombinieren

Für ernsthafte juristische Recherche betreiben Sie beide Server zusammen: CourtListener für kostenlose breite Suche und Zitatzählung, Westlaw MCP für Volltext-Abruf, Shepardisierung, Statuten und Practical Law-Dokumente. Kombinierte Konfiguration:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    },
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Workflow: verwenden Sie `search_opinions` auf CourtListener, um über einen großen Datumsbereich kostenlos relevante Fälle zu identifizieren, dann verwenden Sie `get_case` und `shepardize` auf Westlaw, um Volltext abzurufen und aktuelle Gültigkeit für die Fälle zu überprüfen, die wichtig sind.

## Datenschutz

Alle von CourtListener bereitgestellten Daten sind öffentliche Aufzeichnungen. Es gibt keine Anwaltsprivilegienbedenken für Forschungsabfragen. PACER-Docketndaten sind öffentlich, aber vollständige Dokumentdownloads für noch nicht in CourtListeners Cache vorhandene Elemente verursachen Standard-PACER-Pro-Seite-Gebühren (derzeit 0,10 $/Seite, begrenzt auf 3,00 $ pro Dokument). Urteile, die CourtListener bereits abgerufen und indexiert hat, werden kostenlos aus seinem eigenen Speicher bereitgestellt.
