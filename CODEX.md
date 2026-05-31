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

Session login endpoint:

* `POST http://127.0.0.1:8000/api/auth/login/`
* Validates email/password input, checks the stored Django password hash, and calls Django `login(...)` after credentials are valid.
* Creates a Django session and session cookie.
* Requires CSRF cookie/token for real browser requests.
* Does not issue JWTs, issue tokens, redirect, or persist frontend auth state.
* Uses one generic invalid credentials error for unknown email and wrong password.

Example request:

```json
{
  "email": "USER@example.com",
  "password": "Password123"
}
```

Example success response:

```json
{
  "authenticated": true,
  "session_created": true,
  "message": "تم تسجيل الدخول بنجاح.",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

Example invalid credentials response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "general",
      "code": "auth.invalid_credentials",
      "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة."
    }
  ],
  "normalized": {}
}
```

Current user endpoint:

* `GET http://127.0.0.1:8000/api/auth/me/`
* Reads the current Django session authentication state.
* Returns HTTP `200` for both authenticated and anonymous sessions.
* Does not log in, log out, create users, issue tokens, or persist frontend auth state.
* Frontend calls should use `credentials: "include"` so the browser sends the session cookie.

Anonymous response:

```json
{
  "authenticated": false,
  "user": null
}
```

Authenticated response:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

Session logout endpoint:

* `POST http://127.0.0.1:8000/api/auth/logout/`
* Destroys the current Django session authentication state with Django `logout(...)`.
* Requires CSRF cookie/token because it is a state-changing POST.
* Returns HTTP `200` even when the browser is already anonymous.
* Does not issue or clear JWTs or tokens because token auth is not used.
* Does not redirect or persist frontend auth state.

Example success response:

```json
{
  "authenticated": false,
  "session_destroyed": true,
  "message": "تم تسجيل الخروج بنجاح."
}
```

Frontend auth state:

* On page load, the frontend calls `GET /api/auth/me/` through `window.AuthApi.getCurrentUser()`.
* Auth state is memory-only in `window.AuthSession`.
* Authenticated state stores only:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

* Anonymous state uses `authenticated: false` and `user: null`.
* Successful session login updates memory and the visible nav state.
* Successful session logout clears memory and returns the visible nav state to anonymous.
* The nav login action is hidden while authenticated.
* A compact user email label and logout action are shown while authenticated.
* The frontend does not store auth state, user data, passwords, or tokens in `localStorage` or `sessionStorage`.
* No JWTs, redirects, route guards, protected pages, or frontend-persistent auth state have been added.

## Authentication Strategy Decision

Current auth state:

* Register creates Django built-in users.
* Register uses Django password hashing through `create_user(...)`.
* Login creates a Django session after credentials pass validation.
* `/api/auth/me/` reads the current session authentication state.
* Logout destroys the current Django session authentication state.
* The frontend reads `/api/auth/me/` on page load and keeps auth state in memory only.
* There is no JWT, token issuing, persistent frontend auth storage, route guarding, protected pages, or email confirmation.

The next implementation step requires choosing the real authentication strategy.

### Option 1: Django Session/Cookie Authentication

Django session/cookie authentication uses Django's built-in session framework. The server stores session state, and the browser stores a session cookie. Unsafe requests must include correct CSRF handling.

This works well for browser-based frontends. Because the current frontend and backend are separate origins during local development, this approach needs careful CORS, CSRF, `SameSite`, and credentials configuration. It is a good fit if we want classic web authentication with HttpOnly cookies and no token handling in JavaScript.

Pros:

* Built into Django.
* Password and session handling are mature.
* HttpOnly session cookies reduce token exposure to JavaScript.
* Logout and session invalidation are straightforward server-side.

Cons:

* Cross-origin local development needs careful setup.
* CSRF must be implemented correctly.
* Mobile or native clients may be less convenient later.
* Frontend fetch requests must use credentials when the real session flow is added.

### Option 2: JWT/Token Authentication

JWT/token authentication has the backend issue access and refresh tokens. The frontend sends a token with API requests. This is common for SPAs, mobile apps, and non-browser API clients.

This strategy requires careful token storage, expiry, refresh, and revocation handling. Storing tokens in `localStorage` or `sessionStorage` increases XSS impact. Safer token patterns often use HttpOnly cookies, which brings back cookie and CSRF considerations.

Pros:

* Common for decoupled APIs.
* Convenient for mobile clients and non-browser clients.
* Stateless access token verification can scale well.

Cons:

* Token storage is easy to get wrong.
* Logout and revocation are more complex.
* Refresh token rotation and expiry handling add complexity.
* More moving parts than the project currently needs.

### Chosen Strategy

Use Django session/cookie authentication first.

Rationale:

* The project is Django-based.
* The backend already uses Django's built-in user system.
* We are building incrementally and want the smallest secure next step.
* The project does not currently need mobile or native token auth.
* HttpOnly cookies avoid storing auth tokens in JavaScript.
* This keeps the next implementation focused on real login, logout, current-user state, and CSRF handling.

