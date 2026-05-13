// LanguageContext - manages current UI language (en/ar) and RTL direction
// Provides a t() helper for translations
import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kashta-lang') || 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Apply lang + dir on <html> so CSS and screen readers know
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('kashta-lang', lang);
  }, [lang, dir]);

  const toggleLang = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'));

  // Translation helper - supports nested keys like 'auth.loginTitle'
  function t(path, vars) {
    const keys = path.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return path; // fallback: show the key itself
      }
    }
    if (typeof value === 'string' && vars) {
      // Replace {var} placeholders
      return Object.entries(vars).reduce(
        (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), val),
        value
      );
    }
    return value;
  }

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
