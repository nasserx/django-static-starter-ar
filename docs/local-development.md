# Local Development

This guide explains how to run the reusable Django backend + static frontend starter template locally from a fresh clone.

It is for local development only. Production deployment, hosting, HTTPS, production cookie settings, and deployment-specific CORS/CSRF configuration are out of scope here.

For guidance on using this repository as a starter for future projects, see [template-usage.md](./template-usage.md).

## Overview

The project has two independently served parts:

* `backend/` - Django, Django REST Framework, and `django-cors-headers`.
* `frontend/` - static HTML/CSS/JavaScript with no build step.

The current auth strategy is Django session/cookie authentication:

* Register creates Django users.
* Login creates a Django session and is CSRF-protected.
* `/api/auth/me/` reads current session state.
* Logout destroys the session and is CSRF-protected.
* Frontend auth state is memory-only through `window.AuthSession`.

No JWT, token storage, redirects, route guards, protected pages, or frontend auth persistence are part of the starter.

## Prerequisites

Recommended local tools:

* Git.
* Python 3.10 or newer for Django 5.x.
* Node.js and npm for frontend checks only.
* A modern browser.
* SQLite support through Python, which is normally included with standard Python installs.

There is no frontend package install or build step in the current template.

## Fresh Clone Setup

Clone the repository:

```powershell
git clone <repository-url>
cd html-frontend-template
```

Create and activate the backend virtual environment:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Environment file behavior is documented in [environment.md](./environment.md).

Current behavior:

* `backend/config/settings.py` does not read `.env`.
* `frontend/src/js/config.js` does not read `.env`.
* Local `.env` files should stay untracked.

## Backend Setup

From the backend directory:

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py check
```

Run migrations for local Django tables such as auth and sessions:

```powershell
.\.venv\Scripts\python.exe manage.py migrate
```

Creating a superuser is optional and only useful if you want to use Django admin locally:

```powershell
.\.venv\Scripts\python.exe manage.py createsuperuser
```

Start the backend development server:

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

Expected backend base URL:

```text
http://127.0.0.1:8000
```

Useful local backend URLs:

* `GET http://127.0.0.1:8000/health/`
* `GET http://127.0.0.1:8000/api/health/`
* `GET http://127.0.0.1:8000/api/auth/csrf/`
* `GET http://127.0.0.1:8000/api/auth/me/`

## Frontend Setup

The frontend is static HTML/CSS/JavaScript.

Serve it locally from the `frontend/` directory:

```powershell
cd frontend
python -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500/
```

The frontend backend base URL currently lives in:

```text
frontend/src/js/config.js
```

Current default:

```js
BACKEND_API_BASE_URL: 'http://127.0.0.1:8000'
```

Frontend `.env` files are not consumed by browser JavaScript. Do not add a build system just to support env files unless a future branch explicitly chooses that direction.

## Local Auth Flow

For the full auth flow locally:

1. Start the Django backend at `http://127.0.0.1:8000`.
2. Serve the frontend at `http://127.0.0.1:5500`.
3. Open the frontend in a browser.
4. The frontend checks session state with `GET /api/auth/me/`.
5. Register uses `POST /api/auth/register/`.
6. Login first requests `GET /api/auth/csrf/`, then posts to `POST /api/auth/login/` with `credentials: "include"` and `X-CSRFToken`.
7. Authenticated state is visible through `/api/auth/me/` and reflected in memory-only frontend state.
8. Logout posts to `POST /api/auth/logout/` with CSRF and credentials included.

Registration does not auto-login. Login creates the session.

For exact endpoint response shapes and CSRF/session notes, see [api.md](./api.md).

## Standard Checks

Backend:

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
.\.venv\Scripts\python.exe -m unittest app.tests
```

Frontend:

```powershell
cd frontend
node --check src\js\main.js
node --check src\js\config.js
npx --yes html-validate@9 "*.html" "partials/*.html"
```

Repository:

```powershell
git diff --check
git status
```

On macOS/Linux, use `.venv/bin/python` from `backend/` instead of `.\.venv\Scripts\python.exe`. Depending on your Python install, `python`, `python3`, or `py` may be the command that creates the virtual environment. Do not change project code just because the local virtualenv path differs.

## Troubleshooting

Django server is not running:

* Start it with `.\.venv\Scripts\python.exe manage.py runserver` from `backend/`.
* Confirm `http://127.0.0.1:8000/health/` returns HTTP `200`.

Frontend cannot reach backend:

* Confirm `BACKEND_API_BASE_URL` in `frontend/src/js/config.js` points to `http://127.0.0.1:8000`.
* Confirm the backend server is running.
* Use `http://127.0.0.1:5500/` or `http://localhost:5500/` for the frontend during local development.

CORS or CSRF local origin mismatch:

* Current Django settings include local frontend origins for ports `3000`, `5173`, and `5500`.
* If you serve the frontend from another port, update settings in a deliberate future branch and run checks.

Login returns HTTP `403`:

* Confirm the frontend requested `GET /api/auth/csrf/`.
* Confirm the login POST sends `X-CSRFToken`.
* Confirm the request uses `credentials: "include"`.
* Prefer serving the frontend over `http://127.0.0.1:5500/` instead of opening `file://`.

Static frontend opened from `file://` behaves differently:

* Use `python -m http.server 5500` from `frontend/`.
* Browser cookie, CSRF, and cross-origin behavior is more predictable over local HTTP.

Database tables are missing:

* Run `.\.venv\Scripts\python.exe manage.py migrate` from `backend/`.
* `backend/db.sqlite3` is local-only and ignored by Git.

Node or HTML validation command is unavailable:

* Install Node.js/npm locally.
* `npx --yes html-validate@9 ...` downloads or uses the validator through npm.
* No frontend build step is required.

Virtualenv path differs:

* Windows PowerShell uses `.\.venv\Scripts\python.exe`.
* macOS/Linux usually uses `.venv/bin/python`.
* Keep local path differences out of committed code.

## Development Rules For Future Branches

* Preserve the current frontend design unless a branch explicitly requests design changes.
* Keep the starter template domain-neutral.
* Avoid app-specific domain features in the base template.
* Use isolated branches for focused changes.
* Do not add JWTs or token storage by default.
* Do not persist auth state in `localStorage` or `sessionStorage`.
* Do not introduce frontend build tooling unless a branch explicitly requires it.
* Run standard checks before committing.
