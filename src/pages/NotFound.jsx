// 404 - translated Not Found page
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon" aria-hidden="true">🏜️</div>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.msg')}</p>
        <Link to="/" className="btn btn-primary">{t('notFound.goHome')}</Link>
      </div>
    </main>
  );
}
