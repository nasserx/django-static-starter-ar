# Environment Configuration

This starter template should keep real secrets and local runtime configuration out of Git.

Environment example files are safe templates only. Local `.env` files, virtual environments, SQLite databases, caches, logs, and coverage output should stay local and are ignored by `.gitignore`.

## Current State

Tracked environment-related files:

* `.env.example` - safe placeholder example file.
* `backend/config/settings.py` - Django settings with hardcoded local development defaults.
* `frontend/src/js/config.js` - static frontend configuration object.
* `.gitignore` - ignores local environment/config artifacts.

Not present as tracked files:

* `backend.env`
* `frontend.env`
* `backend/.env`
* `frontend/.env`

Local-only files observed during the audit:

* `backend/.env` - ignored, local-only, empty at audit time.
* `frontend/.env` - ignored, local-only, empty at audit time.
* `backend/db.sqlite3` - ignored local SQLite file.
* Root `.venv/` and `backend/.venv/` - ignored local virtual environments.

Do not commit real secrets or local `.env` files.

## Backend Environment

Backend local settings should eventually live in `backend/.env` or another clearly documented local-only mechanism.

Current code behavior:

* `backend/config/settings.py` does not read `.env`.
* `backend/config/settings.py` does not call `os.environ`.
* `python-dotenv`, `django-environ`, or similar env-loading packages are not configured.
* The backend currently uses development defaults directly in `settings.py`.

Currently supported variables:

* None through environment variables.

Current hardcoded development settings include:

* `SECRET_KEY = "django-insecure-development-only-change-me"`
* `DEBUG = True`
* `ALLOWED_HOSTS = ["localhost", "127.0.0.1"]`
* SQLite database at `backend/db.sqlite3`
* Local frontend CORS/CSRF origins for `3000`, `5173`, and `5500`

Recommended future backend variables:

* `DJANGO_SECRET_KEY`
* `DJANGO_DEBUG`
* `DJANGO_ALLOWED_HOSTS`
* `CORS_ALLOWED_ORIGINS`
* `CSRF_TRUSTED_ORIGINS`
* `DATABASE_URL` or explicit database settings

These future variables are not consumed yet. A later branch should add env parsing deliberately, with tests and clear local setup documentation.

## Frontend Environment And Static Config

The frontend is plain static HTML/CSS/JavaScript. It has no build step and does not read `.env` files.

Current code behavior:

* `frontend/src/js/config.js` defines `window.APP_CONFIG`.
* `window.APP_CONFIG.BACKEND_API_BASE_URL` currently points to `http://127.0.0.1:8000`.
* Auth endpoints are configured under `window.APP_CONFIG.endpoints`.
* `frontend/.env` is not consumed by the browser.

Current configured auth endpoints:

* `csrf: "/api/auth/csrf/"`
* `me: "/api/auth/me/"`
* `login: "/api/auth/login/"`
* `logout: "/api/auth/logout/"`
* `register: "/api/auth/register/"`

To change frontend runtime config today, edit or inject `window.APP_CONFIG` before `frontend/src/js/main.js` runs. Do not add Vite, Webpack, React, or another build tool just for env support in this branch.

Recommended future frontend config work:

* Decide whether deployments should inject `window.APP_CONFIG` from server-rendered HTML.
* Decide whether static hosting should use a generated config file.
* Document how derived projects override `BACKEND_API_BASE_URL` per environment.

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

## Copy And Setup Guidance

Current safe pattern:

1. Keep `.env.example` tracked.
2. Do not commit `.env`, `backend/.env`, or `frontend/.env`.
3. Treat `.env.example` as documentation until env loading is implemented.

If a future branch adds backend env loading, a reasonable local setup could be:

```powershell
Copy-Item .env.example backend\.env
```

That command is only future guidance. The current backend does not read `backend/.env`.

## Future Cleanup Candidates

| Candidate | Risk | Reason | Suggested branch |
| --- | --- | --- | --- |
| Decide whether to keep one root `.env.example` or split into `backend/.env.example` and `frontend/.env.example`. | Low | The current root example is safe but broad. Split examples may be clearer as the template grows. | `feature/template-env-examples` |
| Decide whether `backend.env` and `frontend.env` should exist. | Low | They are not present or consumed today, but the naming question may return during template packaging. | `feature/template-env-examples` |
| Add robust environment parsing to Django settings. | Medium | This changes runtime behavior and must be tested carefully. | `feature/backend-env-settings` |
| Document production deployment environment variables. | Medium | Production docs require decisions about hosting, HTTPS, cookies, CORS, and CSRF. | `feature/production-env-docs` |
| Add database configuration through env variables. | Medium | Database settings affect migrations, tests, and deployment behavior. | `feature/backend-database-env` |
| Add a frontend API base URL strategy for multiple deployments. | Medium | Static frontend config needs a deliberate injection or generated-file approach. | `feature/frontend-runtime-config` |

## Non-Goals

This document does not introduce runtime behavior changes.

It does not add JWTs, token storage, redirects, route guards, protected pages, domain-specific features, frontend redesigns, new models, migrations, or new environment-loading dependencies.
