import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logoImg from '../assets/Logo Stelle Card.png';
import toast from 'react-hot-toast';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Email de réinitialisation envoyé !');
  };

  return (
    <div className="login-page">
      <div className="auth-content slide-up">
        <button className="vd-back auth-back" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <div className="auth-header">
          <img src={logoImg} alt="Stelle Card" className="auth-logo" />
          <p className="auth-subtitle">Réinitialiser votre mot de passe</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary">Envoyer le lien</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '3rem' }}>✉️</span>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>Email envoyé !</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
            </p>
          </div>
        )}
        <p className="auth-footer">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
