from __future__ import annotations

import json
import os
import sys
from unittest import TestCase as UnitTestCase

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import SimpleTestCase, override_settings

from app.auth_validation import (
    MAX_PASSWORD_LENGTH,
    validate_auth_payload,
    validate_email,
    validate_login_payload,
    validate_password,
)


_RUNNING_STANDALONE_UNITTEST = any("unittest" in argument for argument in sys.argv) and "test" not in sys.argv

if _RUNNING_STANDALONE_UNITTEST:
    settings.DATABASES["default"]["NAME"] = ":memory:"

if not apps.ready:
    django.setup()

if _RUNNING_STANDALONE_UNITTEST:
    call_command("migrate", interactive=False, verbosity=0)


@override_settings(ALLOWED_HOSTS=["testserver"])
class ApiFoundationTests(SimpleTestCase):
    databases = {"default"}

    def setUp(self) -> None:
        get_user_model()._default_manager.all().delete()

    def test_django_health_endpoint_still_returns_ok(self) -> None:
        response = self.client.get("/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_api_health_endpoint_returns_ok(self) -> None:
        response = self.client.get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "api"})

    def test_register_valid_payload_creates_user(self) -> None:
        response = self._post_register({"email": "USER@example.com", "password": "Password1"})
        data = response.json()
        user = get_user_model()._default_manager.get(email="user@example.com")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["is_valid"])
        self.assertTrue(data["user_created"])
        self.assertEqual(data["message"], "تم إنشاء الحساب بنجاح. تسجيل الدخول سيتم تفعيله لاحقًا.")
        self.assertEqual(data["user"]["id"], user.id)
        self.assertEqual(data["user"]["email"], "user@example.com")
        self.assertEqual(user.email, "user@example.com")

    def test_register_success_response_never_includes_password(self) -> None:
        response = self._post_register({"email": "user@example.com", "password": "Password1"})

        self.assertEqual(response.status_code, 201)
        self.assertNotIn("password", response.content.decode())

    def test_register_password_is_hashed_and_verifiable(self) -> None:
        response = self._post_register({"email": "user@example.com", "password": "Password1"})
        user = get_user_model()._default_manager.get(email="user@example.com")

        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(user.password, "Password1")
        self.assertTrue(user.check_password("Password1"))

    def test_register_duplicate_email_returns_duplicate_error(self) -> None:
        get_user_model()._default_manager.create_user(
            username="user@example.com",
            email="user@example.com",
            password="Password1",
        )

        response = self._post_register({"email": "user@example.com", "password": "Password1"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["is_valid"])
        self.assertEqual(data["errors"][0]["field"], "email")
        self.assertEqual(data["errors"][0]["code"], "auth.email_already_registered")
        self.assertEqual(data["errors"][0]["message"], "البريد الإلكتروني مسجل مسبقًا.")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 1)

    def test_register_duplicate_email_check_is_case_insensitive(self) -> None:
        get_user_model()._default_manager.create_user(
            username="user@example.com",
            email="user@example.com",
            password="Password1",
        )

        response = self._post_register({"email": "  USER@EXAMPLE.COM  ", "password": "Password1"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["errors"][0]["code"], "auth.email_already_registered")
        self.assertEqual(get_user_model()._default_manager.count(), 1)

    def test_register_invalid_email_returns_email_error_and_does_not_create_user(self) -> None:
        response = self._post_register({"email": "invalid-email", "password": "Password1"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["is_valid"])
        self.assertEqual(data["errors"][0]["field"], "email")
        self.assertEqual(data["errors"][0]["code"], "auth.email_invalid")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_invalid_password_returns_password_error_and_does_not_create_user(self) -> None:
        response = self._post_register({"email": "user@example.com", "password": "short"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["is_valid"])
        self.assertEqual(data["errors"][0]["field"], "password")
        self.assertEqual(data["errors"][0]["code"], "auth.password_too_short")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_validation_missing_email_returns_required_error(self) -> None:
        response = self._post_register({"password": "Password1"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["errors"][0]["code"], "auth.email_required")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_validation_missing_password_returns_required_error(self) -> None:
        response = self._post_register({"email": "user@example.com"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["errors"][0]["code"], "auth.password_required")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_validation_invalid_email_and_password_return_both_errors(self) -> None:
        response = self._post_register({"email": "invalid-email", "password": "short"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual([error["field"] for error in data["errors"]], ["email", "password"])
        self.assertEqual([error["code"] for error in data["errors"]], ["auth.email_invalid", "auth.password_too_short"])
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_validation_whitespace_only_password_returns_required_error(self) -> None:
        response = self._post_register({"email": "user@example.com", "password": "        "})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["errors"][0]["field"], "password")
        self.assertEqual(data["errors"][0]["code"], "auth.password_required")
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_validation_get_returns_method_not_allowed(self) -> None:
        response = self.client.get("/api/auth/register/")

        self.assertEqual(response.status_code, 405)

    def test_register_validation_non_object_json_body_returns_general_error(self) -> None:
        response = self._post_register(["user@example.com", "Password1"])
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["is_valid"])
        self.assertEqual(
            data["errors"],
            [
                {
                    "field": "general",
                    "code": "request.invalid_json_body",
                    "message": "صيغة الطلب غير صحيحة.",
                }
            ],
        )
        self.assertEqual(data["normalized"], {})
        self.assertEqual(get_user_model()._default_manager.count(), 0)

    def test_register_success_does_not_log_in_user_or_create_session_cookie(self) -> None:
        response = self._post_register({"email": "user@example.com", "password": "Password1"})

        self.assertEqual(response.status_code, 201)
        self.assertNotIn("_auth_user_id", self.client.session)
        self.assertNotIn("sessionid", response.cookies)

    def test_login_valid_credentials_returns_authenticated_success(self) -> None:
        user = self._create_user(email="user@example.com", password="Password123")

        response = self._post_login({"email": "user@example.com", "password": "Password123"})
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["is_valid"])
        self.assertTrue(data["authenticated"])
        self.assertEqual(data["message"], "تم التحقق من بيانات تسجيل الدخول بنجاح. جلسة تسجيل الدخول سيتم تفعيلها لاحقًا.")
        self.assertEqual(data["user"], {"id": user.id, "email": "user@example.com"})

    def test_login_success_response_never_includes_password_or_token(self) -> None:
        self._create_user(email="user@example.com", password="Password123")

        response = self._post_login({"email": "user@example.com", "password": "Password123"})
        content = response.content.decode()

        self.assertEqual(response.status_code, 200)
        self.assertNotIn("password", content)
        self.assertNotIn("token", content)

    def test_login_wrong_password_returns_generic_invalid_credentials_error(self) -> None:
        self._create_user(email="user@example.com", password="Password123")

        response = self._post_login({"email": "user@example.com", "password": "WrongPassword123"})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            data["errors"],
            [
                {
                    "field": "general",
                    "code": "auth.invalid_credentials",
                    "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
                }
            ],
        )
        self.assertEqual(data["normalized"], {})

    def test_login_unknown_email_returns_same_generic_invalid_credentials_error(self) -> None:
        self._create_user(email="user@example.com", password="Password123")

        wrong_password_response = self._post_login({"email": "user@example.com", "password": "WrongPassword123"})
        unknown_email_response = self._post_login({"email": "missing@example.com", "password": "Password123"})

        self.assertEqual(unknown_email_response.status_code, 400)
        self.assertEqual(unknown_email_response.json(), wrong_password_response.json())

    def test_login_email_lookup_is_case_insensitive_and_trimmed(self) -> None:
        user = self._create_user(email="user@example.com", password="Password123")

        response = self._post_login({"email": "  USER@EXAMPLE.COM  ", "password": "Password123"})
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["authenticated"])
        self.assertEqual(data["user"], {"id": user.id, "email": "user@example.com"})

    def test_login_empty_email_fails_with_required_error(self) -> None:
        response = self._post_login({"email": "", "password": "Password123"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["errors"][0]["code"], "auth.email_required")

    def test_login_empty_password_fails_with_required_error(self) -> None:
        response = self._post_login({"email": "user@example.com", "password": ""})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["errors"][0]["code"], "auth.password_required")

    def test_login_whitespace_only_password_fails_with_required_error(self) -> None:
        response = self._post_login({"email": "user@example.com", "password": " \t\n "})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["errors"][0]["code"], "auth.password_required")

    def test_login_non_string_email_and_password_return_type_errors(self) -> None:
        response = self._post_login({"email": 123, "password": []})
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual([error["code"] for error in data["errors"]], ["auth.email_must_be_string", "auth.password_must_be_string"])
        self.assertEqual(data["normalized"], {})

    def test_login_invalid_json_returns_general_error(self) -> None:
        response = self._post_login(["user@example.com", "Password123"])
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["errors"][0]["code"], "request.invalid_json_body")
        self.assertEqual(data["normalized"], {})

    def test_login_validation_does_not_create_session_cookie_or_persist_auth(self) -> None:
        self._create_user(email="user@example.com", password="Password123")

        response = self._post_login({"email": "user@example.com", "password": "Password123"})

        self.assertEqual(response.status_code, 200)
        self.assertNotIn("_auth_user_id", self.client.session)
        self.assertNotIn("sessionid", response.cookies)

    def test_login_uses_stored_hash_without_registration_strength_policy(self) -> None:
        self._create_user(email="user@example.com", password="short")

        response = self._post_login({"email": "user@example.com", "password": "short"})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["authenticated"])

    def _post_register(self, payload):
        return self.client.post(
            "/api/auth/register/",
            data=json.dumps(payload),
            content_type="application/json",
        )

    def _post_login(self, payload):
        return self.client.post(
            "/api/auth/login/",
            data=json.dumps(payload),
            content_type="application/json",
        )

    def _create_user(self, email: str, password: str):
        return get_user_model()._default_manager.create_user(
            username=email,
            email=email,
            password=password,
        )


