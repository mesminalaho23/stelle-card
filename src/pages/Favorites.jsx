import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuHeart, LuArrowLeft } from 'react-icons/lu';
import { useFavorites } from '../contexts/FavoritesContext';
import { getVehicleById } from '../services/VehicleService';
import VehicleCard from '../components/VehicleCard';
import './Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { favorites } = useFavorites();
  const favoriteVehicles = favorites.map(id => getVehicleById(id)).filter(Boolean);

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </button>
          <div>
            <h1 className="favorites-title">{t('favorites.title')}</h1>
            <p className="favorites-count">{favoriteVehicles.length} {t('favorites.count')}</p>
          </div>
        </div>

        {favoriteVehicles.length > 0 ? (
          <div className="favorites-grid">
            {favoriteVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        ) : (
          <div className="favorites-empty slide-up">
            <LuHeart className="favorites-empty-icon" />
            <h2>{t('favorites.empty')}</h2>
            <p>{t('favorites.emptySub')}</p>
            <button className="btn-primary" onClick={() => navigate('/vehicles')} style={{ width: 'auto', marginTop: '1rem' }}>
              {t('favorites.seeVehicles')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
