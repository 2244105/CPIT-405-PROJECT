// OpenWeatherMap API service with bilingual (en/ar) support
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch current weather for a location.
 * @param {string} location - City name in any language (e.g., "Jeddah" or "جدة")
 * @param {string} lang - 'en' or 'ar' — controls API language for descriptions
 * @returns {Promise<Object>} Normalized weather data
 */
export async function fetchWeather(location, lang = 'en') {
  if (!location || !location.trim()) {
    throw new Error('NO_LOCATION');
  }
  if (!API_KEY) {
    throw new Error('MISSING_KEY');
  }

  // OpenWeatherMap accepts 'ar' for Arabic responses (descriptions translated)
  // Search itself works with both Arabic and English city names
  const url = `${BASE_URL}?q=${encodeURIComponent(
    location.trim()
  )}&appid=${API_KEY}&units=metric&lang=${lang}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        const err = new Error('NOT_FOUND');
        err.locationName = location;
        throw err;
      }
      if (response.status === 401) {
        throw new Error('INVALID_KEY');
      }
      const err = new Error('SERVICE_ERROR');
      err.status = response.status;
      throw err;
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys?.country || '',
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s -> km/h
      visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A',
      description: data.weather[0]?.description || 'N/A',
      condition: data.weather[0]?.main || 'Unknown',
      icon: data.weather[0]?.icon || '',
      timestamp: new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'),
    };
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('NETWORK');
    }
    throw err;
  }
}

/**
 * Decide if conditions are safe for a kashta trip.
 * Returns a level for the UI (good/caution/danger) — message text
 * is resolved by the caller through translations.
 */
export function evaluateKashtaSafety(weather) {
  if (!weather) return { safe: false, level: 'unknown' };

  const { windSpeed, condition, temperature } = weather;
  const lower = (condition || '').toLowerCase();

  if (windSpeed > 40 || lower.includes('storm') || lower.includes('dust') || lower.includes('sand')) {
    return { safe: false, level: 'danger' };
  }
  if (windSpeed > 25 || lower.includes('rain') || temperature > 42 || temperature < 5) {
    return { safe: true, level: 'caution' };
  }
  return { safe: true, level: 'good' };
}
