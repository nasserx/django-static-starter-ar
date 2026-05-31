/*
 * theme.js — must load synchronously in <head>, BEFORE any stylesheet link.
 * Sets data-theme on <html> from localStorage or the OS preference so the
 * first paint already shows the correct palette (no theme flash).
 *
 * Exposes window.AppTheme = { get, set, clear, toggle, source } for optional
 * backend or custom UI controls.
 */
(function () {
  var STORAGE_KEY = 'brand-theme';
  var THEME_REVEAL_MS = 820;

  var root = document.documentElement;
  var systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isAnimating = false;

  function readStoredTheme() {
    try {
      var theme = localStorage.getItem(STORAGE_KEY);
      return theme === 'dark' || theme === 'light' ? theme : null;
    } catch (_) {
      return null;
    }
  }

  function getSystemTheme() {
    return systemQuery.matches ? 'dark' : 'light';
  }

  function getTheme() {
    return readStoredTheme() || getSystemTheme();
  }

  function applyTheme(theme, source) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-source', source || (readStoredTheme() ? 'user' : 'system'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#09090B' : '#F4F4F5');
    var favicon = document.getElementById('themeFavicon');
    if (favicon) {
      favicon.setAttribute('href', theme === 'dark' ? favicon.dataset.darkHref : favicon.dataset.lightHref);
    }
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    applyTheme(theme, 'user');
  }

  function clearTheme() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    applyTheme(getSystemTheme(), 'system');
  }

  function getRevealOrigin(source) {
    if (source && typeof source.getBoundingClientRect === 'function') {
      var rect = source.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  function getRevealRadius(origin) {
    var corners = [
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ];

    return Math.ceil(corners.reduce(function (max, corner) {
      return Math.max(max, Math.hypot(corner[0] - origin.x, corner[1] - origin.y));
    }, 0));
  }

  function revealWithOverlay(theme, origin, radius) {
    var overlay = document.createElement('div');
    overlay.className = 'theme-reveal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.backgroundColor = theme === 'dark' ? '#09090B' : '#F4F4F5';
    overlay.style.clipPath = 'circle(0px at ' + origin.x + 'px ' + origin.y + 'px)';
    document.body.appendChild(overlay);

    var animation = overlay.animate(
      [
        { clipPath: 'circle(0px at ' + origin.x + 'px ' + origin.y + 'px)' },
        { clipPath: 'circle(' + radius + 'px at ' + origin.x + 'px ' + origin.y + 'px)' },
      ],
      { duration: THEME_REVEAL_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );

    animation.finished
      .catch(function () {})
      .then(function () {
        setTheme(theme);
        overlay.remove();
        isAnimating = false;
      });
  }

  function toggleTheme(source) {
    var nextTheme = getTheme() === 'dark' ? 'light' : 'dark';

    if (isAnimating) return;

    if (motionQuery.matches) {
      setTheme(nextTheme);
      return;
    }

    var origin = getRevealOrigin(source);
    var radius = getRevealRadius(origin);

    if (document.startViewTransition) {
      isAnimating = true;
      var transition = document.startViewTransition(function () {
        setTheme(nextTheme);
      });

      transition.ready
        .then(function () {
          root.animate(
            {
              clipPath: [
                'circle(0px at ' + origin.x + 'px ' + origin.y + 'px)',
                'circle(' + radius + 'px at ' + origin.x + 'px ' + origin.y + 'px)',
              ],
            },
            {
              duration: THEME_REVEAL_MS,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(function () {})
        .then(function () {
          return transition.finished;
        })
        .catch(function () {})
        .then(function () {
          isAnimating = false;
        });
      return;
    }

    isAnimating = true;
    revealWithOverlay(nextTheme, origin, radius);
  }

  applyTheme(getTheme(), readStoredTheme() ? 'user' : 'system');

  function handleSystemChange() {
    if (!readStoredTheme()) applyTheme(getSystemTheme(), 'system');
  }

  if (systemQuery.addEventListener) {
    systemQuery.addEventListener('change', handleSystemChange);
  } else if (systemQuery.addListener) {
    systemQuery.addListener(handleSystemChange);
  }

  window.AppTheme = {
    get: getTheme,
    set: setTheme,
    clear: clearTheme,
    toggle: toggleTheme,
    source: function () { return readStoredTheme() ? 'user' : 'system'; },
  };
})();
