// Navbar - top nav with brand, links, theme + language toggles, auth controls
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <header className="navbar" role="banner">
      <Link to="/" className="brand" aria-label={t('common.appName')}>
        <span className="brand-icon" aria-hidden="true">🏕️</span>
        <span className="brand-text">
          {lang === 'ar' ? (
            <>كشتة<span className="brand-accent">تراكر</span></>
          ) : (
            <>Kashta<span className="brand-accent">Tracker</span></>
          )}
        </span>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          {t('nav.home')}
        </NavLink>
        {currentUser && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('nav.weather')}
            </NavLink>
            <NavLink to="/checklist" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('nav.checklist')}
            </NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        {/* Language toggle */}
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLang}
          aria-label={t('nav.switchLang')}
          title={t('nav.switchLang')}
        >
          {t('nav.switchLang')}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'night' ? t('nav.switchToDay') : t('nav.switchToNight')}
          title={theme === 'night' ? t('nav.switchToDay') : t('nav.switchToNight')}
        >
          {theme === 'night' ? '☀️' : '🌙'}
        </button>

        {currentUser ? (
          <>
            <span className="user-greet" aria-label="Current user">
              {currentUser.displayName || currentUser.email.split('@')[0]}
            </span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">{t('nav.login')}</Link>
            <Link to="/register" className="btn btn-primary">{t('nav.register')}</Link>
          </>
        )}
      </div>
    </header>
  );
}
