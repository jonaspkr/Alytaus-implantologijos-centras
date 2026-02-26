(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var EXPIRY_DAYS = 365;

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
   * Hook for future analytics/marketing scripts.
   * Called after consent is saved or on page load if consent exists.
   */
  function onConsentUpdate(consent) {
    // Example usage:
    // if (consent.analytics) { /* init analytics */ }
    // if (consent.marketing) { /* init marketing pixels */ }
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
