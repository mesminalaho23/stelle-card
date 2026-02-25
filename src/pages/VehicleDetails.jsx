import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuHeart, LuUsers, LuBriefcase, LuCog, LuDroplets, LuNavigation, LuShare2, LuSend, LuStar } from 'react-icons/lu';
import { getVehicleById } from '../services/vehicleService';
import toast from 'react-hot-toast';
import { useBooking } from '../contexts/BookingContext';
import { useFavorites } from '../contexts/FavoritesContext';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const vehicle = getVehicleById(id);
  const { setVehicle } = useBooking();
  const [selectedDuration, setSelectedDuration] = useState('24h');
  const { isFavorite, toggleFavorite } = useFavorites();

  const durationOptions = [
    { label: t('compare.day'), key: '24h' },
    { label: '48h', key: '48h' },
    { label: `1 ${t('compare.week')}`, key: '1week' },
    { label: `1 ${t('compare.month')}`, key: '1month' }
  ];

  const [userReviews, setUserReviews] = useState(() => {
    const stored = localStorage.getItem(`reviews_${id}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewType, setReviewType] = useState('vehicle');

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) {
      toast.error(t('review.error'));
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
    toast.success(t('review.thanks'));
  };

  if (!vehicle) {
    return (
      <div className="vehicle-details-page">
        <div className="container">
          <div className="vd-not-found slide-up">
            <span>🚫</span>
            <h2>{t('vehicles.notFound')}</h2>
            <p>{t('vehicles.notFoundDesc')}</p>
            <button className="btn-primary" onClick={() => navigate('/vehicles')}>
              {t('vehicles.seeAll')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const specItems = [
    { icon: <LuUsers />, label: `${vehicle.specs.passengers} ${t('vehicles.passengers')}` },
    { icon: <LuBriefcase />, label: `${vehicle.specs.luggage} ${t('vehicles.luggage')}` },
    { icon: <LuCog />, label: vehicle.specs.transmission },
    { icon: <LuDroplets />, label: vehicle.specs.fuel },
    { icon: <LuNavigation />, label: `${vehicle.specs.doors} ${t('vehicles.doors')}` }
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
                navigator.share({ title: vehicle.name, text: `${vehicle.name} sur Stelle Card — ${vehicle.price['24h']}€${t('vehicles.perDay')}`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                import('react-hot-toast').then(m => m.default.success(t('common.linkCopied')));
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
                <span className="badge badge-green">{t('vehicles.available')}</span>
              ) : (
                <span className="badge badge-red">{t('vehicles.unavailable')}</span>
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
              <h3 className="vd-section-title">{t('vehicles.equipment')}</h3>
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
                <span>{t('vehicles.driverAvailable')}</span>
              </div>
            )}

            {/* Laisser un avis */}
            <div className="vd-reviews">
              <h3 className="vd-section-title">{t('review.leaveReview')}</h3>
              <div className="vd-review-form">
                <div className="vd-review-type-toggle">
                  <button
                    className={`vd-review-type-btn ${reviewType === 'vehicle' ? 'vd-review-type-btn--active' : ''}`}
                    onClick={() => setReviewType('vehicle')}
                  >
                    🚗 {t('review.vehicle')}
                  </button>
                  {vehicle.withDriver && (
                    <button
                      className={`vd-review-type-btn ${reviewType === 'driver' ? 'vd-review-type-btn--active' : ''}`}
                      onClick={() => setReviewType('driver')}
                    >
                      👤 {t('review.driver')}
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
                  placeholder={reviewType === 'vehicle' ? t('review.placeholder') : t('review.driverPlaceholder')}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <button className="btn-primary vd-review-submit" onClick={handleSubmitReview}>
                  <LuSend size={16} />
                  {t('review.submit')}
                </button>
              </div>

              {userReviews.length > 0 && (
                <>
                  <h3 className="vd-section-title" style={{ marginTop: '1.5rem' }}>{t('review.clientReviews')} ({userReviews.length})</h3>
                  <div className="vd-reviews-list">
                    {userReviews.map((review) => (
                      <div key={review.id} className="vd-review">
                        <div className="vd-review-header">
                          <div className="vd-review-avatar">{review.user.charAt(0)}</div>
                          <div className="vd-review-meta">
                            <span className="vd-review-user">{review.user}</span>
                            <span className="vd-review-date">{new Date(review.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                          </div>
                          <span className="vd-review-type-tag">
                            {review.type === 'driver' ? `👤 ${t('review.driver')}` : `🚗 ${t('review.vehicle')}`}
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
              <h3 className="vd-section-title">{t('vehicles.pricing')}</h3>
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
              {vehicle.available ? `${t('vehicles.reserve')} — ${vehicle.price[selectedDuration]}€` : t('vehicles.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
