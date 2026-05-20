# Backend integration guide

This document is the contract between the static frontend and any
backend (Django, Flask, Node, etc.). It covers:

1. Editing the **Living Content** (marketing copy, showcase messages)
2. Customizing the global **corner radius** token
3. Managing the **input contrast** tokens
4. Framework integration best practices
5. Mapping the **unified sections and nav tabs** to backend routes
6. Wiring the **API base URL** and endpoints
7. **Flask** / **Django** static-mount snippets for the compact layout
8. The full inventory of `data-*` selectors and CSRF strategy

## 1. Living Content — the editable surface

This site is a **flat, minimalist Master Template**. Every editable
string lives in one of two places:

### 1a. Showcase card messages — `window.SHOWCASE_MESSAGES`

The rotating messages in the hero showcase card live in an array at
the top of `frontend/assets/js/main.js`:

```js
window.SHOWCASE_MESSAGES = window.SHOWCASE_MESSAGES || [
  'اعرض ميزات تطبيقك بشكل تفاعلي هنا.',
  'دعم الرسوم البيانية والبيانات الحية.',
  'واجهة ذكية تتكيف مع احتياجاتك.',
  'بساطة في التصميم، قوة في الأداء.',
];
```

The `||` guard means a backend can override the entire array by
defining `window.SHOWCASE_MESSAGES` *before* `main.js` loads:

```html
<script>
  window.SHOWCASE_MESSAGES = [
    'رسالة مخصّصة #1',
    'رسالة مخصّصة #2',
    'رسالة مخصّصة #3',
  ];
</script>
<script src="assets/js/main.js" defer></script>
```

The rotator rebuilds the dot indicator to match the array length —
3 messages produces 3 dots, 6 produces 6, etc.

### 1b. HTML Living Content blocks

Every editable region in `index.html` is wrapped in a
`<!-- LIVING CONTENT BLOCK: NAME -->` comment marker:

| Block          | Anchor          | What you can change                                  |
|----------------|-----------------|------------------------------------------------------|
| `HERO`         | `#hero`         | Eyebrow chip, H1, lead paragraph, CTA label, trust note. The showcase card markup is here; messages are in `main.js` (§1a). |
| `FEATURES`     | `#features`     | Section eyebrow/title/description + each `.feature-card` (icon SVG, title, description). |
| `STATS`        | `#stats`        | Four `.stat-num` / `.stat-label` pairs.              |
| `TESTIMONIALS` | `#testimonials` | Each `.testimonial-card`: quote, avatar letter, name, role. |
| `PRICING`      | `#pricing`      | Plan name, title, description, price, features list, CTA. Toggle `.featured` on the recommended plan. |
| `HELP / FAQ`   | `#help`         | Each `<details class="faq-item">` is one Q&A.        |
| `FINAL CTA`    | (no anchor)     | Closing headline + paragraph + CTA label.            |

Nav tabs live in `frontend/partials/nav.html`; the 3 footer columns
live in `frontend/partials/footer.html`.

## 2. Customizing the unified corner radius

The template has one corner geometry source of truth in
`frontend/assets/css/tokens.css`:

```css
:root {
  --radius: 8px;
}
```

Every rounded element consumes `border-radius: var(--radius);`,
including nav-tab backgrounds, cards, buttons, form fields, modal panels,
FAQ rows, footer marks, and dropdown/modal controls. To make the whole
interface slightly softer, change only this token:

```css
:root {
  --radius: 8px;
}
```

Do not add component-level oversized radius values or one-off
`12px/16px` radii. Backend-rendered components should use the same CSS
primitive classes (`.btn`, `.card`, `.input`) or set
`border-radius: var(--radius);` directly.

## 3. Managing input contrast tokens

Inputs are borderless and rely only on background contrast. The token
contract lives in `frontend/assets/css/tokens.css`. Light mode uses a
layered contrast model: base page `#EEF2F6`, cards/surfaces `#FFFFFF`,
and inputs use a quiet neutral fill inside white surfaces so the fields
remain visible without borders.

