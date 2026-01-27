import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCookiePreferences, saveCookiePreferences } from '../utils/cookieManager';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if preferences exist. If not, show banner after a small delay.
    const prefs = getCookiePreferences();
    if (!prefs) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveCookiePreferences({ essential: true, analytics: true, marketing: true });
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    saveCookiePreferences({ essential: true, analytics: false, marketing: false });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-white border-t-2 border-vakya-black shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="max-w-3xl">
          <h3 className="font-serif text-2xl mb-2">We value your privacy.</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and support our independent journalism.
            You can choose to accept all cookies or manage them individually.
            Read our <Link to="/cookie-policy" className="underline font-bold hover:text-vakya-salmon">Cookie Policy</Link>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 min-w-max">
          <button
            onClick={handleRejectNonEssential}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-sans text-xs font-bold uppercase tracking-widest hover:border-black hover:text-black transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-6 py-3 bg-vakya-black text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;