import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuEye, LuEyeOff, LuArrowLeft } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/Logo Stelle Card.png';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setLoading(true);
    const success = await register(formData);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="register-page">
        <div className="auth-content slide-up">
        <button className="vd-back auth-back" onClick={() => navigate(-1)}>
          <LuArrowLeft />
        </button>
        <div className="auth-header">
          <img src={logoImg} alt="Stelle Card" className="auth-logo" />
          <p className="auth-subtitle">{t('register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('register.fullName')}</label>
            <input type="text" name="name" placeholder={t('register.fullNamePlaceholder')} value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.email')}</label>
            <input type="email" name="email" placeholder={t('register.emailPlaceholder')} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.password')}</label>
            <div className="password-field">
              <input type={showPwd ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.confirmPassword')}</label>
            <div className="password-field">
              <input type={showConfirmPwd ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                {showConfirmPwd ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>

        <p className="auth-footer">
          {t('register.hasAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
        </div>
    </div>
  );
};

export default Register;
