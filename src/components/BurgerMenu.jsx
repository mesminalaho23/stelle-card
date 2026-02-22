import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuX, LuHome, LuCar, LuList, LuUser, LuLogIn, LuUserPlus, LuLogOut } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './BurgerMenu.css';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

const BurgerMenu = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleLinkClick = () => {
    onClose();
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`burger-overlay ${isOpen ? 'burger-overlay--active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div className={`burger-panel ${isOpen ? 'burger-panel--active' : ''}`}>
        {/* Close Button */}
        <button className="burger-close" onClick={onClose} aria-label="Fermer le menu">
          <LuX />
        </button>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="burger-user">
            <div className="burger-avatar">{getInitials()}</div>
            <div className="burger-user-info">
              <span className="burger-user-name">{user.name || 'Utilisateur'}</span>
              <span className="burger-user-email">{user.email || ''}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="burger-nav">
          <Link to="/" className="burger-nav-link" onClick={handleLinkClick}>
            <LuHome className="burger-nav-icon" />
            <span>{t('nav.home')}</span>
          </Link>
          <Link to="/vehicles" className="burger-nav-link" onClick={handleLinkClick}>
            <LuCar className="burger-nav-icon" />
            <span>{t('nav.vehicles')}</span>
          </Link>
          {isAuthenticated && (
            <Link to="/my-rentals" className="burger-nav-link" onClick={handleLinkClick}>
              <LuList className="burger-nav-icon" />
              <span>{t('nav.myRentals')}</span>
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/profile" className="burger-nav-link" onClick={handleLinkClick}>
              <LuUser className="burger-nav-icon" />
              <span>{t('nav.profile')}</span>
            </Link>
          )}
        </nav>

        {/* Language Switcher */}
        <div className="burger-lang">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`burger-lang-btn ${i18n.language === lang.code ? 'burger-lang-btn--active' : ''}`}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                localStorage.setItem('language', lang.code);
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Auth Section */}
        <div className="burger-auth">
          {isAuthenticated ? (
            <button className="burger-auth-btn burger-auth-btn--logout" onClick={handleLogout}>
              <LuLogOut className="burger-nav-icon" />
              <span>{t('nav.logout')}</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="burger-auth-btn burger-auth-btn--login"
                onClick={handleLinkClick}
              >
                <LuLogIn className="burger-nav-icon" />
                <span>{t('nav.login')}</span>
              </Link>
              <Link
                to="/register"
                className="burger-auth-btn burger-auth-btn--register"
                onClick={handleLinkClick}
              >
                <LuUserPlus className="burger-nav-icon" />
                <span>{t('nav.register')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
