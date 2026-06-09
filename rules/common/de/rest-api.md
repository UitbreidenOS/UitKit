# REST API Regeln

Anwenden beim Erstellen oder Verbrauchen von HTTP/REST-Diensten.

## Anfrage-Design

- `Content-Type: application/json` standardmäßig akzeptieren; `application/x-www-form-urlencoded` nur bei Bedarf unterstützen (OAuth, Formulare)
- `Accept`-Header korrekt behandeln — `406` zurückgeben, wenn der angeforderte Medientyp nicht erfüllbar ist
- Abfrageparameter streng analysieren und validieren; unbekannte Parameter mit `400` ablehnen, anstatt sie zu ignorieren
- `If-Match` / `ETag` für optimistisches Concurrency Control bei veränderbaren Ressourcen verwenden
- `Prefer: return=minimal` unterstützen, um Aufrufer den Antwortkörper bei Mutationen überspringen zu lassen

## Antworte-Design

- Einheitliche Umhüllung über alle Endpunkte hinweg — einigen Sie sich auf eine Form und weichen Sie nie ab:
  ```json
  { "data": {}, "error": null, "meta": {} }
  ```
- Datums-/Zeitfelder: ISO 8601 mit Zeitzone (`2025-01-15T14:30:00Z`)
- Boolesche Felder: tatsächliche `true`/`false` verwenden, nie `"yes"`/`"no"` oder `1`/`0`
- Null vs. abwesend: wählen Sie eine Konvention und wenden Sie sie überall an — bevorzugen Sie das Auslassen von optionalen abwesenden Feldern

## Fehlerantworten

- Jede Fehlerantwort enthält: `code` (maschinenlesbarer String), `message` (benutzerlesbarer Text), optional `details`
- `code`-Werte sind stabil — Clients verzweigen sich basierend auf ihnen; `message` ist für Menschen und kann sich ändern
- Geben Sie nie `500` für Client-Fehler zurück; klassifizieren Sie den Fehler korrekt, bevor Sie antworten
- Protokollieren Sie den vollständigen Fehler server-seitig; geben Sie nur die sichere Zusammenfassung an den Client zurück

## Zwischenspeicherung

- `Cache-Control` für jede `GET`-Antwort setzen — standardmäßig nur auf `no-store` setzen, wenn Sie einen Grund haben
- `ETag` oder `Last-Modified` verwenden, um bedingte Anfragen zu aktivieren
- `Vary`-Header muss jeden Header aufzählen, der die Antwortform beeinflusst (z. B. `Vary: Accept, Accept-Language`)
- Antworten, die benutzerspezifische Daten enthalten, nie ohne `private`-Direktive zwischenspeichern

## Rate Limiting

- `429 Too Many Requests` mit `Retry-After`-Header zurückgeben
- Rate-Limit-Status in Antwortheadern offenlegen: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Striktere Limits auf Auth-Endpunkte und Massenoperationen anwenden
- Rate Limit nach authentifizierter Identität, falls möglich, nur als Fallback nach IP

## Client-Verbrauch

- Alle nicht dokumentierten Felder als instabil behandeln — bauen Sie keine Logik darauf auf
- Exponentiellen Backoff mit Jitter für `429`- und `5xx`-Wiederholungen implementieren
- Explizite Lese- und Verbindungs-Timeouts auf jedem HTTP-Client setzen — verlassen Sie sich nie auf Standards
- TLS-Zertifikate in allen Umgebungen validieren; Zertifikatvalidierung nie deaktivieren
