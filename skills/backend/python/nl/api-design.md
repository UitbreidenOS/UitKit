---
name: api-design
description: "REST API design: resource naming, versioning, pagination, error responses, rate limiting headers, idempotency, OpenAPI documentation"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../api-design.md).

# API Design Skill

## Wanneer activeren
- Ontwerpen van een nieuwe REST API (resourcestructuur, HTTP-methoden, statuscodes)
- Paginering toevoegen aan een bestaand lijst-endpoint
- Standaardiseren van het foutantwoordformaat in een codebase
- Een API-versioneringsstrategie opzetten
- OpenAPI/Swagger-documentatie schrijven
- Idempotentie implementeren voor POST-endpoints

## Wanneer NIET gebruiken
- GraphQL APIs — andere ontwerpeisen
- Interne microservice-communicatie waarbij gRPC geschikter is
- WebSocket/realtime APIs — ander protocol

## Instructies

### Naamgeving van resources

```
# Patroon: /resources/{id}/sub-resources/{sub-id}
# Zelfstandige naamwoorden, geen werkwoorden. Meervoud. Kleine letters met koppeltekens.

GET    /users              → gebruikers weergeven
POST   /users              → gebruiker aanmaken
GET    /users/{id}         → gebruiker ophalen
PATCH  /users/{id}         → gebruiker gedeeltelijk bijwerken
PUT    /users/{id}         → gebruiker volledig vervangen
DELETE /users/{id}         → gebruiker verwijderen

GET    /users/{id}/posts   → posts van een gebruiker weergeven
POST   /users/{id}/posts   → post aanmaken voor een gebruiker

# Acties die niet in CRUD passen — gebruik een werkwoord-subresource
POST   /users/{id}/activate
POST   /users/{id}/password-reset
POST   /orders/{id}/cancel
POST   /invoices/{id}/send

# Nooit:
POST /getUser          ❌
GET  /deleteUser/{id}  ❌
POST /user_management  ❌
```

### HTTP-statuscodes — gebruik de juiste

```
2xx Succes
  200 OK           — GET, PATCH, PUT succes met body
  201 Created      — POST succes, Location-header toevoegen
  204 No Content   — DELETE succes, of PUT/PATCH zonder antwoordbody
  202 Accepted     — asynchrone operatie gestart (nog niet voltooid)

4xx Clientfouten (hun schuld)
  400 Bad Request        — misvormd JSON, ontbrekend verplicht veld
  401 Unauthorized       — niet geauthenticeerd (geen/ongeldig token)
  403 Forbidden          — geauthenticeerd maar niet geautoriseerd
  404 Not Found          — resource bestaat niet
  405 Method Not Allowed — GET op een schrijf-only endpoint
  409 Conflict           — uniciteitsbeperking (e-mail al in gebruik)
  410 Gone               — resource permanent verwijderd
  422 Unprocessable      — geldig JSON maar validatie mislukt
  429 Too Many Requests  — rate limit overschreden

5xx Serverfouten (uw schuld)
  500 Internal Server Error  — onverwachte fout
  502 Bad Gateway            — upstream service niet beschikbaar
  503 Service Unavailable    — gepland onderhoud of overbelasting
  504 Gateway Timeout        — upstream timeout
```

### Foutantwoordformaat

Consistent foutformaat op elk endpoint:

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

**Conventies voor foutcodes:**
- `SNAKE_UPPER_CASE` string-codes (niet numeriek)
- Specifiek genoeg om op te handelen: `EMAIL_ALREADY_REGISTERED` niet `CONFLICT`
- Stabiel over API-versies heen (niet wijzigen)

```python
# FastAPI-voorbeeld
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

# Gebruik
raise AppError(
    code="EMAIL_ALREADY_REGISTERED",
    message="This email address is already in use",
    status=409,
)
```

### Paginering

**Cursor-gebaseerde paginering (aanbevolen voor grote datasets):**
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
# Cursor = base64(JSON) van de sorteersleutel van het laatste item
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

**Offset-paginering (eenvoudiger, prima voor kleine datasets):**
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

### Versioneringsstrategie

```
# URL-versioning (meest gebruikelijk, meest expliciet)
/v1/users
/v2/users

# Header-versioning (schonere URLs, moeilijker te testen in browser)
GET /users
Accept: application/vnd.myapi.v2+json

# Query-parameter (vermijden — vervuilt query-ruimte)
GET /users?version=2  ❌
```

**Regels voor versioning:**
- Versie alleen verhogen voor **breaking changes**
- Niet-brekende toevoegingen (nieuwe velden, nieuwe optionele parameters) vereisen geen versie-bump
- Oude versies ten minste 6 maanden na deprecation-melding beschikbaar houden
- Deprecation communiceren via `Deprecation`- en `Sunset`-headers:

```
Deprecation: Sun, 01 Jan 2027 00:00:00 GMT
Sunset: Sun, 01 Jul 2027 00:00:00 GMT
Link: <https://docs.example.com/migration/v1-to-v2>; rel="deprecation"
```

### Standaard antwoordheaders

```python
# Rate limiting
X-RateLimit-Limit: 1000       # requests per window
X-RateLimit-Remaining: 450    # remaining in current window
X-RateLimit-Reset: 1716835200 # unix timestamp of window reset

# Idempotentie
Idempotency-Key: client-generated-uuid

# Verzoek-tracking
X-Request-ID: req_01JKM3X2...

# Pagineringslinks (RFC 5988)
Link: <https://api.example.com/posts?cursor=next>; rel="next"
```

### Idempotentie voor POST-endpoints

```python
# Idempotentie voorkomt dubbele afschrijvingen/acties bij netwerkherhaling
import hashlib

@router.post("/payments")
async def create_payment(
    payload: PaymentRequest,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    redis: Redis = Depends(get_redis),
):
    # Controleren of deze sleutel al verwerkt is
    cache_key = f"idempotency:{idempotency_key}"
    cached = await redis.get(cache_key)
    if cached:
        return JSONResponse(content=json.loads(cached))  # return same response

    # Betaling verwerken
    result = await charge_card(payload)

    # Antwoord 24 uur cachen
    await redis.setex(cache_key, 86400, json.dumps(result))
    return result
```

### OpenAPI-documentatie (FastAPI genereert dit automatisch)

```python
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    },
    summary="Gebruiker ophalen via ID",
    description="Geeft het openbare profiel van de gebruiker terug. Vereist authenticatie.",
    tags=["Users"],
)
async def get_user(
    user_id: str = Path(description="De UUID van de gebruiker"),
    include_private: bool = Query(default=False, description="Privévelden toevoegen (alleen zichzelf)"),
):
    ...
```

## Voorbeeld

**Gebruiker:** Ontwerp de API voor een taakbeheer-app met projecten, taken en reacties — inclusief paginering, foutformaat en hoe taakopdrachten worden afgehandeld.

**Verwachte uitvoer:**
```
GET  /v1/projects                    → gepagineerde lijst
POST /v1/projects                    → aanmaken, geeft 201 + Location terug
GET  /v1/projects/{id}/tasks         → gepagineerd, filterbaar (?status=open)
POST /v1/projects/{id}/tasks         → taak aanmaken
PATCH /v1/tasks/{id}                 → bijwerken (titel, omschrijving, status)
POST /v1/tasks/{id}/assign           → toewijzen aan gebruiker (actie-endpoint)
POST /v1/tasks/{id}/comments         → reactie toevoegen
DELETE /v1/tasks/{id}                → soft delete, 204

Foutformaat: { error: { code, message, details[], requestId } }
Paginering: cursor-gebaseerd op alle lijst-endpoints
```

---
