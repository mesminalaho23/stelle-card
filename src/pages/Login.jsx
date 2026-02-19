import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/Logo Stelle Card.png';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="login-page">
        <div className="auth-content slide-up">
        <button className="vd-back auth-back" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <div className="auth-header">
          <img src={logoImg} alt="Stelle Card" className="auth-logo" />
          <p className="auth-subtitle">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('login.email')}</label>
            <input type="email" placeholder={t('login.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login.password')}</label>
            <div className="password-field">
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
        </p>
        <p className="auth-footer">
          {t('login.noAccount')} <Link to="/register">{t('login.signUp')}</Link>
        </p>
        </div>
    </div>
  );
};

export default Login;