```css
:root {
  --bg: #EEF2F6;
  --surface: #FFFFFF;
  --input-bg: #FCFDFE;
  --input-bg-dark: #333539;
  --input-focus-ring: #1a73e8;
  --input-error-ring: #d93025;
  --form-bg: var(--input-bg);
}

:root[data-theme="dark"] {
  --form-bg: var(--input-bg-dark);
}
```

Use `--input-bg` for all light-mode form fields and `--input-bg-dark`
for dark-mode form fields. Focus and error states use a 1px inset ring
on inputs only, not a CSS border. Do not add borders or outlines to
backend-rendered forms. Native `input`, `textarea`, and `select` elements already inherit
`border: none !important`, `outline: none !important`, and
`border-radius: var(--radius)`.

Modal panels use `--modal-bg: var(--bg)` so white/light input fields
remain visible inside login, registration, and future dialogs.

## 4. Framework integration best practices

Keep the frontend contract stable and let the backend adapt to it:

- Serve `frontend/assets/` as static files without rewriting paths.
- Render `frontend/index.html` as a template only when you need server-side
  injection for CSRF, app config, nav links, or CMS content.
- Inject `window.APP_CONFIG` and `window.SHOWCASE_MESSAGES` before
  `assets/js/main.js`; do not edit `main.js` per environment.
- Keep `partials/nav.html` and `partials/footer.html` as the source of
  shared chrome. In a server-rendered app you may convert them to native
  includes, but keep the same classes and `data-*` attributes.
- Treat CSS classes as the public design-system API. Backend-rendered
  forms should compose `.input`, `.btn`, `.card`, `.stack`, and `.cluster`
  before adding custom styles.
- Preserve stable selectors such as `[data-auth-open]`, `[data-section-link]`,
  and `#showcaseMessage`; JavaScript behavior depends on them.

## 5. Mapping the unified sections and nav tabs to backend routes

The header exposes four primary tabs. On the static template they jump to
scroll anchors; on a real backend you can either keep that single-page
behavior or split into routed views. The contract that ties them together
is the `href` attribute on each `.nav-link`.

| Nav tab           | Anchor          | Suggested Flask route             | Suggested Django route name |
|-------------------|-----------------|-----------------------------------|-----------------------------|
| الرئيسية           | `#hero`         | `@app.route('/')`                 | `path('', …, name='home')`           |
| المميزات          | `#features`     | `@app.route('/features')`         | `path('features/', …, name='features')` |
| باقات الاشتراك     | `#pricing`      | `@app.route('/pricing')`          | `path('pricing/', …, name='pricing')` |
| مركز المساعدة      | `#help`         | `@app.route('/help')`             | `path('help/', …, name='help')` |

To convert from anchors to routes, edit `frontend/partials/nav.html`:

```html
<!-- Before — single-page anchor -->
<a href="index.html#features" class="nav-link" data-section-link>المميزات</a>

<!-- After — Flask url_for / Django {% url %} -->
<a href="{{ url_for('features') }}" class="nav-link">المميزات</a>           <!-- Flask -->
<a href="{% url 'features' %}" class="nav-link">المميزات</a>                <!-- Django -->
```

Drop the `data-section-link` attribute on tabs that point to real
routes — that attribute is what activates the in-page scroll-spy.

The active-tab styling (`.nav-link.is-active`) reads from the
`is-active` class. With routed views, set it server-side based on the
current view name. With the default single-page setup, `main.js`
toggles it via `IntersectionObserver`.

### Backend section model

If you render the template from Flask or Django, map each living section
to a simple context object. This keeps copy edits outside the template
and lets a CMS or admin panel own the content later.

