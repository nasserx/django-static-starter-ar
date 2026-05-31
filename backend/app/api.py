from app.auth_validation import validate_auth_payload, validate_login_payload
from common.errors import AuthErrorCode, RequestErrorCode, build_error
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_health_check(request):
    return Response({"status": "ok", "service": "api"})


@api_view(["GET"])
@ensure_csrf_cookie
def csrf_cookie(request):
    return Response({"csrf": "ok", "message": "CSRF cookie set."})


@api_view(["POST"])
def register_validation(request):
    try:
        payload = request.data
    except ParseError:
        return _invalid_json_body_response()

    if not isinstance(payload, dict):
        return _invalid_json_body_response()

    result = validate_auth_payload(payload.get("email"), payload.get("password"))
    if not result["is_valid"]:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    email = result["normalized"]["email"]
    if _email_is_registered(email):
        return Response(
            {
                "is_valid": False,
                "errors": [build_error("email", AuthErrorCode.EMAIL_ALREADY_REGISTERED)],
                "normalized": {},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = _create_user(email, payload.get("password"))
    return Response(
        {
            "is_valid": True,
            "user_created": True,
            "message": "تم إنشاء الحساب بنجاح. تسجيل الدخول سيتم تفعيله لاحقًا.",
            "user": {
                "id": user.id,
                "email": user.email,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login_validation(request):
    try:
        payload = request.data
    except ParseError:
        return _invalid_json_body_response()

    if not isinstance(payload, dict):
        return _invalid_json_body_response()

    result = validate_login_payload(payload.get("email"), payload.get("password"))
    if not result["is_valid"]:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    email = result["normalized"]["email"]
    user = _get_user_by_email(email)
    password = payload.get("password")
    if user is None or not user.check_password(password):
        return _invalid_credentials_response()

    return Response(
        {
            "is_valid": True,
            "authenticated": True,
            "message": "تم التحقق من بيانات تسجيل الدخول بنجاح. جلسة تسجيل الدخول سيتم تفعيلها لاحقًا.",
            "user": {
                "id": user.id,
                "email": email,
            },
        },
        status=status.HTTP_200_OK,
    )


def _invalid_json_body_response():
    return Response(
        {
            "is_valid": False,
            "errors": [build_error("general", RequestErrorCode.INVALID_JSON_BODY)],
            "normalized": {},
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


def _invalid_credentials_response():
    return Response(
        {
            "is_valid": False,
            "errors": [build_error("general", AuthErrorCode.INVALID_CREDENTIALS)],
            "normalized": {},
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


def _email_is_registered(email: str) -> bool:
    user_model = get_user_model()
    query = Q(email__iexact=email)

    if user_model.USERNAME_FIELD != "email":
        query |= Q(**{f"{user_model.USERNAME_FIELD}__iexact": email})

    return user_model._default_manager.filter(query).exists()


def _get_user_by_email(email: str):
    user_model = get_user_model()
    return user_model._default_manager.filter(email__iexact=email).order_by("id").first()


def _create_user(email: str, password: str):
    user_model = get_user_model()
    user_data = {"email": email, "password": password}

    if user_model.USERNAME_FIELD != "email":
        user_data[user_model.USERNAME_FIELD] = email

    return user_model._default_manager.create_user(**user_data)
