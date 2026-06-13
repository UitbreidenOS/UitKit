# Programmatic Tool Calling (PTC)

## Wann aktivieren
Der Nutzer möchte die API-Token-Nutzung für Tool-schwere Workflows reduzieren, erwähnt programmatisches Tool-Calling, oder hat ein Muster, bei dem das gleiche Tool mehr als 3 Mal in einem einzigen Inferenz-Durchgang aufgerufen wird.

## Wann NICHT verwenden
- Tools mit Nebenwirkungen, die zwischen Aufrufen eine menschliche Überprüfung benötigen (write, delete, deploy)
- Tools, die eine Neuauthentifizierung Pro-Call oder mit Pro-Call-Autorisierungs-Prompts erfordern
- Einzelne Tool-Aufrufe — PTC-Overhead lohnt sich nicht unter ~3 Aufrufen
- Nicht-Python-Ausführungsumgebungen — PTC-Sandbox ist nur Python

## Anweisungen

### Was PTC tut
Standard-Tool-Use: Claude ruft ein Tool auf → Ergebnis zurückgegeben → Claude ruft das nächste Tool auf. Jede Round Trip ist ein Inferenz-Durchgang durch die API.

Mit PTC: Claude schreibt Python-Orchestrierungscode, der mehrere Tools in einer Schleife aufruft, führt es in einer Sandbox aus, und nur der endgültige stdout gelangt in den Kontext. Drei Tools = 1 Inferenz-Durchgang statt 3.

**Gemessene Token-Reduktion: ~37% weniger Tokens für Multi-Tool-Workflows.**

### Aktivieren von PTC
Fügen Sie `code_execution_20250825` als zulässiger Aufrufer in Ihrer Tool-Definition hinzu:
```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the filesystem",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path to read"},
            },
            "required": ["path"],
        },
        "allowed_callers": ["code_execution_20250825"],  # Enable PTC for this tool
    }
]
```

Wenn PTC aktiviert ist, kann Claude wählen, Orchestrierungscode zu schreiben, statt das Tool direkt aufzurufen.

### Execution Sandbox
- Nur Python
- Standardmäßig kein Dateisystem-Zugriff (es sei denn, das Tool selbst stellt ihn zur Verfügung)
- Begrenzte Standard-Library — keine Netzwerk-Aufrufe aus Sandbox-Code
- Tool-Ergebnisse werden als Python-Objekte zum Sandbox-Code zurückgegeben
- Nur stdout aus der Sandbox betritt den Kontext

### Wenn Claude PTC automatisch verwendet
Claude wählt PTC, wenn es ein Muster erkennt, das von Batching profitiert:
- Lesen von N Dateien und Extrahieren eines Feldes aus jeder
- Ausführen derselben Transformation auf einer Liste von Eingaben
- Aggregieren von Ergebnissen mehrerer Tool-Aufrufe, bevor eine Antwort erfolgt
- Jede Schleife, in der ein Tool mit unterschiedlichen Parametern pro Iteration aufgerufen wird

### Wenn Sie PTC erzwingen möchten (Prompt Engineering)
Wenn Claude PTC nicht für ein Muster verwendet, das eindeutig davon profitiert, fügen Sie zum Systemprompt hinzu:
```
When you need to call the same tool multiple times with different inputs, write Python orchestration code using code_execution_20250825 to batch the calls rather than calling the tool individually each time.
```

### Tool-Design für PTC-Kompatibilität
Tools, die mit PTC verwendet werden, sollten:
- Einfache, serialisierbare Eingaben akzeptieren (Strings, Zahlen, Listen)
- Saubere, analysierbare Ausgabe zurückgeben (bevorzugen JSON gegenüber freiem Text)
- Idempotent sein (Lesevorgänge, Lookups) statt stateful (Schreibvorgänge, Mutationen)
- Keine interaktive Bestätigung erfordern

### Kombinieren von PTC mit Prompt Caching
Für maximale Token-Effizienz: Cache die Tool-Definitionen (die groß sein können) mit `cache_control`, und aktivieren Sie PTC, um die Anzahl der Round Trips zu reduzieren:
```python
tools = [
    # ... your tools ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"],
        "cache_control": {"type": "ephemeral"},  # Cache all tools up to here
    }
]
```

### Beschränkungen
- PTC kann keine Tools aufrufen, die menschliche Genehmigung während der Ausführung erfordern
- Die Sandbox hat ein Timeout — sehr lange Schleifen können abgebrochen werden
- Tools, die binäre Daten zurückgeben (Bilder, Dateien), sind nicht geeignet für PTC-Orchestrierung
- Das Debugging ist schwieriger — der Code und Zwischenergebnisse sind nicht im Hauptkontext sichtbar

## Beispiel

Extrahieren von Funktionssignaturen aus 20 Quelldateien ohne PTC: 20 `read_file`-Tool-Aufrufe, 20 Round Trips, ~40.000 Tokens Tool-Call + Ergebnis-Overhead.

Mit PTC aktiviert auf `read_file`:

Claude schreibt (intern, in Sandbox):
```python
files = [
    "src/api/users.ts", "src/api/orders.ts", "src/api/products.ts",
    # ... 17 more
]
signatures = []
for f in files:
    content = read_file(path=f)
    # Extract export function lines
    sigs = [line.strip() for line in content.split("\n") if line.startswith("export function")]
    signatures.extend(sigs)
print("\n".join(signatures))
```

Ein Inferenz-Durchgang. Nur die extrahierten Signaturen (nicht vollständige Dateiinhalte) betreffen den Kontext. Token-Reduktion: 37% in diesem Workflow.

---