| Section         | Template anchor | Suggested context key |
|-----------------|-----------------|------------------------|
| Hero            | `#hero`         | `hero`                 |
| Features        | `#features`     | `features`             |
| Stats           | `#stats`        | `stats`                |
| Testimonials    | `#testimonials` | `testimonials`         |
| Pricing         | `#pricing`      | `plans`                |
| FAQ / Help      | `#help`         | `faqs`                 |

Flask example:

```python
@app.route("/")
def home():
    return render_template(
        "index.html",
        hero={"title": "ابتكر. انمُ. وحقّق الكفاءة."},
        features=Feature.query.order_by(Feature.sort_order).all(),
        stats=Metric.query.order_by(Metric.sort_order).all(),
        testimonials=Testimonial.query.limit(2).all(),
        plans=Plan.query.filter_by(active=True).all(),
        faqs=Faq.query.order_by(Faq.sort_order).all(),
    )
```

Django example:

```python
class HomeView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            "hero": {"title": "ابتكر. انمُ. وحقّق الكفاءة."},
            "features": Feature.objects.order_by("sort_order"),
            "stats": Metric.objects.order_by("sort_order"),
            "testimonials": Testimonial.objects.all()[:2],
            "plans": Plan.objects.filter(active=True),
            "faqs": Faq.objects.order_by("sort_order"),
        })
        return context
```

## 6. Wiring the API base URL

The frontend has a single config object at the top of
`frontend/assets/js/main.js`:

```js
window.APP_CONFIG = window.APP_CONFIG || {
  API_BASE_URL: '#',
  endpoints: {
    trialSignup: '/api/trial',
    login:       '/api/auth/login',
    register:    '/api/auth/register',
    oauthGoogle: '/api/auth/google',
  },
};
```

Until `API_BASE_URL` changes from `'#'`, every form submit short-circuits
to a stub success. Inject your own config *before* `main.js` loads —
the `||` guard makes the override win:

```html
<script>
  window.APP_CONFIG = {
    API_BASE_URL: 'https://api.your-backend.example',
    endpoints: { trialSignup: '/api/trial', login: '/api/auth/login',
                 register: '/api/auth/register', oauthGoogle: '/api/auth/google' }
  };
</script>
<script src="assets/js/main.js" defer></script>
```

### Endpoint shapes

All endpoints accept and return `application/json`. The frontend POSTs.

- `POST trialSignup` — body `{ "email": "…" }`. Any 2xx = success.
- `POST login` — body `{ "email": "…", "password": "…" }`. Non-2xx with
  `{ "error": "…" }` surfaces the message in `[data-auth-error="login"]`.
- `POST register` — body `{ "email": "…", "password": "…" }`
  (`password_confirm` is validated client-side and not sent). The
  registration UI intentionally has no `name` / `الاسم` field.
- `POST oauthGoogle` — backend returns either
  `{ "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?…" }`
  (frontend will `window.location.assign(...)`) or
  `{ "ok": true, "user": {…} }` for server-side completion.

## 7. Serving under Flask

The frontend lives under `frontend/`. Two patterns:

### 4a. Mount `frontend/` as static, render index.html as a template

```python
# app.py
from flask import Flask, render_template
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'frontend'),
    static_url_path='',                           # /assets/… and /partials/… work directly
    template_folder=os.path.join(BASE_DIR, 'frontend'),
)

@app.route('/')
def home():
    # Render index.html as a Jinja template so the backend can inject
    # window.APP_CONFIG, the CSRF meta, and showcase overrides.
    return render_template('index.html')
```

`frontend/assets/...` is served as `/assets/...` and
`frontend/partials/...` as `/partials/...` without further routing.

In `index.html`, the CSRF meta is already present:

```html
<meta name="csrf-token" content="" data-backend-fill="csrf">
```

Replace the empty `content=""` with `{{ csrf_token() }}` in the Jinja
render. Then update `apiPost()` in `main.js` to forward the token:

```js
const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
const response = await fetch(base + window.APP_CONFIG.endpoints[endpointKey], {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(csrf && { 'X-CSRFToken': csrf }) },
  body: JSON.stringify(body),
});
```

