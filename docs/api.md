# API Contract

This document describes the current backend API contract for the reusable Django backend + static frontend starter template.

It documents the API as implemented today. It does not define new endpoints, new response shapes, or future auth behavior.

## Overview

The current API is intentionally small and domain-neutral. It provides:

* Basic health checks.
* Django session/cookie authentication foundation.
* CSRF support for unsafe session requests.
* Register, login, current-user, and logout endpoints.

Authentication uses Django sessions and cookies with CSRF protection. JWTs, access tokens, refresh tokens, frontend token storage, route guards, redirects, and protected pages are not part of the current starter template.

Domain-specific APIs should be added in downstream projects or scoped feature branches and documented separately.

## Base URLs

Local backend base URL:

```text
http://127.0.0.1:8000
```

The static frontend reads endpoint configuration from:

```text
frontend/src/js/config.js
```

Current frontend config uses `window.APP_CONFIG.BACKEND_API_BASE_URL` with:

```js
BACKEND_API_BASE_URL: 'http://127.0.0.1:8000'
```

The current static frontend does not read environment variables at runtime and does not use build-time environment injection.

## Response Conventions

The project does not currently use one universal response envelope for every endpoint.

Current response styles:

* Health endpoints return small status objects.
* Register validation and register errors use `is_valid`, `errors`, and `normalized`.
* Login validation errors use the same centralized error shape.
* Successful session login, current-user, and logout responses use auth-specific objects.

Centralized error object shape:

```json
{
  "field": "email",
  "code": "auth.email_invalid",
  "message": "صيغة البريد الإلكتروني غير صحيحة."
}
```

Allowed error fields are currently:

* `email`
* `password`
* `general`

Common error response shape:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "general",
      "code": "request.invalid_json_body",
      "message": "صيغة الطلب غير صحيحة."
    }
  ],
  "normalized": {}
}
```

The frontend displays backend validation messages from `errors[].message` when available.

## CSRF And Session Authentication

The current auth strategy is Django session/cookie authentication.

For CSRF-protected unsafe requests such as login and logout, the local browser flow is:

1. Request `GET /api/auth/csrf/` to set the `csrftoken` cookie.
2. Read the `csrftoken` cookie in the frontend.
3. Send `X-CSRFToken: <csrftoken>` with the unsafe request.
4. Use `credentials: "include"` so the browser includes cookies.

The browser manages the Django session cookie. The frontend must not store JWTs, tokens, passwords, session keys, CSRF tokens, or user auth state in `localStorage` or `sessionStorage`.

API responses must not expose:

* password
* password hash
* session key
* CSRF token
* JWT or access token
* staff/superuser flags
* permissions

## Endpoint Reference

### GET /health/

Purpose:

Basic Django health check.

Auth requirement:

None.

CSRF requirement:

None.

Request body:

None.

Success status:

HTTP `200`.

Success response:

```json
{
  "status": "ok"
}
```

### GET /api/health/

Purpose:

Basic Django REST Framework API health check.

Auth requirement:

None.

CSRF requirement:

None.

Request body:

None.

Success status:

HTTP `200`.

Success response:

```json
{
  "status": "ok",
  "service": "api"
}
```

Unsupported methods return HTTP `405` through Django REST Framework.

### GET /api/auth/csrf/

Purpose:

Set the Django `csrftoken` cookie for future CSRF-protected unsafe requests.

Auth requirement:

None.

CSRF requirement:

None for this safe GET request.

Request body:

None.

Success status:

HTTP `200`.

Success response:

```json
{
  "csrf": "ok",
  "message": "CSRF cookie set."
}
```

Security notes:

* The response sets or refreshes the `csrftoken` cookie.
* The response does not return the token value in the JSON body.
* This endpoint does not authenticate a user and does not create users.

### POST /api/auth/register/

Purpose:

Validate registration credentials and create a Django built-in user.

Auth requirement:

None.

CSRF requirement:

The current register endpoint is not the session login endpoint. It does not create an authenticated session.

Request body:

```json
{
  "email": "USER@example.com",
  "password": "Password1"
}
```

Success status:

HTTP `201`.

Success response:

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

Validation error status:

HTTP `400`.

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

Invalid JSON or non-object JSON response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "general",
      "code": "request.invalid_json_body",
      "message": "صيغة الطلب غير صحيحة."
    }
  ],
  "normalized": {}
}
```

Security notes:

* Uses backend validation from `backend/app/auth_validation.py`.
* Normalizes email before user creation.
* Prevents duplicate registration by email case-insensitively.
* Uses Django password hashing through `create_user(...)`.
* Does not return the password.
* Does not log in the user.
* Does not create a session.
* Does not issue JWTs or tokens.

Unsupported methods return HTTP `405` through Django REST Framework.

### POST /api/auth/login/

Purpose:

