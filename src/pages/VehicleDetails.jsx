import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuHeart, LuUsers, LuBriefcase, LuCog, LuDroplets, LuNavigation, LuShare2, LuSend, LuStar } from 'react-icons/lu';
import { getVehicleById } from '../services/vehicleService';
import toast from 'react-hot-toast';
import { useBooking } from '../contexts/BookingContext';
import { useFavorites } from '../contexts/FavoritesContext';
import './VehicleDetails.css';

const durationOptions = [
  { label: 'Jour', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '1 Semaine', key: '1week' },
  { label: '1 Mois', key: '1month' }
];

const VehicleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vehicle = getVehicleById(id);
  const { setVehicle } = useBooking();
  const [selectedDuration, setSelectedDuration] = useState('24h');
  const { isFavorite, toggleFavorite } = useFavorites();

  const [userReviews, setUserReviews] = useState(() => {
    const stored = localStorage.getItem(`reviews_${id}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewType, setReviewType] = useState('vehicle');

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) {
      toast.error('Veuillez écrire un avis et donner une note');
      return;
    }
    const newReview = {
      id: Date.now(),
      user: 'Client',
      rating: reviewRating,
      date: new Date().toISOString(),
      comment: reviewText,
      type: reviewType
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setReviewText('');
    setReviewRating(0);
    toast.success('Merci pour votre avis !');
  };

  if (!vehicle) {
    return (
      <div className="vehicle-details-page">
        <div className="container">
          <div className="vd-not-found slide-up">
            <span>🚫</span>
            <h2>Véhicule introuvable</h2>
            <p>Ce véhicule n'existe pas ou a été retiré.</p>
            <button className="btn-primary" onClick={() => navigate('/vehicles')}>
              Voir tous les véhicules
            </button>
          </div>
        </div>
      </div>
    );
  }

  const specItems = [
    { icon: <LuUsers />, label: `${vehicle.specs.passengers} Passagers` },
    { icon: <LuBriefcase />, label: `${vehicle.specs.luggage} Bagages` },
    { icon: <LuCog />, label: vehicle.specs.transmission },
    { icon: <LuDroplets />, label: vehicle.specs.fuel },
    { icon: <LuNavigation />, label: `${vehicle.specs.doors} Portes` }
  ];

  return (
    <div className="vehicle-details-page">
      <div className="container">
        {/* Back + Favorite Header */}
        <div className="vd-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="vd-fav" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: vehicle.name, text: `${vehicle.name} sur Stelle Card — ${vehicle.price['24h']}€/jour`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                import('react-hot-toast').then(m => m.default.success('Lien copié !'));
              }
            }}>
              <LuShare2 />
            </button>
            <button className={`vd-fav ${isFavorite(vehicle.id) ? 'vd-fav--active' : ''}`} onClick={() => toggleFavorite(vehicle.id)}>
              <LuHeart />
            </button>
          </div>
        </div>

        <div className="vd-layout">
          {/* Hero Image */}
          <div className="vd-hero slide-up">
            <img src={vehicle.image} alt={vehicle.name} className="vd-hero-img" />
            <div className="vd-hero-overlay">
              {vehicle.available ? (
                <span className="badge badge-green">DISPONIBLE</span>
              ) : (
                <span className="badge badge-red">INDISPONIBLE</span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="vd-info slide-up">
            <div className="vd-info-top">
              <div>
                <h1 className="vd-name">{vehicle.name}</h1>
                <p className="vd-type">{vehicle.type} • {vehicle.category}</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="vd-specs">
              {specItems.map((spec, i) => (
                <div key={i} className="vd-spec">
                  <span className="vd-spec-icon">{spec.icon}</span>
                  <span className="vd-spec-label">{spec.label}</span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="vd-features">
              <h3 className="vd-section-title">Équipements</h3>
              <div className="vd-features-list">
                {vehicle.features.map((feat, i) => (
                  <span key={i} className="vd-feature-tag">✓ {feat}</span>
                ))}
              </div>
            </div>

            {/* With Driver */}
            {vehicle.withDriver && (
              <div className="vd-driver-badge">
                <span>🚗</span>
                <span>Chauffeur disponible sur demande</span>
              </div>
            )}

            {/* Laisser un avis */}
            <div className="vd-reviews">
              <h3 className="vd-section-title">Laisser un avis</h3>
              <div className="vd-review-form">
                <div className="vd-review-type-toggle">
                  <button
                    className={`vd-review-type-btn ${reviewType === 'vehicle' ? 'vd-review-type-btn--active' : ''}`}
                    onClick={() => setReviewType('vehicle')}
                  >
                    🚗 Véhicule
                  </button>
                  {vehicle.withDriver && (
                    <button
                      className={`vd-review-type-btn ${reviewType === 'driver' ? 'vd-review-type-btn--active' : ''}`}
                      onClick={() => setReviewType('driver')}
                    >
                      👤 Chauffeur
                    </button>
                  )}
                </div>
                <div className="vd-review-stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`vd-star-btn ${star <= reviewRating ? 'vd-star-btn--active' : ''}`}
                      onClick={() => setReviewRating(star)}
                    >
                      <LuStar />
                    </button>
                  ))}
                  {reviewRating > 0 && <span className="vd-rating-label">{reviewRating}/5</span>}
                </div>
                <textarea
                  className="form-input vd-review-textarea"
                  placeholder={reviewType === 'vehicle' ? 'Votre avis sur ce véhicule...' : 'Votre avis sur le chauffeur...'}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <button className="btn-primary vd-review-submit" onClick={handleSubmitReview}>
                  <LuSend size={16} />
                  Publier l'avis
                </button>
              </div>

              {userReviews.length > 0 && (
                <>
                  <h3 className="vd-section-title" style={{ marginTop: '1.5rem' }}>Avis clients ({userReviews.length})</h3>
                  <div className="vd-reviews-list">
                    {userReviews.map((review) => (
                      <div key={review.id} className="vd-review">
                        <div className="vd-review-header">
                          <div className="vd-review-avatar">{review.user.charAt(0)}</div>
                          <div className="vd-review-meta">
                            <span className="vd-review-user">{review.user}</span>
                            <span className="vd-review-date">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <span className="vd-review-type-tag">
                            {review.type === 'driver' ? '👤 Chauffeur' : '🚗 Véhicule'}
                          </span>
                        </div>
                        <div className="vd-review-stars">
                          {[...Array(5)].map((_, i) => (
                            <LuStar key={i} className={i < review.rating ? 'vd-star-filled' : 'vd-star-empty'} />
                          ))}
                        </div>
                        <p className="vd-review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="vd-pricing">
              <h3 className="vd-section-title">Tarifs</h3>
              <div className="vd-duration-bar">
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
              <div className="vd-price-display">
                <span className="vd-price-amount">{vehicle.price[selectedDuration]}€</span>
                <span className="vd-price-period">/ {durationOptions.find(d => d.key === selectedDuration)?.label.toLowerCase()}</span>
              </div>
            </div>

            {/* Reserve Button */}
            <button
              className="btn-primary vd-reserve-btn"
              onClick={() => { setVehicle(vehicle, selectedDuration); navigate('/booking'); }}
              disabled={!vehicle.available}
            >
              {vehicle.available ? `Réserver — ${vehicle.price[selectedDuration]}€` : 'Indisponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
