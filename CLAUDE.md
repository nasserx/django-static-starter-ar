# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working
with code in this repository.

## What this project is

`cranl-test` is a **flat, generic Arabic SaaS Master Template** — plain
HTML, CSS, and JavaScript, no backend, no build step. A single landing
page (`frontend/index.html`) renders the full marketing surface as a
living template: copy is editable inside `<!-- LIVING CONTENT BLOCK: … -->`
HTML comment regions, showcase-card messages live in
`window.SHOWCASE_MESSAGES`, and a future backend wires in by editing one
value (`window.APP_CONFIG.API_BASE_URL`) at the top of
`frontend/assets/js/main.js`.

The site is **dual-theme**:

- **Light (default)** — `#EEF2F6` cool off-white canvas, `#FFFFFF`
  cards, `#FCFDFE` inputs, charcoal `#202124` ink, Google Blue
  `#1a73e8` accent.
- **Dark** — Google Studio: `#202124` canvas, `#292a2d` cards,
  `#e8eaed` ink, `#8ab4f8` accent.

Active nav-tab background follows `--accent`: `#1a73e8` in light mode
and `#8ab4f8` in dark mode, with white text.

A `#themeToggle` button in the nav flips between modes; preference
persists in `localStorage`. `theme.js` runs synchronously in `<head>`
before any stylesheet so the first paint is always correct.

See `README.md` for the preview and integration story, and
`BACKEND_INTEGRATION.md` for the endpoint / data-attribute inventory,
Living Content block map, and Python static-mount snippets.

## Stack quick reference

- **Vanilla HTML / CSS / JS** — no framework, no bundler, no build step.
- **Tajawal** loaded from Google Fonts. IBM Plex Mono is intentionally
  not loaded — Latin mono mangles Arabic ligatures.
- **Static server preferred** for preview (partials use `fetch()`), but
  `main.js` inlines partial copies as a fallback so `file://` also works.
- **No tests** — verification is manual browser checks.

## Common commands

```bash
# Local preview — run from frontend/ so / serves the landing page
cd frontend && python -m http.server 8000

# HTML validation (matches CI)
cd frontend && npx --yes html-validate@9 "*.html" "partials/*.html"
```

## Architecture

### Single page

`frontend/index.html` is the whole site. It:

- Loads `theme.js` synchronously in `<head>` so `<html data-theme="…">`
  is set before stylesheets paint.
- Preconnects to Google Fonts and loads Tajawal.
- Loads `tokens.css` → `layout.css` → `components.css` in that order.
- Drops `<div data-include="partials/nav.html"></div>` and
  `<div data-include="partials/footer.html"></div>` for shared chrome.
- Defers `assets/js/main.js`, which loads partials and binds the theme
  toggle, nav, auth-modal, trial form, scroll-spy, reveal animations,
  and the rotating showcase card.

### Design system (load-bearing)

```
tokens.css     →  ONE source of truth. :root carries LIGHT tokens by
                  default. :root[data-theme="dark"] (and the
                  prefers-color-scheme media query, when the user
                  hasn't opted into light) override to dark.
layout.css     →  Resets, typography, primitives:
                  .btn (+ -primary|-secondary|-ghost|-sm), .card, .surface,
                  .input, .chip (+ -accent), .stack, .cluster, .center,
                  .container, .heading-xl|-lg, .text-muted|-subtle
components.css →  Landing-page composition: nav, hero, features,
                  stats, testimonials, pricing, help, final-cta,
                  footer, auth-modal.
```

Hard rules (these matter — past bugs depend on them):

- **FLAT by design.** No elevation shadows, no gradients, no text-shadows,
  and no glows. Surfaces are defined by solid color contrast. Inputs are
  the only exception: they use a 1px inset `box-shadow` ring for
  focus/error states.
- **Never duplicate tokens.** Use `var(--bg)` and edit `tokens.css` if
  the palette needs to change.
- **Never hard-code colors.** All colors go through tokens. The active
  nav-tab uses `--nav-active-bg`, which resolves to the current theme
  accent.
- **Never hard-code font names outside `tokens.css`.** Use `var(--font)`.
- **Subtle rounding only** — all rounded UI resolves to `--radius: 8px`.
- **Never apply monospace to Arabic prose.** It mangles ligature joins.
- **`letter-spacing: 0` on Arabic text.** Positive values break joins.
- **`hidden` is enforced as `display:none!important`** in `layout.css`.

### Header navigation

The four nav tabs sit directly in the header on desktop with no visible
container. Mobile still uses a solid popover surface for readability.
The active tab is a solid accent block with white text.

### Living Content

Marketing copy lives in `<!-- LIVING CONTENT BLOCK: NAME -->` markers
in `index.html`. Showcase messages live in `window.SHOWCASE_MESSAGES`
at the top of `main.js`. Backends can override both via injected
`<script>` blocks; see `BACKEND_INTEGRATION.md` §1.

### Partials and the `partials:ready` event

`assets/js/main.js` fetches every `<div data-include="…"></div>` and
replaces the host element. After all partials resolve it sets
`window.__partialsReady = true` and dispatches `partials:ready` on
`document`. If `fetch()` fails (typical on `file://`), it falls back
to inline copies inside `main.js` — both copies must be kept in sync
when the partials change.

### API configuration

`assets/js/main.js` owns the entire backend contract at the top of the
file:

```js
window.APP_CONFIG = window.APP_CONFIG || {
  API_BASE_URL: '#',
  endpoints: { trialSignup: '/api/trial', login: '/api/auth/login',
               register: '/api/auth/register', oauthGoogle: '/api/auth/google' },
};
```

When `API_BASE_URL === '#'`, form submits short-circuit to a stub
success. Wiring = changing one string. See `BACKEND_INTEGRATION.md` for
endpoint shapes + CSRF + Flask/Django mount snippets.

## File pointers

- `README.md` — preview + integration story
- `BACKEND_INTEGRATION.md` — endpoints + data-attribute inventory +
  Living Content block map + Flask/Django snippets + nav-tab-to-route
  mapping
- `docs/superpowers/specs/2026-05-18-premium-template-redesign.md` —
  the original design spec (now superseded by the flat-template direction
  but kept for history)
