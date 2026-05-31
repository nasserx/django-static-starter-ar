# Django + Static Frontend Starter Template

This repository is being prepared as a reusable Django backend + static
frontend starter template. It includes a Django session-auth foundation
and a static Arabic RTL frontend design that should remain stable while
the template is generalized.

For the current structure audit and future cleanup notes, see
[`docs/template-structure.md`](./docs/template-structure.md).

For environment file usage and current config behavior, see
[`docs/environment.md`](./docs/environment.md).

For local setup and day-to-day development commands, see
[`docs/local-development.md`](./docs/local-development.md).

For the current backend API contract, see
[`docs/api.md`](./docs/api.md).

## Frontend Template

The frontend is a **flat, generic, production-ready Arabic SaaS landing
template**. Plain HTML, CSS, and JavaScript — no frontend framework, no
bundler, no build step. Drop it into any future application: tweak the
copy/config, point the API config at your backend, and you have a polished
landing page.

Highlights:

- **Flat by design**. No elevation shadows, no gradients, no glows.
  Elements are defined by solid background contrast. Inputs use a subtle
  inset ring only for focus/error states.
- **Dual-theme**. Default light is a cool off-white `#EEF2F6`.
  Dark is Google Studio (`#202124` canvas, `#292a2d` cards).
  Toggle in the nav. System preference is respected until the user
  flips it manually.
- **Borderless nav tabs**. Four tabs sit directly in the header on
  desktop. Active tab uses the current accent block: `#1a73e8` in light,
  `#8ab4f8` in dark.
- **Compact layout**. 1400px max-width, 5% page padding —
  content fills the screen, no wasted dead space.
- **Living Content**. Every editable string sits inside a clearly
  commented HTML block. See [`BACKEND_INTEGRATION.md`](./BACKEND_INTEGRATION.md)
  for the per-block map.
- **Generic-ready branding**. Brand placeholder is "منصتك" —
  drop in any name. The logo is an abstract 8-point spark.

## Preview locally

```bash
# Static server (preferred — partials load via fetch)
cd frontend && python -m http.server 8000
# then visit http://localhost:8000/

# Direct file open also works — main.js inlines the partials as a
# fallback when fetch() fails on file://.
open frontend/index.html
```

## Project layout

```
/
├── frontend/
│   ├── index.html
│   ├── partials/
│   │   ├── nav.html               brand + 4 tabs + theme toggle + login
│   │   └── footer.html            3 columns (الشركة / الدعم / قانوني) + © strip
│   ├── assets/
│   │   ├── css/
│   │   │   ├── tokens.css         dual-theme palette + radii + motion (FLAT)
│   │   │   ├── layout.css         resets + primitives (.btn, .card, .input, …)
│   │   │   └── components.css     landing-page composition
│   │   ├── js/
│   │   │   ├── theme.js           synchronous theme bootstrap (no FOUC)
│   │   │   └── main.js            partials loader + nav + auth modal + scroll-spy + showcase rotator
│   │   └── branding/              spark monogram favicon set
│   └── .htmlvalidate.json
├── README.md
├── CLAUDE.md
├── BACKEND_INTEGRATION.md
└── docs/superpowers/specs/        design specs that drove this layout
```

## Information architecture

| Nav tab           | Anchor          | Content block                                |
|-------------------|-----------------|----------------------------------------------|
| الرئيسية           | `#hero`         | Hero + rotating showcase card                |
| المميزات          | `#features`     | 3 feature cards                              |
| باقات الاشتراك     | `#pricing`      | 2 pricing plans                              |
| مركز المساعدة      | `#help`         | FAQ accordion + contact strip                |

`#stats` and `#testimonials` exist as sections between Features and
Pricing — surfaced via footer links, not in primary nav.

Every `<section>` can be hidden by adding `hidden`. `layout.css`
enforces `[hidden]{display:none!important}`.

## CI

`.github/workflows/ci.yml` runs `gitleaks` and `html-validate` on every
push and pull request.

## Wiring a backend

Two paths covered in detail in
[`BACKEND_INTEGRATION.md`](./BACKEND_INTEGRATION.md):

- **Flask** — mount `frontend/` as static + render `index.html` as a
  Jinja template
- **Django** — `STATICFILES_DIRS` + `TemplateView`, with anchor-to-route
  conversion for the nav tabs
- **Any framework** — serve `frontend/assets/` statically, render or
  include `partials/nav.html` and `partials/footer.html`, then inject
  config before `assets/js/main.js`.

API config lives at the top of `frontend/assets/js/main.js`:

```js
window.APP_CONFIG = window.APP_CONFIG || {
  API_BASE_URL: 'https://api.your-backend.example',
  endpoints: { trialSignup: '/api/trial', login: '/api/auth/login',
               register: '/api/auth/register', oauthGoogle: '/api/auth/google' },
};
```

Showcase card messages live in the same file:

```js
window.SHOWCASE_MESSAGES = window.SHOWCASE_MESSAGES || [
  'اعرض ميزات تطبيقك بشكل تفاعلي هنا.',
  // …
];
```

Override both with `<script>` blocks injected before `main.js`.

## Adding a section

1. Compose using existing primitives in `layout.css` (`.btn`, `.card`,
   `.chip`, `.stack`, `.cluster`, `.container`).
2. Wrap in `<section id="…" class="section">` so the section padding
   and scroll-margin rules apply.
3. To make it hideable, just add `hidden` on the `<section>`.
4. Wrap editable copy in a `<!-- LIVING CONTENT BLOCK: NAME -->`
   comment so future template users can find it.
