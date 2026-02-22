import { Link, useLocation } from 'react-router-dom';
import { LuHome, LuCar, LuHeart, LuUser } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import './BottomNav.css';

const BottomNav = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const tabs = [
    { path: '/', icon: LuHome, label: t('nav.home') },
    { path: '/vehicles', icon: LuCar, label: t('nav.vehicles') },
    { path: '/favorites', icon: LuHeart, label: t('nav.favorites') },
    { path: '/profile', icon: LuUser, label: t('nav.profile') }
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
