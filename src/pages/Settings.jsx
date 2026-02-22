import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuBell, LuLock, LuTrash2, LuInfo, LuEye, LuEyeOff } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { changePassword } = useAuth();

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('settings_notifications') ?? 'true');
  });
  const [emailNotifs, setEmailNotifs] = useState(() => {
    return JSON.parse(localStorage.getItem('settings_emailNotifs') ?? 'true');
  });
  const [promoNotifs, setPromoNotifs] = useState(() => {
    return JSON.parse(localStorage.getItem('settings_promoNotifs') ?? 'false');
  });

  const toggleSetting = (key, value, setter) => {
    const newVal = !value;
    setter(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
    toast.success('Paramètre mis à jour');
  };

  const handleClearData = () => {
    if (window.confirm('Supprimer toutes les données locales ? (favoris, réservations, paramètres)')) {
      localStorage.removeItem('favorites');
      localStorage.removeItem('bookings');
      localStorage.removeItem('settings_notifications');
      localStorage.removeItem('settings_emailNotifs');
      localStorage.removeItem('settings_promoNotifs');
      toast.success('Données supprimées');
    }
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPwd.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    const success = changePassword(currentPwd, newPwd);
    if (success) {
      setShowPasswordForm(false);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }
  };

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </button>
          <h1 className="settings-title">Paramètres</h1>
        </div>

        {/* Notifications */}
        <div className="settings-section slide-up">
          <h3 className="settings-section-title"><LuBell /> Notifications</h3>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Notifications push</span>
              <span className="settings-item-desc">Recevoir des alertes sur votre appareil</span>
            </div>
            <button
              className={`settings-toggle ${notifications ? 'settings-toggle--on' : ''}`}
              onClick={() => toggleSetting('settings_notifications', notifications, setNotifications)}
            >
              <div className="settings-toggle-knob" />
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Notifications email</span>
              <span className="settings-item-desc">Confirmations et rappels par email</span>
            </div>
            <button
              className={`settings-toggle ${emailNotifs ? 'settings-toggle--on' : ''}`}
              onClick={() => toggleSetting('settings_emailNotifs', emailNotifs, setEmailNotifs)}
            >
              <div className="settings-toggle-knob" />
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Offres promotionnelles</span>
              <span className="settings-item-desc">Recevoir les bons plans et réductions</span>
            </div>
            <button
              className={`settings-toggle ${promoNotifs ? 'settings-toggle--on' : ''}`}
              onClick={() => toggleSetting('settings_promoNotifs', promoNotifs, setPromoNotifs)}
            >
              <div className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section slide-up">
          <h3 className="settings-section-title">{isDark ? '☀️' : '🌙'} Apparence</h3>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Mode sombre</span>
              <span className="settings-item-desc">Adapter l'interface à votre préférence</span>
            </div>
            <button
              className={`settings-toggle ${isDark ? 'settings-toggle--on' : ''}`}
              onClick={toggleTheme}
            >
              <div className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section slide-up">
          <h3 className="settings-section-title"><LuLock /> {t('settings.security')}</h3>
          
          <button className="settings-action-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <span>{t('settings.changePassword')}</span>
            <span className="menu-arrow">{showPasswordForm ? '‹' : '›'}</span>
          </button>

          {showPasswordForm && (
            <form className="password-form slide-up" onSubmit={handlePasswordSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Mot de passe actuel</label>
                <div className="password-field">
                  <input type={showCurrentPwd ? 'text' : 'password'} className="form-input" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required />
                  <button type="button" className="password-toggle" onClick={() => setShowCurrentPwd(!showCurrentPwd)}>
                    {showCurrentPwd ? <LuEyeOff /> : <LuEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <div className="password-field">
                  <input type={showNewPwd ? 'text' : 'password'} className="form-input" value={newPwd} onChange={e => setNewPwd(e.target.value)} required minLength={6} />
                  <button type="button" className="password-toggle" onClick={() => setShowNewPwd(!showNewPwd)}>
                    {showNewPwd ? <LuEyeOff /> : <LuEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le nouveau mot de passe</label>
                <div className="password-field">
                  <input type={showConfirmPwd ? 'text' : 'password'} className="form-input" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                    {showConfirmPwd ? <LuEyeOff /> : <LuEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </form>
          )}
        </div>

        {/* Data */}
        <div className="settings-section slide-up">
          <h3 className="settings-section-title"><LuTrash2 /> Données</h3>
          
          <button className="settings-action-btn settings-action-btn--danger" onClick={handleClearData}>
            <span>Supprimer les données locales</span>
            <span className="menu-arrow">›</span>
          </button>
        </div>

        {/* About */}
        <div className="settings-section slide-up">
          <h3 className="settings-section-title"><LuInfo /> À propos</h3>
          <div className="settings-about">
            <div className="settings-about-row">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="settings-about-row">
              <span>Développé par</span>
              <span>Stelle Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
