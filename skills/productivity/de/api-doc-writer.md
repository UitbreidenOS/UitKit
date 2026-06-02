---
name: api-doc-writer
description: "API-Dokumentation aus OpenAPI-Spezifikation oder Code: Endpunkte, Parameter, Beispiele, Fehlercodes, SDKs"
---

# API-Dokumentations-Skill

## Wann aktivieren
- Du hast eine OpenAPI/Swagger-Spezifikation und möchtest daraus menschenlesbare Referenzdokumentation erstellen
- Du schreibst Dokumentation für eine REST-, GraphQL- oder Webhook-API aus Code oder einer Spezifikationsdatei
- Bestehende API-Dokumentation ist unvollständig — es fehlen Beispiele, Fehlercodes oder Authentifizierungsdokumentation
- Du musst SDK-Schnellstarts oder Code-Beispiele in mehreren Sprachen erstellen
- Du erstellst einen Migrationsleitfaden zwischen API-Versionen (v1 → v2, Breaking Changes)

## Wann NICHT verwenden
- Du musst die API selbst entwerfen — dieser Skill dokumentiert bestehende APIs, entwirft keine neuen
- Du benötigst ein Changelog aus der Git-Historie — verwende `/changelog-writer`
- Du brauchst eine vollständige Dokumentationsseiten-Architektur — nutze dafür zuerst `/doc-site-builder`, dann diesen Skill für den Referenzbereich
- Die API ist nur intern und die Zielgruppe ist dein eigenes Team — passe Tiefe und Stil an; interne Wikis benötigen nicht die vollständige verbraucherorientierte Behandlung

## Anweisungen

### OpenAPI-Spezifikation → Referenzdokumentation

