# Template Structure Audit

This repository is being prepared as a reusable Django backend + static frontend starter template.

The current goal is to preserve the working auth foundation and frontend design while documenting what exists before later cleanup branches reorganize or generalize the project further.

## Purpose

Use this repository as a starter for future apps that need:

* A Django backend with session/cookie authentication.
* A static HTML/CSS/JavaScript frontend.
* A preserved, ready-to-customize frontend design.
* Clear separation between reusable template foundation and app-specific domain features.

The base template should stay generic. App-specific product logic should be added only in derived projects or separate feature branches.

## Top-Level Structure

* `backend/` - Django backend and API.
* `frontend/` - static frontend application.
* `docs/` - project and template documentation.
* `.github/` - CI and dependency automation.
* `README.md` - human-facing entry point.
* `CODEX.md` - AI-agent working notes and long-running implementation history.
* `CLAUDE.md` - older AI-agent guidance; currently describes an earlier frontend-only state and should be reconciled later.
* `BACKEND_INTEGRATION.md` - older backend integration guide; useful context, but some paths still reflect the previous frontend-only structure.
* `docs/environment.md` - current environment/configuration audit and future env cleanup notes.
* `.env.example` - tracked environment example placeholder.
* `.gitignore` - local/cache/generated file ignore rules.

## Backend Structure

Current backend layout:

```text
backend/
├── manage.py
├── requirements.txt
├── config/
├── app/
└── common/
```

Important folders:

* `backend/config/` - Django project package with settings, URL routing, ASGI, and WSGI modules.
* `backend/app/` - current early-stage Django app containing API endpoints, auth validation, and tests.
* `backend/common/` - shared backend utilities such as centralized error definitions.

Current notable backend files:

* `backend/app/api.py` - API endpoints for health, register, CSRF, login, `/me`, and logout.
* `backend/app/auth_validation.py` - email/password validation helpers.
* `backend/app/tests.py` - backend auth/API tests.
* `backend/common/errors.py` - centralized error shapes, codes, messages, and `build_error()`.
* `backend/config/settings.py` - minimal Django, DRF, and local CORS/CSRF settings.
* `backend/config/urls.py` - current route registration.
* `backend/requirements.txt` - backend Python dependencies.

Placeholder backend files currently exist and should be reviewed in a later cleanup branch:

* `backend/app/admin.py`
* `backend/app/models.py`
* `backend/app/selectors.py`
* `backend/app/serializers.py`
* `backend/app/services.py`
* `backend/app/urls.py`
* `backend/app/views.py`
* `backend/common/pagination.py`
* `backend/common/responses.py`
* `backend/common/utils.py`

Do not remove these placeholders during this audit branch. Decide later whether they help template clarity or add noise.

## Frontend Structure

Current frontend layout:

```text
frontend/
├── index.html
├── partials/
├── public/
├── pages/
└── src/
```

Important folders:

* `frontend/index.html` - static frontend entry point.
* `frontend/partials/` - partial HTML folder currently present but empty.
* `frontend/public/assets/` - public static assets and manifest/icons.
* `frontend/src/css/` - CSS tokens, layout, and component styles.
* `frontend/src/js/` - frontend JavaScript including config, main behavior, theme handling, auth API helpers, and memory-only auth state.
* `frontend/src/pages/` - page-specific JavaScript placeholder folder currently present but empty.
* `frontend/pages/` - top-level page placeholder folder currently present but empty.

There are currently two page placeholder locations: `frontend/pages/` and `frontend/src/pages/`. Their intended responsibilities should be clarified in a later cleanup branch before either is removed.

## Current Auth Foundation

The current auth foundation uses Django session/cookie authentication.

Backend endpoints:

* `POST /api/auth/register/` - validates registration input and creates a Django built-in user.
* `GET /api/auth/csrf/` - sets the Django CSRF cookie for unsafe session requests.
* `POST /api/auth/login/` - validates credentials and creates a Django session with `login(request, user)`.
* `GET /api/auth/me/` - reads the current session state and returns safe user data or anonymous state.
* `POST /api/auth/logout/` - destroys the Django session with `logout(request)` and is idempotent.

Frontend behavior:

* Calls `/api/auth/me/` on page load.
* Keeps authenticated state in memory only through `window.AuthSession`.
* Updates the nav to show user email and logout when authenticated.
* Clears memory/UI state after logout.
* Does not store auth state in `localStorage` or `sessionStorage`.
* Does not use JWTs or frontend tokens.

## Local-Only Files Observed

The audit found these local-only files/folders in the working tree:

* Root `.venv/`
* `backend/.venv/`
* `backend/.env`
* `frontend/.env`
* `backend/db.sqlite3`
* Generated `__pycache__/` folders after tests run

These are ignored by `.gitignore` and were not removed in this branch. If any local-only files become tracked in the future, remove them in a separate cleanup branch with a focused commit.

## Cleanup Candidates For Later Branches

Potential future cleanup work:

* Decide whether to keep `backend/app/` or split/rename it into clearer apps such as `accounts`, `core`, or `api`.
* Decide whether placeholder backend files should stay for template guidance or be removed until needed.
* Split `frontend/src/js/main.js` into smaller modules.
* Clarify `frontend/pages/` versus `frontend/src/pages/`.
* Reconcile older docs that still describe the previous frontend-only template and older asset paths.
* Improve environment/settings documentation.
* Add template usage docs for creating a new app from this starter.
* Add a base dashboard shell in a later feature branch.

## Future Template Work Rules

Use these rules when evolving the template:

* Preserve the current frontend design unless a branch explicitly changes design.
* Keep the base template generic.
* Avoid app-specific domain logic in the base template.
* Add product-specific features only in derived projects or clearly scoped feature branches.
* Keep auth state memory-only unless a future branch deliberately changes that decision.
* Do not add JWTs or frontend token storage by default.
* Keep Django session/cookie auth as the default auth strategy.
* Keep local/cache/generated files out of Git.
