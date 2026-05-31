# CODEX.md

## Project Purpose

This project is currently a separated frontend + future Django backend structure.

The frontend already exists and has a completed design. The backend currently exists as a Django-ready structure only, with empty files prepared for future development.

The main goal is to keep the project clean, scalable, and easy to continue later.

## Current Project Structure

The project is organized into the following main parts:

* `frontend/` — existing frontend application and current design.
* `backend/` — future Django backend structure.
* `docs/` — project documentation.
* `.env.example` — example environment variables file.
* `.gitignore` — ignored files and folders.
* `README.md` — general project documentation.
* `CODEX.md` — long-term instructions for future development.

## Frontend Status

The frontend has already been restructured while preserving the current design.

Current frontend principles:

* Do not break the current design.
* Do not remove existing CSS behavior.
* Do not remove existing JavaScript behavior.
* Do not delete used images, icons, fonts, or assets.
* Do not rename CSS classes or HTML IDs unless absolutely necessary.
* Only update paths when moving files.
* Keep the main homepage at `frontend/index.html`.
* Keep `frontend/pages/` empty unless real extra HTML pages are needed later.

Current frontend organization:

* CSS files are placed under `frontend/src/css/`.
* JavaScript files are placed under `frontend/src/js/`.
* Page-specific JavaScript placeholders are placed under `frontend/src/pages/`.
* Public assets are placed under `frontend/public/assets/`.
* Icons are placed under `frontend/public/assets/icons/`.
* Images should be placed under `frontend/public/assets/images/`.
* Fonts should be placed under `frontend/public/assets/fonts/`.

## Frontend Development Rules

When working on the frontend in the future:

1. Preserve the existing visual design unless the user explicitly requests a redesign.
2. Do not remove or rewrite styling without checking its usage.
3. Do not remove JavaScript behavior without checking its usage.
4. Keep assets organized inside `frontend/public/assets/`.
5. Keep reusable CSS inside `frontend/src/css/`.
6. Keep reusable JavaScript inside `frontend/src/js/`.
7. Keep page-specific JavaScript inside `frontend/src/pages/`.
8. Do not introduce React, Vue, Angular, Next.js, or any frontend framework unless explicitly requested.
9. Do not create `package.json` unless the project intentionally moves to a package-based frontend workflow.
10. If files are moved, update all related paths in HTML, CSS, JavaScript, and manifest files.

## Backend Status

The backend now has a minimal Django foundation.

This means:

* `backend/manage.py` is configured.
* `backend/config/` contains minimal Django settings, URLs, ASGI, and WSGI modules.
* `backend/app/` remains the early-stage generic app for current backend logic.
* `backend/common/errors.py` contains centralized validation error utilities.
* No real domain models or project migrations have been added yet.

Current backend structure:

* `backend/manage.py`
* `backend/.env`
* `backend/requirements.txt`
* `backend/config/`
* `backend/app/`
* `backend/common/`

## Backend Local Setup

From the repository root on Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If activation is unavailable, use the virtual environment Python directly:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Run the standalone auth validation tests:

```powershell
cd backend
python -m unittest app.tests
```

Run Django checks and Django's test runner:

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
```

Run the standalone test module through the virtual environment:

```powershell
cd backend
.\.venv\Scripts\python.exe -m unittest app.tests
```

Start the local Django development server:

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py runserver
```

Local health endpoints:

* `http://127.0.0.1:8000/health/` — basic Django health check.
* `http://127.0.0.1:8000/api/health/` — Django REST Framework API health check.

Register auth endpoint:

* `POST http://127.0.0.1:8000/api/auth/register/`
* Validates email and password, then creates a Django built-in user when the payload is valid.
* Uses Django password hashing through the built-in user manager.
* Does not log in the user, issue tokens, customize sessions or cookies, or send email.

Example request:

```json
{
  "email": "USER@example.com",
  "password": "Password1"
}
```

Example success response:

```json
{
  "is_valid": true,
  "user_created": true,
  "message": "تم إنشاء الحساب بنجاح. تسجيل الدخول سيتم تفعيله لاحقًا.",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

Example validation error response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "email",
      "code": "auth.email_invalid",
      "message": "صيغة البريد الإلكتروني غير صحيحة."
    }
  ],
  "normalized": {}
}
```

Duplicate email response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "email",
      "code": "auth.email_already_registered",
      "message": "البريد الإلكتروني مسجل مسبقًا."
    }
  ],
  "normalized": {}
}
```

## Register Manual Test Checklist

The frontend register form calls the backend register endpoint through:

* `window.APP_CONFIG.BACKEND_API_BASE_URL`
* `window.APP_CONFIG.endpoints.register`

Default local target:

```text
http://127.0.0.1:8000/api/auth/register/
```

### Setup

Start the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

In a second terminal, serve the frontend:

```powershell
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500/` in the browser, then open the register modal/form.

### Manual Cases

Valid email, valid password, and matching confirmation:

* Request should be sent to `POST /api/auth/register/`.
* Backend should return HTTP `201`.
* The frontend should show: `تم إنشاء الحساب بنجاح. تسجيل الدخول سيتم تفعيله لاحقًا.`
* No login should happen.
* No redirect should happen.
* No token should be stored.
* Password fields should be cleared after success.

Duplicate email:

* Submitting the same email again should return HTTP `400`.
* The frontend should show: `البريد الإلكتروني مسجل مسبقًا.`
* No second user should be created.

Invalid email:

* Backend validation error text from `errors[].message` should be displayed.

Empty email:

* Frontend required-field UX text should appear, or the backend validation message should appear if submitted.

Empty password:

* Frontend required-field UX text should appear, or the backend validation message should appear if submitted.

Whitespace-only password:

* Backend validation error text from `errors[].message` should be displayed.

Weak or common password, such as `password123`:

* Backend validation error text from `errors[].message` should be displayed.

Password without letters or without numbers:

* Backend validation error text from `errors[].message` should be displayed.

Password confirmation mismatch:

* Frontend mismatch UX text should appear.
* No backend request should be sent for this case.

Backend server stopped or connection failure:

* The frontend should show: `تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.`

### Out Of Scope For This Step

* No models or migrations.
* No login or logout.
* No JWT or session/cookie authentication flow.
* No frontend auth state or token storage.
* No email confirmation.

### Verification Commands

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
```

