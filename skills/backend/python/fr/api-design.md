---
name: api-design
description: "REST API design: resource naming, versioning, pagination, error responses, rate limiting headers, idempotency, OpenAPI documentation"
---

> 🇫🇷 Version française. [English version](../api-design.md).

# Compétence Conception d'API

## Quand activer
- Conception d'une nouvelle API REST (structure des ressources, méthodes HTTP, codes de statut)
- Ajout de pagination à un endpoint de liste existant
- Standardisation du format de réponse d'erreur dans un codebase
- Mise en place d'une stratégie de versioning d'API
- Rédaction de documentation OpenAPI/Swagger
- Implémentation de l'idempotence pour les endpoints POST

## Quand NE PAS utiliser
- APIs GraphQL — contraintes de conception différentes
- Communication entre microservices internes où gRPC est plus approprié
- APIs WebSocket/temps réel — protocole différent

## Instructions

### Nommage des ressources

```
# Pattern : /resources/{id}/sub-resources/{sub-id}
# Noms, pas des verbes. Pluriel. Minuscules avec des tirets.

GET    /users              → lister les utilisateurs
POST   /users              → créer un utilisateur
GET    /users/{id}         → obtenir un utilisateur
PATCH  /users/{id}         → mise à jour partielle d'un utilisateur
PUT    /users/{id}         → remplacement complet d'un utilisateur
DELETE /users/{id}         → supprimer un utilisateur

GET    /users/{id}/posts   → lister les posts d'un utilisateur
POST   /users/{id}/posts   → créer un post pour un utilisateur

# Actions qui ne correspondent pas au CRUD — utiliser une sous-ressource avec verbe
POST   /users/{id}/activate
POST   /users/{id}/password-reset
POST   /orders/{id}/cancel
POST   /invoices/{id}/send

# Jamais :
POST /getUser          ❌
GET  /deleteUser/{id}  ❌
POST /user_management  ❌
```

### Codes de statut HTTP — utilisez le bon

```
2xx Succès
  200 OK           — succès GET, PATCH, PUT avec corps
  201 Created      — succès POST, inclure l'en-tête Location
  204 No Content   — succès DELETE, ou PUT/PATCH sans corps de réponse
  202 Accepted     — opération asynchrone démarrée (pas encore terminée)

4xx Erreurs client (leur faute)
  400 Bad Request        — JSON malformé, champ requis manquant
  401 Unauthorized       — non authentifié (pas de token / token invalide)
  403 Forbidden          — authentifié mais non autorisé
  404 Not Found          — la ressource n'existe pas
  405 Method Not Allowed — GET sur un endpoint en écriture seule
  409 Conflict           — contrainte d'unicité (email déjà pris)
  410 Gone               — ressource définitivement supprimée
  422 Unprocessable      — JSON valide mais validation échouée
  429 Too Many Requests  — limite de débit dépassée

5xx Erreurs serveur (votre faute)
  500 Internal Server Error  — erreur inattendue
  502 Bad Gateway            — service en amont indisponible
  503 Service Unavailable    — maintenance planifiée ou surcharge
  504 Gateway Timeout        — timeout du service en amont
```

### Format de réponse d'erreur

Format d'erreur cohérent sur chaque endpoint :

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

**Conventions de code d'erreur :**
- Codes en `SNAKE_UPPER_CASE` (pas numériques)
- Suffisamment spécifiques pour agir : `EMAIL_ALREADY_REGISTERED` pas `CONFLICT`
- Stables entre les versions d'API (ne pas les changer)

```python
# Exemple FastAPI
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

# Utilisation
raise AppError(
    code="EMAIL_ALREADY_REGISTERED",
    message="This email address is already in use",
    status=409,
)
```

### Pagination

**Pagination par curseur (recommandée pour les grands ensembles de données) :**
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
# Cursor = base64(JSON) de la clé de tri du dernier élément
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

**Pagination par offset (plus simple, convient aux petits ensembles de données) :**
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

### Stratégie de versioning

```
# Versioning par URL (le plus courant, le plus explicite)
/v1/users
/v2/users

# Versioning par en-tête (URLs plus propres, plus difficile à tester dans le navigateur)
GET /users
Accept: application/vnd.myapi.v2+json

# Paramètre de requête (à éviter — pollue l'espace de requête)
GET /users?version=2  ❌
```

**Règles de versioning :**
- Incrémenter la version uniquement pour les **changements cassants**
- Les ajouts non cassants (nouveaux champs, nouveaux paramètres optionnels) ne nécessitent pas de version bump
- Maintenir les anciennes versions en vie pendant au moins 6 mois après l'avis de dépréciation
- Communiquer la dépréciation via les en-têtes `Deprecation` et `Sunset` :

```
Deprecation: Sun, 01 Jan 2027 00:00:00 GMT
Sunset: Sun, 01 Jul 2027 00:00:00 GMT
Link: <https://docs.example.com/migration/v1-to-v2>; rel="deprecation"
```

### En-têtes de réponse standard

```python
# Limitation de débit
X-RateLimit-Limit: 1000       # requests per window
X-RateLimit-Remaining: 450    # remaining in current window
X-RateLimit-Reset: 1716835200 # unix timestamp of window reset

# Idempotence
Idempotency-Key: client-generated-uuid

# Suivi des requêtes
X-Request-ID: req_01JKM3X2...

# Liens de pagination (RFC 5988)
Link: <https://api.example.com/posts?cursor=next>; rel="next"
```

### Idempotence pour les endpoints POST

```python
# L'idempotence empêche les doubles débits/actions lors des nouvelles tentatives réseau
import hashlib

@router.post("/payments")
async def create_payment(
    payload: PaymentRequest,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    redis: Redis = Depends(get_redis),
):
    # Vérifier si cette clé a déjà été traitée
    cache_key = f"idempotency:{idempotency_key}"
    cached = await redis.get(cache_key)
    if cached:
        return JSONResponse(content=json.loads(cached))  # return same response

    # Traiter le paiement
    result = await charge_card(payload)

    # Mettre en cache la réponse pendant 24 heures
    await redis.setex(cache_key, 86400, json.dumps(result))
    return result
```

### Documentation OpenAPI (FastAPI la génère automatiquement)

```python
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    },
    summary="Obtenir un utilisateur par ID",
    description="Retourne le profil public de l'utilisateur. Nécessite une authentification.",
    tags=["Users"],
)
async def get_user(
    user_id: str = Path(description="L'UUID de l'utilisateur"),
    include_private: bool = Query(default=False, description="Inclure les champs privés (soi-même uniquement)"),
):
    ...
```

## Exemple

**Utilisateur :** Concevoir l'API pour une application de gestion de tâches avec des projets, des tâches et des commentaires — incluant la pagination, le format d'erreur et comment gérer l'assignation de tâches.

**Résultat attendu :**
```
GET  /v1/projects                    → liste paginée
POST /v1/projects                    → créer, retourne 201 + Location
GET  /v1/projects/{id}/tasks         → paginée, filtrable (?status=open)
POST /v1/projects/{id}/tasks         → créer une tâche
PATCH /v1/tasks/{id}                 → mettre à jour (titre, description, statut)
POST /v1/tasks/{id}/assign           → assigner à un utilisateur (endpoint d'action)
POST /v1/tasks/{id}/comments         → ajouter un commentaire
DELETE /v1/tasks/{id}                → suppression douce, 204

Format d'erreur : { error: { code, message, details[], requestId } }
Pagination : basée sur curseur pour tous les endpoints de liste
```

---
