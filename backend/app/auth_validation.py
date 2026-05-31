from __future__ import annotations

import re
from typing import Final, TypedDict

from common.errors import AppError, AuthErrorCode, ErrorField, build_error

try:
    from django.core.exceptions import ValidationError as DjangoValidationError
    from django.core.validators import validate_email as django_validate_email
except ImportError:  # pragma: no cover - exercised only when Django is not installed.
    DjangoValidationError = None
    django_validate_email = None


MIN_PASSWORD_LENGTH: Final = 8
MAX_PASSWORD_LENGTH: Final = 128
COMMON_WEAK_PASSWORDS: Final[frozenset[str]] = frozenset(
    {
        "password",
        "password123",
        "12345678",
        "qwerty123",
        "admin123",
    }
)
EMAIL_PATTERN: Final = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class NormalizedAuthData(TypedDict, total=False):
    email: str


class ValidationResult(TypedDict):
    is_valid: bool
    errors: list[AppError]
    normalized: NormalizedAuthData


def validate_email(email: object) -> ValidationResult:
    if email is None:
        return _invalid("email", AuthErrorCode.EMAIL_REQUIRED)

    if not isinstance(email, str):
        return _invalid("email", AuthErrorCode.EMAIL_MUST_BE_STRING)

    normalized_email = email.strip()
    if not normalized_email:
        return _invalid("email", AuthErrorCode.EMAIL_REQUIRED)

    normalized_email = normalized_email.lower()
    if not _is_valid_email_format(normalized_email):
        return _invalid("email", AuthErrorCode.EMAIL_INVALID)

    return {"is_valid": True, "errors": [], "normalized": {"email": normalized_email}}


def validate_password(password: object) -> ValidationResult:
    if password is None:
        return _invalid("password", AuthErrorCode.PASSWORD_REQUIRED)

    if not isinstance(password, str):
        return _invalid("password", AuthErrorCode.PASSWORD_MUST_BE_STRING)

    if not password:
        return _invalid("password", AuthErrorCode.PASSWORD_REQUIRED)

    if not password.strip():
        return _invalid("password", AuthErrorCode.PASSWORD_REQUIRED)

    if password != password.strip():
        return _invalid("password", AuthErrorCode.PASSWORD_HAS_OUTER_SPACES)

    if len(password) < MIN_PASSWORD_LENGTH:
        return _invalid("password", AuthErrorCode.PASSWORD_TOO_SHORT)

    if len(password) > MAX_PASSWORD_LENGTH:
        return _invalid("password", AuthErrorCode.PASSWORD_TOO_LONG)

    if password.lower() in COMMON_WEAK_PASSWORDS:
        return _invalid("password", AuthErrorCode.PASSWORD_TOO_COMMON)

    if not any(character.isalpha() for character in password):
        return _invalid("password", AuthErrorCode.PASSWORD_MISSING_LETTER)

    if not any(character.isdigit() for character in password):
        return _invalid("password", AuthErrorCode.PASSWORD_MISSING_NUMBER)

    return {"is_valid": True, "errors": [], "normalized": {}}


def validate_auth_payload(email: object, password: object) -> ValidationResult:
    email_result = validate_email(email)
    password_result = validate_password(password)
    errors = [*email_result["errors"], *password_result["errors"]]
    normalized: NormalizedAuthData = {}

    if email_result["is_valid"]:
        normalized["email"] = email_result["normalized"]["email"]

    return {
        "is_valid": not errors,
        "errors": errors,
        "normalized": normalized if not errors else {},
    }


def _invalid(field: ErrorField, code: str) -> ValidationResult:
    return {
        "is_valid": False,
        "errors": [build_error(field, code)],
        "normalized": {},
    }


def _is_valid_email_format(email: str) -> bool:
    if django_validate_email is None or DjangoValidationError is None:
        return bool(EMAIL_PATTERN.fullmatch(email))

    try:
        django_validate_email(email)
    except DjangoValidationError:
        return False

    return True
