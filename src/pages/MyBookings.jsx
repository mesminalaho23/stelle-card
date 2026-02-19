import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/Bookingservice';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      bookingService.getBookings(user.id).then(setBookings);
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm('Annuler cette réservation ?')) {
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
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="mb-title">Mes Réservations</h1>
            <p className="mb-count">{bookings.length} réservation{bookings.length !== 1 ? 's' : ''}</p>
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
                      <span><FiClock size={14} /> {bookingService.getDurationLabel(booking.duration)}</span>
                      {booking.startDate && <span><FiCalendar size={14} /> {new Date(booking.startDate).toLocaleDateString('fr-FR')}</span>}
                    </div>
                    {booking.withDriver && <span className="booking-driver-tag">🚗 Avec chauffeur</span>}
                    <div className="booking-card-footer">
                      <span className="booking-price">{booking.total}€</span>
                      {booking.status === 'pending' && (
                        <button className="booking-cancel-btn" onClick={() => handleCancel(booking.id)}>
                          Annuler
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
            <h2 className="empty-title">Aucune réservation</h2>
            <p className="empty-text">Vous n'avez pas encore de réservation.</p>
            <button className="btn-primary empty-action-btn" onClick={() => navigate('/vehicles')} style={{ width: 'auto' }}>
              Explorer les véhicules
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
