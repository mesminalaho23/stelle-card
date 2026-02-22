import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuX, LuPlus, LuStar, LuUsers, LuBriefcase, LuCog, LuDroplets } from 'react-icons/lu';
import { vehiclesData } from '../services/VehicleService';
import './Compare.css';

const Compare = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const selectedVehicles = selectedIds.map(id => vehiclesData.find(v => v.id === id)).filter(Boolean);
  const availableVehicles = vehiclesData.filter(v => !selectedIds.includes(v.id));

  const addVehicle = (id) => {
    if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
      setShowPicker(false);
    }
  };

  const removeVehicle = (id) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  return (
    <div className="compare-page">
      <div className="container">
        <div className="compare-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </button>
          <div>
            <h1 className="compare-title">Comparer</h1>
            <p className="compare-subtitle">{selectedVehicles.length}/3 véhicules sélectionnés</p>
          </div>
        </div>

        {/* Selected vehicles comparison */}
        <div className="compare-grid slide-up">
          {selectedVehicles.map(vehicle => (
            <div key={vehicle.id} className="compare-card">
              <button className="compare-remove" onClick={() => removeVehicle(vehicle.id)}>
                <LuX />
              </button>
              <img src={vehicle.image} alt={vehicle.name} className="compare-img" />
              <h3 className="compare-name">{vehicle.name}</h3>
              <span className="compare-category">{vehicle.category} • {vehicle.type}</span>

              <div className="compare-specs">
                <div className="compare-spec-row">
                  <span className="compare-spec-label"><LuStar /> Note</span>
                  <span className="compare-spec-value">{vehicle.rating}/5</span>
                </div>
                <div className="compare-spec-row">
                  <span className="compare-spec-label"><LuUsers /> Places</span>
                  <span className="compare-spec-value">{vehicle.specs.passengers}</span>
                </div>
                <div className="compare-spec-row">
                  <span className="compare-spec-label"><LuBriefcase /> Bagages</span>
                  <span className="compare-spec-value">{vehicle.specs.luggage}</span>
                </div>
                <div className="compare-spec-row">
                  <span className="compare-spec-label"><LuCog /> Transmission</span>
                  <span className="compare-spec-value">{vehicle.specs.transmission}</span>
                </div>
                <div className="compare-spec-row">
                  <span className="compare-spec-label"><LuDroplets /> Carburant</span>
                  <span className="compare-spec-value">{vehicle.specs.fuel}</span>
                </div>
              </div>

              <div className="compare-prices">
                <div className="compare-price-row">
                  <span>Jour</span>
                  <span className="compare-price-val">{vehicle.price['24h']}€</span>
                </div>
                <div className="compare-price-row">
                  <span>Semaine</span>
                  <span className="compare-price-val">{vehicle.price['1week']}€</span>
                </div>
                <div className="compare-price-row">
                  <span>Mois</span>
                  <span className="compare-price-val">{vehicle.price['1month']}€</span>
                </div>
              </div>

              <div className="compare-features">
                {vehicle.features.map((f, i) => (
                  <span key={i} className="compare-feature-tag">✓ {f}</span>
                ))}
              </div>

              <button
                className="btn-primary compare-book-btn"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                Voir détails
              </button>
            </div>
          ))}

          {/* Add vehicle slot */}
          {selectedIds.length < 3 && (
            <button className="compare-add-slot" onClick={() => setShowPicker(true)}>
              <LuPlus />
              <span>Ajouter un véhicule</span>
            </button>
          )}
        </div>

        {/* Vehicle picker modal */}
        {showPicker && (
          <>
            <div className="compare-overlay" onClick={() => setShowPicker(false)} />
            <div className="compare-picker slide-up">
              <div className="compare-picker-header">
                <h3>Choisir un véhicule</h3>
                <button className="vd-back" onClick={() => setShowPicker(false)}>
                  <LuX />
                </button>
              </div>
              <div className="compare-picker-list">
                {availableVehicles.map(v => (
                  <div key={v.id} className="compare-picker-item" onClick={() => addVehicle(v.id)}>
                    <img src={v.image} alt={v.name} className="compare-picker-img" />
                    <div className="compare-picker-info">
                      <strong>{v.name}</strong>
                      <span>{v.category} — {v.price['24h']}€/jour</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
