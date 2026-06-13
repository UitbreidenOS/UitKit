> 🇫🇷 This is the French translation. [English version](../django.md).

# Compétence Django

## Quand activer
- Construire un projet Django avec des modèles ORM, des migrations et des vues
- Configurer les sérialiseurs, viewsets et routers Django REST Framework (DRF)
- Rédiger des managers de modèles personnalisés ou des méthodes QuerySet
- Utiliser les signaux Django pour des effets secondaires découplés
- Configurer Celery pour les tâches async dans un projet Django
- Personnaliser l'admin Django
- Rédiger des tests avec `django.test.TestCase` ou `pytest-django`

## Quand NE PAS utiliser
- APIs async en priorité — utiliser la compétence FastAPI à la place
- Microservices qui n'ont pas besoin de l'ORM ou de l'admin Django
- Scripts ou CLIs simples — Python simple ou Typer
- Si le projet utilise déjà FastAPI ou Flask

## Instructions

### Structure du projet
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

### Séparation des paramètres
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

AUTH_USER_MODEL = "users.User"  # Toujours définir un modèle utilisateur personnalisé dès le début

# config/settings/production.py
from .base import *
DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {"default": env.db("DATABASE_URL")}
```

### Modèle User personnalisé
```python
# apps/users/models.py — à configurer avant la première migration, ne jamais changer ensuite
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

### Manager personnalisé
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

### Sérialiseurs DRF
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

### Configuration du Router
```python
# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
urlpatterns = router.urls
```

### Signaux
```python
# apps/users/signals.py — utiliser les signaux uniquement pour des effets secondaires vraiment découplés
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
        # envoyer l'email
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

### Personnalisation de l'admin
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
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups")}),
    )
    add_fieldsets = (
        (None, {"fields": ("email", "password1", "password2")}),
    )
```

### Optimisation des QuerySet
```python
# Toujours select_related pour les champs FK, prefetch_related pour M2M/FK inverse
posts = Post.objects.select_related("author").prefetch_related("tags").filter(published=True)

# Utiliser only() ou defer() pour les grands modèles quand vous n'avez besoin que de champs spécifiques
emails = User.objects.filter(is_active=True).only("email")

# Utiliser values() pour les agrégations en lecture seule — évite la construction d'objets ORM
counts = Order.objects.values("status").annotate(count=Count("id"))
```

### Tests
```python
# Style pytest-django
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

## Exemple

**Utilisateur :** Ajouter un modèle `Post` à un projet Django avec DRF, incluant des endpoints liste/création/récupération, des résultats paginés et un filtre par `published=True`.

**Sortie attendue :**
- `models.py` — `Post` avec `title`, `body`, `author` (FK vers User), `published`, `created_at`
- `serializers.py` — `PostSerializer` avec `author` en lecture seule (imbriqué), `title`/`body`/`published` modifiables
- `views.py` — `PostViewSet` avec `queryset` filtré à `published=True` pour les utilisateurs non authentifiés, permission `IsAuthenticatedOrReadOnly`, `PageNumberPagination`
- `urls.py` — router enregistré à `/api/posts/`

---
