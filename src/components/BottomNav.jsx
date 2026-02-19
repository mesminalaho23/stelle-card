import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiHeart, FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './BottomNav.css';

const BottomNav = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const tabs = [
    { path: '/', icon: FiHome, label: t('nav.home') },
    { path: '/vehicles', icon: FiTruck, label: t('nav.vehicles') },
    { path: '/favorites', icon: FiHeart, label: t('nav.favorites') },
    { path: '/profile', icon: FiUser, label: t('nav.profile') }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
          >
            <Icon className="bottom-nav-icon" />
            <span className="bottom-nav-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
