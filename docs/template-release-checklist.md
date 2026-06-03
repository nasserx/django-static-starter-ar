# Template Release Checklist

Use this checklist before treating this repository as a reusable starter template release, or before copying, branching, or deriving a downstream project from it.

This is not a deployment checklist for a specific product. It does not replace project-specific QA for downstream applications.

## Overview

The checklist validates the neutral Django backend + static frontend starter template.

It focuses on:

* Documentation accuracy.
* Repository hygiene.
* Backend/API/auth readiness.
* Frontend static-template readiness.
* Security and domain-neutrality checks.
* Manual QA before reuse.

## Release Readiness Status

Use this section as the top-level release gate:

* [ ] Documentation is complete and internally linked.
* [ ] Repository hygiene checks pass.
* [ ] Backend checks and tests pass.
* [ ] Frontend syntax and HTML checks pass.
* [ ] API documentation matches implementation.
* [ ] API success and error contracts are documented.
* [ ] Session/cookie auth behavior is intact.
* [ ] Auth/security boundaries are documented.
* [ ] Frontend auth session behavior is documented.
* [ ] `LICENSE`, `SECURITY.md`, and `CHANGELOG.md` exist.
* [ ] `CHANGELOG.md` is updated before release without marking unreleased work as released.
* [ ] No secrets or local artifacts are tracked.
* [ ] No domain-specific implementation was added to the base template.
* [ ] Manual auth QA has been completed.
* [ ] Release notes are drafted.

## Documentation Checklist

Verify:

* [ ] `README.md` exists and points to current docs.
* [ ] `docs/template-usage.md#project-structure` reflects the current structure.
* [ ] `docs/environment.md` exists and reflects current env behavior.
* [ ] `docs/local-development.md` exists and includes current setup/check commands.
* [ ] Backend commands use the repository-root `.venv` workflow.
* [ ] Docs state that `backend/.venv` is not the supported documented workflow.
* [ ] `docs/api.md` exists and matches implemented endpoints.
* [ ] `docs/api.md` documents current success and error response contracts.
* [ ] `docs/template-usage.md` exists and explains safe downstream usage.
* [ ] `docs/template-usage.md` documents auth/security boundaries and frontend auth session behavior.
* [ ] `LICENSE` exists.
* [ ] `SECURITY.md` exists and reflects template security expectations.
* [ ] `CHANGELOG.md` exists and has an accurate `Unreleased` section before release.
* [ ] `CODEX.md` is up to date if used as the working log.
* [ ] Docs are internally linked where useful.
* [ ] Docs state that backend settings read only the supported environment variables.
* [ ] Docs state that `.env` files are not automatically loaded.
* [ ] Docs state that `.env.example` is example-only.
* [ ] Docs do not describe domain-specific product features as part of the base template.
* [ ] Docs clearly state that auth uses Django session/cookie authentication, not JWT.
* [ ] Docs clearly state that frontend auth state is memory-only.
* [ ] Docs do not present `.\.venv\Scripts\python.exe backend\manage.py test` as the main repository-root test command.
* [ ] Docs use `.\.venv\Scripts\python.exe backend\manage.py test app` as the official Django app test command.

## Repository Hygiene Checklist

Verify:

* [ ] `git status` is clean before release.
* [ ] `git diff --check` passes.
* [ ] Stale project-name grep checks find no legacy frontend-template or Django-template repository names.
* [ ] No real secrets are tracked.
* [ ] Local `.env` files are ignored and not tracked.
* [ ] `.env` files remain ignored.
* [ ] `.env.example` contains placeholders only and does not load automatically.
* [ ] SQLite database files are ignored and not tracked.
* [ ] Virtual environments are ignored and not tracked.
* [ ] `node_modules/` is ignored and not tracked.
* [ ] No `package.json` or frontend package manager workflow was introduced unless intentionally approved.
* [ ] No new dependencies were added unless intentionally approved.
* [ ] Logs, cache files, coverage outputs, and generated artifacts are ignored and not tracked.
* [ ] Frontend public assets are not accidentally ignored.
* [ ] Documentation files are not accidentally ignored.
* [ ] `.gitignore` does not hide source files too broadly.

## Backend Checklist

Verify:

