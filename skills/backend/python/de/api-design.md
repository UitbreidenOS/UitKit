---
name: api-design
description: "REST API design: resource naming, versioning, pagination, error responses, rate limiting headers, idempotency, OpenAPI documentation"
---

> 🇩🇪 Deutsche Version. [Englische Version](../api-design.md).

# API Design Skill

## Wann aktivieren
- Entwurf einer neuen REST API (Ressourcenstruktur, HTTP-Methoden, Statuscodes)
- Hinzufügen von Paginierung zu einem bestehenden Listen-Endpoint
- Standardisierung des Fehlerantwortformats in einer Codebase
- Einrichten einer API-Versionierungsstrategie
- Schreiben von OpenAPI/Swagger-Dokumentation
- Implementierung von Idempotenz für POST-Endpoints

## Wann NICHT verwenden
- GraphQL APIs — andere Designbeschränkungen
- Interne Microservice-Kommunikation, bei der gRPC geeigneter ist
- WebSocket/Echtzeit-APIs — anderes Protokoll

## Anweisungen

### Ressourcenbenennung

```
# Muster: /resources/{id}/sub-resources/{sub-id}
# Substantive, keine Verben. Plural. Kleinbuchstaben mit Bindestrichen.

GET    /users              → Nutzer auflisten
POST   /users              → Nutzer erstellen
GET    /users/{id}         → Nutzer abrufen
PATCH  /users/{id}         → Nutzer teilweise aktualisieren
PUT    /users/{id}         → Nutzer vollständig ersetzen
DELETE /users/{id}         → Nutzer löschen

GET    /users/{id}/posts   → Posts eines Nutzers auflisten
POST   /users/{id}/posts   → Post für einen Nutzer erstellen

# Aktionen, die nicht in CRUD passen — Verb-Unterressource verwenden
POST   /users/{id}/activate
POST   /users/{id}/password-reset
POST   /orders/{id}/cancel
POST   /invoices/{id}/send

# Niemals:
POST /getUser          ❌
GET  /deleteUser/{id}  ❌
POST /user_management  ❌
```

### HTTP-Statuscodes — den richtigen verwenden

```
2xx Erfolg
  200 OK           — GET, PATCH, PUT Erfolg mit Body
  201 Created      — POST Erfolg, Location-Header einschließen
  204 No Content   — DELETE Erfolg, oder PUT/PATCH ohne Antwort-Body
  202 Accepted     — asynchrone Operation gestartet (noch nicht abgeschlossen)

4xx Client-Fehler (deren Schuld)
  400 Bad Request        — fehlerhaftes JSON, fehlendes Pflichtfeld
  401 Unauthorized       — nicht authentifiziert (kein/ungültiges Token)
  403 Forbidden          — authentifiziert aber nicht autorisiert
  404 Not Found          — Ressource existiert nicht
  405 Method Not Allowed — GET auf einem schreibgeschützten Endpoint
  409 Conflict           — Eindeutigkeitsbeschränkung (E-Mail bereits vergeben)
  410 Gone               — Ressource dauerhaft gelöscht
  422 Unprocessable      — gültiges JSON, aber Validierung fehlgeschlagen
  429 Too Many Requests  — Rate-Limit überschritten

5xx Server-Fehler (eigene Schuld)
  500 Internal Server Error  — unerwarteter Fehler
  502 Bad Gateway            — vorgelagerter Service nicht erreichbar
  503 Service Unavailable    — geplante Wartung oder Überlastung
  504 Gateway Timeout        — Timeout des vorgelagerten Services
```

### Fehlerantwortformat

Konsistentes Fehlerformat auf jedem Endpoint:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ],
    "requestId": "req_01JKM3X2...",
    "docsUrl": "https://docs.example.com/errors/VALIDATION_FAILED"
  }
}
```

**Fehlercode-Konventionen:**
- `SNAKE_UPPER_CASE`-String-Codes (nicht numerisch)
- Spezifisch genug zum Handeln: `EMAIL_ALREADY_REGISTERED` statt `CONFLICT`
- Stabil über API-Versionen hinweg (nicht ändern)

```python
# FastAPI-Beispiel
from fastapi import Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, code: str, message: str, status: int, details=None):
        self.code = code
        self.message = message
        self.status = status
        self.details = details or []

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "requestId": request.state.request_id,
            }
        }
    )

# Verwendung
raise AppError(
    code="EMAIL_ALREADY_REGISTERED",
    message="This email address is already in use",
    status=409,
)
```

### Paginierung

**Cursor-basierte Paginierung (empfohlen für große Datensätze):**
```json
GET /posts?limit=20&cursor=eyJpZCI6IjEwMCJ9

{
  "data": [...],
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6IjEyMCJ9",
    "hasMore": true
  }
}
```

```python
# Cursor = base64(JSON) des Sortierschlüssels des letzten Elements
import base64, json