```
Wandle diese OpenAPI-Spezifikation (oder API-Beschreibung) in menschenlesbare Referenzdokumentation um.

## Eingabe
Spezifikationsformat: [OpenAPI 3.x / Swagger 2.x / einfache Endpunktbeschreibung]
API-Name: [Name]
API-Version: [v1 / v2 / etc.]
Basis-URL: [https://api.example.com/v1]
Authentifizierung: [API-Schlüssel / Bearer-Token / OAuth 2.0 / Basic]

[OpenAPI-JSON/YAML hier einfügen oder Endpunkte beschreiben]

## Ausgabeformat
Für jeden Endpunkt einen Dokumentationsabschnitt erstellen:

---

### [HTTP-Methode] [/pfad]
[Ein Satz — was dieser Endpunkt tut und wann er verwendet wird]

**Authentifizierung:** [erforderlich / optional — und wie]

**Anfrage**

Header:
| Header | Erforderlich | Wert |
|---|---|---|
| `Authorization` | Ja | `Bearer {token}` |
| `Content-Type` | Ja | `application/json` |

Pfadparameter:
| Parameter | Typ | Beschreibung |
|---|---|---|
| `{id}` | string | Der eindeutige Bezeichner der [Ressource] |

Abfrageparameter:
| Parameter | Typ | Erforderlich | Standard | Beschreibung |
|---|---|---|---|---|
| `limit` | integer | Nein | 20 | Max. Anzahl Ergebnisse (1-100) |
| `cursor` | string | Nein | — | Paginierungs-Cursor aus vorheriger Antwort |

Anfragekörper:
```json
{
  "field_name": "string",        // Erforderlich. Feldbeschreibung.
  "optional_field": 42,          // Optional. Standard: 0. Beschreibung.
  "nested_object": {
    "child_field": true          // Erforderlich. Beschreibung.
  }
}
```

**Antwort**

Erfolgsantwort — `200 OK`:
```json
{
  "id": "res_abc123",
  "created_at": "2026-06-01T12:00:00Z",
  "status": "active",
  "data": {
    "field": "value"
  }
}
```

Antwortfelder:
| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutiger Bezeichner, mit Präfix `res_` |
| `created_at` | ISO 8601 | Zeitstempel der Ressourcenerstellung (UTC) |
| `status` | enum | `active` \| `inactive` \| `pending` |

**Fehlerantworten**
| Status | Fehlercode | Wann er auftritt |
|---|---|---|
| `400` | `invalid_request` | Pflichtfeld fehlt oder ungültiges Format |
| `401` | `unauthorized` | Fehlender oder ungültiger API-Schlüssel |
| `403` | `forbidden` | Authentifiziert, aber unzureichende Berechtigungen |
| `404` | `not_found` | Ressource mit dieser ID existiert nicht |
| `429` | `rate_limited` | Rate-Limit überschritten — siehe Abschnitt Rate-Limits |
| `500` | `internal_error` | Serverseitiger Fehler — mit exponentiellem Backoff wiederholen |

**Code-Beispiele**

```bash
# cURL
curl -X POST https://api.example.com/v1/[path] \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "value"
  }'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v1/[path]",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"field_name": "value"}
)
response.raise_for_status()
data = response.json()
```

```typescript
const response = await fetch('https://api.example.com/v1/[path]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field_name: 'value' }),
});
const data = await response.json();
```

---

## Übergreifende Abschnitte, die neben der Endpunktdokumentation erstellt werden sollen:

### Authentifizierungsleitfaden
[Einen vollständigen Leitfaden zur Authentifizierungseinrichtung schreiben — nicht nur eine kurze Erwähnung]

Abschnitte:
1. So erhält man einen API-Schlüssel / Token
2. So authentifiziert man Anfragen (alle unterstützten Methoden zeigen)
3. Schlüssel rotieren / Token erneuern
4. Bereiche und Berechtigungen (falls zutreffend)
5. Authentifizierung testen (ein curl-Befehl zur Verifikation)

### Rate-Limits
- Rate-Limit-Werte: [X Anfragen pro Minute / Stunde / Tag]
- Welche Header Rate-Limit-Informationen enthalten: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Umgang mit 429-Fehlern: Retry-After-Header, exponentielles Backoff
- Endpunktspezifische vs. globale Limits

### Paginierung
Wenn die API Cursor- oder Offset-Paginierung verwendet:
- Paginierungsmodell erläutern (cursor-basiert / Offset / seitenbasiert)
- Zeigen, wie man mit einem Code-Beispiel durch alle Ergebnisse blättert (eine Schleife)
- Erläutern, was auf der letzten Seite passiert

### Webhooks-Abschnitt (falls zutreffend)
- Webhook-Payload-Struktur (mit Beispiel)
- Signaturverifizierung (mit Code-Beispiel in 3 Sprachen)
- Wiederholungsrichtlinie und Zustellungsgarantien
- Registrierung von Webhook-Endpunkten
- Lokales Testen (ngrok / Cloudflare Tunnel)

### Fehlerbehandlungsleitfaden (übergreifend)
Fehlercodes nicht nur auflisten — einen Leitfaden schreiben:
- Unterscheidung zwischen wiederholbaren (5xx, 429) und nicht wiederholbaren (4xx) Fehlern
- Beispielimplementierung für exponentielles Backoff
- Idempotenz-Schlüssel — wann sie verwendet werden
- Wie der Fehlerantwort-Body gelesen und genutzt wird

### SDK-Schnellstart
Für jede unterstützte SDK-Sprache ein minimales funktionierendes Beispiel:
- SDK installieren
- Authentifizieren
- Den häufigsten API-Aufruf durchführen
- Fehler behandeln
- Vollständiges Code-Beispiel, ausführbar ohne Änderungen (keine Platzhalterwerte, die es kaputtmachen)
```

### API-Migrationsleitfaden (Versionsupgrade)

```
Migrationsleitfaden von [API vALT] zu [API vNEU] schreiben.

## Zu dokumentierende Breaking Changes
[Jeden Breaking Change auflisten — Endpunkt umbenannt, Parameter entfernt, Antwortstruktur geändert, Authentifizierungsmethode geändert]

## Struktur des Migrationsleitfadens:

### Übersicht
- Was sich geändert hat und warum (benutzerseitiger Grund, nicht technisch)
- Zeitplan: wann v[ALT] veraltet ist, wann es abgeschaltet wird
- Migrationsaufwand: [Stunden / Tage / Wochen für eine typische Integration]

### Breaking Changes

Für jeden Breaking Change:
**[Name der Änderung]**
Was sich geändert hat: [einfache Beschreibung]
Vorher (v[ALT]):
```[sprache]
[alter Code]
```
Nachher (v[NEU]):
```[sprache]
[neuer Code]
```
Migrationsschritte:
1. [Konkreter Schritt]
2. [Konkreter Schritt]
Auswirkung: [was passiert, wenn man nicht migriert]

### Nicht brechende Ergänzungen
[Features, die in vNEU verfügbar sind, aber nicht in vALT — optionale Lektüre für v[ALT]-Nutzer]

### Migrations-Checkliste
- [ ] SDK-Version auf [X] aktualisieren
- [ ] Basis-URL von [alt] auf [neu] aktualisieren
- [ ] [Jeden Breaking Change als Checkbox]
- [ ] Testsuite ausführen
- [ ] In Staging deployen und verifizieren
- [ ] In Produktion deployen

### Hilfe während der Migration
[Link zum Support-Kanal, Migrations-Sprechstunden oder Feedback-Formular]
```

