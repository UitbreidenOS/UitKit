> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../django.md).

# Skill de Django

## Cuándo activar
- Construir un proyecto Django con modelos ORM, migraciones y vistas
- Configurar serializadores, viewsets y routers de Django REST Framework (DRF)
- Escribir managers de modelos personalizados o métodos QuerySet
- Usar señales de Django para efectos secundarios desacoplados
- Configurar Celery para tareas asíncronas en un proyecto Django
- Personalizar el admin de Django
- Escribir pruebas con `django.test.TestCase` o `pytest-django`

## Cuándo NO usar
- APIs async-first — usar el skill de FastAPI en su lugar
- Microservicios que no necesitan el ORM o el admin de Django
- Scripts o CLIs simples — Python puro o Typer
- Si el proyecto ya usa FastAPI o Flask

## Instrucciones

### Estructura del proyecto
```
project_name/
├── manage.py
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   └── users/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       ├── managers.py
│       └── tests/
└── requirements/
    ├── base.txt
    ├── development.txt
    └── production.txt
```

### División de configuración
```python
# config/settings/base.py
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "rest_framework",
    "apps.users",
]

AUTH_USER_MODEL = "users.User"  # Siempre establece un modelo de usuario personalizado desde el primer día

# config/settings/production.py
from .base import *
DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {"default": env.db("DATABASE_URL")}
```

### Modelo de usuario personalizado
```python
# apps/users/models.py — configurar antes de la primera migración, nunca cambiar después
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()
```

### Manager personalizado
```python
# apps/users/managers.py
from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email: str, password: str, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

    def active(self):
        return self.get_queryset().filter(is_active=True)
```

### Serializadores DRF
```python
# apps/users/serializers.py
from rest_framework import serializers
from .models import User

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "password"]

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "created_at"]
        read_only_fields = ["id", "created_at"]
```

### ViewSets DRF
```python
# apps/users/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.active()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=["get"])
    def me(self, request):
        return Response(UserSerializer(request.user).data)
```

### Configuración del router
```python
# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
urlpatterns = router.urls
```

### Señales
```python
# apps/users/signals.py — usa señales solo para efectos secundarios verdaderamente desacoplados
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance: User, created: bool, **kwargs):
    if created:
        send_email_task.delay(instance.email, "welcome")

# apps/users/apps.py
class UsersConfig(AppConfig):
    name = "apps.users"
    def ready(self):
        import apps.users.signals  # noqa: F401
```

### Celery
```python
# config/celery.py
from celery import Celery
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
app = Celery("project_name")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# apps/users/tasks.py
from config.celery import app

@app.task(bind=True, max_retries=3)
def send_email_task(self, to_email: str, template: str):
    try:
        # enviar correo
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

### Personalización del admin
```python
# apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "is_active", "is_staff", "created_at"]
    list_filter = ["is_active", "is_staff"]
    search_fields = ["email"]
    ordering = ["-created_at"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permisos", {"fields": ("is_active", "is_staff", "is_superuser", "groups")}),
    )
    add_fieldsets = (
        (None, {"fields": ("email", "password1", "password2")}),
    )
```

### Optimización de QuerySet
```python
# Siempre select_related para campos FK, prefetch_related para M2M/FK inversa
posts = Post.objects.select_related("author").prefetch_related("tags").filter(published=True)

# Usa only() o defer() para modelos grandes cuando solo necesitas campos específicos
emails = User.objects.filter(is_active=True).only("email")

# Usa values() para agregaciones de solo lectura — omite la construcción de objetos ORM
counts = Order.objects.values("status").annotate(count=Count("id"))
```

### Testing
```python
# Estilo pytest-django
import pytest
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_create_user(api_client):
    resp = api_client.post("/api/users/", {"email": "a@b.com", "password": "strongpass"})
    assert resp.status_code == 201
    assert resp.data["email"] == "a@b.com"
```

## Ejemplo

**Usuario:** Agregar un modelo `Post` a un proyecto Django con DRF, incluyendo endpoints de lista/create/retrieve, resultados paginados y filtro por `published=True`.

**Salida esperada:**
- `models.py` — `Post` con `title`, `body`, `author` (FK a User), `published`, `created_at`
- `serializers.py` — `PostSerializer` con `author` de solo lectura (anidado), `title`/`body`/`published` editables
- `views.py` — `PostViewSet` con `queryset` filtrado a `published=True` para usuarios no autenticados, permiso `IsAuthenticatedOrReadOnly`, `PageNumberPagination`
- `urls.py` — router registrado en `/api/posts/`

---
