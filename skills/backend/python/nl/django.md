> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../django.md).

# Django Skill

## Wanneer te activeren
- Een Django-project bouwen met ORM-modellen, migraties en views
- Django REST Framework (DRF) serializers, viewsets en routers instellen
- Aangepaste model-managers of QuerySet-methoden schrijven
- Django-signalen gebruiken voor ontkoppelde neveneffecten
- Celery instellen voor async taken in een Django-project
- De Django-admin aanpassen
- Tests schrijven met `django.test.TestCase` of `pytest-django`

## Wanneer NIET te gebruiken
- Async-first API's — gebruik in plaats daarvan de FastAPI skill
- Microservices die Django's ORM of admin niet nodig hebben
- Eenvoudige scripts of CLI's — gewone Python of Typer
- Als het project al FastAPI of Flask gebruikt

## Instructies

### Projectindeling
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

### Instellingen splitsen
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

AUTH_USER_MODEL = "users.User"  # Stel altijd een aangepast gebruikersmodel in vanaf dag één

# config/settings/production.py
from .base import *
DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {"default": env.db("DATABASE_URL")}
```

### Aangepast User-model
```python
# apps/users/models.py — instellen vóór eerste migratie, daarna nooit meer wijzigen
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

### Aangepaste Manager
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

### DRF Serializers
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

### DRF ViewSets
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

### Router-instelling
```python
# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
urlpatterns = router.urls
```

### Signalen
```python
# apps/users/signals.py — gebruik signalen alleen voor werkelijk ontkoppelde neveneffecten
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
        # e-mail verzenden
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

### Admin-aanpassing
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

### QuerySet-optimalisatie
```python
# Gebruik altijd select_related voor FK-velden, prefetch_related voor M2M/reverse FK
posts = Post.objects.select_related("author").prefetch_related("tags").filter(published=True)

# Gebruik only() of defer() voor grote modellen wanneer je alleen specifieke velden nodig hebt
emails = User.objects.filter(is_active=True).only("email")

# Gebruik values() voor alleen-lezen aggregaties — slaat ORM-objectconstructie over
counts = Order.objects.values("status").annotate(count=Count("id"))
```

### Testen
```python
# pytest-django-stijl
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

## Voorbeeld

**Gebruiker:** Voeg een `Post`-model toe aan een Django-project met DRF, inclusief lijst/aanmaken/ophalen-endpoints, gepagineerde resultaten en filter op `published=True`.

**Verwachte output:**
- `models.py` — `Post` met `title`, `body`, `author` (FK naar User), `published`, `created_at`
- `serializers.py` — `PostSerializer` met alleen-lezen `author` (genest), beschrijfbare `title`/`body`/`published`
- `views.py` — `PostViewSet` met `queryset` gefilterd op `published=True` voor niet-geauthenticeerde gebruikers, `IsAuthenticatedOrReadOnly`-toestemming, `PageNumberPagination`
- `urls.py` — router geregistreerd op `/api/posts/`

---