class EmailValidationTests(UnitTestCase):
    def test_valid_email_passes(self) -> None:
        result = validate_email("user@example.com")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})

    def test_uppercase_email_is_normalized_to_lowercase(self) -> None:
        result = validate_email("USER@EXAMPLE.COM")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})

    def test_email_with_outer_whitespace_is_trimmed(self) -> None:
        result = validate_email("  user@example.com  ")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})

    def test_empty_email_fails(self) -> None:
        result = validate_email("")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.email_required")
        self.assertEqual(result["normalized"], {})

    def test_whitespace_only_email_fails_as_required(self) -> None:
        for email in (" ", "   ", "\t", "\n", " \t\n "):
            with self.subTest(email=repr(email)):
                result = validate_email(email)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.email_required")
                self.assertEqual(result["normalized"], {})

    def test_none_email_fails(self) -> None:
        result = validate_email(None)

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.email_required")

    def test_non_string_email_fails(self) -> None:
        for email in (123, [], {}, True):
            with self.subTest(email=repr(email)):
                result = validate_email(email)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.email_must_be_string")
                self.assertEqual(result["normalized"], {})

    def test_invalid_email_format_fails(self) -> None:
        invalid_emails = (
            "invalid-email",
            "user",
            "user@",
            "@example.com",
            "user@example",
            "user@@example.com",
            "user example@example.com",
        )

        for email in invalid_emails:
            with self.subTest(email=email):
                result = validate_email(email)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.email_invalid")
                self.assertEqual(result["normalized"], {})


