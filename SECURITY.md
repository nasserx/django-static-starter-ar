# Security Policy

## Supported Versions

This starter template is maintained from the current default branch. Published releases are supported according to the notes attached to each release. Older copies should be updated by the consuming project before production use.

## Reporting a Vulnerability

If GitHub Security Advisories are enabled for this repository, please report vulnerabilities through the repository's private advisory flow.

If private advisories are not available, open a minimal public issue that states a vulnerability needs private disclosure. Do not include sensitive exploit details, secrets, or proof-of-concept payloads in the public issue.

## Security Expectations for Users of the Template

This repository is a reusable Django and static frontend starter template, not a hosted production service. Consuming projects are responsible for reviewing, hardening, deploying, and monitoring their own application.

Before production use, set project-specific production values for:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `DJANGO_SECURE_SSL_REDIRECT`
- `DJANGO_SESSION_COOKIE_SECURE`
- `DJANGO_CSRF_COOKIE_SECURE`
- `DJANGO_SECURE_HSTS_SECONDS`
- `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS`
- `DJANGO_SECURE_HSTS_PRELOAD`
- `DJANGO_SECURE_REFERRER_POLICY`

`.env` files are not loaded automatically by this template. If a consuming project uses `.env` files, it must load them explicitly in its own runtime setup.

## Development Defaults Versus Production Configuration

The template is development-friendly by default and is not production-safe out of the box. It provides optional environment-driven hardening knobs, but consuming projects must still choose values that match their HTTPS, host, proxy, cookie, CORS, and CSRF deployment.

Expected deployment-check warnings for the development starter can include:

- `SECURE_HSTS_SECONDS`
- `SECURE_SSL_REDIRECT`
- insecure development `SECRET_KEY`
- `SESSION_COOKIE_SECURE`
- `CSRF_COOKIE_SECURE`
- `DEBUG=True`

Resolve these warnings in the consuming project before deploying to production. Secure cookies and SSL redirect require HTTPS. Enable HSTS preload only when you understand the domain-wide consequences and are ready for all affected hosts to require HTTPS.
