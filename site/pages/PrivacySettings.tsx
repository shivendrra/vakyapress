import React, { useEffect, useState } from 'react';
import { CookiePreferences } from '../types';
import { getCookiePreferences, saveCookiePreferences, DEFAULT_PREFERENCES } from '../utils/cookieManager';

const PrivacySettings: React.FC = () => {
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Privacy Settings | Vakya";
    const stored = getCookiePreferences();
    if (stored) {
      setPrefs(stored);
    }
  }, []);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    saveCookiePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-vakya-paper py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
        <h1 className="font-serif text-5xl mb-6">Privacy Settings</h1>
        <p className="font-sans text-lg text-gray-600 mb-12 leading-relaxed">
          At Vakya, we believe in transparency. You have full control over the data we collect.
          Manage your cookie preferences below. Changes will take effect immediately.
        </p>

        <div className="space-y-8">

          {/* Essential */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-8">
            <div>
              <h3 className="font-serif text-2xl mb-2 flex items-center gap-2">
                Essential Cookies
                <span className="bg-gray-100 text-gray-600 text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded">Required</span>
              </h3>
              <p className="font-sans text-sm text-gray-500 max-w-lg">
                These cookies are necessary for the website to function (e.g., logging in, saving your preferences, security). They cannot be switched off.
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in opacity-50 cursor-not-allowed">
              <input type="checkbox" checked={true} readOnly className="absolute block w-6 h-6 rounded-full bg-vakya-black border-4 border-white appearance-none cursor-not-allowed right-0" />
              <label className="block overflow-hidden h-6 rounded-full bg-vakya-black cursor-not-allowed"></label>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-8">
            <div>
              <h3 className="font-serif text-2xl mb-2">Analytics & Performance</h3>
              <p className="font-sans text-sm text-gray-500 max-w-lg">
                These help us understand how readers use Vakya. We use this data to improve our storytelling and website performance. Data is aggregated and anonymous.
              </p>
            </div>
            {/* Custom Toggle Switch */}
            <div
              onClick={() => handleToggle('analytics')}
              className={`relative inline-block w-12 h-6 transition duration-200 ease-in cursor-pointer ${prefs.analytics ? 'opacity-100' : 'opacity-50 grayscale'}`}
            >
              <div className={`absolute block w-6 h-6 rounded-full bg-white border border-gray-300 shadow-sm transition-transform duration-200 ${prefs.analytics ? 'translate-x-6 bg-vakya-black border-vakya-black' : 'translate-x-0'}`}></div>
              <div className={`block overflow-hidden h-6 rounded-full transition-colors duration-200 ${prefs.analytics ? 'bg-vakya-black' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          {/* Marketing */}
          <div className="flex items-start justify-between pb-8">
            <div>
              <h3 className="font-serif text-2xl mb-2">Marketing & Social</h3>
              <p className="font-sans text-sm text-gray-500 max-w-lg">
                These cookies allow us to measure the effectiveness of our outreach campaigns and support our store functionality.
              </p>
            </div>
            <div
              onClick={() => handleToggle('marketing')}
              className={`relative inline-block w-12 h-6 transition duration-200 ease-in cursor-pointer ${prefs.marketing ? 'opacity-100' : 'opacity-50 grayscale'}`}
            >
              <div className={`absolute block w-6 h-6 rounded-full bg-white border border-gray-300 shadow-sm transition-transform duration-200 ${prefs.marketing ? 'translate-x-6 bg-vakya-black border-vakya-black' : 'translate-x-0'}`}></div>
              <div className={`block overflow-hidden h-6 rounded-full transition-colors duration-200 ${prefs.marketing ? 'bg-vakya-black' : 'bg-gray-300'}`}></div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-black flex items-center justify-between">
          <span className="text-sm font-sans text-gray-400">
            {prefs.timestamp ? `Last updated: ${new Date(prefs.timestamp).toLocaleDateString()}` : 'Preferences not set'}
          </span>
          <div className="flex items-center gap-4">
            {saved && <span className="text-green-600 font-bold text-sm uppercase tracking-widest animate-fade-in">Saved!</span>}
            <button
              onClick={handleSave}
              className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacySettings;