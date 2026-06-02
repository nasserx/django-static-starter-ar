# Changelog

This changelog tracks notable changes for the reusable Django and static frontend starter template.

## Unreleased

### Added

- Added an MIT `LICENSE` file.
- Added `SECURITY.md` with vulnerability reporting guidance and production security expectations for consuming projects.

### Changed

- Expanded CI validation to run Django system checks, backend tests, standalone backend unit tests, JavaScript syntax checks, gitleaks, and HTML validation.
- Hardened register CSRF protection so `POST /api/auth/register/` is rejected when Django CSRF checks are enforced and no CSRF token is provided.
- Removed the frontend forgot-password placeholder because no password reset backend endpoint exists in the starter.

## v0.1.0 - Initial Stable Starter Baseline

- Initial stable baseline for the Arabic reusable Django and static frontend starter template.
