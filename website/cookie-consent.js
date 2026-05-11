(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var EXPIRY_DAYS = 365;
  var GA_ID = 'G-BR9THTHTR8';
  var PIXEL_ID = '962424326312201';

  // Track which trackers have already been loaded to avoid double-init on re-consent
  var loaded = { analytics: false, marketing: false };

  // Phone-click conversion tracking — fires to GA + Pixel if they're loaded.
  // Attached unconditionally because the listener no-ops when trackers aren't
  // available (i.e. before consent), so it's safe in all states.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    var phone = a.getAttribute('href').replace('tel:', '');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'phone_click', {
        event_category: 'contact',
        event_label: phone,
        value: 1
      });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact');
    }
  });

  function loadAnalytics() {
    if (loaded.analytics) return;
    loaded.analytics = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function loadMarketing() {
    if (loaded.marketing) return;
    loaded.marketing = true;
    // Meta Pixel — standard install snippet, gated by consent
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  var banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;

  var analyticsCheckbox = banner.querySelector('[data-cookie-category="analytics"]');
  var marketingCheckbox = banner.querySelector('[data-cookie-category="marketing"]');
  var acceptBtn = banner.querySelector('[data-cookie-accept]');
  var rejectBtn = banner.querySelector('[data-cookie-reject]');
  var saveBtn = banner.querySelector('[data-cookie-save]');

  function getConsent() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!data || !data.timestamp) return null;
      // Check expiry
      var now = Date.now();
      var expiry = data.timestamp + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (now > expiry) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(analytics, marketing) {
    var data = {
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage not available — fail silently
    }
    hideBanner();
    onConsentUpdate(data);
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  /**
   * Load analytics/marketing trackers based on consent state.
   * Called after consent is saved or on page load if consent exists.
   * NOTE: Once a tracker is loaded for the session, withdrawing consent
   * does NOT unload it (browser limitation). The cookie store is purged
   * on next page load — but full revocation requires a page reload.
   */
  function onConsentUpdate(consent) {
    if (consent.analytics) loadAnalytics();
    if (consent.marketing) loadMarketing();
  }

  // Button handlers
  acceptBtn.addEventListener('click', function () {
    saveConsent(true, true);
  });

  rejectBtn.addEventListener('click', function () {
    saveConsent(false, false);
  });

  saveBtn.addEventListener('click', function () {
    saveConsent(analyticsCheckbox.checked, marketingCheckbox.checked);
  });

  // Footer "Slapukų nustatymai" link re-opens banner
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-cookie-settings]');
    if (trigger) {
      e.preventDefault();
      // Restore checkboxes to current consent state
      var consent = getConsent();
      if (consent) {
        analyticsCheckbox.checked = consent.analytics;
        marketingCheckbox.checked = consent.marketing;
      } else {
        analyticsCheckbox.checked = false;
        marketingCheckbox.checked = false;
      }
      showBanner();
    }
  });

  // Init: show banner if no consent, otherwise fire hook
  var existing = getConsent();
  if (existing) {
    onConsentUpdate(existing);
  } else {
    showBanner();
  }
})();
