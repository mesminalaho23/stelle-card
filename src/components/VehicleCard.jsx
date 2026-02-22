import { Link } from 'react-router-dom';
import { LuUsers, LuZap, LuHeart } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useFavorites } from '../contexts/FavoritesContext';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, index = 0 }) => {
  const {
    id,
    name,
    category,
    type,
    image,
    price,
    specs,
    available,
    withDriver
  } = vehicle;

  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/vehicles/${id}`} className="vehicle-card">
        {/* Image */}
        <div className="vehicle-card-image">
          <img src={image} alt={name} loading="lazy" />
          
          {/* Badges */}
          <div className="vehicle-badges">
            <span className={`badge badge-${category.toLowerCase()}`}>
              {category}
            </span>
            {!available && (
              <span className="badge badge-danger">
                Non disponible
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            className={`vc-fav-btn ${isFavorite(id) ? 'vc-fav-btn--active' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
          >
            <LuHeart />
          </button>
        </div>

        {/* Content */}
        <div className="vehicle-card-content">
          <div className="vehicle-card-header">
            <h3 className="vehicle-name">{name}</h3>
            <p className="vehicle-type">{type}</p>
          </div>

          {/* Specs */}
          <div className="vehicle-specs">
            <div className="spec-item">
              <LuUsers className="spec-icon" />
              <span>{specs.passengers} places</span>
            </div>
            <div className="spec-item">
              <LuZap className="spec-icon" />
              <span>{specs.transmission}</span>
            </div>
          </div>

          {/* Driver Option */}
          {withDriver && (
            <div className="driver-badge">
              <span>🚗</span>
              <span>Avec chauffeur disponible</span>
            </div>
          )}

          {/* Footer */}
          <div className="vehicle-card-footer">
            <div className="vehicle-price">
              <span className="price-amount">{price['24h']}€</span>
              <span className="price-period">/jour</span>
            </div>
            <span className="view-btn">
              Voir détails →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;