# Environment Configuration

This starter template keeps real secrets and local runtime configuration out of Git.

Environment example files are safe templates only. Local `.env` files, virtual environments, SQLite databases, caches, logs, and coverage output should stay local and are ignored by `.gitignore`.

## Current State

Tracked environment-related files:

* `.env.example` - safe placeholder example file.
* `backend/config/settings.py` - Django settings with local development defaults and selected environment overrides.
* `frontend/src/js/config.js` - static frontend configuration object.
* `.gitignore` - ignores local environment/config artifacts.

Not present as tracked files:

* `backend.env`
* `frontend.env`
* `backend/.env`
* `frontend/.env`

Local-only files may exist during development and must remain untracked:

* `backend/.env`
* `frontend/.env`
* `backend/db.sqlite3`
* Root `.venv/`
* `backend/.venv/`

Do not commit real secrets or local `.env` files.

## Backend Environment

`backend/config/settings.py` reads a small set of backend settings directly through `os.environ`.

Important behavior:

* Django still does not automatically load `.env` files.
* `python-dotenv`, `django-environ`, or similar env-loading packages are not configured.
* To use `.env` values locally, export them yourself or use external tooling before starting Django.
* If a supported variable is unset or blank, the existing local development default is used.
* Database settings are not environment-driven in this branch.

Supported variables:

| Variable | Purpose | Example | Default when unset or blank |
| --- | --- | --- | --- |
| `DJANGO_SECRET_KEY` | Overrides Django `SECRET_KEY`. Use a generated secret for real deployments. | `DJANGO_SECRET_KEY=change-me-to-a-generated-secret-key` | `django-insecure-development-only-change-me` |
| `DJANGO_DEBUG` | Overrides Django `DEBUG`. Accepts `1`, `true`, `yes`, `on`, `0`, `false`, `no`, `off`. Invalid values raise `ValueError`. | `DJANGO_DEBUG=false` | `True` |
| `DJANGO_ALLOWED_HOSTS` | Overrides Django `ALLOWED_HOSTS` with a comma-separated list. Empty entries are ignored. | `DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1` | `["localhost", "127.0.0.1"]` |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Overrides `CORS_ALLOWED_ORIGINS` with a comma-separated list of frontend origins. | `DJANGO_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5500,http://localhost:5500` | Local frontend origins for ports `3000`, `5173`, and `5500` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Overrides `CSRF_TRUSTED_ORIGINS` with a comma-separated list of trusted frontend origins. | `DJANGO_CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5500,http://localhost:5500` | Local frontend origins for ports `3000`, `5173`, and `5500` |

Optional security hardening variables:

These settings are optional hardening knobs for consuming projects. Their defaults are development-friendly and do not make the starter production-ready by default.

| Variable | Purpose | Example | Default when unset or blank |
| --- | --- | --- | --- |
| `DJANGO_SECURE_SSL_REDIRECT` | Overrides `SECURE_SSL_REDIRECT`. Enable only when Django is served over HTTPS or behind correctly configured HTTPS proxying. | `DJANGO_SECURE_SSL_REDIRECT=true` | `False` |
| `DJANGO_SESSION_COOKIE_SECURE` | Overrides `SESSION_COOKIE_SECURE`. Requires HTTPS for browser session cookies. | `DJANGO_SESSION_COOKIE_SECURE=true` | `False` |
| `DJANGO_CSRF_COOKIE_SECURE` | Overrides `CSRF_COOKIE_SECURE`. Requires HTTPS for the CSRF cookie. | `DJANGO_CSRF_COOKIE_SECURE=true` | `False` |
| `DJANGO_SECURE_HSTS_SECONDS` | Overrides `SECURE_HSTS_SECONDS`. Must be a non-negative integer. `0` disables HSTS. | `DJANGO_SECURE_HSTS_SECONDS=31536000` | `0` |
| `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS` | Overrides `SECURE_HSTS_INCLUDE_SUBDOMAINS`. Use only when HTTPS is correct for all subdomains. | `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=true` | `False` |
| `DJANGO_SECURE_HSTS_PRELOAD` | Overrides `SECURE_HSTS_PRELOAD`. Use only when you understand the domain-wide preload consequences. | `DJANGO_SECURE_HSTS_PRELOAD=true` | `False` |
| `DJANGO_SECURE_REFERRER_POLICY` | Overrides `SECURE_REFERRER_POLICY`. | `DJANGO_SECURE_REFERRER_POLICY=same-origin` | `same-origin` |