Decision:

* Use Django session/cookie authentication.
* Do not use JWT for now.
* Do not store tokens in `localStorage` or `sessionStorage`.
* Add CSRF handling before or during real session login work.
* Keep cross-origin local development settings explicit.

### Proposed Auth Roadmap

Phase 1:

* Add a CSRF endpoint, `GET /api/auth/csrf/`.
* Configure frontend fetch credentials behavior.
* Confirm CORS and CSRF settings.

Phase 2:

* `POST /api/auth/login/` has been converted into real session login.
* Django `login(...)` is called only after credential validation passes.
* Return safe user data.

Phase 3:

* `GET /api/auth/me/` has been added.
* Return authenticated user data or an anonymous state.

Phase 4:

* `POST /api/auth/logout/` has been added.
* Django `logout(...)` destroys the current session authentication state.

Phase 5:

* Frontend authenticated UI state has been connected.
* Logged-in UI is shown after `/api/auth/me/` returns an authenticated session.
* Do not store tokens.
* Do not store passwords.
* Continue using `credentials: "include"` for session-aware requests.

## Session/CSRF Foundation

The backend exposes a CSRF endpoint for the Django session/cookie auth flow:

* `GET http://127.0.0.1:8000/api/auth/csrf/`
* Returns HTTP `200`.
* Ensures Django sets the `csrftoken` cookie.
* Returns a safe JSON response:

```json
{
  "csrf": "ok",
  "message": "CSRF cookie set."
}
```

Purpose:

* The frontend requests this endpoint before real session login.
* Unsafe session-auth requests send `X-CSRFToken` using the `csrftoken` cookie value.
* Session-aware fetch requests use `credentials: "include"`.

Local development origins:

* Frontend: `http://127.0.0.1:5500` or `http://localhost:5500`
* Backend: `http://127.0.0.1:8000`
* `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` explicitly include local frontend origins.
* `CORS_ALLOW_CREDENTIALS = True` is enabled for future credentialed session requests.
* `CORS_ALLOW_ALL_ORIGINS` is not enabled.
* CSRF middleware remains enabled.

Frontend foundation:

* `window.APP_CONFIG.endpoints.csrf` points to `/api/auth/csrf/`.
* `window.APP_CONFIG.endpoints.me` points to `/api/auth/me/`.
* `window.APP_CONFIG.endpoints.logout` points to `/api/auth/logout/`.
* `window.AuthApi.requestCsrfCookie()` requests the CSRF endpoint with `credentials: "include"`.
* `window.AuthApi.getCsrfToken()` reads the `csrftoken` cookie for unsafe requests.
* `window.AuthApi.getCurrentUser()` requests `/api/auth/me/` with `credentials: "include"`.
* `window.AuthApi.logout()` requests CSRF, then posts to `/api/auth/logout/` with `credentials: "include"` and `X-CSRFToken`.
* The token is not stored in `localStorage` or `sessionStorage`.

Still out of scope:

* No JWT or issued tokens.
* No frontend auth persistence.
* No password storage.
* No email confirmation.

Manual CSRF test:

1. Start the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

2. Request the CSRF endpoint in a browser or fetch:

```text
http://127.0.0.1:8000/api/auth/csrf/
```

3. Confirm the response is HTTP `200` and a `csrftoken` cookie is set.

4. Start the frontend:

```powershell
cd frontend
python -m http.server 5500
```

5. Confirm existing register still behaves as before and login creates a session only after CSRF-backed credential validation succeeds.

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

## Session Login Manual Test Checklist

The frontend login form calls the backend session login endpoint through:

* `window.APP_CONFIG.BACKEND_API_BASE_URL`
* `window.APP_CONFIG.endpoints.login`

Default local target:

```text
http://127.0.0.1:8000/api/auth/login/
```

Use the same backend/frontend setup commands from the register checklist, then open the login modal/form.

### Manual Cases

Registered email and correct password:

* The frontend should first request `GET /api/auth/csrf/` with `credentials: "include"`.
* The frontend should read `csrftoken`.
* Request should be sent to `POST /api/auth/login/`.
* Login POST should include `credentials: "include"` and `X-CSRFToken`.
* Backend should return HTTP `200`.
* The frontend should show: `تم تسجيل الدخول بنجاح.`
* Django should create a session cookie.
* No redirect should happen.
* No token or frontend auth state should be stored.
* Password field should be cleared after success.

Registered email and wrong password:

* Backend should return HTTP `400`.
* The frontend should show: `البريد الإلكتروني أو كلمة المرور غير صحيحة.`

Unknown email:

* Backend should return HTTP `400`.
* The frontend should show the same generic invalid credentials message as wrong password.

Uppercase or trimmed email:

* `  USER@example.com  ` should be normalized and checked case-insensitively.

Empty email:

