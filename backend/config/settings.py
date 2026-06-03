import os
from pathlib import Path


def _get_env_bool(name, default):
    value = os.environ.get(name)
    if value is None or value.strip() == "":
        return default

    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False

    raise ValueError(
        f"{name} must be one of: 1, true, yes, on, 0, false, no, off."
    )


def _get_env_list(name, default):
    value = os.environ.get(name)
    if value is None or value.strip() == "":
        return default

    return [item.strip() for item in value.split(",") if item.strip()]


def _get_env_non_negative_int(name, default):
    value = os.environ.get(name)
    if value is None or value.strip() == "":
        return default

    try:
        parsed = int(value.strip())
    except ValueError as exc:
        raise ValueError(f"{name} must be a non-negative integer.") from exc

    if parsed < 0:
        raise ValueError(f"{name} must be a non-negative integer.")

    return parsed


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "").strip() or "django-insecure-development-only-change-me"
DEBUG = _get_env_bool("DJANGO_DEBUG", True)
ALLOWED_HOSTS = _get_env_list("DJANGO_ALLOWED_HOSTS", ["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "corsheaders",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "app.apps.BackendAppConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "ar"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}

LOCAL_FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

CORS_ALLOWED_ORIGINS = _get_env_list("DJANGO_CORS_ALLOWED_ORIGINS", LOCAL_FRONTEND_ORIGINS)
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = _get_env_list("DJANGO_CSRF_TRUSTED_ORIGINS", LOCAL_FRONTEND_ORIGINS)

SECURE_SSL_REDIRECT = _get_env_bool("DJANGO_SECURE_SSL_REDIRECT", False)
SESSION_COOKIE_SECURE = _get_env_bool("DJANGO_SESSION_COOKIE_SECURE", False)
CSRF_COOKIE_SECURE = _get_env_bool("DJANGO_CSRF_COOKIE_SECURE", False)
SECURE_HSTS_SECONDS = _get_env_non_negative_int("DJANGO_SECURE_HSTS_SECONDS", 0)
SECURE_HSTS_INCLUDE_SUBDOMAINS = _get_env_bool("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", False)
SECURE_HSTS_PRELOAD = _get_env_bool("DJANGO_SECURE_HSTS_PRELOAD", False)
SECURE_REFERRER_POLICY = os.environ.get("DJANGO_SECURE_REFERRER_POLICY", "").strip() or "same-origin"