Do not enable HSTS preload casually. Preload can affect the whole registered domain and may be difficult to reverse. Secure cookies and SSL redirect require HTTPS; enabling them on local HTTP development can break auth cookies or make the development server unreachable.

Current unchanged development settings include:

* SQLite database at `backend/db.sqlite3`.
* Django REST Framework JSON renderer/parser settings.
* Existing installed apps and middleware order.
* Local frontend CORS/CSRF origins for `3000`, `5173`, and `5500` when env overrides are not set.

Example PowerShell override:

```powershell
$env:DJANGO_DEBUG="false"
.\.venv\Scripts\python.exe backend\manage.py check
Remove-Item Env:\DJANGO_DEBUG
```

## Frontend Environment And Static Config

The frontend is plain static HTML/CSS/JavaScript. It has no build step and does not read `.env` files.

Current code behavior:

* `frontend/src/js/config.js` defines `window.APP_CONFIG`.
* `window.APP_CONFIG.BACKEND_API_BASE_URL` currently points to `http://127.0.0.1:8000`.
* Auth endpoints are configured under `window.APP_CONFIG.endpoints`.
* `frontend/.env` is not consumed by browser JavaScript unless a future build or config injection step is introduced.

Current configured auth endpoints:

* `csrf: "/api/auth/csrf/"`
* `me: "/api/auth/me/"`
* `login: "/api/auth/login/"`
* `logout: "/api/auth/logout/"`
* `register: "/api/auth/register/"`

To change frontend runtime config today, edit or inject `window.APP_CONFIG` before `frontend/src/js/main.js` runs. Do not add Vite, Webpack, React, or another build tool just for env support in this branch.

## Local-Only Files

These files and folders should remain untracked:

* `.env`
* `.env.*`, except `.env.example`
* `backend/.env`
* `frontend/.env`
* `.venv/`
* `backend/.venv/`
* `node_modules/`
* `__pycache__/`
* `.pytest_cache/`
* `db.sqlite3`
* `backend/db.sqlite3`
* `*.sqlite3`
* coverage outputs
* logs

See `.gitignore` for the active ignore rules.

The supported documented Python workflow uses the repository-root `.venv`. `backend/.venv` is ignored as a local artifact and is not the supported documented workflow.

## Copy And Setup Guidance

Current safe pattern:

1. Keep `.env.example` tracked.
2. Do not commit `.env`, `backend/.env`, or `frontend/.env`.
3. Export supported backend variables in your shell or deployment environment when defaults are not enough.
4. Keep frontend runtime config in `window.APP_CONFIG` unless a future branch deliberately introduces a config injection step.

## Future Cleanup Candidates

| Candidate | Risk | Reason | Suggested branch |
| --- | --- | --- | --- |
| Decide whether to keep one root `.env.example` or split into `backend/.env.example` and `frontend/.env.example`. | Low | The current root example is safe but broad. Split examples may be clearer as the template grows. | `feature/template-env-examples` |
| Decide whether `backend.env` and `frontend.env` should exist. | Low | They are not present or consumed today, but the naming question may return during template packaging. | `feature/template-env-examples` |
| Document production deployment environment variables. | Medium | Production docs require decisions about hosting, HTTPS, cookies, CORS, and CSRF. | `feature/production-env-docs` |
| Add database configuration through env variables. | Medium | Database settings affect migrations, tests, and deployment behavior. | `feature/backend-database-env` |
| Add a frontend API base URL strategy for multiple deployments. | Medium | Static frontend config needs a deliberate injection or generated-file approach. | `feature/frontend-runtime-config` |

## Non-Goals

This document does not add automatic `.env` loading, new dependencies, database environment settings, JWTs, token storage, auth redirects, route guards, protected pages, domain-specific features, frontend redesigns, new models, or migrations.
