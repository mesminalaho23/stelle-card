import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuCalendarDays, LuClock4 } from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/Bookingservice';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      bookingService.getBookings(user.id).then(setBookings);
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm(t('myBookings.cancelConfirm'))) {
      await bookingService.updateBookingStatus(id, 'cancelled');
      const updated = await bookingService.getBookings(user.id);
      setBookings(updated);
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="mb-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </button>
          <div>
            <h1 className="mb-title">{t('myBookings.title')}</h1>
            <p className="mb-count">{bookings.length} {t('myBookings.count')}</p>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking, index) => {
              const status = bookingService.getStatusInfo(booking.status);
              return (
                <div key={booking.id} className="booking-card slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="booking-card-img">
                    <img src={booking.vehicleImage} alt={booking.vehicleName} />
                  </div>
                  <div className="booking-details">
                    <div className="booking-details-top">
                      <h3 className="booking-vehicle-name">{booking.vehicleName}</h3>
                      <span className={`booking-status booking-status--${status.color}`}>{status.label}</span>
                    </div>
                    <div className="booking-meta">
                      <span><LuClock4 size={14} /> {bookingService.getDurationLabel(booking.duration)}</span>
                      {booking.startDate && <span><LuCalendarDays size={14} /> {new Date(booking.startDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>}
                    </div>
                    {booking.withDriver && <span className="booking-driver-tag">🚗 {t('myBookings.withDriver')}</span>}
                    <div className="booking-card-footer">
                      <span className="booking-price">{booking.total}€</span>
                      {booking.status === 'pending' && (
                        <button className="booking-cancel-btn" onClick={() => handleCancel(booking.id)}>
                          {t('myBookings.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state slide-up">
            <span className="empty-icon">📋</span>
            <h2 className="empty-title">{t('myBookings.empty')}</h2>
            <p className="empty-text">{t('myBookings.emptyDesc')}</p>
            <button className="btn-primary empty-action-btn" onClick={() => navigate('/vehicles')} style={{ width: 'auto' }}>
              {t('myBookings.explore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
