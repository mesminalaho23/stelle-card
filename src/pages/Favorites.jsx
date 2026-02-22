import { useNavigate } from 'react-router-dom';
import { LuHeart, LuArrowLeft } from 'react-icons/lu';
import { useFavorites } from '../contexts/FavoritesContext';
import { getVehicleById } from '../services/VehicleService';
import VehicleCard from '../components/VehicleCard';
import './Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
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
            <h1 className="favorites-title">Mes Favoris</h1>
            <p className="favorites-count">{favoriteVehicles.length} véhicule{favoriteVehicles.length !== 1 ? 's' : ''}</p>
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
            <h2>Aucun favori</h2>
            <p>Appuyez sur ❤️ sur un véhicule pour l'ajouter ici.</p>
            <button className="btn-primary" onClick={() => navigate('/vehicles')} style={{ width: 'auto', marginTop: '1rem' }}>
              Voir les véhicules
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
