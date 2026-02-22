import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LuSearch, LuUsers, LuZap } from 'react-icons/lu';
import { getVehicles, categories } from '../services/vehicleService';
import './VehicleList.css';

const durationOptions = [
  { label: 'Jour', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '1 Semaine', key: '1week' },
  { label: '1 Mois', key: '1month' }
];

const VehicleList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDuration, setSelectedDuration] = useState('24h');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [vehicles, setVehicles] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [fuelFilter, setFuelFilter] = useState('');
  const [transFilter, setTransFilter] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(search);
  }, [searchParams]);

  useEffect(() => {
    const filters = {};
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (searchQuery) filters.search = searchQuery;
    if (maxPrice < 300) filters.maxPrice = maxPrice;
    let results = getVehicles(filters);
    if (fuelFilter) results = results.filter(v => v.specs.fuel === fuelFilter);
    if (transFilter) results = results.filter(v => v.specs.transmission === transFilter);
    setVehicles(results);
  }, [selectedCategory, searchQuery, maxPrice, fuelFilter, transFilter]);

  return (
    <div className="vehicle-list-page">
      <div className="container">
        {/* Search Bar */}
        <div className="search-bar slide-up">
          <LuSearch className="search-bar-icon" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-input"
          />
        </div>

        {/* Category Filters */}
        <div className="filters-bar slide-up">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Duration Filters */}
        <div className="duration-bar slide-up">
          {durationOptions.map((dur) => (
            <button
              key={dur.key}
              className={`duration-btn ${selectedDuration === dur.key ? 'active' : ''}`}
              onClick={() => setSelectedDuration(dur.key)}
            >
              {dur.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters slide-up">
          <div className="filter-group filter-group--budget">
            <label className="filter-label">💎 Budget max</label>
            <div className="budget-slider-wrapper">
              <input type="range" min="20" max="300" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="price-slider" />
              <div className="budget-track-fill" style={{ width: `${((maxPrice - 20) / 280) * 100}%` }} />
            </div>
            <div className="budget-info">
              <span className="budget-value">{maxPrice}€<small>/jour</small></span>
              <span className="budget-range">20€ — 300€</span>
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">⛽ Carburant</label>
            <div className="filter-chips">
              {['', 'Essence', 'Diesel', 'Électrique'].map(f => (
                <button key={f} className={`filter-chip ${fuelFilter === f ? 'filter-chip--active' : ''}`} onClick={() => setFuelFilter(f)}>
                  {f === '' ? 'Tous' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">⚙️ Transmission</label>
            <div className="filter-chips">
              {['', 'Automatique', 'Manuelle'].map(t => (
                <button key={t} className={`filter-chip ${transFilter === t ? 'filter-chip--active' : ''}`} onClick={() => setTransFilter(t)}>
                  {t === '' ? 'Tous' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="results-count">{vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} trouvé{vehicles.length !== 1 ? 's' : ''}</p>

        {/* Vehicle Cards */}
        {vehicles.length > 0 ? (
          <div className="vl-grid">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="vl-card slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                <div className="vl-card-image">
                  <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
                  <span className={`vl-badge vl-badge--${vehicle.category.toLowerCase()}`}>
                    {vehicle.category}
                  </span>
                  {!vehicle.available && (
                    <div className="vl-unavailable">Indisponible</div>
                  )}
                </div>
                <div className="vl-card-body">
                  <h3 className="vl-card-name">{vehicle.name}</h3>
                  <p className="vl-card-type">{vehicle.type}</p>
                  <div className="vl-card-specs">
                    <span><LuUsers size={14} /> {vehicle.specs.passengers}</span>
                    <span><LuZap size={14} /> {vehicle.specs.transmission}</span>
                  </div>
                  <div className="vl-card-footer">
                    <div className="vl-card-price">
                      <span className="vl-price-amount">{vehicle.price[selectedDuration]}€</span>
                      <span className="vl-price-period">/{durationOptions.find(d => d.key === selectedDuration)?.label.toLowerCase()}</span>
                    </div>
                    <span className="vl-card-cta">Voir →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vl-empty slide-up">
            <span className="vl-empty-icon">🔍</span>
            <h3>Aucun véhicule trouvé</h3>
            <p>Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