* [ ] Backend requirements install correctly from `backend/requirements.txt`.
* [ ] Backend requirements are installed into the repository-root `.venv`.
* [ ] Django system check passes.
* [ ] Python dependency check passes with `.\.venv\Scripts\python.exe -m pip check`.
* [ ] Migrations are in a known good state for local auth/session tables.
* [ ] Django app test runner passes with `.\.venv\Scripts\python.exe backend\manage.py test app`.
* [ ] Standalone unittest discovery passes with `.\.venv\Scripts\python.exe -m unittest discover backend`.
* [ ] Supported backend env vars are documented.
* [ ] Backend env defaults still support local development.
* [ ] Development `manage.py check --deploy` warnings are understood and expected unless production settings are configured.
* [ ] Register creates Django users using hashed passwords.
* [ ] Register does not log users in automatically.
* [ ] Session login behavior remains intact.
* [ ] Session logout behavior remains intact and idempotent.
* [ ] CSRF endpoint works.
* [ ] `/api/auth/me/` works for anonymous state.
* [ ] `/api/auth/me/` works for authenticated state.
* [ ] API responses do not return password, password hash, token, session key, or CSRF token.
* [ ] `/api/auth/me/` does not return permissions, groups, or staff/superuser flags.
* [ ] JWT or token storage behavior has not been introduced.
* [ ] No domain-specific Django apps, models, or endpoints were added to the base template.

## Frontend Checklist

Verify:

* [ ] JavaScript syntax checks pass for current JS files.
* [ ] `html-validate` passes.
* [ ] Current frontend design remains unchanged unless a scoped design branch intentionally changes it.
* [ ] Frontend requests CSRF before login/logout where needed.
* [ ] Frontend uses `credentials: "include"` for session requests.
* [ ] Frontend auth state remains memory-only through `window.AuthSession`.
* [ ] Frontend auth session behavior is documented.
* [ ] No token persistence was added.
* [ ] No auth data persistence was added to `localStorage` or `sessionStorage`.
* [ ] No unsupported frontend API placeholders exist for nonexistent backend endpoints.
* [ ] No forgot-password or reset-password UI/API behavior exists unless a real backend endpoint is added and documented.
* [ ] No redirects were added to the base auth flow.
* [ ] No route guards or protected pages were added to the base template.
* [ ] No frontend build tooling was introduced unintentionally.
* [ ] No npm workflow was introduced unintentionally.

## API Checklist

Verify:

* [ ] Documented endpoints match implemented endpoints.
* [ ] Official endpoints remain limited to:

  * `GET /health/`
  * `GET /api/health/`
  * `GET /api/auth/csrf/`
  * `POST /api/auth/register/`
  * `POST /api/auth/login/`
  * `GET /api/auth/me/`
  * `POST /api/auth/logout/`

* [ ] No forgot-password or reset-password endpoint is documented unless it is implemented.
* [ ] Documented success response shapes match implemented response shapes.
* [ ] Documented error response shapes and status codes match implemented behavior.
* [ ] `GET /health/` works.
* [ ] `GET /api/health/` works.
* [ ] `GET /api/auth/csrf/` sets the CSRF cookie.
* [ ] `POST /api/auth/register/` creates a user, requires CSRF, and does not log in automatically.
* [ ] `POST /api/auth/login/` creates a session and requires CSRF.
* [ ] `GET /api/auth/me/` returns the anonymous response shape.
* [ ] `GET /api/auth/me/` returns the authenticated response shape.
* [ ] `POST /api/auth/logout/` is CSRF-protected.
* [ ] `POST /api/auth/logout/` is idempotent.
* [ ] Duplicate registration remains case-insensitive.
* [ ] Login errors do not reveal whether an email exists.

## Security Checklist

Verify:

* [ ] No real secrets are committed.
* [ ] `.env.example` contains placeholders only.
* [ ] `.env` files are not automatically loaded by Django.
* [ ] Passwords are not logged or returned.
* [ ] Password hashes are not returned.
* [ ] Session keys are not returned.
* [ ] CSRF behavior is documented and tested.
* [ ] Auth tokens are not stored in browser storage.
* [ ] CSRF tokens are documented as request-protection details, not login tokens.
* [ ] Backend validation remains authoritative.
* [ ] Frontend validation is treated as UX only.
* [ ] Login uses one generic invalid credentials error for unknown email and wrong password.
* [ ] The starter is documented as development-friendly by default, not production-safe out of the box.
* [ ] Consuming projects must set production values for `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ALLOWED_ORIGINS`, and `DJANGO_CSRF_TRUSTED_ORIGINS`.
* [ ] `manage.py check --deploy` warnings such as `SECURE_HSTS_SECONDS`, `SECURE_SSL_REDIRECT`, development `SECRET_KEY`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, and `DEBUG=True` are expected for the development starter unless production settings are configured.

## Domain-Neutrality Checklist

Verify:

* [ ] No trading-specific logic exists in the base template.
* [ ] No stock-specific logic exists in the base template.
* [ ] No store or e-commerce-specific logic exists in the base template.
* [ ] No wallet or payment-specific logic exists in the base template.
* [ ] No dashboard, product, order, analytics, or domain models exist in the base template.
* [ ] Domain-specific projects are documented as downstream uses only.

## Manual QA Checklist

Run a concise manual pass:

1. Start the backend:

```powershell
.\.venv\Scripts\Activate.ps1
python backend\manage.py runserver
```

2. Serve the frontend:

```powershell
cd frontend
python -m http.server 5500
```

3. Open:

```text
http://127.0.0.1:5500/
```

4. Check health endpoints:

* [ ] `GET http://127.0.0.1:8000/health/`
* [ ] `GET http://127.0.0.1:8000/api/health/`

5. Request CSRF:

* [ ] `GET http://127.0.0.1:8000/api/auth/csrf/`
* [ ] Confirm `csrftoken` cookie is set.

6. Register:

* [ ] Register a new user.
* [ ] Confirm success.
* [ ] Confirm registration does not auto-login.
* [ ] Confirm password fields clear.

7. Duplicate registration:

* [ ] Register the same email with different casing.
* [ ] Confirm duplicate email error.
* [ ] Confirm no second user is created.

8. Login:

* [ ] Log in with valid credentials.
* [ ] Confirm session is created.
* [ ] Confirm UI switches to authenticated state.

9. Refresh:

* [ ] Refresh the page.
* [ ] Confirm `/api/auth/me/` detects the existing session.

10. Check current user:

* [ ] `GET /api/auth/me/` with credentials returns authenticated user id/email.

11. Logout:

* [ ] Log out.
* [ ] Confirm UI returns to anonymous state.

12. Verify anonymous state:

* [ ] `GET /api/auth/me/` returns `authenticated: false` and `user: null`.

13. Inspect browser storage:

* [ ] No JWT.
* [ ] No auth tokens.
* [ ] No password.
* [ ] No persisted user auth data.

14. Inspect auth responses:

* [ ] No password.
* [ ] No password hash.
* [ ] No token.
* [ ] No session key.
* [ ] No CSRF token value.
* [ ] No staff/superuser flags.
* [ ] No permissions.

## Standard Commands

Backend:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe backend\manage.py check
.\.venv\Scripts\python.exe backend\manage.py test app
.\.venv\Scripts\python.exe -m unittest discover backend
.\.venv\Scripts\python.exe -m pip check
```

Use `backend\manage.py test app` from the repository root. Plain `backend\manage.py test` may complete while discovering zero tests and is not the documented release command.

Frontend:

```powershell
cd frontend
node --check src\js\main.js
node --check src\js\config.js
npx --yes html-validate@9 "*.html" "partials/*.html"
```

Repository:

Run the stale project-name grep checks from the release task; they should print no matches.

```powershell
git diff --check
git status
```

On macOS/Linux or different Windows setups, use the equivalent Python executable from the repository-root virtual environment. `backend/.venv` is not the supported documented workflow. Do not change project behavior just because the local virtualenv path differs.

## Release Notes Template

Use this template for future starter-template release notes:

```markdown
# Release Notes

Version/date:

Branch/commit:

Summary:

Docs changed:

Behavior changes:

Checks run:

Known cleanup candidates:

Downstream notes:
```

For behavior changes, write `None` if the release is documentation-only.

## Known Non-Goals For This Template Release

This starter release does not include:

* JWT.
* Protected pages.
* Dashboard implementation.
* Domain-specific app.
* Deployment automation.
* Frontend build system.
* OpenAPI generation.
* `backend/app` rename.
* `frontend/src/js/main.js` split.

## Future Release Candidates

These are future branch candidates only.

| Candidate | Risk | Reason |
| --- | --- | --- |
| Backend env settings | Medium | Add deliberate environment parsing for Django settings without surprising runtime changes. |
| Deployment docs | Low | Document production hosting, HTTPS, cookies, allowed hosts, CORS, and CSRF later. |
| CI expansion | Medium | Broaden automated checks beyond the current official checks once the desired CI policy is clear. |
| Optional OpenAPI/schema docs | Medium | Add machine-readable API docs if a future branch accepts the dependency/tooling. |
| Frontend component docs | Low | Help downstream teams customize the static frontend safely. |
| `backend/app` rename analysis | High | Evaluate clearer backend app naming without breaking imports or tests. |
| Frontend JS split analysis | Medium | Plan a safe split of `frontend/src/js/main.js` without changing behavior. |

Keep future release work focused, documented, and verified with the standard checks.
