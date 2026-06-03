# Changelog

This changelog tracks notable changes for the reusable Django and static frontend starter template.

## Unreleased

No unreleased changes.

## v0.1.4 - Optional Security Settings Hardening

### Added

- Added optional environment-driven Django security settings for SSL redirect, secure session/CSRF cookies, HSTS, and referrer policy.

### Changed

- Preserved local-development-safe defaults while documenting the new optional hardening knobs.
- Confirmed the frontend, runtime auth model, dependencies, and build workflow remain unchanged.

## v0.1.3 - Frontend Contract and Template Cleanup

### Changed

- Converted the hero email/signup form into a static demo-only form.
- Confirmed the backend contract remains limited to the documented health and auth endpoints.

### Removed

- Removed the unsupported Google OAuth placeholder from the default frontend.
- Removed unsupported `/api/trial` frontend behavior.
- Removed unused empty backend placeholder modules while keeping Python package marker files.

## v0.1.2 - Frontend CSRF Registration Fix

### Fixed

- Fixed frontend registration POST handling so the static frontend requests the CSRF cookie and sends `X-CSRFToken` with credentials for Django session/cookie auth.

## v0.1.1 - Public Template Hardening

### Added

- Added an MIT `LICENSE` file.
- Added `SECURITY.md` with vulnerability reporting guidance and production security expectations for consuming projects.

### Changed

- Expanded CI validation to run Django system checks, backend tests, standalone backend unit tests, JavaScript syntax checks, gitleaks, and HTML validation.
- Hardened register CSRF protection so `POST /api/auth/register/` is rejected when Django CSRF checks are enforced and no CSRF token is provided.
- Removed the frontend forgot-password placeholder because no password reset backend endpoint exists in the starter.

## v0.1.0 - Initial Stable Starter Baseline

- Initial stable baseline for the Arabic reusable Django and static frontend starter template.
