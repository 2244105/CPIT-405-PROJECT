// Footer - translated site footer
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer" role="contentinfo">
      <p>{t('footer.builtWith', { year: new Date().getFullYear() })}</p>
      <p className="footer-credits">{t('footer.credits')}</p>
    </footer>
  );
}
