import { CookiePreferences } from '../types';

const STORAGE_KEY = 'vakya_cookie_consent';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: '',
};

export const getCookiePreferences = (): CookiePreferences | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const saveCookiePreferences = (prefs: Omit<CookiePreferences, 'timestamp'>) => {
  const fullPrefs: CookiePreferences = {
    ...prefs,
    essential: true, // Force true
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));

  // Trigger an event so components can react (like the settings page)
  window.dispatchEvent(new Event('cookie-prefs-changed'));

  // Here is where you would initialize scripts based on preferences
  applyConsent(fullPrefs);
};

export const applyConsent = (prefs: CookiePreferences) => {
  if (prefs.analytics) {
    console.log("Analytics Cookies Enabled: Initializing Tracking...");
    // Initialize Google Analytics or PostHog here
    // e.g., window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
  } else {
    console.log("Analytics Cookies Disabled.");
    // e.g., window.gtag('consent', 'update', { 'analytics_storage': 'denied' });
  }

  if (prefs.marketing) {
    console.log("Marketing Cookies Enabled.");
    // Initialize Marketing pixels
  }
};

// Check on load
export const initializeCookies = () => {
  const prefs = getCookiePreferences();
  if (prefs) {
    applyConsent(prefs);
  }
};