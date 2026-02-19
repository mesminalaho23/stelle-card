import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiColumns } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import BurgerMenu from './BurgerMenu';
import ThemeToggle from './ThemeToggle';
import Notifications from './Notifications';
import LanguageSwitcher from './LanguageSwitcher';
import logoImg from '../assets/Logo Stelle Card.png';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <img src={logoImg} alt="Stelle Card" className="logo-img" />
              <span className="logo-text">STELLE CARD</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links desktop-only">
              <Link to="/" className="nav-link">{t('nav.home')}</Link>
              <Link to="/vehicles" className="nav-link">{t('nav.vehicles')}</Link>
              {isAuthenticated && (
                <Link to="/my-rentals" className="nav-link">{t('nav.myRentals')}</Link>
              )}
              <Link to="/favorites" className="nav-link">{t('nav.favorites')}</Link>
              <Link to="/compare" className="nav-link">{t('nav.compare')}</Link>
            </div>

            {/* Right Section */}
            <div className="navbar-actions">
              <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageSwitcher />
                <Notifications />
                <ThemeToggle />
              </div>
              {/* Auth Buttons - Desktop */}
              <div className="desktop-only auth-btns">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="btn btn-secondary btn-sm">
                      <FiUser />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                      <FiLogOut />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-secondary btn-sm">
                      {t('nav.login')}
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm">
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>

              {/* Burger Menu Button */}
              <button
                className="burger-btn mobile-only"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;
