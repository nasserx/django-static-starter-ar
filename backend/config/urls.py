from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from app.api import api_health_check, csrf_cookie, login_validation, register_validation


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/health/", api_health_check, name="api-health"),
    path("api/auth/csrf/", csrf_cookie, name="api-auth-csrf"),
    path("api/auth/register/", register_validation, name="api-auth-register"),
    path("api/auth/login/", login_validation, name="api-auth-login"),
]
