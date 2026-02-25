import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuCreditCard, LuLock, LuCalendarDays, LuMapPin, LuAlertCircle } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../contexts/BookingContext';

import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/Bookingservice';
import ConfirmModal from '../components/ConfirmModal';
import './Payment.css';

// SVG payment icons (inline for crisp rendering)
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" width="38" height="26"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.5 21h-3l1.9-10h3L19.5 21zm12.7-9.7c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.6 3.1 1.2.6 1.5.9 1.5 1.4 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.2-1.5 5.3-3.8 0-1.3-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.4-2.4zM37 21h-2.5l.2-.8H32l-.4.8h-3.2l4.5-9.3c.3-.6.9-.7 1.6-.7H37L37 21zm-3.5-7.3l-1.8 4.3h2l.8-4.3h1zM17.4 11L14 18.4l-.4-1.8c-.6-2.1-2.6-4.4-4.8-5.5l2.7 9.8h3.2l4.8-10h-3.1z" fill="#fff"/><path d="M11.5 11H6.8l-.1.3c3.8.9 6.3 3.2 7.3 5.9l-1.1-5.3c-.2-.7-.7-.9-1.4-.9z" fill="#F9A51A"/></svg>
);
const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" width="38" height="26"><rect width="48" height="32" rx="4" fill="#252525"/><circle cx="19" cy="16" r="9" fill="#EB001B"/><circle cx="29" cy="16" r="9" fill="#F79E1B"/><path d="M24 9.3a9 9 0 0 1 3.3 6.7A9 9 0 0 1 24 22.7 9 9 0 0 1 20.7 16 9 9 0 0 1 24 9.3z" fill="#FF5F00"/></svg>
);
const PaypalIcon = () => (
  <svg viewBox="0 0 48 32" width="38" height="26"><rect width="48" height="32" rx="4" fill="#003087"/><path d="M20 10h5c2.7 0 4.3 1.4 4 4-.4 3.3-2.5 5-5.5 5h-1.3c-.4 0-.7.3-.8.7l-.7 4.3h-3l2.3-14zm3.5 6.5c1.2 0 2.2-.9 2.4-2 .2-1.2-.5-2-1.7-2h-1.1l-.7 4h1.1z" fill="#fff"/><path d="M30 12h4c2.2 0 3.5 1.2 3.2 3.5-.3 2.8-2.1 4.5-4.5 4.5H31c-.3 0-.5.2-.6.5l-.5 3.5h-2.5L30 12zm2.8 5.5c1 0 1.8-.7 2-1.7.1-1-.4-1.7-1.4-1.7h-.9l-.6 3.4h.9z" fill="#009cde"/></svg>
);
const ApplePayIcon = () => (
  <svg viewBox="0 0 48 32" width="38" height="26"><rect width="48" height="32" rx="4" fill="#000"/><text x="24" y="20" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="system-ui" fontWeight="600"> Pay</text><path d="M15.5 12.5c.5-.6.8-1.5.7-2.3-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.7-.4 2.2-1zm.7 1.2c-1.2-.1-2.3.7-2.9.7s-1.5-.7-2.5-.6c-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.4 5.7 1 7.5.6.9 1.4 1.9 2.4 1.9 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-.9 2.3-1.9c.4-.6.7-1.3.9-2-1-.4-1.8-1.5-1.8-2.7 0-1.1.6-2 1.4-2.5-.5-.8-1.5-1.3-2.7-1.3z" fill="#fff"/></svg>
);

const paymentMethods = [
  { id: 'visa', label: 'Visa', icon: <VisaIcon /> },
  { id: 'mastercard', label: 'Mastercard', icon: <MastercardIcon /> },
  { id: 'paypal', label: 'PayPal', icon: <PaypalIcon /> },
  { id: 'apple', label: 'Apple Pay', icon: <ApplePayIcon /> }
];

