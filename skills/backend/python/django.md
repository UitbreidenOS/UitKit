---
name: django
description: "Django project layout, ORM models, migrations, DRF serializers, viewsets, Celery tasks, admin customization"
updated: 2026-06-13
---

# Django Skill

## When to activate
- Building a Django project with ORM models, migrations, and views
- Setting up Django REST Framework (DRF) serializers, viewsets, and routers
- Writing custom model managers or QuerySet methods
- Using Django signals for decoupled side effects
- Setting up Celery for async tasks in a Django project
- Customizing the Django admin
- Writing tests with `django.test.TestCase` or `pytest-django`

## When NOT to use
- Async-first APIs — use FastAPI skill instead
- Microservices that don't need Django's ORM or admin
- Simple scripts or CLIs — plain Python or Typer
- If the project already uses FastAPI or Flask

## Instructions

### Project layout
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

### Settings split
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

AUTH_USER_MODEL = "users.User"  # Always set a custom user model from day one

# config/settings/production.py
from .base import *
DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {"default": env.db("DATABASE_URL")}
```

### Custom User model
```python
# apps/users/models.py — set up before first migration, never change afterwards
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

### Custom Manager
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

### Router setup
```python
# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
urlpatterns = router.urls
```

### Signals
```python
# apps/users/signals.py — use signals for truly decoupled side effects only
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
        # send email
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

### Admin customization
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

### QuerySet optimization
```python
# Always select_related for FK fields, prefetch_related for M2M/reverse FK
posts = Post.objects.select_related("author").prefetch_related("tags").filter(published=True)

# Use only() or defer() for large models when you only need specific fields
emails = User.objects.filter(is_active=True).only("email")

# Use values() for read-only aggregations — skips ORM object construction
counts = Order.objects.values("status").annotate(count=Count("id"))
```

### Testing
```python
# pytest-django style
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

## Example

**User:** Add a `Post` model to a Django project with DRF, including list/create/retrieve endpoints, paginated results, and filter by `published=True`.

**Expected output:**
- `models.py` — `Post` with `title`, `body`, `author` (FK to User), `published`, `created_at`
- `serializers.py` — `PostSerializer` with read-only `author` (nested), writable `title`/`body`/`published`
- `views.py` — `PostViewSet` with `queryset` filtered to `published=True` for unauthenticated users, `IsAuthenticatedOrReadOnly` permission, `PageNumberPagination`
- `urls.py` — router registered at `/api/posts/`

---