Validate login credentials and create a Django session.

Auth requirement:

None before login.

CSRF requirement:

Required for real browser requests. The endpoint is CSRF-protected.

Request body:

```json
{
  "email": "USER@example.com",
  "password": "Password123"
}
```

Success status:

HTTP `200`.

Success response:

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

Validation error status:

HTTP `400`.

Example validation error response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "password",
      "code": "auth.password_required",
      "message": "كلمة المرور مطلوبة."
    }
  ],
  "normalized": {}
}
```

Invalid credentials response:

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

Invalid JSON or non-object JSON response:

```json
{
  "is_valid": false,
  "errors": [
    {
      "field": "general",
      "code": "request.invalid_json_body",
      "message": "صيغة الطلب غير صحيحة."
    }
  ],
  "normalized": {}
}
```

CSRF failure:

When CSRF checks are enforced and the token is missing or invalid, Django rejects the request with HTTP `403`.

Security notes:

* Login validates email format and password presence.
* Login does not apply registration password strength rules.
* Email lookup is case-insensitive.
* Unknown email and wrong password return the same generic error.
* Success calls Django `login(request, user)`.
* Does not return password, password hash, token, session key, or CSRF token.
* Does not issue JWTs.

### GET /api/auth/me/

Purpose:

Read the current browser session authentication state.

Auth requirement:

Optional Django session cookie.

CSRF requirement:

None for this safe GET request.

Request body:

None.

Success status:

HTTP `200` for both anonymous and authenticated states.

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

Frontend usage:

Use `credentials: "include"` so the browser sends the session cookie.

Security notes:

* Does not create users.
* Does not create a new authenticated session for anonymous users.
* Does not return password, password hash, token, session key, CSRF token, permissions, `is_staff`, or `is_superuser`.
* Does not return HTTP `401` for anonymous users in the current implementation.

### POST /api/auth/logout/

Purpose:

Destroy the current Django session authentication state.

Auth requirement:

Optional. Logout is idempotent and returns success even when the browser is already anonymous.

CSRF requirement:

Required. The endpoint is CSRF-protected because it is a state-changing POST.

Request body:

No body is required. The frontend may send `{}`.

Success status:

HTTP `200`.

Success response:

```json
{
  "authenticated": false,
  "session_destroyed": true,
  "message": "تم تسجيل الخروج بنجاح."
}
```

CSRF failure:

When CSRF checks are enforced and the token is missing or invalid, Django rejects the request with HTTP `403`.

Security notes:

* Calls Django `logout(request)`.
* Does not require or clear JWTs because token auth is not used.
* Does not return session key, CSRF token, password, password hash, or sensitive user fields.
* Does not redirect.

## Frontend API Usage Notes

Frontend endpoint configuration lives in:

```text
frontend/src/js/config.js
```

Current auth endpoint keys:

* `csrf` -> `/api/auth/csrf/`
* `me` -> `/api/auth/me/`
* `login` -> `/api/auth/login/`
* `logout` -> `/api/auth/logout/`
* `register` -> `/api/auth/register/`

Current frontend helpers in `frontend/src/js/main.js` include:

* `window.AuthApi.requestCsrfCookie()`
* `window.AuthApi.getCsrfToken()`
* `window.AuthApi.getCurrentUser()`
* `window.AuthApi.logout()`
* `window.AuthSession`

Current behavior:

* Page load calls `/api/auth/me/` through `window.AuthApi.getCurrentUser()`.
* Register posts `{ email, password }` to `/api/auth/register/`.
* Login requests the CSRF cookie, then posts `{ email, password }` to `/api/auth/login/` with `credentials: "include"` and `X-CSRFToken`.
* Logout requests or uses a CSRF token, then posts to `/api/auth/logout/` with `credentials: "include"` and `X-CSRFToken`.
* Frontend auth state is memory-only through `window.AuthSession`.

Some frontend config keys exist as placeholders for future work and are not part of the implemented backend API contract in this document.

## Security Notes

* Django session/cookie authentication is the current strategy.
* JWT is intentionally not part of the starter template at this stage.
* Auth tokens must not be stored in `localStorage` or `sessionStorage`.
* Backend validation is authoritative. Frontend validation is lightweight UX only.
* Login errors must not reveal whether an email exists.
* Passwords must never be returned in API responses.
* Session keys, CSRF token values, password hashes, permissions, and staff/superuser flags must not be exposed in auth responses.

## Future API Documentation Candidates

Potential future documentation work:

* Add OpenAPI or schema generation in a separate branch if needed.
* Add API versioning later if the project needs it.
* Add protected endpoint examples only in a clearly scoped future branch.
* Add domain-specific endpoints only in downstream projects or domain-specific feature branches, not in the base starter template.
* Add deployment-specific CORS, CSRF, cookie, and HTTPS documentation later.
