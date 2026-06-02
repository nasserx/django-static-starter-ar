# Template Usage Guide

This guide explains how to use this repository as a reusable Django backend + static frontend starter template.

It is intentionally neutral. The base template is not a trading app, stock app, store, wallet, dashboard product, analytics product, or any other domain-specific application.

## Overview

This repository provides a starter foundation for future projects that need:

* A Django backend structure.
* Django REST Framework and local CORS support.
* Django session/cookie authentication.
* A static HTML/CSS/JavaScript frontend.
* A preserved frontend design baseline.
* Local development documentation.
* Environment/configuration documentation.
* Current API contract documentation.

The template is meant to be extended in downstream projects or focused feature branches. Keep the base template generic and reusable.

## When To Use This Template

Use this template when starting a project that needs:

* Django backend/API foundation.
* Session/cookie auth rather than JWT by default.
* A static frontend without a build step.
* Existing frontend design and auth UI foundation.
* A neutral structure that can later receive domain-specific apps.

Avoid using the neutral base template branch for domain-specific product work. Add product logic in downstream repositories or clearly scoped feature branches.

## Starting A New Project From The Template

Recommended workflow:

1. Create a new downstream repository or a new focused branch.
2. Keep base template commits clean and domain-neutral.
3. Rename project-level branding only in the downstream project if needed.
4. Review [template-structure.md](./template-structure.md).
5. Review [environment.md](./environment.md).
6. Review [local-development.md](./local-development.md).
7. Review [api.md](./api.md).
8. Run [template-release-checklist.md](./template-release-checklist.md) before treating the starter as ready to reuse.
9. Configure local-only environment files safely.
10. Run the standard backend, frontend, and repository checks before and after changes.

Do not commit real secrets, local databases, virtual environments, caches, logs, or generated artifacts.

## What To Customize Downstream

These are appropriate customization areas for downstream projects or scoped feature branches:

* Project name and README branding.
* Django settings for deployment.
* Additional Django apps for domain logic.
* Additional API endpoints.
* Additional frontend pages or components.
* Domain-specific models, services, selectors, serializers, and tests.
* Deployment configuration.
* Database configuration.

Keep these changes out of the neutral base template unless the branch explicitly scopes generic template support.

## What To Keep Stable In The Base Template

Keep these stable unless a focused branch intentionally changes them:

* Django session/cookie auth foundation.
* Current auth API contract.
* Frontend design baseline.
* Documentation structure.
* Neutral project structure.
* Domain-neutral naming and examples.
* No JWT or token storage by default.
* No `localStorage` or `sessionStorage` auth persistence.

## Backend Extension Guidance

For future backend work:

* Prefer creating new Django apps for real domain features instead of placing all future logic in `backend/app`.
* Keep `backend/app` focused on the current starter/auth/template foundation until a dedicated refactor branch exists.
* Use services, selectors, serializers, and tests consistently when those patterns are introduced for real features.
* Keep validation authoritative on the server.
* Keep auth security rules intact.
* Add tests for new domain endpoints.
* Avoid placing domain-specific business logic in `backend/common`.
* Do not rename `backend/app` without a dedicated migration/refactor branch.

Current auth should remain session/cookie based unless a future scoped auth architecture branch deliberately changes that decision.

## Auth And Security Boundaries

The starter's current auth boundary is deliberately small:

* Django session/cookie authentication is the only auth strategy.
* Register creates a Django user but does not log the user in.
* Login creates a Django session and logout destroys session authentication state.
* Register, login, and logout POST requests rely on Django CSRF protection.
* CSRF tokens are request-protection details, not login tokens or API credentials.
* `/api/auth/me/` reports current session state only.

The current `/api/auth/me/` response is intentionally narrow:

* Anonymous users receive `{"authenticated": false, "user": null}`.
* Authenticated users receive `authenticated: true` with user `id` and `email`.
* Tests assert auth responses do not return passwords, password hashes, tokens, session keys, CSRF token values, permissions, or staff/superuser flags.

The static frontend should use browser-managed cookies with `credentials: "include"` and should keep auth state in memory through `window.AuthSession`. It should not store auth credentials, tokens, session data, or user auth state in `localStorage` or `sessionStorage`.

This starter does not provide authorization patterns, protected routes, protected pages, role checks, permissions UI, or route guards by default. Applications built from the starter can add those later in project-specific branches with their own tests and documentation.

For endpoint response shapes and error behavior, see [api.md](./api.md).

## Frontend Auth Session Behavior

The static frontend keeps auth behavior in `frontend/src/js/main.js`, with endpoint configuration in `frontend/src/js/config.js`.

