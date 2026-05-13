// Login - translated email/password sign in with validation
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
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
    if (!form.email.trim()) errs.email = t('auth.errEmailRequired');
    else if (!emailRegex.test(form.email)) errs.email = t('auth.errEmailInvalid');
    if (!form.password) errs.password = t('auth.errPasswordRequired');
    else if (form.password.length < 6) errs.password = t('auth.errPasswordShort');
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
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = err.code || '';
      if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
        setSubmitError(t('auth.errIncorrect'));
      } else if (code.includes('too-many-requests')) {
        setSubmitError(t('auth.errTooMany'));
      } else if (code.includes('network')) {
        setSubmitError(t('auth.errNetwork'));
      } else {
        setSubmitError(err.message || t('auth.errLoginGeneric'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title" className="auth-title">{t('auth.loginTitle')}</h1>
        <p className="auth-sub">{t('auth.loginSub')}</p>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
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
              aria-describedby={errors.email ? 'email-err' : undefined}
              required
              dir="ltr"
            />
            {errors.email && (
              <span id="email-err" className="field-error" role="alert">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'pw-err' : undefined}
              required
              dir="ltr"
            />
            {errors.password && (
              <span id="pw-err" className="field-error" role="alert">{errors.password}</span>
            )}
          </div>

          {submitError && (
            <div className="form-error" role="alert">{submitError}</div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.newUser')} <Link to="/register">{t('auth.createAccountLink')}</Link>
        </p>
      </section>
    </main>
  );
}
