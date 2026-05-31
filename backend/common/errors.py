from __future__ import annotations

from typing import Final, Literal, TypedDict


ErrorField = Literal["email", "password", "general"]


class AppError(TypedDict):
    field: ErrorField
    code: str
    message: str


class AuthErrorCode:
    EMAIL_REQUIRED: Final = "auth.email_required"
    EMAIL_MUST_BE_STRING: Final = "auth.email_must_be_string"
    EMAIL_INVALID: Final = "auth.email_invalid"
    EMAIL_ALREADY_REGISTERED: Final = "auth.email_already_registered"
    PASSWORD_REQUIRED: Final = "auth.password_required"
    PASSWORD_MUST_BE_STRING: Final = "auth.password_must_be_string"
    PASSWORD_TOO_SHORT: Final = "auth.password_too_short"
    PASSWORD_TOO_LONG: Final = "auth.password_too_long"
    PASSWORD_MISSING_LETTER: Final = "auth.password_missing_letter"
    PASSWORD_MISSING_NUMBER: Final = "auth.password_missing_number"
    PASSWORD_HAS_OUTER_SPACES: Final = "auth.password_has_outer_spaces"
    PASSWORD_TOO_COMMON: Final = "auth.password_too_common"


class RequestErrorCode:
    INVALID_JSON_BODY: Final = "request.invalid_json_body"


DEFAULT_ERROR_MESSAGES: Final[dict[str, str]] = {
    AuthErrorCode.EMAIL_REQUIRED: "البريد الإلكتروني مطلوب.",
    AuthErrorCode.EMAIL_MUST_BE_STRING: "البريد الإلكتروني يجب أن يكون نصًا.",
    AuthErrorCode.EMAIL_INVALID: "صيغة البريد الإلكتروني غير صحيحة.",
    AuthErrorCode.EMAIL_ALREADY_REGISTERED: "البريد الإلكتروني مسجل مسبقًا.",
    AuthErrorCode.PASSWORD_REQUIRED: "كلمة المرور مطلوبة.",
    AuthErrorCode.PASSWORD_MUST_BE_STRING: "كلمة المرور يجب أن تكون نصًا.",
    AuthErrorCode.PASSWORD_TOO_SHORT: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    AuthErrorCode.PASSWORD_TOO_LONG: "كلمة المرور يجب ألا تتجاوز 128 حرفًا.",
    AuthErrorCode.PASSWORD_MISSING_LETTER: "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل.",
    AuthErrorCode.PASSWORD_MISSING_NUMBER: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.",
    AuthErrorCode.PASSWORD_HAS_OUTER_SPACES: "كلمة المرور لا يجب أن تبدأ أو تنتهي بمسافة.",
    AuthErrorCode.PASSWORD_TOO_COMMON: "كلمة المرور ضعيفة جدًا.",
    RequestErrorCode.INVALID_JSON_BODY: "صيغة الطلب غير صحيحة.",
}

UNKNOWN_ERROR_MESSAGE: Final = "حدث خطأ غير متوقع."


def build_error(field: ErrorField, code: str) -> AppError:
    return {
        "field": field,
        "code": code,
        "message": DEFAULT_ERROR_MESSAGES.get(code, UNKNOWN_ERROR_MESSAGE),
    }