const formatCardNumber = (val) => {
  const nums = val.replace(/\D/g, '').slice(0, 16);
  return nums.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (val) => {
  const nums = val.replace(/\D/g, '').slice(0, 4);
  if (nums.length > 2) return nums.slice(0, 2) + '/' + nums.slice(2);
  return nums;
};

const Payment = () => {
  const navigate = useNavigate();
  const { booking, getTotal, clearBooking } = useBooking();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { vehicle, duration, withDriver, startDate, endDate, pickupLocation, pickupTime } = booking;
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!vehicle) {
    return (
      <div className="payment-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span style={{ fontSize: '3rem' }}>🚗</span>
            <h2>{t('payment.noBooking')}</h2>
            <button className="btn-primary" onClick={() => navigate('/vehicles')} style={{ marginTop: '1rem' }}>
              Voir les véhicules
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const isCardMethod = paymentMethod === 'visa' || paymentMethod === 'mastercard';

  const validate = () => {
    const errs = {};
    if (!startDate) errs.startDate = t('payment.errors.startDate');
    if (!endDate) errs.endDate = t('payment.errors.endDate');
    if (!pickupLocation) errs.location = t('payment.errors.location');
    if (!pickupTime) errs.pickupTime = t('payment.errors.pickupTime');
    if (isCardMethod) {
      if (!cardName.trim()) errs.cardName = t('payment.errors.cardName');
      if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = t('payment.errors.cardNumber');
      if (cardExpiry.length < 5) errs.cardExpiry = t('payment.errors.cardExpiry');
      if (cardCvv.length < 3) errs.cardCvv = t('payment.errors.cardCvv');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayClick = () => {
    if (!validate()) {
      toast.error(t('payment.fillRequired'));
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    await bookingService.createBooking({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.image,
      duration,
      withDriver,
      startDate,
      endDate,
      pickupLocation,
      pickupTime,
      total,
      paymentMethod,
      userId: user?.id || '',
      userName: user?.name || 'Client',
      userEmail: user?.email || ''
    });
    clearBooking();
    toast.success(t('payment.success'));
    navigate('/my-rentals');
  };

  return (
    <div className="payment-page">
      <div className="container">
        <button className="vd-back slide-up" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          <LuArrowLeft />
        </button>

        {/* Order Summary */}
        <div className="payment-summary slide-up">
          <h3 style={{ marginBottom: '0.75rem' }}>{t('payment.summary')}</h3>
          <div className="summary-row">
            <span>{vehicle.name}</span>
            <span>{vehicle.price[duration]}€</span>
          </div>
          <div className="summary-row">
            <span>Durée</span>
            <span>{bookingService.getDurationLabel(duration)}</span>
          </div>
          {withDriver && (
            <div className="summary-row">
              <span>{t('payment.driver')}</span>
              <span>+{Math.round(vehicle.price[duration] * 0.3)}€</span>
            </div>
          )}

          {/* Required info warnings */}
          {(!startDate || !endDate || !pickupLocation || !pickupTime) && (
            <div className="payment-missing-info">
              <LuAlertCircle size={14} />
              <span>{t('payment.missingInfo')}</span>
              <div className="payment-missing-list">
                {!startDate && <span className="payment-missing-tag">📅 {t('payment.missingStartDate')}</span>}
                {!endDate && <span className="payment-missing-tag">📅 {t('payment.missingEndDate')}</span>}
                {!pickupLocation && <span className="payment-missing-tag">📍 {t('payment.missingAddress')}</span>}
                {!pickupTime && <span className="payment-missing-tag">🕐 {t('payment.missingTime')}</span>}
              </div>
            </div>
          )}

          {pickupLocation && (
            <div className="summary-row"><span><LuMapPin size={13} /> {t('payment.location')}</span><span>{pickupLocation}</span></div>
          )}
          {pickupTime && (
            <div className="summary-row"><span>🕐 {t('payment.time')}</span><span>{pickupTime}</span></div>
          )}
          {startDate && (
            <div className="summary-row"><span><LuCalendarDays size={13} /> {t('payment.from')}</span><span>{new Date(startDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span></div>
          )}
          {endDate && (
            <div className="summary-row"><span><LuCalendarDays size={13} /> {t('payment.to')}</span><span>{new Date(endDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span></div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="payment-methods slide-up">
          <h3 className="payment-methods-title">{t('payment.paymentMethod')}</h3>
          <div className="payment-methods-grid">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                className={`payment-method-btn ${paymentMethod === method.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <span className="payment-icon">{method.icon}</span>
                <span className="payment-label">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Form */}
        {isCardMethod && (
          <div className="card-form slide-up">
            <div className="card-form-header">
              <LuLock size={14} />
              <span>{t('payment.securePayment')}</span>
            </div>
            <div className="form-group">
              <label className="form-label">{t('payment.cardName')}</label>
              <input
                type="text"
                className={`form-input ${errors.cardName ? 'form-input--error' : ''}`}
                placeholder={t('payment.cardNamePlaceholder')}
                value={cardName}
                onChange={e => { setCardName(e.target.value); setErrors(p => ({ ...p, cardName: '' })); }}
              />
              {errors.cardName && <span className="form-error">{errors.cardName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('payment.cardNumber')}</label>
              <div className="card-input-wrapper">
                <LuCreditCard className="card-input-icon" />
                <input
                  type="text"
                  className={`form-input form-input--with-icon ${errors.cardNumber ? 'form-input--error' : ''}`}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={e => { setCardNumber(formatCardNumber(e.target.value)); setErrors(p => ({ ...p, cardNumber: '' })); }}
                  maxLength="19"
                />
                <div className="card-brand-icons">
                  <VisaIcon /><MastercardIcon />
                </div>
              </div>
              {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
            </div>

            <div className="card-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">{t('payment.expiry')}</label>
                <div className="card-input-wrapper">
                  <LuCalendarDays className="card-input-icon" />
                  <input
                    type="text"
                    className={`form-input form-input--with-icon ${errors.cardExpiry ? 'form-input--error' : ''}`}
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={e => { setCardExpiry(formatExpiry(e.target.value)); setErrors(p => ({ ...p, cardExpiry: '' })); }}
                    maxLength="5"
                  />
                </div>
                {errors.cardExpiry && <span className="form-error">{errors.cardExpiry}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CVV</label>
                <div className="card-input-wrapper">
                  <LuLock className="card-input-icon" />
                  <input
                    type="password"
                    className={`form-input form-input--with-icon ${errors.cardCvv ? 'form-input--error' : ''}`}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={e => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setErrors(p => ({ ...p, cardCvv: '' })); }}
                    maxLength="4"
                  />
                </div>
                {errors.cardCvv && <span className="form-error">{errors.cardCvv}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="payment-total slide-up">
          <div className="total-row">
            <span className="total-label">{t('payment.total')}</span>
            <span className="total-amount">{total}€</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          className="btn-primary pay-btn slide-up"
          onClick={handlePayClick}
          disabled={isProcessing}
        >
          {isProcessing ? t('payment.processing') : `Payer ${total}€`}
        </button>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={showConfirm}
          title={t('payment.confirmTitle')}
          message={`Vous allez payer ${total}€ pour la location de ${vehicle.name}. Cette action est définitive.`}
          variant="success"
          confirmLabel={`Payer ${total}€`}
          cancelLabel={t('payment.cancel')}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export default Payment;