### Dokumentationsqualitäts-Audit — API-Referenz

```
Diese API-Dokumentation auf Vollständigkeit und Qualität prüfen.

[Bestehende API-Dokumentation einfügen]

Anhand dieser Bewertungskriterien prüfen:

VOLLSTÄNDIGKEIT:
- [ ] Jeder Endpunkt enthält: Beschreibung, alle dokumentierten Parameter, Erfolgsantwort, Fehlerantworten
- [ ] Authentifizierung mit funktionierendem Beispiel erklärt
- [ ] Rate-Limits dokumentiert
- [ ] Paginierung dokumentiert (falls zutreffend)
- [ ] Code-Beispiele in mindestens 2 Sprachen für jeden Endpunkt
- [ ] Webhook-Dokumentation (falls zutreffend) enthält Signaturverifizierung

GENAUIGKEIT:
- [ ] Parametertypen korrekt
- [ ] Erforderlich vs. optional korrekt gekennzeichnet
- [ ] Standardwerte für optionale Parameter angegeben
- [ ] Fehlercodes sind real (nicht erfunden)

BENUTZERFREUNDLICHKEIT:
- [ ] Kann ein Entwickler integrieren, ohne den Quellcode zu lesen?
- [ ] Gibt es funktionierende Code-Beispiele (kein Pseudocode)?
- [ ] Ist die Sprache klar und präzise (kein Marketingtext)?
- [ ] Sind Fallstricke und Randfälle dort dokumentiert, wo sie existieren?

Für jede Lücke: konkrete Korrekturempfehlung.
Priorität: welche Lücken am wahrscheinlichsten Integrationsfehler oder Support-Tickets verursachen.
```

## Beispiel

**Benutzer:** Dokumentiere diesen REST-Endpunkt. Es ist `POST /v1/payments`, der eine Zahlung erstellt. Pflichtfelder: amount (integer, in Cent), currency (ISO-4217-String), customer_id (String). Optional: description (String), metadata (Objekt). Gibt das Zahlungsobjekt mit id, status, amount, currency, created_at zurück. Fehler: 400 für ungültigen Betrag, 401 für schlechte Authentifizierung, 402 für Zahlungsfehler (mit einem decline_code-Feld).

**Ausgabe:**

```markdown
### POST /v1/payments

Eine neue Zahlungsbelastung für einen Kunden erstellen.

**Authentifizierung:** Erforderlich — Bearer-Token

**Anfragekörper**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "description": "Rechnung #1042",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

| Feld | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `amount` | integer | Ja | Betrag in kleinster Währungseinheit (Cent für USD). Muss > 0 sein. |
| `currency` | string | Ja | ISO-4217-Währungscode in Kleinbuchstaben (`usd`, `eur`, `gbp`). |
| `customer_id` | string | Ja | ID des zu belastenden Kunden. Muss existieren. |
| `description` | string | Nein | Eine menschenlesbare Beschreibung, die auf der Zahlung gespeichert wird. |
| `metadata` | object | Nein | Schlüssel-Wert-Paare für interne Referenz. Max. 50 Schlüssel, 500 Zeichen pro Wert. |

**Erfolgsantwort — `200 OK`**
```json
{
  "id": "pay_abc123",
  "status": "succeeded",
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**Fehlerantworten**
| Status | Code | Wann |
|---|---|---|
| `400` | `invalid_amount` | Betrag ist 0, negativ oder kein Integer |
| `401` | `unauthorized` | Fehlender oder ungültiger Bearer-Token |
| `402` | `payment_failed` | Karte abgelehnt — `decline_code` im Antwort-Body prüfen |

Bei `402`-Antworten enthält der Body:
```json
{
  "error": "payment_failed",
  "decline_code": "insufficient_funds",
  "message": "The card has insufficient funds to complete the purchase."
}
```

Häufige `decline_code`-Werte: `insufficient_funds`, `card_declined`, `expired_card`, `incorrect_cvc`.

**Code-Beispiele**

```bash
curl -X POST https://api.example.com/v1/payments \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd", "customer_id": "cus_abc123"}'
```

```python
response = requests.post(
    "https://api.example.com/v1/payments",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"amount": 2000, "currency": "usd", "customer_id": customer_id},
)
if response.status_code == 402:
    decline_code = response.json()["decline_code"]
    # Ablehnung behandeln
response.raise_for_status()
payment = response.json()
```
```

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
