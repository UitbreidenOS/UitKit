# Logging-Regeln

Anwenden beim Hinzufügen, Überprüfen oder Konfigurieren von Anwendungsprotokollen.

## Struktur

- Strukturierte JSON-Logs ausgeben — niemals freie Textstrings in der Produktion
- Jede Protokollzeile muss enthalten: `timestamp` (ISO 8601 UTC), `level`, `service`, `message`
- Füge `trace_id` und `span_id` auf jeder Protokollzeile hinzu zur Korrelation der verteilten Verfolgung
- Protokolliere die `request_id` auf jeder Zeile, die während des HTTP-Request-Lebenszyklus emittiert wird
- Verwende konsistente Feldnamen über Services hinweg — vereinbare ein Schema einmal und erzwinge es

## Ebenen

| Ebene | Verwendung für |
|---|---|
| `ERROR` | Eine Operation ist fehlgeschlagen; menschliche Aufmerksamkeit kann erforderlich sein |
| `WARN` | Unerwarteter Zustand, aber die Operation ist fortgesetzt; wert, überwacht zu werden |
| `INFO` | Normale bedeutende Ereignisse: Service gestartet, Job abgeschlossen, Benutzer authentifiziert |
| `DEBUG` | Entwickler-Diagnosen — standardmäßig in der Produktion deaktiviert |

- Verwende niemals `ERROR` für erwartete geschäftliche Fehler (ungültige Eingabe, nicht gefunden) — verwende `WARN` oder `INFO`
- Verwende niemals `INFO` für Pro-Request-Rauschen auf hochfrequenten Endpunkten — verwende `DEBUG`

## Inhalt

- Protokolliere, was passiert ist, warum es wichtig ist, und welche Identifikatoren zur Untersuchung benötigt werden
- Füge die vollständige Fehlermeldung und Stack-Trace auf `ERROR`-Zeilen ein
- Protokolliere niemals Geheimnisse, Token, Passwörter, Kreditkartennummern oder Raw-PII
- Maskiere oder weglassen `Authorization`-Header, Cookie-Werte und Query-Parameter mit Anmeldedaten
- Protokolliere keine Request-Bodies, es sei denn, es ist für das Debuggen notwendig, und entferne auch dann sensible Felder

## Volumen und Kosten

- Sample `DEBUG` und hochfrequente `INFO`-Logs in der Produktion — protokolliere 1 von N, nicht jedes Ereignis
- Legen Sie die Protokoll-Aufbewahrung nach Ebene fest: Fehler 90 Tage, Info 30 Tage, Debug 7 Tage (passen Sie nach Kosten und Compliance-Anforderungen an)
- Füge `slow_query` und `high_latency` Marker hinzu, statt jede Request mit voller Ausführlichkeit zu protokollieren
- Zentralisiere Logs auf einer Plattform — fragmentierte Logs über Services hinweg sind während Zwischenfällen unbrauchbar

## Betriebliche Anforderungen

- Logs müssen innerhalb von Sekunden nach der Emission abfragbar sein — verwende einen strukturierten Log-Aggregator (Loki, CloudWatch Logs Insights, Datadog)
- Warnung bei `ERROR`-Rate-Spitzen, nicht nur bei einzelnen Fehlern
- Trenne Anwendungs-Logs von Access-Logs — Access-Logs haben unterschiedliche Aufbewahrung und PII-Regeln
- Schreibe Logs niemals nur auf die lokale Festplatte in einer containerisierten Umgebung — sie gehen beim Neustart verloren
