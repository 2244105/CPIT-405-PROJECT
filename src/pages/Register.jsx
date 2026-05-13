// Register - translated account creation with full validation
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: '' }));
  }

  function validate() {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name.trim()) errs.name = t('auth.errNameRequired');
    else if (form.name.trim().length < 2) errs.name = t('auth.errNameShort');
    if (!form.email.trim()) errs.email = t('auth.errEmailRequired');
    else if (!emailRegex.test(form.email)) errs.email = t('auth.errEmailInvalid');
    if (!form.password) errs.password = t('auth.errPasswordRequired');
    else if (form.password.length < 6) errs.password = t('auth.errPasswordShort');
    if (!form.confirm) errs.confirm = t('auth.errConfirmRequired');
    else if (form.confirm !== form.password) errs.confirm = t('auth.errConfirmMismatch');
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      await register(form.email, form.password, form.name.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const code = err.code || '';
      if (code.includes('email-already-in-use')) {
        setSubmitError(t('auth.errEmailInUse'));
      } else if (code.includes('weak-password')) {
        setSubmitError(t('auth.errWeakPassword'));
      } else if (code.includes('invalid-email')) {
        setSubmitError(t('auth.errInvalidEmail'));
      } else {
        setSubmitError(err.message || t('auth.errRegisterGeneric'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="reg-title">
        <h1 id="reg-title" className="auth-title">{t('auth.registerTitle')}</h1>
        <p className="auth-sub">{t('auth.registerSub')}</p>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="name">{t('auth.name')}</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('auth.namePlaceholder')}
              aria-invalid={!!errors.name}
              required
            />
            {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              aria-invalid={!!errors.email}
              required
              dir="ltr"
            />
            {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              aria-invalid={!!errors.password}
              required
              dir="ltr"
            />
            {errors.password && <span className="field-error" role="alert">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm">{t('auth.confirmPassword')}</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              aria-invalid={!!errors.confirm}
              required
              dir="ltr"
            />
            {errors.confirm && <span className="field-error" role="alert">{errors.confirm}</span>}
          </div>

          {submitError && (
            <div className="form-error" role="alert">{submitError}</div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
        </p>
      </section>
    </main>
  );
}
