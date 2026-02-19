import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
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
          <FiArrowLeft />
        </button>
        <div className="auth-header">
          <img src={logoImg} alt="Stelle Card" className="auth-logo" />
          <p className="auth-subtitle">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="password-field">
              <input type={showPwd ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <div className="password-field">
              <input type={showConfirmPwd ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer un compte'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
        </div>
    </div>
  );
};

export default Register;