def encode_cursor(id: str) -> str:
    return base64.b64encode(json.dumps({"id": id}).encode()).decode()

def decode_cursor(cursor: str) -> dict:
    return json.loads(base64.b64decode(cursor).decode())

@router.get("/posts")
async def list_posts(limit: int = 20, cursor: str | None = None):
    query = Post.query.order_by(Post.id.desc())
    if cursor:
        last_id = decode_cursor(cursor)["id"]
        query = query.filter(Post.id < last_id)
    posts = query.limit(limit + 1).all()
    has_more = len(posts) > limit
    posts = posts[:limit]
    return {
        "data": posts,
        "pagination": {
            "limit": limit,
            "nextCursor": encode_cursor(str(posts[-1].id)) if has_more else None,
            "hasMore": has_more,
        }
    }
```

**Offset-Paginierung (einfacher, gut für kleine Datensätze):**
```json
GET /posts?page=2&perPage=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "perPage": 20,
    "total": 347,
    "totalPages": 18
  }
}
```

### Versionierungsstrategie

```
# URL-Versionierung (am häufigsten, am explizitesten)
/v1/users
/v2/users

# Header-Versionierung (sauberere URLs, schwieriger im Browser zu testen)
GET /users
Accept: application/vnd.myapi.v2+json

# Query-Parameter (vermeiden — verschmutzt den Query-Raum)
GET /users?version=2  ❌
```

**Versionierungsregeln:**
- Version nur bei **Breaking Changes** erhöhen
- Nicht brechende Erweiterungen (neue Felder, neue optionale Parameter) benötigen keinen Version-Bump
- Alte Versionen mindestens 6 Monate nach Deprecation-Hinweis aufrechterhalten
- Deprecation über `Deprecation`- und `Sunset`-Header kommunizieren:

```
Deprecation: Sun, 01 Jan 2027 00:00:00 GMT
Sunset: Sun, 01 Jul 2027 00:00:00 GMT
Link: <https://docs.example.com/migration/v1-to-v2>; rel="deprecation"
```

### Standard-Antwort-Header

```python
# Rate Limiting
X-RateLimit-Limit: 1000       # requests per window
X-RateLimit-Remaining: 450    # remaining in current window
X-RateLimit-Reset: 1716835200 # unix timestamp of window reset

# Idempotenz
Idempotency-Key: client-generated-uuid

# Request-Tracking
X-Request-ID: req_01JKM3X2...

# Paginierungs-Links (RFC 5988)
Link: <https://api.example.com/posts?cursor=next>; rel="next"
```

### Idempotenz für POST-Endpoints

```python
# Idempotenz verhindert doppelte Abbuchungen/Aktionen bei Netzwerk-Wiederholungen
import hashlib

@router.post("/payments")
async def create_payment(
    payload: PaymentRequest,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    redis: Redis = Depends(get_redis),
):
    # Prüfen, ob dieser Schlüssel bereits verarbeitet wurde
    cache_key = f"idempotency:{idempotency_key}"
    cached = await redis.get(cache_key)
    if cached:
        return JSONResponse(content=json.loads(cached))  # return same response

    # Zahlung verarbeiten
    result = await charge_card(payload)

    # Antwort für 24 Stunden cachen
    await redis.setex(cache_key, 86400, json.dumps(result))
    return result
```

### OpenAPI-Dokumentation (FastAPI generiert diese automatisch)

```python
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    },
    summary="Nutzer nach ID abrufen",
    description="Gibt das öffentliche Profil des Nutzers zurück. Authentifizierung erforderlich.",
    tags=["Users"],
)
async def get_user(
    user_id: str = Path(description="Die UUID des Nutzers"),
    include_private: bool = Query(default=False, description="Private Felder einschließen (nur für sich selbst)"),
):
    ...
```

## Beispiel

**Nutzer:** Entwerfe die API für eine Aufgabenverwaltungs-App mit Projekten, Aufgaben und Kommentaren — einschließlich Paginierung, Fehlerformat und wie Aufgabenzuweisung gehandhabt wird.

**Erwartete Ausgabe:**
```
GET  /v1/projects                    → paginierte Liste
POST /v1/projects                    → erstellen, gibt 201 + Location zurück
GET  /v1/projects/{id}/tasks         → paginiert, filterbar (?status=open)
POST /v1/projects/{id}/tasks         → Aufgabe erstellen
PATCH /v1/tasks/{id}                 → aktualisieren (Titel, Beschreibung, Status)
POST /v1/tasks/{id}/assign           → Nutzer zuweisen (Aktions-Endpoint)
POST /v1/tasks/{id}/comments         → Kommentar hinzufügen
DELETE /v1/tasks/{id}                → Soft-Delete, 204

Fehlerformat: { error: { code, message, details[], requestId } }
Paginierung: cursor-basiert auf allen Listen-Endpoints
```

---
