// Dashboard - bilingual weather lookup (supports searching in EN and AR)
import { useState } from 'react';
import { fetchWeather } from '../services/weatherApi';
import WeatherCard from '../components/WeatherCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Popular locations shown for each language
const POPULAR_LOCATIONS = {
  en: ['Jeddah', 'Usfan', 'Taif', 'Riyadh', 'Mecca', 'Tabuk'],
  ar: ['جدة', 'عسفان', 'الطائف', 'الرياض', 'مكة', 'تبوك'],
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Map error codes from the API service to translated messages
  function translateError(err) {
    switch (err.message) {
      case 'NO_LOCATION':
        return t('dashboard.enterLocation');
      case 'MISSING_KEY':
        return t('dashboard.errMissingKey');
      case 'NOT_FOUND':
        return t('dashboard.errLocationNotFound');
      case 'INVALID_KEY':
        return t('dashboard.errInvalidKey');
      case 'SERVICE_ERROR':
        return `${t('dashboard.errService')} (${err.status || ''})`;
      case 'NETWORK':
        return t('dashboard.errNetwork');
      default:
        return err.message || t('dashboard.errService');
    }
  }

  async function lookup(query) {
    setError('');
    if (!query.trim()) {
      setError(t('dashboard.enterLocation'));
      return;
    }
    try {
      setLoading(true);
      // Pass current UI language so API returns descriptions in that language
      const data = await fetchWeather(query, lang);
      setWeather(data);
    } catch (err) {
      setError(translateError(err));
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    lookup(location);
  }

  function handleQuickPick(city) {
    setLocation(city);
    lookup(city);
  }

  const firstName = currentUser?.displayName?.split(' ')[0];

  return (
    <main className="dashboard-page">
      <header className="page-header">
        <h1 className="page-title">
          {t('dashboard.title')}{firstName && `, ${firstName}`} 🌤️
        </h1>
        <p className="page-sub">{t('dashboard.sub')}</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="location" className="visually-hidden">{t('dashboard.placeholder')}</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('dashboard.placeholder')}
          className="search-input"
          aria-label={t('dashboard.placeholder')}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('dashboard.checking') : t('dashboard.check')}
        </button>
      </form>

      <div className="quick-picks" role="group" aria-label="Popular locations">
        <span className="quick-picks-label">{t('dashboard.quickPicks')}</span>
        {POPULAR_LOCATIONS[lang].map((city) => (
          <button
            key={city}
            type="button"
            className="quick-pick"
            onClick={() => handleQuickPick(city)}
            disabled={loading}
          >
            {city}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-banner" role="alert">⚠️ {error}</div>
      )}

      {loading && !weather && (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>{t('dashboard.fetching')}</p>
        </div>
      )}

      {weather && <WeatherCard weather={weather} />}

      {!weather && !loading && !error && (
        <div className="empty-state" aria-hidden="true">
          <div className="empty-icon">🏜️</div>
          <p>{t('dashboard.emptyHint')}</p>
        </div>
      )}
    </main>
  );
}
