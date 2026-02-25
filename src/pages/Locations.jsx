import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Locations.css';

const Locations = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const locations = [
    {
      id: 1,
      status: t('locations.inProgress'),
      vehicle: 'Audi Q5',
      dates: '20 Apr - 25 May',
      price: '€285,00',
      image: '🚙',
      badge: t('locations.inProgress')
    },
    {
      id: 2,
      status: t('locations.completed'),
      vehicle: 'Renault Clio',
      dates: '10 Apr - 12 Apr',
      price: '€110,00',
      image: '🚗',
      badge: t('locations.completed')
    }
  ];

  return (
    <div className="mobile-container">
      {/* Status Bar */}
      <div className="status-bar">
        <span>9:41</span>
        <div className="status-icons">
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="nav-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title">{t('locations.title')}</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="locations-page">
        <div className="locations-list">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="location-card slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate('/profile')}
            >
              <div className="location-header">
                <h3 className="location-status">{location.status}</h3>
                <span className={`badge ${location.status === t('locations.inProgress') ? 'badge-blue' : 'badge-green'}`}>
                  {location.badge}
                </span>
              </div>

              <div className="location-body">
                <div className="location-vehicle-img">
                  <span className="location-emoji">{location.image}</span>
                </div>
                <div className="location-info">
                  <h4 className="location-vehicle">{location.vehicle}</h4>
                  <p className="location-dates">{location.dates}</p>
                  <p className="location-price">{location.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;