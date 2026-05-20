(function () {
  const CONFIG = window.APP_CONFIG || {};
  const CONTENT = window.APP_CONTENT || {};
  const CONSTANTS = window.APP_CONSTANTS || {};
  const AUTH_PROVIDERS = window.AUTH_PROVIDERS || [];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const isEmail = (value) => CONSTANTS.emailPattern.test((value || '').trim().toLowerCase());
  const toArabicNumeral = (value) => String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[digit]);

  const svg = {
    assetIcon(path, className, label) {
      const aria = label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"';
      return '<span class="svg-icon ' + className + '" style="--icon-url: url(\'' + path + '\');"' + aria + '></span>';
    },
    logo(className = 'brand-mark') {
      return [
        '<svg class="' + className + '" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + CONTENT.brand.name + '">',
        '<rect width="64" height="64" rx="6" fill="var(--logo-bg)" />',
        '<path d="M32 16 L36 28 L48 32 L36 36 L32 48 L28 36 L16 32 L28 28 Z" fill="var(--logo-icon)" />',
        '</svg>',
      ].join('');
    },
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    checkCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    preview: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6v6H9z"/></svg>',
    moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  };

  const featureIcons = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
    rings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>',
  };

  function renderInto(name, markup) {
    const slot = $('[data-component="' + name + '"]');
    if (slot) slot.outerHTML = markup;
  }

  function renderSectionHead(section) {
    return [
      '<div class="section-head">',
      '<span class="section-eyebrow">' + section.eyebrow + '</span>',
      '<h2 class="section-title">' + section.title + '</h2>',
      '<p class="section-desc">' + section.description + '</p>',
      '</div>',
    ].join('');
  }

  function renderNavbar() {
    const nav = CONTENT.navigation;
    const brand = CONTENT.brand;
    const links = nav.links.map((link) => (
      '<a href="' + link.href + '" class="nav-link' + (link.active ? ' is-active' : '') + '" data-section-link' + (link.active ? ' aria-current="true"' : '') + '>' +
        link.label +
      '</a>'
    )).join('');

    return [
      '<nav class="nav" id="nav">',
      '<div class="container nav-inner">',
      '<a href="index.html#hero" class="brand">',
      svg.logo('brand-mark'),
      '<span class="brand-name">' + brand.name + '</span>',
      '</a>',
      '<div class="nav-links" id="primaryNav">' + links + '</div>',
      '<div class="nav-actions">',
      '<button class="nav-action-link" type="button" data-auth-open>' + nav.loginLabel + '</button>',
      '<button class="theme-toggle" id="themeToggle" type="button" aria-label="' + nav.themeToggleLabel + '" title="' + nav.themeToggleLabel + '">' + svg.moon + svg.sun + '</button>',
      '<button class="nav-toggle" id="navToggle" type="button" aria-label="' + nav.menuToggleLabel + '" aria-controls="primaryNav" aria-expanded="false"><span></span><span></span><span></span></button>',
      '</div>',
      '</div>',
      '</nav>',
    ].join('');
  }

  function renderHero() {
    const hero = CONTENT.hero;
    const form = hero.trialForm;
    const dotCount = hero.preview.messages.length;
    const dots = Array.from({ length: dotCount }, (_, index) => '<span class="showcase-dot' + (index === 0 ? ' is-active' : '') + '"></span>').join('');

    return [
      '<section class="hero" id="' + hero.id + '">',
      '<div class="container hero-grid">',
      '<div class="hero-text">',
      '<div class="hero-tag"><span class="hero-tag-dot"></span>' + hero.eyebrow + '</div>',
      '<h1><span class="accent">' + hero.titlePrefix + '</span>' + hero.titleSuffix + '</h1>',
      '<p class="lead">' + hero.lead + '</p>',
      '<form class="email-form" id="' + form.id + '" action="' + form.action + '" method="' + form.method + '" data-endpoint-key="' + form.endpointKey + '" autocomplete="on" novalidate>',
      '<input type="email" name="' + form.inputName + '" placeholder="' + form.inputPlaceholder + '" aria-label="' + form.inputLabel + '" autocomplete="email" inputmode="email" required dir="ltr">',
      '<button type="submit" data-loading-label="' + form.loadingLabel + '" data-success-label="' + form.successLabel + '">' + form.submitLabel + svg.arrow + '</button>',
      '</form>',
      '<div class="hero-note">' + svg.checkCircle + hero.note + '</div>',
      '</div>',
      '<div class="hero-visual">',
      '<div class="preview-card">',
      '<div class="preview-top"><div class="label">' + svg.preview + hero.preview.label + '</div><span class="preview-badge">' + hero.preview.badge + '</span></div>',
      '<div class="preview-body">',
      '<div class="showcase-step" id="showcaseStep">١ / ' + toArabicNumeral(dotCount) + '</div>',
      '<div class="showcase-message" id="showcaseMessage">' + hero.preview.messages[0] + '</div>',
      '<div class="showcase-dots" id="showcaseDots" aria-hidden="true">' + dots + '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</section>',
    ].join('');
  }

  function renderFeatures() {
    const section = CONTENT.features;
    const cards = section.items.map((item) => (
      '<article class="feature-card">' +
      '<div class="feature-icon" aria-hidden="true">' + featureIcons[item.icon] + '</div>' +
      '<h3 class="feature-title">' + item.title + '</h3>' +
      '<p class="feature-desc">' + item.description + '</p>' +
      '</article>'
    )).join('');

    return '<section class="section features" id="' + section.id + '"><div class="container">' + renderSectionHead(section) + '<div class="features-grid">' + cards + '</div></div></section>';
  }

  function renderStats() {
    const section = CONTENT.stats;
    const cards = section.items.map((item) => '<div class="stat-card"><div class="stat-num">' + item.value + '</div><div class="stat-label">' + item.label + '</div></div>').join('');
    return '<section class="section stats" id="' + section.id + '"><div class="container">' + renderSectionHead(section) + '<div class="stats-grid">' + cards + '</div></div></section>';
  }

  function renderTestimonials() {
    const section = CONTENT.testimonials;
    const cards = section.items.map((item) => (
      '<article class="testimonial-card">' +
      '<p class="testimonial-quote">' + item.quote + '</p>' +
      '<div class="testimonial-foot"><div class="testimonial-avatar" aria-hidden="true">' + item.avatar + '</div><div><div class="testimonial-name">' + item.name + '</div><div class="testimonial-role">' + item.role + '</div></div></div>' +
      '</article>'
    )).join('');
    return '<section class="section" id="' + section.id + '"><div class="container">' + renderSectionHead(section) + '<div class="testimonials-grid">' + cards + '</div></div></section>';
  }

  function renderPricing() {
    const section = CONTENT.pricing;
    const plans = section.plans.map((plan) => {
      const features = plan.features.map((item) => '<li>' + svg.check + item + '</li>').join('');
      const cta = plan.cta.auth
        ? '<button type="button" class="price-cta" data-auth-open>' + plan.cta.label + '</button>'
        : '<a href="' + plan.cta.href + '" class="price-cta">' + plan.cta.label + '</a>';

      return [
        '<div class="price-card' + (plan.featured ? ' featured' : '') + '">',
        plan.tag ? '<span class="price-tag">' + plan.tag + '</span>' : '',
        '<div class="price-name">' + plan.name + '</div>',
        '<div class="price-title">' + plan.title + '</div>',
        '<div class="price-desc">' + plan.description + '</div>',
        '<div class="price-amount"><span class="num">' + plan.amount + '</span><span class="unit">' + plan.unit + '</span></div>',
        '<ul class="price-features">' + features + '</ul>',
        cta,
        '<div class="price-foot">' + plan.footnote + '</div>',
        '</div>',
      ].join('');
    }).join('');

    return '<section class="section" id="' + section.id + '"><div class="container">' + renderSectionHead(section) + '<div class="pricing-grid">' + plans + '</div></div></section>';
  }

  function renderHelp() {
    const section = CONTENT.help;
    const faqs = section.faqs.map((item) => (
      '<details class="faq-item"' + (item.open ? ' open' : '') + '>' +
      '<summary>' + item.question + '</summary>' +
      '<div class="faq-answer">' + item.answer + '</div>' +
      '</details>'
    )).join('');

    return [
      '<section class="section help" id="' + section.id + '">',
      '<div class="container">',
      renderSectionHead(section),
      '<div class="faq">' + faqs + '</div>',
      '<div class="help-contact">',
      '<div class="help-contact-text"><div class="help-contact-title">' + section.contact.title + '</div><div class="help-contact-sub">' + section.contact.subtitle + '</div></div>',
      '<a href="' + section.contact.href + '" class="help-contact-cta">' + svg.mail + section.contact.label + '</a>',
      '</div>',
      '</div>',
      '</section>',
    ].join('');
  }

  function renderFinalCta() {
    const cta = CONTENT.finalCta;
    return '<section class="final-cta"><div class="container"><div class="final-cta-inner"><h2>' + cta.title + '</h2><p>' + cta.description + '</p><a href="' + cta.href + '" class="cta">' + cta.label + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></a></div></div></section>';
  }

  function renderFooter() {
    const columns = CONTENT.footer.columns.map((column) => (
      '<div><div class="footer-col-title">' + column.title + '</div><ul class="footer-col-links">' +
      column.links.map((link) => '<li><a href="' + link.href + '">' + link.label + '</a></li>').join('') +
      '</ul></div>'
    )).join('');

    return [
      '<footer class="site-footer">',
      '<div class="container">',
      '<div class="footer-grid">' + columns + '</div>',
      '<div class="footer-bottom">',
      '<div class="footer-brand-mini">' + svg.logo('footer-brand-mark') + '<span>' + CONTENT.brand.name + '</span></div>',
      '<div>' + CONTENT.brand.copyright + '</div>',
      '</div>',
      '</div>',
      '</footer>',
    ].join('');
  }

  function renderApp() {
    renderInto('navbar', renderNavbar());
    renderInto('hero', renderHero());
    renderInto('features', renderFeatures());
    renderInto('stats', renderStats());
    renderInto('testimonials', renderTestimonials());
    renderInto('pricing', renderPricing());
    renderInto('help', renderHelp());
    renderInto('final-cta', renderFinalCta());
    renderInto('footer', renderFooter());
  }

  function setInvalid(input, invalid) {
    if (!input) return;
    if (invalid) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function setInputState(input, state) {
    if (!input) return;
    input.classList.toggle('is-error', state === 'error');
    setInvalid(input, state === 'error');
  }

  async function apiPost(endpointKey, body) {
    const base = CONFIG.API_BASE_URL;
    if (!base || base === '#') return { ok: true, stub: true };

    const response = await fetch(base + CONFIG.endpoints[endpointKey], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    let data = {};
    try { data = await response.json(); } catch (_) {}
    return { ok: response.ok, status: response.status, ...data };
  }

  const AuthSession = {
    state: { status: 'anonymous', provider: null, user: null },
    set(nextState) {
      this.state = { ...this.state, ...nextState };
      document.dispatchEvent(new CustomEvent('auth:state', { detail: this.state }));
    },
    get() {
      return { ...this.state };
    },
  };

  window.AuthSession = window.AuthSession || AuthSession;

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      button.dataset.idleLabel = button.textContent;
      button.disabled = true;
      button.textContent = label;
      return;
    }
    button.disabled = false;
    if (button.dataset.idleLabel) button.textContent = button.dataset.idleLabel;
    delete button.dataset.idleLabel;
  }

  function buildProviderButtons() {
    return AUTH_PROVIDERS.map((provider) => (
      '<button class="auth-option-button" type="button" data-auth-provider="' + provider.id + '">' +
      provider.icon +
      '<span>' + provider.label + '</span>' +
      '</button>'
    )).join('');
  }

  function buildAuthForm(name, submitLabel, fields, hidden = false) {
    const fieldMarkup = fields.map(([fieldName, label, type, autocomplete]) => (
      '<label class="auth-field">' +
      '<span>' + label + '</span>' +
      '<input class="input" type="' + type + '" name="' + fieldName + '" autocomplete="' + autocomplete + '"' +
      (type === 'email' ? ' inputmode="email" dir="ltr"' : '') +
      (type === 'password' ? ' minlength="8"' : '') +
      ' required>' +
      '</label>'
    )).join('');

    return (
      '<form class="auth-form' + (hidden ? '' : ' is-active') + '" data-auth-panel="' + name + '"' + (hidden ? ' hidden' : '') + ' novalidate>' +
      fieldMarkup +
      '<div class="auth-modal__error" data-auth-error="' + name + '" hidden></div>' +
      '<button class="btn btn-primary auth-submit" type="submit">' + submitLabel + '</button>' +
      '</form>'
    );
  }

  function buildAuthModalMarkup() {
    return (
      '<div class="auth-modal__panel" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">' +
      '<div class="auth-modal__head">' +
      '<h2 id="authModalTitle">دخول</h2>' +
      '<button class="auth-modal__close" type="button" data-auth-close aria-label="إغلاق">×</button>' +
      '</div>' +
      '<div class="auth-modal__providers">' + buildProviderButtons() + '</div>' +
      '<div class="auth-divider" aria-hidden="true"><span></span></div>' +
      '<div class="auth-tabs" role="tablist" aria-label="خيارات الدخول">' +
      '<button class="auth-tab is-active" type="button" role="tab" aria-selected="true" data-auth-tab="login">تسجيل الدخول</button>' +
      '<button class="auth-tab" type="button" role="tab" aria-selected="false" data-auth-tab="register">إنشاء حساب</button>' +
      '</div>' +
      buildAuthForm('login', 'دخول', [
        ['email', 'البريد الإلكتروني', 'email', 'email'],
        ['password', 'كلمة المرور', 'password', 'current-password'],
      ]) +
      buildAuthForm('register', 'إنشاء حساب', [
        ['email', 'البريد الإلكتروني', 'email', 'email'],
        ['password', 'كلمة المرور', 'password', 'new-password'],
        ['password_confirm', 'تأكيد كلمة المرور', 'password', 'new-password'],
      ], true) +
      '</div>'
    );
  }

  function ensureAuthModal() {
    let modal = $('#authModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.id = 'authModal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = buildAuthModalMarkup();
    document.body.appendChild(modal);
    return modal;
  }

  function getFocusableElements(root) {
    return $$('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])', root)
      .filter((element) => element.offsetParent !== null);
  }

  function bindThemeToggle() {
    const button = $('#themeToggle');
    if (!button) return;
    button.addEventListener('click', () => {
      if (window.AppTheme) window.AppTheme.toggle();
    });
  }

  function bindNavigation() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const menu = $('#primaryNav');
    if (!nav || !toggle || !menu) return;

    const closeMenu = () => {
      nav.classList.remove('menu-open');
      document.body.classList.remove('menu-locked');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('menu-open');
      document.body.classList.toggle('menu-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia(CONSTANTS.desktopQuery).matches) closeMenu();
    });
  }

  function bindTrialForm() {
    const form = $('#emailForm');
    if (!form) return;

    const input = $('input[name="email"]', form);
    const button = $('button[type="submit"]', form);
    if (!input || !button) return;

    input.addEventListener('input', () => setInvalid(input, false));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = (input.value || '').trim().toLowerCase();

      if (!isEmail(email)) {
        setInvalid(input, true);
        input.focus();
        return;
      }

      setInvalid(input, false);
      setBusy(button, true, button.dataset.loadingLabel || 'جارٍ التحضير...');

      try {
        const endpointKey = form.dataset.endpointKey || 'trialSignup';
        const result = await apiPost(endpointKey, { email });
        if (!result.ok) throw new Error(result.error || 'trial failed');
        button.textContent = button.dataset.successLabel || 'تحقّق من بريدك';
      } catch (_) {
        setInvalid(input, true);
        input.focus();
        setBusy(button, false);
      }
    });
  }

  function bindAuthForm(modal, panelName, options) {
    const form = $('[data-auth-panel="' + panelName + '"]', modal);
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      options.clearError(panelName);

      const submit = $('button[type="submit"]', form);
      const validation = options.validate(form);

      if (validation.input) {
        options.showError(panelName, validation.message);
        setInputState(validation.input, 'error');
        validation.input.focus();
        return;
      }

      setBusy(submit, true, options.loadingLabel);

      try {
        const result = await apiPost(options.endpointKey, validation.body);
        if (!result.ok) throw new Error(result.error || options.endpointKey + ' failed');
        window.AuthSession.set({ status: 'authenticated', provider: options.provider, user: result.user || null });
        options.close();
      } catch (_) {
        window.AuthSession.set({ status: 'anonymous', provider: null });
        setBusy(submit, false);
        options.showError(panelName, options.fallbackError);
      }
    });
  }

  function bindAuthModal() {
    const modal = ensureAuthModal();
    const panel = $('.auth-modal__panel', modal);
    const closeButton = $('[data-auth-close]', modal);
    const tabs = $$('[data-auth-tab]', modal);
    const forms = $$('[data-auth-panel]', modal);
    let lastFocused = null;
    let closeTimer = null;

    const errorSlot = (panelName) => $('[data-auth-error="' + panelName + '"]', modal);
    const clearError = (panelName) => {
      const slot = errorSlot(panelName);
      if (!slot) return;
      slot.textContent = '';
      slot.hidden = true;
    };
    const showError = (panelName, message) => {
      const slot = errorSlot(panelName);
      if (!slot) return;
      slot.textContent = message;
      slot.hidden = false;
    };

    const switchTab = (target) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.authTab === target;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      forms.forEach((form) => {
        const active = form.dataset.authPanel === target;
        form.hidden = !active;
        form.classList.toggle('is-active', active);
      });
      const firstInput = $('[data-auth-panel="' + target + '"] input', modal);
      if (firstInput) window.setTimeout(() => firstInput.focus(), 0);
    };

    const close = () => {
      window.clearTimeout(closeTimer);
      modal.classList.remove('is-open');
      document.body.classList.remove('auth-modal-open');
      closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        $$('.auth-modal__error', modal).forEach((slot) => {
          slot.textContent = '';
          slot.hidden = true;
        });
        $$('.input', modal).forEach((input) => setInputState(input, null));
        switchTab('login');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      }, CONSTANTS.modalCloseDelay);
    };

    const open = () => {
      window.clearTimeout(closeTimer);
      lastFocused = document.activeElement;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('auth-modal-open');
      window.requestAnimationFrame(() => modal.classList.add('is-open'));
      window.setTimeout(() => {
        const firstChoice = $('[data-auth-provider]', modal);
        if (firstChoice) firstChoice.focus();
        else if (closeButton) closeButton.focus();
      }, 0);
    };

    $$('[data-auth-open]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        open();
      });
    });

    if (closeButton) closeButton.addEventListener('click', close);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.authTab));
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal || !panel.contains(event.target)) close();
    });

    document.addEventListener('keydown', (event) => {
      if (modal.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(modal);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    $$('[data-auth-provider]', modal).forEach((button) => {
      button.addEventListener('click', async () => {
        const provider = AUTH_PROVIDERS.find((item) => item.id === button.dataset.authProvider);
        if (!provider) return;

        window.AuthSession.set({ status: 'pending', provider: provider.id });
        const label = $('span', button);
        if (label) {
          label.dataset.idleLabel = label.textContent;
          label.textContent = 'جارٍ الاتصال...';
        }
        button.disabled = true;

        try {
          const result = await apiPost(provider.endpointKey, { provider: provider.id });
          if (result.redirectUrl) {
            window.location.assign(result.redirectUrl);
            return;
          }
          window.AuthSession.set({ status: 'authenticated', provider: provider.id, user: result.user || null });
          close();
        } catch (_) {
          window.AuthSession.set({ status: 'anonymous', provider: null });
          button.disabled = false;
          if (label && label.dataset.idleLabel) {
            label.textContent = label.dataset.idleLabel;
            delete label.dataset.idleLabel;
          }
        }
      });
    });

    bindAuthForm(modal, 'login', {
      loadingLabel: 'جارٍ الدخول...',
      validate(form) {
        const emailInput = $('input[name="email"]', form);
        const passwordInput = $('input[name="password"]', form);
        const email = (emailInput.value || '').trim().toLowerCase();
        const password = passwordInput.value || '';
        [emailInput, passwordInput].forEach((input) => setInputState(input, null));

        if (!isEmail(email)) return { input: emailInput, message: 'أدخل بريدًا إلكترونيًا صحيحًا.' };
        if (password.length < 8) return { input: passwordInput, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' };
        return { body: { email, password } };
      },
      endpointKey: 'login',
      provider: 'email',
      fallbackError: 'تعذّر الدخول. تحقق من البيانات وحاول مرة أخرى.',
      showError,
      clearError,
      close,
    });

    bindAuthForm(modal, 'register', {
      loadingLabel: 'جارٍ الإنشاء...',
      validate(form) {
        const emailInput = $('input[name="email"]', form);
        const passwordInput = $('input[name="password"]', form);
        const confirmInput = $('input[name="password_confirm"]', form);
        const email = (emailInput.value || '').trim().toLowerCase();
        const password = passwordInput.value || '';
        const confirm = confirmInput.value || '';
        [emailInput, passwordInput, confirmInput].forEach((input) => setInputState(input, null));

        if (!isEmail(email)) return { input: emailInput, message: 'أدخل بريدًا إلكترونيًا صحيحًا.' };
        if (password.length < 8) return { input: passwordInput, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' };
        if (password !== confirm) return { input: confirmInput, message: 'كلمتا المرور غير متطابقتين.' };
        return { body: { email, password } };
      },
      endpointKey: 'register',
      provider: 'email',
      fallbackError: 'تعذّر إنشاء الحساب. حاول مرة أخرى.',
      showError,
      clearError,
      close,
    });
  }

  function bindSectionNav() {
    const links = $$('[data-section-link]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map();
    const sections = links.map((link) => {
      const id = link.getAttribute('href').split('#')[1];
      const section = id ? document.getElementById(id) : null;
      if (id && section) linkById.set(id, link);
      return section;
    }).filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link === linkById.get(id);
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });

    sections.forEach((section) => observer.observe(section));
  }

  function bindRevealAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    $$(CONSTANTS.revealSelector).forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  }

  function bindShowcase() {
    const messageEl = $('#showcaseMessage');
    const stepEl = $('#showcaseStep');
    const dotsEl = $('#showcaseDots');
    if (!messageEl) return;

    const messages = (window.SHOWCASE_MESSAGES || CONTENT.hero.preview.messages || []).slice();
    if (!messages.length) return;

    const card = $('.preview-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dotsEl) {
      dotsEl.innerHTML = '';
      messages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'showcase-dot' + (index === 0 ? ' is-active' : '');
        dotsEl.appendChild(dot);
      });
    }

    const dots = dotsEl ? Array.from(dotsEl.children) : [];
    let index = 0;
    let paused = false;

    const render = () => {
      messageEl.textContent = messages[index];
      if (stepEl) stepEl.textContent = toArabicNumeral(index + 1) + ' / ' + toArabicNumeral(messages.length);
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
    };

    const advance = () => {
      if (paused) return;
      messageEl.classList.add('is-fading');
      window.setTimeout(() => {
        index = (index + 1) % messages.length;
        render();
        messageEl.classList.remove('is-fading');
      }, CONSTANTS.showcaseFadeDelay);
    };

    if (card) {
      card.addEventListener('mouseenter', () => { paused = true; });
      card.addEventListener('mouseleave', () => { paused = false; });
      card.addEventListener('focusin', () => { paused = true; });
      card.addEventListener('focusout', () => { paused = false; });
    }

    render();
    if (!reduceMotion) window.setInterval(advance, CONSTANTS.showcaseInterval);
  }

  function init() {
    renderApp();
    bindThemeToggle();
    bindNavigation();
    bindTrialForm();
    bindAuthModal();
    bindSectionNav();
    bindRevealAnimations();
    bindShowcase();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
