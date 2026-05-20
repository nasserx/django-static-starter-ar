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

  var root = document.documentElement;
  var systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

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

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
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
