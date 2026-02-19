import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiPackage, FiSettings, FiDroplet, FiUser, FiMapPin } from 'react-icons/fi';
import { useBooking } from '../contexts/BookingContext';
import { bookingService } from '../services/Bookingservice';
import LocationMap, { getCoords, searchAddressOnline } from '../components/LocationMap';
import './Booking.css';

const durationOptions = [
  { label: 'Jour', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '1 Semaine', key: '1week' },
  { label: '1 Mois', key: '1month' }
];

const Booking = () => {
  const navigate = useNavigate();
  const { booking, setDuration, setWithDriver, setDates, setPickupLocation: setCtxLocation, getTotal } = useBooking();
  const { vehicle, duration, withDriver, startDate, endDate } = booking;
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const [pickupLocation, setPickupLocation] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const handleLocationInput = useCallback((val) => {
    setPickupLocation(val);
    setSelectedCoords(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchAddressOnline(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setLoadingSuggestions(false);
    }, 400);
  }, []);

  if (!vehicle) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="booking-empty slide-up" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span style={{ fontSize: '3rem' }}>🚗</span>
            <h2>Aucun véhicule sélectionné</h2>
            <p>Veuillez d'abord choisir un véhicule.</p>
            <button className="btn-primary" onClick={() => navigate('/vehicles')} style={{ marginTop: '1rem' }}>
              Voir les véhicules
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();

  const handleReserve = () => {
    setDates(localStartDate, localEndDate);
    setCtxLocation(pickupLocation);
    navigate('/payment');
  };

  return (
    <div className="booking-page">
      <div className="container">
        {/* Back */}
        <button className="vd-back slide-up" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          <FiArrowLeft />
        </button>

        {/* Vehicle Summary */}
        <div className="booking-vehicle-card slide-up">
          <div className="vehicle-image-small">
            <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
          <div className="vehicle-summary-info">
            <h3 className="vehicle-name-small">{vehicle.name}</h3>
            <p className="vehicle-type-small">{vehicle.type} • {vehicle.specs.transmission}</p>
            <div className="spec-row">
              <span className="spec-icon-small"><FiUsers size={14} /></span>
              <span className="spec-text">{vehicle.specs.passengers} Passagers, {vehicle.specs.luggage} Bagages</span>
            </div>
            <div className="spec-row">
              <span className="spec-icon-small"><FiSettings size={14} /></span>
              <span className="spec-text">{vehicle.features.slice(0, 3).join(', ')}</span>
            </div>
            <span className="badge badge-green" style={{ marginTop: '0.5rem' }}>
              DISPONIBLE
            </span>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="booking-section slide-up">
          <h3 className="booking-section-title">Durée</h3>
          <div className="duration-bar">
            {durationOptions.map((dur) => (
              <button
                key={dur.key}
                className={`duration-btn ${duration === dur.key ? 'active' : ''}`}
                onClick={() => setDuration(dur.key)}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pickup Location */}
        <div className="booking-section slide-up">
          <h3 className="booking-section-title"><FiMapPin style={{ marginRight: '0.5rem' }} />Localisation</h3>
          <div className="location-autocomplete">
            <input
              type="text"
              className="form-input"
              placeholder="Tapez une adresse..."
              value={pickupLocation}
              onChange={(e) => handleLocationInput(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="location-suggestions">
                {suggestions.map((loc, i) => (
                  <button
                    key={i}
                    className="location-suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setPickupLocation(loc.name);
                      setSelectedCoords({ lat: loc.lat, lng: loc.lng });
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }}
                  >
                    <FiMapPin className="suggestion-icon" />
                    <span>{loc.name}</span>
                  </button>
                ))}
              </div>
            )}
            {loadingSuggestions && <div className="location-loading">Recherche...</div>}
          </div>
          {(selectedCoords || getCoords(pickupLocation)) && (
            <LocationMap
              locations={[{
                address: pickupLocation,
                label: pickupLocation,
                type: 'client',
                ...(selectedCoords || {}),
              }]}
              height="200px"
            />
          )}
        </div>

        {/* Dates */}
        <div className="booking-section slide-up">
          <h3 className="booking-section-title">Dates</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Début</label>
              <input
                type="date"
                className="form-input"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fin</label>
              <input
                type="date"
                className="form-input"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* With Driver Option */}
        {vehicle.withDriver && (
          <div className="booking-section slide-up">
            <div
              className={`booking-driver-option ${withDriver ? 'booking-driver-option--active' : ''}`}
              onClick={() => setWithDriver(!withDriver)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiUser size={20} />
                <div>
                  <strong>Avec chauffeur</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>+30% du tarif</p>
                </div>
              </div>
              <div className={`booking-toggle ${withDriver ? 'booking-toggle--on' : ''}`}>
                <div className="booking-toggle-knob" />
              </div>
            </div>
          </div>
        )}

        {/* Price Display */}
        <div className="price-display slide-up">
          <div className="price-row">
            <span className="price-label">{vehicle.name} — {bookingService.getDurationLabel(duration)}</span>
            <span className="price-value">{vehicle.price[duration]}€</span>
          </div>
          {withDriver && (
            <div className="price-row">
              <span className="price-label">Supplément chauffeur</span>
              <span className="price-value">+{Math.round(vehicle.price[duration] * 0.3)}€</span>
            </div>
          )}
          <div className="price-row price-row--total">
            <span className="price-label">Total</span>
            <span className="price-value">{total}€</span>
          </div>
        </div>

        {/* Reserve Button */}
        <button
          className="btn-primary reserve-action-btn slide-up"
          onClick={handleReserve}
        >
          Réserver — {total}€
        </button>
      </div>
    </div>
  );
};

export default Booking;
