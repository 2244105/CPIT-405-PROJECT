// WeatherCard - displays fetched weather info, translated
import { evaluateKashtaSafety } from '../services/weatherApi';
import { useLanguage } from '../context/LanguageContext';

export default function WeatherCard({ weather }) {
  const { t } = useLanguage();
  if (!weather) return null;

  const safety = evaluateKashtaSafety(weather);
  const safetyMessage =
    safety.level === 'good'
      ? t('dashboard.safetyGood')
      : safety.level === 'caution'
      ? t('dashboard.safetyCaution')
      : t('dashboard.safetyDanger');

  return (
    <article className={`weather-card weather-${safety.level}`} aria-live="polite">
      <header className="weather-card-header">
        <div>
          <h2 className="weather-location">
            {weather.city}
            {weather.country && <span className="weather-country">, {weather.country}</span>}
          </h2>
          <p className="weather-desc">{weather.description}</p>
        </div>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="weather-icon"
            width="80"
            height="80"
          />
        )}
      </header>

      <div className="weather-temp">
        <span className="weather-temp-value">{weather.temperature}</span>
        <span className="weather-temp-unit">°C</span>
      </div>
      <p className="weather-feels">{t('dashboard.feelsLike')} {weather.feelsLike}°C</p>

      <dl className="weather-stats">
        <div className="weather-stat">
          <dt>{t('dashboard.wind')}</dt>
          <dd>{weather.windSpeed} km/h</dd>
        </div>
        <div className="weather-stat">
          <dt>{t('dashboard.humidity')}</dt>
          <dd>{weather.humidity}%</dd>
        </div>
        <div className="weather-stat">
          <dt>{t('dashboard.visibility')}</dt>
          <dd>{weather.visibility} km</dd>
        </div>
        <div className="weather-stat">
          <dt>{t('dashboard.status')}</dt>
          <dd>{weather.condition}</dd>
        </div>
      </dl>

      <div className={`safety-banner safety-${safety.level}`} role="status">
        <span className="safety-icon" aria-hidden="true">
          {safety.level === 'good' && '✅'}
          {safety.level === 'caution' && '⚠️'}
          {safety.level === 'danger' && '🚫'}
        </span>
        <span>{safetyMessage}</span>
      </div>

      <p className="weather-timestamp">{t('dashboard.updated')} {weather.timestamp}</p>
    </article>
  );
}