### 4b. Serve as fully-static (CDN, S3, Nginx)

Point Nginx (or your CDN) at `frontend/` as the document root. No
server-side rendering needed — partials use `fetch()` for nav/footer,
and `main.js` falls back to inline copies if `fetch()` fails.

## 8. Serving under Django

```python
# settings.py
import os

BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'frontend'],         # index.html is treated as a template
    # …
}]

STATIC_URL = '/'
STATICFILES_DIRS = [BASE_DIR / 'frontend']   # /assets/… and /partials/… resolve
```

```python
# urls.py
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    # Serve frontend assets directly when DEBUG=True. For production,
    # collect static and serve via Nginx / Whitenoise.
    re_path(r'^assets/(?P<path>.*)$', serve,
            {'document_root': settings.BASE_DIR / 'frontend' / 'assets'}),
    re_path(r'^partials/(?P<path>.*)$', serve,
            {'document_root': settings.BASE_DIR / 'frontend' / 'partials'}),
]
```

In `index.html` (treated as a Django template), replace the CSRF meta:

```html
<meta name="csrf-token" content="{{ csrf_token }}">
```

## 9. Selector inventory

Stable contract points:

- `#emailForm` — trial-signup form in hero
- `#authModal` — auth modal injected by JS
  - `[data-auth-tab="login|register"]` — tab triggers
  - `[data-auth-panel="login|register"]` — form panels
  - `[data-auth-error="login|register"]` — error message slots
  - `[data-auth-provider="google"]` — Google sign-in button
- `[data-auth-open]` — opens the auth modal (nav login button, pricing
  "اشترك الآن" button)
- `#navToggle`, `#primaryNav`, `#nav` — chrome
- `[data-section-link]` — anchor links the scroll-spy observes (drop
  this when converting an anchor into a real route)
- `#showcaseMessage`, `#showcaseStep`, `#showcaseDots` — showcase card
  internals; the rotator script in `main.js` queries these by ID
- Section anchors: `#hero`, `#features`, `#stats`, `#testimonials`,
  `#pricing`, `#help`

## 10. Design rules to preserve

This template is **flat, borderless, and contrast-based by design**.
When integrating, keep the rules:

- No borders or outlines in UI styling. The global reset applies
  `border: none !important;` and `outline: none !important;` to every
  element.
- Elements are defined only by solid background contrast.
- No elevation shadow effects. Inputs may use the documented 1px inset
  ring for focus/error states.
- No gradients. Solid surfaces only.
- Inputs use one light-mode variable, `--input-bg: #FCFDFE`, and one
  dark-mode variable, `--input-bg-dark: #333539`. Form wrappers can use
  the page background `var(--bg)` to make the fields visible.
- Light mode uses vibrant Google Blue `#1a73e8`; dark mode uses soft
  Google Blue `#8ab4f8`. Text on accent backgrounds stays white.
- One global corner token: `--radius: 8px;`. Every rounded element must
  use `border-radius: var(--radius);`.
- Header actions are limited to `دخول` and the theme toggle. On desktop,
  the four nav tabs sit directly in the header without a visible container.
- Tokens flow through `:root` (light) and `:root[data-theme="dark"]`.
  Don't hard-code colors in your templates.
- Active nav-tab background follows the current accent token:
  vibrant `#1a73e8` in light mode and soft `#8ab4f8` in dark mode.
- The `<meta name="theme-color">` is `#EEF2F6` light / `#202124` dark.
  `theme.js` updates it on toggle; don't override server-side.

## 11. Operational considerations

- `POST /api/trial` should be rate-limited (IP bucket).
- Password validation should be enforced server-side; the frontend
  only checks `minlength=8` and password-match.
- HTTPS / HSTS / secure cookies for production.
- `prefers-color-scheme` is respected by `theme.js` until the user
  flips the toggle (the choice persists in `localStorage`).
