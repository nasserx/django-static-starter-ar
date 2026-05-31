from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from app.api import api_health_check


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/health/", api_health_check, name="api-health"),
]
