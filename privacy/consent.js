(() => {
  'use strict';
  if (window.SeskaPrivacy) return;
  const config = window.SeskaPrivacyConfig || {};
  const key = 'seska.privacy.v1';
  const version = 1;
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const gpc = () => navigator.globalPrivacyControl === true;
  const ga = config.enabled === true && /^G-[A-Z0-9]+$/.test(config.ga4Id || '') ? config.ga4Id : '';
  const clarityId = config.enabled === true && /^[a-z0-9]+$/.test(config.clarityId || '') ? config.clarityId : '';
  let loaded = false;
  let timer;
  let trigger;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value?.version === version && Number.isFinite(value.at) && value.at <= Date.now()
        && Date.now() - value.at < lifetime && typeof value.analytics === 'boolean'
        && typeof value.recordings === 'boolean') return value;
    } catch { /* Missing or unavailable storage is never consent. */ }
    return null;
  }
  let choice = read();
  function state() {
    return { analytics: !gpc() && choice?.analytics === true,
      recordings: !gpc() && choice?.recordings === true };
  }
  function clearCookies() {
    const domains = location.hostname.split('.');
    const paths = location.pathname.split('/');
    const cookiePaths = new Set(['/']);
    while (paths.length) { cookiePaths.add(paths.join('/') || '/'); paths.pop(); }
    for (const pair of document.cookie.split(';')) {
      const name = pair.trim().split('=')[0];
      if (!/^(_ga($|_)|_gid$|_gat($|_)|_clck$|_clsk$)/.test(name)) continue;
      for (const path of cookiePaths) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
        for (let i = 0; i < domains.length - 1; i++) {
          document.cookie = `${name}=; Max-Age=0; Path=${path}; Domain=${domains.slice(i).join('.')}; SameSite=Lax`;
        }
      }
    }
  }
  function script(src) {
    const element = document.createElement('script');
    element.async = true;
    element.src = src;
    document.head.append(element);
  }
  const denied = { analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied' };
  function start() {
    const current = state();
    if (ga && current.analytics && !window.SeskaPrivacyGaLoaded) {
      window.SeskaPrivacyGaLoaded = true;
      window[`ga-disable-${ga}`] = false;
      loaded = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', denied);
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', ga, { send_page_view: false, ...pageContext(), allow_google_signals: false,
        allow_ad_personalization_signals: false, cookie_expires: 15552000, cookie_update: false });
      script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`);
      pageView();
    }
    if (clarityId && current.recordings && !window.SeskaPrivacyClarityLoaded) {
      loaded = true;
      window.SeskaPrivacyClarityLoaded = true;
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
      script(`https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`);
    }
    clearTimeout(timer);
    if (choice) timer = setTimeout(expire, Math.min(2147483647, Math.max(0, choice.at + lifetime - Date.now())));
  }
  // Call after client-side route changes. Only known public paths are measured;
  // queries, fragments, titles, referrers, form contents and dynamic IDs are excluded.
  function pageContext() {
    const publicPaths = ['/', '/index.html', '/about.html', '/privacy.html', '/services.html', '/ordering-guide.html', '/answers.html'];
    const path = publicPaths.includes(location.pathname) ? location.pathname : '/other';
    return { page_location: location.origin + path, page_title: path, page_referrer: '' };
  }
  function pageView() {
    if (!state().analytics || !window.SeskaPrivacyGaLoaded) return;
    window.gtag('event', 'page_view', pageContext());
  }
  function stop() {
    if (ga) window[`ga-disable-${ga}`] = true;
    if (window.gtag) window.gtag('consent', 'update', denied);
    if (window.clarity) window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
    clearCookies();
  }
  function expire() {
    const latest = read();
    if (latest) { choice = latest; start(); return; }
    choice = null;
    stop();
    if (loaded) location.reload();
    else render();
  }
  function save(analytics, recordings) {
    const previous = state();
    choice = { version, at: Date.now(), analytics: Boolean(ga && analytics && !gpc()),
      recordings: Boolean(clarityId && recordings && !gpc()) };
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch { /* Use memory for this page only. */ }
    dialog.close();
    render();
    controls.querySelector('[data-settings]').focus({ preventScroll: true });
    if ((previous.analytics && !choice.analytics) || (previous.recordings && !choice.recordings)) {
      stop();
      if (loaded) { location.reload(); return; }
    }
    start();
    document.dispatchEvent(new CustomEvent('seska:consent', { detail: state() }));
  }
  const panel = document.createElement('section');
  panel.id = 'seska-cookie-banner';
  panel.setAttribute('aria-label', 'Cookie choices');
  panel.innerHTML = `<h2>Your privacy choices</h2><p>With your permission, Google Analytics measures visits and Microsoft Clarity records interactions to help improve this website. Optional services stay off until you choose. Rejecting will not affect your access.</p><p data-gpc hidden>Global Privacy Control is on. Optional tracking is disabled.</p><a data-policy>Read our privacy policy</a><div class="seska-actions"><button type="button" data-reject>Reject optional</button><button type="button" data-accept>Accept optional</button><button type="button" data-settings>Choose cookies</button></div>`;
  const dialog = document.createElement('dialog');
  dialog.id = 'seska-cookie-dialog';
  dialog.setAttribute('aria-labelledby', 'seska-cookie-title');
  dialog.innerHTML = `<h2 id="seska-cookie-title">Cookie preferences</h2><p>Essential storage remembers your choice for 180 days. You can withdraw consent at any time using Privacy settings.</p><label><input type="checkbox" checked disabled> Essential preference storage (always on)</label><label><input type="checkbox" name="analytics"> Google Analytics — visit measurement</label><label><input type="checkbox" name="recordings"> Microsoft Clarity — interaction recordings and heatmaps</label><p data-unavailable></p><p data-gpc hidden>Global Privacy Control is on. Optional tracking is disabled.</p><a data-policy>Read our privacy policy</a><div class="seska-actions"><button type="button" data-reject>Reject optional</button><button type="button" data-save>Save preferences</button><button type="button" data-close>Close</button></div>`;
  const controls = document.createElement('div');
  controls.id = 'seska-privacy-controls';
  controls.innerHTML = '<button type="button" data-settings>Privacy settings</button><button type="button" data-optout>Do Not Sell or Share My Personal Information</button>';
  function open(event) {
    trigger = event?.currentTarget || document.activeElement;
    render();
    dialog.showModal();
    dialog.querySelector('[data-reject]').focus();
  }
  function render() {
    panel.hidden = Boolean(choice);
    const current = state();
    dialog.querySelector('[name="analytics"]').checked = current.analytics;
    dialog.querySelector('[name="recordings"]').checked = current.recordings;
    dialog.querySelector('[name="analytics"]').disabled = !ga || gpc();
    dialog.querySelector('[name="recordings"]').disabled = !clarityId || gpc();
    dialog.querySelector('[data-unavailable]').textContent = (!ga && !clarityId) ? 'Optional tracking services are not currently enabled.' : 'Unavailable services cannot be selected. Advertising tracking is not enabled by this integration.';
    panel.querySelector('p').textContent = !ga && !clarityId
      ? 'Optional tracking is not currently enabled. Essential storage remembers your privacy choice. You can review or change your choice at any time.'
      : 'With your permission, enabled services measure visits (Google Analytics) or record interactions (Microsoft Clarity) to improve this website. Choose cookies for separate controls. Rejecting will not affect your access.';
    panel.querySelector('[data-accept]').disabled = (!ga && !clarityId) || gpc();
    for (const root of [panel, dialog]) root.querySelector('[data-gpc]').hidden = !gpc();
  }
  for (const root of [panel, dialog, controls]) {
    root.querySelectorAll('[data-reject]').forEach(button => button.addEventListener('click', () => save(false, false)));
    root.querySelectorAll('[data-settings]').forEach(button => button.addEventListener('click', open));
    root.querySelectorAll('[data-policy]').forEach(link => {
      link.href = config.privacyUrl === 'privacy.html' ? config.privacyUrl : '/privacy';
    });
  }
  panel.querySelector('[data-accept]').addEventListener('click', () => save(true, true));
  dialog.querySelector('[data-save]').addEventListener('click', () => save(dialog.querySelector('[name="analytics"]').checked, dialog.querySelector('[name="recordings"]').checked));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  controls.querySelector('[data-optout]').addEventListener('click', () => save(false, false));
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    stop();
    // Reload tears down previously loaded SDKs, including pending asynchronous loads.
    location.reload();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { stop(); location.reload(); } });
  window.addEventListener('focus', () => {
    if (gpc() && loaded) { stop(); location.reload(); }
    else if (choice && !read()) expire();
  });
  window.SeskaPrivacy = Object.freeze({ open, reject: () => save(false, false), pageView, state });
  document.body.append(panel, dialog);
  (document.querySelector('footer') || document.body).append(controls);
  render();
  if (!choice || gpc()) clearCookies();
  start();
})();
