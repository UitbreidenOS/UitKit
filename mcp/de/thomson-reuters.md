# MCP : Thomson Reuters Westlaw & Practical Law

Thomson Reuters bietet einen offiziellen MCP-Server, der Claude Code direkten Zugriff auf Westlaw — die führende US-Datenbank für juristische Recherche — und Practical Law gibt, die Praxis-Leitfäden, Standard-Dokumente und Checklisten abdeckt. Benötigt ein aktives Westlaw-Abonnement. Sobald verbunden, kann Claude aktuelle Rechtsprechung, Statuten und Verordnungen abrufen, statt sich auf Trainingsdaten verlassen zu müssen, die auf seinem Wissensstichtag eingefroren sind.

## Warum Sie dies brauchen

Ohne TR MCP sind Claudes juristische Kenntnisse statisch. Damit:
- Suchen und rufen Sie aktuelle Rechtsprechung nach Gerichtsbarkeit, Gericht und Datumbereich ab
- Rufen Sie Statuten und Verordnungen in ihrer aktuellen, geltenden Form ab
- Greifen Sie auf Practical Law-Praxishinweise und Standard-Dokumentvorlagen zu
- Shepardize / KeyCite-Fälle, um zu bestätigen, dass sie immer noch gültiges Recht sind
- Generieren Sie Zitate im Bluebook-Format
- Beantworten Sie Fragen wie: "Ist diese Klausel im Jahr 2026 immer noch unter New York-Gesetz durchsetzbar?"

## Voraussetzungen

- Aktives Westlaw-Abonnement (individuell, Kanzlei oder Unternehmen)
- TR Developer API-Schlüssel — erhalten von `developer.thomsonreuters.com`
- API-Zugriff kann das Level legal.ai auf Ihrem TR-Konto erfordern; bestätigen Sie mit Ihrem Account-Vertreter vor der Konfiguration

## Konfiguration

Hinzufügen zu `~/.claude.json` oder zum Projekt `.claude/mcp.json`:

```json
{
  "mcpServers": {
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

Ersetzen Sie `@thomsonreuters/westlaw-mcp@latest` durch den genauen Paketnamen, der im TR Developer Portal aufgeführt ist — der Name oben ist illustrativ und kann sich vom veröffentlichten Paket unterscheiden.

## Was es bereitstellt

| Werkzeug | Was es tut |
|---|---|
| `search_cases` | Volltext-Rechtsprechungssuche mit Filtern für Gerichtsbarkeit, Gericht und Datum |
| `get_case` | Vollständige Fallmeinung nach Zitat abrufen |
| `shepardize` | Überprüfen Sie, ob ein Fall immer noch gültiges Recht ist via KeyCite |
| `search_statutes` | Suchen Sie bundesweit und staatlich Statuten nach Thema oder Zitat |
| `get_statute` | Rufen Sie einen Statutenabschnitt mit Anmerkungen ab |
| `search_regulations` | Suchen Sie in der CFR und den staatlichen Verwaltungscodes |
| `get_practical_law` | Rufen Sie Practical Law-Praxishinweise und Dokumentvorlagen ab |
| `search_secondary` | Suchen Sie in Law Reviews, Abhandlungen und Praxis-Leitfäden |
| `format_citation` | Generieren Sie ein Bluebook-formatiertes Zitat |

## Beispiel-Prompts

```
"Find Delaware Court of Chancery cases from 2022–2026 on director fiduciary duty in M&A transactions"

"Is the arbitration clause in this contract enforceable under 9 USC §2 and recent Second Circuit case law?"

"Get the Practical Law standard NDA for M&A with governing law set to New York"

"Shepardize Revlon v. MacAndrews and tell me if it is still good law"

"What are the current GDPR Article 17 obligations under EU regulation and has anything changed in 2025–2026?"
```

## Kosten

TR-API-Aufrufe werden von Ihrem Westlaw-API-Kontingent abgehoben, das von der Claude-Token-Nutzung getrennt ist. Überwachen Sie den Verbrauch unter `developer.thomsonreuters.com/usage`. Enterprise-Verträge enthalten typischerweise ein gebündeltes API-Level — bestätigen Sie Ihr Kontingent, bevor Sie Bulk-Recherche-Workflows ausführen.

## Mit iManage kombinieren

Die Kombination von Thomson Reuters MCP mit iManage DMS ermöglicht es Claude, Präzedenzfälle von Westlaw abzurufen und frühere Arbeitsergebnisse Ihrer Kanzlei zu diesem Thema aus dem iManage DMS abzurufen, dann ein Memo zu verfassen, das beide Quellen zitiert. Kombinierte Konfiguration:

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/mcp-server@latest"],
      "env": {
        "IMANAGE_SERVER": "https://your-firm.imanage.work",
        "IMANAGE_CLIENT_ID": "your-client-id",
        "IMANAGE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

Mit beiden aktiven Servern wird ein Prompt wie "Draft a memo on enforceability of MNDA liquidated damages clauses under NY law, citing relevant cases and any prior firm memos on the topic" von Westlaw für aktuelle Rechtsprechung und iManage für interne Präzedenzfälle gleichzeitig abrufen.
