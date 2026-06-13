# API-Design-Workflow

Strukturierter Workflow zum Entwerfen einer neuen API — von Anforderungen bis zur implementierungsbereiten Spezifikation.

## Wann verwendet

Verwenden Sie vor der Implementierung eines neuen API-Endpunkts oder einer Service-Schnittstelle, besonders wenn:
- Mehrere Teams oder Services werden die API nutzen
- Die API wird extern/kundenorientiert sein
- Der Endpunkt beinhaltet Datenmutation oder komplexe Geschäftslogik
- Sie entwerfen eine neue Service-Grenze

## Phase 1: Anforderungen (30 Minuten)

**Beantworten Sie zuerst diese Fragen:**

1. Wer sind die Verbraucher?
   - Nur interner Service / mehrere interne Services / externe API-Verbraucher / mobile Clients?
   
2. Was muss jeder Verbraucher tun?
   - Nennen Sie die Anwendungsfälle, nicht die Endpunkte

3. Welche Daten sind beteiligt?
   - Welche Entitäten werden erstellt, gelesen, aktualisiert oder gelöscht?
   - Welche Datenzugriffsmuster gibt es (nach ID, nach Benutzer, nach Datumsbereich)?

4. Welche sind die nicht-funktionalen Anforderungen?
   - Latenzziel (p99 < X ms)
   - Durchsatz (X Anfragen/Sekunde)
   - Konsistenzanforderungen (stark / eventual)
   - Authentifizierungsanforderungen (öffentlich / authentifiziert / Service-zu-Service)

## Phase 2: Schnittstellendesign (45 Minuten)

**Entwerfen Sie die Endpunkte aus Sicht des Verbrauchers:**

1. Beginnen Sie mit den Anwendungsfällen, nicht dem Datenmodell
   ```
   Anwendungsfall: "Benutzer möchte seinen Bestellverlauf sehen"
   → GET /api/orders?userId={id}&status=completed&limit=20&cursor={cursor}
   
   Anwendungsfall: "Benutzer möchte eine Bestellung stornieren"
   → POST /api/orders/{id}/cancel  (Action-Endpunkt, nicht PATCH mit Status)
   ```

2. Wenden Sie REST-Konventionen an (siehe rules/common/api-design.md)

3. Entwerfen Sie Request/Response-Schemas:
   ```typescript
   // Definieren Sie TypeScript-Typen oder JSON Schema vor der Implementierung
   type CreateOrderRequest = {
     customerId: string
     items: Array<{ productId: string; quantity: number }>
     shippingAddressId: string
   }
   
   type Order = {
     id: string
     customerId: string
     status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
     items: OrderItem[]
     total: number
     createdAt: string  // ISO 8601
   }
   ```

4. Entwerfen Sie Fehlerantworten für jeden Endpunkt:
   - Was kann schiefgehen? (ungültige Eingabe, nicht gefunden, Konflikt, Authentifizierungsfehler)
   - Wie sieht jede Fehlerantwort aus?

## Phase 3: Validierung und Überprüfung (20 Minuten)

**Überprüfen Sie das Design anhand dieser Kriterien:**

**Sicht des Verbrauchers:**
- Kann ein Verbraucher alle Anwendungsfälle mit den entworfenen Endpunkten abschließen?
- Sind Antwortformen vorhersehbar und konsistent?
- Helfen Fehlercodes dem Verbraucher bei der Wiederherstellung?

**Implementierungssicht:**
- Erfordert dies N+1-Abfragen zur Implementierung? (Design zur Vermeidung)
- Gibt es Latenzfallen? (große Joins, synchrone externe Aufrufe)
- Ist die Pagination für das erwartete Datenvolumen ausgelegt?

**Sicherheitssicht:**
- Hat jeder Endpunkt klare Authentifizierungsanforderungen?
- Gibt es Endpunkte, die Daten zwischen Benutzern durchsickern könnten?
- Wird Rate Limiting berücksichtigt?

**Versionierung:**
- Ist dies rückwärts kompatibel mit bestehenden Verbrauchern?
- Wenn Breaking: ist Versionierung geplant?

## Phase 4: Dokumentieren und teilen (20 Minuten)

**API-Spezifikationsformat (OpenAPI oder einfaches Markdown):**

```markdown
## POST /api/orders

Erstelle eine neue Bestellung.

**Authentifizierung:** Erforderlich (Benutzer)

**Anforderung:**
\```json
{
  "customerId": "string (UUID)",
  "items": [{ "productId": "string", "quantity": "integer (> 0)" }],
  "shippingAddressId": "string (UUID)"
}
\```

**Antwort 201:**
\```json
{ "id": "string", "status": "pending", "total": "number" }
\```

**Antwort 400:**
\```json
{ "error": { "code": "validation_error", "message": "string", "details": {} } }
\```

**Antwort 404:**
\```json
{ "error": { "code": "not_found", "message": "Customer not found" } }
\```
```

**Teilen mit:**
- Verbrauchenden Teams (für Feedback vor der Implementierung)
- Engineering Lead (für Architektur-Review)
- Sicherheit (bei Handhabung sensibler Daten)

## Phase 5: Implementierung

1. Schreiben Sie zuerst die Tests (aus der Spezifikation — diese werden zu Ihren Akzeptanztests)
2. Implementieren Sie den Handler
3. Validieren Sie manuell gegen die Spezifikation
4. Dokumentieren Sie alle Abweichungen von der ursprünglichen Spezifikation

## Verwandte Skills

- `/rules/common/api-design` — REST-Konventionen zur Anwendung
- `/skills/productivity/spec-driven-workflow` — Spezifikation → Test → Implementierungsmuster
- `/skills/productivity/api-test-builder` — Test-Suites aus Spezifikationen generieren

---