Registration now creates a Django user only after backend validation passes. It does not log in, store tokens, issue JWTs, add a session/cookie auth flow, or send email.

## Backend Development Rules

When backend development starts:

1. Turn the empty Django files into real Django configuration files.
2. Configure `backend/config/settings.py`.
3. Configure `backend/config/urls.py`.
4. Configure `backend/config/asgi.py`.
5. Configure `backend/config/wsgi.py`.
6. Configure `backend/manage.py`.
7. Add dependencies to `backend/requirements.txt`.
8. Add environment variables to `backend/.env` locally only.
9. Keep secrets out of Git.
10. Add real Django apps only when the project features are clear.
11. Add migrations only after real models are created.
12. Do not create `db.sqlite3` in Git.
13. Do not commit `.env`, `.venv`, `__pycache__`, or generated files.

## Important Future Backend Expansion Rule

The current folder:

`backend/app/`

is intentionally generic and acceptable only for the early stage.

However, when the project grows, do not keep all backend logic inside one generic `app/` folder.

When features become clear, split the backend into domain-based Django apps.

Recommended future structure:

```text
backend/
├── manage.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   ├── selectors.py
│   │   ├── serializers.py
│   │   └── tests.py
│   │
│   ├── dashboard/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   ├── selectors.py
│   │   ├── serializers.py
│   │   └── tests.py
│   │
│   ├── billing/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   ├── selectors.py
│   │   ├── serializers.py
│   │   └── tests.py
│   │
│   └── content/
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       ├── urls.py
│       ├── services.py
│       ├── selectors.py
│       ├── serializers.py
│       └── tests.py
│
└── common/
    ├── utils.py
    ├── errors.py
    ├── responses.py
    └── pagination.py
```

Examples of future domain apps:

* `accounts/` — authentication, users, profiles, permissions.
* `dashboard/` — dashboard views, statistics, summaries.
* `billing/` — subscriptions, invoices, payments.
* `content/` — posts, pages, media, content management.
* `notifications/` — email, SMS, system notifications.
* `core/` — base project logic if needed.
* `api/` — API routing layer if the project requires it.

Do not create these apps too early. Create them only when real features exist.

## Services and Selectors Pattern

When Django backend development starts, use this pattern:

* `models.py` — database models only.
* `views.py` — request and response handling.
* `serializers.py` — validation and serialization, especially if Django REST Framework is used.
* `services.py` — business logic and operations that change data.
* `selectors.py` — database queries and read operations.
* `urls.py` — app-level routes.
* `tests.py` or `tests/` — tests.

Avoid placing all logic directly inside views.

## Common Folder Rules

The `backend/common/` folder is for shared backend utilities only.

Use it for:

* shared helper functions
* shared exceptions
* response helpers
* pagination helpers
* reusable constants
* shared validators if needed

Do not place domain-specific business logic inside `common/`.

If logic belongs to users, billing, dashboard, or content, place it inside the relevant domain app instead.

## Documentation Rules

The documentation must stay aligned with the actual project paths.

If frontend paths change, update:

* `README.md`
* `CODEX.md`
* any integration documentation
* any developer notes

Known point to verify later:
Some existing documentation may still reference old paths like:

```text
frontend/assets/
```

The new paths should use:

```text
frontend/src/
frontend/public/assets/
```

Update documentation when needed.

## Git Ignore Rules

Before serious development, expand `.gitignore` to include common ignored files such as:

```text
.env
.venv/
venv/
env/
__pycache__/
*.pyc
db.sqlite3
media/
staticfiles/
node_modules/
.DS_Store
.vscode/
.idea/
```

Do not commit secrets, virtual environments, generated databases, cache files, or local editor settings.

## What Not To Do

Future assistants and developers must avoid:

1. Do not break the existing frontend design.
2. Do not rewrite the frontend unless explicitly requested.
3. Do not delete assets without checking usage.
4. Do not add frontend frameworks unless explicitly requested.
5. Do not add backend code unless backend development is requested.
6. Do not keep a large Django project inside one generic `app/` forever.
7. Do not commit `.env`.
8. Do not commit `.venv`.
9. Do not commit `db.sqlite3`.
10. Do not leave documentation pointing to old paths.
11. Do not place all business logic inside Django views.
12. Do not place domain-specific logic inside `common/`.

## Future Readiness Checklist

Before building real features, verify:

* [ ] Frontend still renders correctly.
* [ ] CSS paths are correct.
* [ ] JavaScript paths are correct.
* [ ] Asset paths are correct.
* [ ] Manifest paths are correct.
* [ ] `.gitignore` is expanded.
* [ ] Documentation paths are updated.
* [ ] Django files are configured when backend development begins.
* [ ] Dependencies are added only when needed.
* [ ] Domain apps are created only when features are clear.
* [ ] `backend/app/` is split into domain apps when the project grows.

## Final Project Principle

Start simple, keep the structure clear, and expand only when the project needs it.

The current structure is mostly ready as a clean foundation.

The frontend should remain stable and design-safe.

The backend should stay simple at first, then evolve into domain-based Django apps when the application grows.
