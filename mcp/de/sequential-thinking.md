# MCP: Sequentielles Denken

Ein strukturierter, schrittweiser Reasoning-Server, der Claude zwingt, komplexe Probleme methodisch durchzudenken, bevor er antwortet, und die Fehlerquote bei mehrstufigen Aufgaben erheblich reduziert.

## Warum Sie dies brauchen

Das Standardverhalten von Claude bei schwierigen Problemen ist, sofort zu antworten, was zu selbstsicher klingendem, aber unvollständigem Reasoning führen kann. Sequentielles Denken ändert die Mechanik:
- Jeder Reasoning-Schritt ist explizit, nummeriert und baut auf dem vorherigen auf
- Das Modell kann frühere Schritte überarbeiten, wenn es einen Widerspruch entdeckt — das Reasoning ist nicht festgelegt
- Komplexe Architekturentscheidungen, Debugging-Ketten und Migrationspläne profitieren von dieser Einschränkung
- Die strukturierte Ausgabe ist überprüfbar — Sie können sehen, genau wo das Reasoning ging, und jeden Schritt in Frage stellen

## Installation

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

## Konfiguration

Fügen Sie zu `~/.claude.json` oder der Projektdatei `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

Keine Umgebungsvariablen oder API-Schlüssel erforderlich.

## Wichtigste Tools / Was es tut

**`sequentialThinking`** — das einzige Tool, das dieser Server bereitstellt. Er führt einen strukturierten Gedankenketten-Prozess durch.

Parameter:
- `thought` — der Inhalt des aktuellen Reasoning-Schritts
- `nextThoughtNeeded` — Boolean; `true`, wenn weitere Schritte erforderlich sind, `false`, wenn die Schlussfolgerung erreicht ist
- `thoughtNumber` — der aktuelle Schrittindex (1-basiert)
- `totalThoughts` — geschätzte Gesamtzahl der Schritte (kann während des Prozesses überarbeitet werden)
- `isRevision` — optionaler Boolean; kennzeichnet einen Schritt als Korrektur eines früheren
- `revisesThought` — optional; die Nummer des überarbeiteten Schritts

Der Server verwaltet die Kette und gibt das angesammelte Reasoning bei jedem Schritt zurück. Claude verwendet es intern, um Probleme durchzuarbeiten, bevor eine Antwort präsentiert wird.

## Verwendungsbeispiele

```
Verwenden Sie sequentielles Denken, um die Migration unseres Authentifizierungssystems
von JWT zu Session-basierten Token zu planen. Berücksichtigen Sie die Rollback-Strategie,
Session-Speicheroptionen und Rückwärtskompatibilität.
```

```
Denken Sie Schritt für Schritt: Sollte dieser Service ein separater Microservice
oder ein Modul im Monolithen sein? Berücksichtigen Sie Teamgröße, Deployment-Häufigkeit,
Datenkopplung und Fehler-Isolation.
```

```
Sequentielles Denken: Was sind alle Grenzfälle, die wir für den Payment-Webhook-Verarbeitungsfluss
berücksichtigen müssen? Schließen Sie Retry-Logik, Idempotenz, Teilfehler und Clock Skew ein.
```

```
Gehen Sie die Debugging-Schritte für diesen intermittierenden Testfehler durch,
der nur in CI auftritt. Beginnen Sie mit dem, was wir wissen, und überlegen Sie,
was zwischen lokalen und CI-Umgebungen anders sein könnte.
```

```
Verwenden Sie sequentielles Denken, um diese Datenbankschema-Änderung zu überprüfen
und jedes downstream-System zu identifizieren, das aktualisiert werden muss.
```

## Authentifizierung

Keine Authentifizierung erforderlich. Sequentielles Denken ist ein lokaler Prozess — es läuft vollständig auf Ihrem Rechner und führt keine externen API-Aufrufe durch. Die einzige Netzwerkaktivität in Ihrer Sitzung sind Claudes normale API-Aufrufe.

## Tipps

**Beste Anwendungsfälle:** Architekturentscheidungen, komplexes Debugging, Migrationsplanung, Risikoanalyse und alle Aufgaben, bei denen „Was übersehe ich?" ein echtes Problem darstellt. Die strukturierte Ausgabe macht es einfach, Lücken zu erkennen.

**Paares mit explizitem Prompting:** Kombinieren Sie mit Ausdrücken wie „Denken Sie Schritt für Schritt nach, bevor Sie antworten" oder „Berücksichtigen Sie alle Grenzfälle" für maximale Wirkung. Der Server erzwingt Struktur; Ihr Prompt leitet, worüber nachzudenken ist.

**Latenz-Tradeoff:** Sequentielles Denken addiert 2–5 Sekunden pro Reasoning-Kette, je nach Komplexität. Reservieren Sie es für Probleme, bei denen Genauigkeit wichtiger ist als Geschwindigkeit — verwenden Sie es nicht für einfache Nachschlagvorgänge oder einstufige Aufgaben.

**Revisionsschritte sind wertvoll:** Wenn Claude einen Schritt als Revision kennzeichnet, achten Sie genau hin. Das bedeutet, dass das Reasoning einen Fehler oder Widerspruch mid-chain entdeckt hat. Dies sind oft die wichtigsten Erkenntnisse.

**Lesbare Ausgabe:** Bitten Sie Claude, die endgültige Reasoning-Kette als nummerierte Liste nach Abschluss des Tools zu präsentieren. Die rohe Tool-Ausgabe ist strukturiertes JSON — die reformatierte Version ist einfacher zu überprüfen und zu teilen.

**Kein Ersatz für Domänenwissen:** Sequentielles Denken verbessert die Struktur und Vollständigkeit des Reasonings. Es addiert keine Informationen, die Claude nicht hat. Wenn das Problem aktuelle externe Daten benötigt, kombinieren Sie es mit Web-Suche oder Abruf-Tools.

---