class PasswordValidationTests(UnitTestCase):
    def test_valid_password_passes(self) -> None:
        result = validate_password("StrongPass1")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["normalized"], {})

    def test_empty_password_fails(self) -> None:
        result = validate_password("")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_required")
        self.assertEqual(result["normalized"], {})

    def test_whitespace_only_password_fails_as_required(self) -> None:
        for password in (" ", "        ", "\t", "\n", " \t\n "):
            with self.subTest(password=repr(password)):
                result = validate_password(password)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.password_required")
                self.assertEqual(result["normalized"], {})

    def test_none_password_fails(self) -> None:
        result = validate_password(None)

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_required")

    def test_non_string_password_fails(self) -> None:
        for password in (12345678, [], {}, True):
            with self.subTest(password=repr(password)):
                result = validate_password(password)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.password_must_be_string")
                self.assertEqual(result["normalized"], {})

    def test_short_password_fails(self) -> None:
        result = validate_password("Abc123")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_too_short")

    def test_password_over_128_characters_fails(self) -> None:
        result = validate_password(f"A1{'a' * MAX_PASSWORD_LENGTH}")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_too_long")

    def test_password_without_number_fails(self) -> None:
        result = validate_password("StrongPassword")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_missing_number")

    def test_password_without_letter_fails(self) -> None:
        result = validate_password("123456789")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_missing_letter")

    def test_password_with_leading_space_fails(self) -> None:
        result = validate_password(" StrongPass1")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_has_outer_spaces")

    def test_password_with_trailing_space_fails(self) -> None:
        result = validate_password("StrongPass1 ")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_has_outer_spaces")

    def test_password_with_leading_and_trailing_spaces_fails(self) -> None:
        result = validate_password(" Password1 ")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_has_outer_spaces")

    def test_password_with_internal_space_passes(self) -> None:
        result = validate_password("Pass word1")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["normalized"], {})

    def test_common_weak_password_fails(self) -> None:
        weak_passwords = ("password", "password123", "12345678", "qwerty123", "admin123")

        for password in weak_passwords:
            with self.subTest(password=password):
                result = validate_password(password)

                self.assertFalse(result["is_valid"])
                self.assertEqual(result["errors"][0]["code"], "auth.password_too_common")
                self.assertEqual(result["normalized"], {})

    def test_common_weak_password_check_is_case_insensitive(self) -> None:
        result = validate_password("Password123")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_too_common")
        self.assertEqual(result["normalized"], {})


