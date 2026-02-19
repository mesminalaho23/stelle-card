import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiCamera } from 'react-icons/fi';
import './Profile.css';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState(null);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('language') || 'fr'
  );

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveInfo = () => {
    updateProfile({ name: editName, phone: editPhone });
    setActiveSection(null);
  };

  const handleChangeLang = (code) => {
    setCurrentLang(code);
    localStorage.setItem('language', code);
    i18n.changeLanguage(code);
    setActiveSection(null);
  };

  // Menu → section or action
  const menuItems = [
    { icon: 'ℹ️', label: 'Mes Informations', section: 'info' },
    { icon: '📍', label: 'Mes Réservations', route: '/my-rentals' },
    { icon: '🌐', label: 'Langue / Language', value: languages.find(l => l.code === currentLang)?.flag, section: 'language' },
    { icon: isDark ? '☀️' : '🌙', label: isDark ? 'Mode clair' : 'Mode sombre', action: toggleTheme },
    { icon: '⚙️', label: 'Paramètres', route: '/settings' },
    ...(isAdmin ? [{ icon: '🔧', label: 'Administration', route: '/admin' }] : []),
    { icon: '🚪', label: 'Déconnexion', action: handleLogout, danger: true }
  ];

  const handleMenuClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      item.action();
    } else if (item.section) {
      setActiveSection(activeSection === item.section ? null : item.section);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* User Info Card */}
        <div className="profile-card slide-up">
          <div className="profile-avatar">
            <div className="avatar-circle" onClick={() => document.getElementById('avatar-input').click()}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="avatar-initials">{getInitials()}</span>
              )}
              <div className="avatar-overlay">
                <FiCamera />
              </div>
            </div>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateProfile({ avatar: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name || 'Utilisateur'}</h2>
            <p className="profile-email">{user?.email || ''}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="profile-menu slide-up">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                className={`menu-item ${item.danger ? 'danger' : ''}`}
                onClick={() => handleMenuClick(item)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="menu-item-left">
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </div>
                <div className="menu-item-right">
                  {item.value && <span className="menu-value">{item.value}</span>}
                  <span className="menu-arrow">{item.section && activeSection === item.section ? '‹' : '›'}</span>
                </div>
              </button>

              {/* Inline: Mes Informations */}
              {item.section === 'info' && activeSection === 'info' && (
                <div className="profile-section slide-up">
                  <div className="form-group">
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <button className="btn-primary" onClick={handleSaveInfo}>
                    Enregistrer
                  </button>
                </div>
              )}

              {/* Inline: Language Picker */}
              {item.section === 'language' && activeSection === 'language' && (
                <div className="profile-section slide-up">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-option ${currentLang === lang.code ? 'lang-option--active' : ''}`}
                      onClick={() => handleChangeLang(lang.code)}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-label">{lang.label}</span>
                      {currentLang === lang.code && <span className="lang-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
