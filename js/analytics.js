/* ==========================================================================
   Ancoravix — Google Analytics 4 com consentimento (LGPD / Consent Mode v2)

   1. Crie uma propriedade GA4 em https://analytics.google.com
   2. Cole o ID de métricas (formato G-XXXXXXXXXX) em GA_MEASUREMENT_ID abaixo.
   Enquanto o ID estiver vazio, nada é carregado e o aviso de cookies não aparece.
   ========================================================================== */
(() => {
  'use strict';

  const GA_MEASUREMENT_ID = ''; // ex.: 'G-ABC123XYZ9'
  const CONSENT_KEY = 'ancoravix-consent'; // 'granted' | 'denied'
  const PRIVACY_URL = 'politica-de-privacidade.html';

  const enabled = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);

  const readConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  };
  const saveConsent = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* navegação privada */ }
  };
  // Ao recusar, remove cookies do GA que possam ter sido gravados antes
  const clearGaCookies = () => {
    const domain = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').map((c) => c.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'))
      .forEach((name) => {
        [`domain=.${domain}`, `domain=${domain}`, ''].forEach((d) => {
          document.cookie = `${name}=; Max-Age=0; path=/; ${d}`;
        });
      });
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /** Envia um evento ao GA4 (sem efeito enquanto o GA não estiver configurado). */
  window.track = (name, params = {}) => {
    if (enabled) gtag('event', name, params);
  };

  if (!enabled) return;

  const stored = readConsent();

  // Consent Mode v2: tudo negado até o visitante aceitar.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: stored === 'granted' ? 'granted' : 'denied',
    wait_for_update: 500,
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID); // o GA4 já anonimiza IPs por padrão

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  // Aviso de cookies
  const showBanner = () => {
    document.querySelector('.consent')?.remove();
    const banner = document.createElement('div');
    banner.className = 'consent glass';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML = `
      <p>Usamos cookies de análise (Google Analytics) para entender como o site é usado e melhorar sua experiência.
      Nenhum dado é usado para publicidade. <a href="${PRIVACY_URL}">Política de privacidade</a></p>
      <div class="consent-actions">
        <button type="button" class="btn btn-glass btn-sm" data-consent="denied">Recusar</button>
        <button type="button" class="btn btn-primary btn-sm" data-consent="granted">Aceitar</button>
      </div>`;
    banner.addEventListener('click', (e) => {
      const choice = e.target.closest('[data-consent]')?.dataset.consent;
      if (!choice) return;
      saveConsent(choice);
      gtag('consent', 'update', { analytics_storage: choice });
      if (choice === 'denied') clearGaCookies();
      banner.classList.add('is-leaving');
      setTimeout(() => banner.remove(), 400);
    });
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  };

  const init = () => {
    // Links "Preferências de cookies" (ocultos enquanto o GA não estiver ativo)
    document.querySelectorAll('[data-consent-open]').forEach((el) => {
      el.hidden = false;
      el.addEventListener('click', (e) => { e.preventDefault(); showBanner(); });
    });
    if (!stored) showBanner();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