class AuthPayloadValidationTests(UnitTestCase):
    def test_valid_email_and_password_passes(self) -> None:
        result = validate_auth_payload("USER@example.com", "StrongPass1")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})

    def test_invalid_email_and_valid_password_fails(self) -> None:
        result = validate_auth_payload("invalid-email", "StrongPass1")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["field"], "email")
        self.assertEqual(result["normalized"], {})

    def test_valid_email_and_invalid_password_fails(self) -> None:
        result = validate_auth_payload("user@example.com", "short")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["field"], "password")
        self.assertEqual(result["normalized"], {})

    def test_invalid_email_and_invalid_password_return_both_errors(self) -> None:
        result = validate_auth_payload("invalid-email", "short")

        self.assertFalse(result["is_valid"])
        self.assertEqual([error["field"] for error in result["errors"]], ["email", "password"])
        self.assertEqual(result["normalized"], {})

    def test_invalid_email_and_whitespace_password_return_both_errors(self) -> None:
        result = validate_auth_payload("invalid-email", "        ")

        self.assertFalse(result["is_valid"])
        self.assertEqual([error["field"] for error in result["errors"]], ["email", "password"])
        self.assertEqual(
            [error["code"] for error in result["errors"]],
            ["auth.email_invalid", "auth.password_required"],
        )
        self.assertEqual(result["normalized"], {})

    def test_normalized_output_contains_only_email_and_never_password(self) -> None:
        result = validate_auth_payload("  USER@example.com  ", "StrongPass1")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})
        self.assertNotIn("password", result["normalized"])

    def test_invalid_payload_never_returns_password_in_normalized_output(self) -> None:
        result = validate_auth_payload("user@example.com", "short")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["normalized"], {})
        self.assertNotIn("password", result["normalized"])


class LoginPayloadValidationTests(UnitTestCase):
    def test_valid_login_payload_passes_with_normalized_email_only(self) -> None:
        result = validate_login_payload("  USER@example.com  ", "short")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["normalized"], {"email": "user@example.com"})
        self.assertNotIn("password", result["normalized"])

    def test_login_payload_does_not_apply_registration_password_strength_rules(self) -> None:
        result = validate_login_payload("user@example.com", "short")

        self.assertTrue(result["is_valid"])
        self.assertEqual(result["errors"], [])

    def test_login_payload_empty_email_fails(self) -> None:
        result = validate_login_payload("", "Password123")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.email_required")
        self.assertEqual(result["normalized"], {})

    def test_login_payload_empty_password_fails(self) -> None:
        result = validate_login_payload("user@example.com", "")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_required")
        self.assertEqual(result["normalized"], {})

    def test_login_payload_whitespace_only_password_fails(self) -> None:
        result = validate_login_payload("user@example.com", " \t\n ")

        self.assertFalse(result["is_valid"])
        self.assertEqual(result["errors"][0]["code"], "auth.password_required")
        self.assertEqual(result["normalized"], {})

    def test_login_payload_non_string_email_and_password_fail(self) -> None:
        result = validate_login_payload(123, [])

        self.assertFalse(result["is_valid"])
        self.assertEqual([error["code"] for error in result["errors"]], ["auth.email_must_be_string", "auth.password_must_be_string"])
        self.assertEqual(result["normalized"], {})