At a high level:

* `window.AuthSession` stores the current frontend auth state in memory for the current page runtime.
* `window.AuthSession.set(...)` updates that in-memory state and dispatches an `auth:state` browser event so the nav/UI can show anonymous, authenticated, pending, or logged-out state.
* `window.AuthSession.get()` returns a copy of the current in-memory state.
* On page load, `checkCurrentAuthState()` calls `window.AuthApi.getCurrentUser()`, which requests `GET /api/auth/me/` with `credentials: "include"`.
* Login first requests the CSRF cookie, then posts credentials to `POST /api/auth/login/` with cookies included and `X-CSRFToken`.
* Logout requests or uses a CSRF token, then posts to `POST /api/auth/logout/` with cookies included and `X-CSRFToken`.
* Register posts `{ email, password }` to `POST /api/auth/register/` and shows the backend response, but it does not create frontend authenticated state.

The frontend does not store auth credentials, JWTs, API tokens, session keys, or user auth state in browser storage. CSRF tokens are read from the framework cookie when needed for unsafe requests and should not be treated as login tokens.

The starter intentionally has no redirects, route guards, protected pages, or authorization UI. Downstream applications can add project-specific routing and authorization patterns later with dedicated tests and documentation.

## Frontend Extension Guidance

For future frontend work:

* Preserve the current design unless a branch explicitly scopes design changes.
* Add pages and components carefully, using existing conventions.
* Keep auth state in memory unless a scoped auth architecture branch changes it.
* Do not add token persistence.
* Do not store auth data in `localStorage` or `sessionStorage`.
* Do not introduce frontend build tooling unless explicitly scoped.
* Do not refactor `frontend/src/js/main.js` without a dedicated cleanup branch.

If future JavaScript splitting is desired, treat it as a separate cleanup candidate with its own tests and visual checks.

## Domain-Specific Project Examples

This template can be used as a starting point for downstream projects such as:

* Trading wallet app.
* Stock analysis app.
* E-commerce app.
* Internal admin-style app.
* Content or project dashboard.

These are examples of downstream uses only. They should not be implemented in the neutral starter template.

## Recommended Branch Strategy

Branch naming examples:

* `feature/template-...` for generic template documentation, cleanup, or reusable foundation.
* `feature/backend-...` for backend infrastructure.
* `feature/frontend-...` for frontend foundation work.
* `feature/auth-...` for scoped auth changes.
* `feature/<domain>-...` for downstream product-specific work.

Template branches should stay domain-neutral. Domain branches should clearly identify that they are no longer generic starter-template work.

## Pre-Change Checklist

Before starting a feature, ask:

* Is this generic template work or domain-specific work?
* Does it change auth behavior?
* Does it change frontend design?
* Does it change endpoint URLs or response shapes?
* Does it add dependencies or tooling?
* Does it require models or migrations?
* Are tests needed or updated?
* Are docs updated?
* Which standard checks should run?

If the answer points to product-specific logic, put the work in a downstream branch or project.

## Handoff Checklist For New Projects

For a new project based on this template:

1. Clone or branch from the template.
2. Read [template-structure.md](./template-structure.md).
3. Read [environment.md](./environment.md).
4. Read [local-development.md](./local-development.md).
5. Read [api.md](./api.md).
6. Configure local environment files safely.
7. Install backend requirements.
8. Run backend checks and tests.
9. Run frontend syntax and HTML checks.
10. Create a domain-specific app or branch.
11. Keep secrets and local artifacts out of Git.

## Future Template Cleanup Candidates

These are candidates for later branches only.

| Candidate | Risk | Why it may be useful | Why it is not part of this branch |
| --- | --- | --- | --- |
| Rename or split `backend/app` | High | Could make backend ownership clearer as the project grows. | It affects imports, settings, tests, and future migration paths. |
| Split `frontend/src/js/main.js` | Medium | Could improve maintainability as frontend behavior grows. | It risks behavior drift and needs dedicated frontend verification. |
| Add Django settings environment parsing | Medium | Could make deployment and local configuration cleaner. | It changes settings behavior and needs focused testing. |
| Add optional OpenAPI generation | Medium | Could provide machine-readable API docs later. | It adds dependencies/tooling and is not needed for current docs. |
| Add deployment docs | Low | Could help production handoff. | Deployment strategy is not chosen in this branch. |
| Expand CI checks | Medium | Could catch regressions earlier. | CI behavior and tooling should change in a separate branch. |
| Add frontend component/page documentation | Low | Could help downstream frontend customization. | This branch focuses on overall template usage. |

Keep cleanup branches narrow and reversible. Run standard checks before committing.
