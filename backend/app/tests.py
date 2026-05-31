from __future__ import annotations

from unittest import TestCase

from app.auth_validation import (
    MAX_PASSWORD_LENGTH,
    validate_auth_payload,
    validate_email,
    validate_password,
)


class EmailValidationTests(TestCase):
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


class PasswordValidationTests(TestCase):
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


class AuthPayloadValidationTests(TestCase):
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