* Frontend required-field UX text should appear, or the backend validation message should appear if submitted.

Empty password:

* Frontend required-field UX text should appear, or the backend validation message should appear if submitted.

Whitespace-only password:

* Backend validation error text from `errors[].message` should be displayed.

Backend server stopped or connection failure:

* The frontend should show: `تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.`

CSRF failure:

* If the CSRF cookie/token is missing or invalid, backend should reject the request.
* The frontend should show: `تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.`

## Current User Manual Test Checklist

The frontend helper can call the current-user endpoint through:

* `window.APP_CONFIG.BACKEND_API_BASE_URL`
* `window.APP_CONFIG.endpoints.me`
* `window.AuthApi.getCurrentUser()`

Default local target:

```text
http://127.0.0.1:8000/api/auth/me/
```

Manual cases:

1. Start the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

2. Start the frontend:

```powershell
cd frontend
python -m http.server 5500
```

3. Without logging in, call `GET /api/auth/me/`.

Expected response:

```json
{
  "authenticated": false,
  "user": null
}
```

4. Register a user if needed.

5. Log in through the frontend or API:

* `GET /api/auth/csrf/` with `credentials: "include"`
* `POST /api/auth/login/` with `credentials: "include"` and `X-CSRFToken`

6. Call `GET /api/auth/me/` with `credentials: "include"`.

Expected response:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

7. Confirm no tokens exist in `localStorage` or `sessionStorage`.

## Session Logout Manual Test Checklist

The frontend helper can call the logout endpoint through:

* `window.APP_CONFIG.BACKEND_API_BASE_URL`
* `window.APP_CONFIG.endpoints.logout`
* `window.AuthApi.logout()`

Default local target:

```text
http://127.0.0.1:8000/api/auth/logout/
```

Purpose:

* Destroy the current Django session authentication state.
* Keep logout idempotent, so anonymous logout with a valid CSRF token still returns success.
* Avoid JWTs, issued tokens, redirects, and frontend auth persistence.

Manual cases:

1. Start the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

2. Start the frontend:

```powershell
cd frontend
python -m http.server 5500
```

3. Register a user if needed.

4. Log in:

* `GET /api/auth/csrf/` with `credentials: "include"`
* `POST /api/auth/login/` with `credentials: "include"` and `X-CSRFToken`

5. Confirm `GET /api/auth/me/` with credentials included returns:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

6. Log out:

* `GET /api/auth/csrf/` with `credentials: "include"`
* `POST /api/auth/logout/` with `credentials: "include"` and `X-CSRFToken`

Expected logout response:

```json
{
  "authenticated": false,
  "session_destroyed": true,
  "message": "تم تسجيل الخروج بنجاح."
}
```

7. Confirm `GET /api/auth/me/` with credentials included returns:

```json
{
  "authenticated": false,
  "user": null
}
```

8. Confirm anonymous logout with a valid CSRF token also returns HTTP `200`.

9. Confirm no tokens exist in `localStorage` or `sessionStorage`.

## Frontend Auth State Manual Test Checklist

The frontend now reads the current Django session through:

* `window.APP_CONFIG.BACKEND_API_BASE_URL`
* `window.APP_CONFIG.endpoints.me`
* `window.AuthApi.getCurrentUser()`
* `window.AuthSession`

Auth state remains in memory only for the current page runtime.

Manual cases:

1. Start the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

2. Start the frontend:

```powershell
cd frontend
python -m http.server 5500
```

3. Open:

```text
http://127.0.0.1:5500/
```

4. Anonymous load:

* Expected anonymous UI.
* Login/register actions remain visible where applicable.
* Logout is hidden or disabled.

5. Register a user if needed.

6. Log in with valid credentials:

* Expected success message: `تم تسجيل الدخول بنجاح.`
* UI switches to authenticated state.
* The nav shows the user email.
* Login/register nav action is hidden.
* Logout is visible and enabled.

7. Refresh the page:

* `/api/auth/me/` detects the existing Django session.
* UI remains authenticated.

8. Log out:

* Expected success message: `تم تسجيل الخروج بنجاح.`
* UI returns to anonymous state.
* `/api/auth/me/` returns `authenticated: false` and `user: null`.

9. Confirm:

* No tokens exist in `localStorage`.
* No auth data exists in `sessionStorage`.
* No password is printed in the console.

Still future work:

* No route guards.
* No protected pages.
* No profile pages.
* No frontend-persistent auth state.

### Out Of Scope For This Step

* No models or migrations.
* No JWT.
* No tokens.
* No persistent frontend auth storage.
* No route guards or protected pages.
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

Registration now creates a Django user only after backend validation passes. Login creates a Django session after CSRF-backed credential validation passes. `/api/auth/me/` reads the current session state. Logout destroys the current session authentication state. The frontend keeps the current auth state in memory only. No flow stores tokens, issues JWTs, redirects, persists frontend auth state, adds route guards, protects pages, or sends email.

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
