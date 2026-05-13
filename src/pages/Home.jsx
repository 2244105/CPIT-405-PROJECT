// Home - translated landing page
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  return (
    <main className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <span className="hero-eyebrow">{t('home.eyebrow')}</span>
          <h1 id="hero-title" className="hero-title">
            {t('home.titlePart1')} <span className="hero-accent">{t('home.titleAccent')}</span>{t('home.titlePart2')}
          </h1>
          <p className="hero-sub">{t('home.subtitle')}</p>
          <div className="hero-cta">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                {t('home.ctaDashboard')}
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  {t('home.ctaStart')}
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  {t('home.ctaHaveAccount')}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-sun"></div>
          <div className="hero-dune dune-1"></div>
          <div className="hero-dune dune-2"></div>
          <div className="hero-dune dune-3"></div>
          <div className="hero-tent">⛺</div>
        </div>
      </section>

      <section className="features" aria-labelledby="features-title">
        <h2 id="features-title" className="section-title">{t('home.featuresTitle')}</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true">🌤️</div>
            <h3>{t('home.f1Title')}</h3>
            <p>{t('home.f1Desc')}</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true">📋</div>
            <h3>{t('home.f2Title')}</h3>
            <p>{t('home.f2Desc')}</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true">💬</div>
            <h3>{t('home.f3Title')}</h3>
            <p>{t('home.f3Desc')}</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true">🌙</div>
            <h3>{t('home.f4Title')}</h3>
            <p>{t('home.f4Desc')}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
