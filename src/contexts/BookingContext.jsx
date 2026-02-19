import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    vehicle: null,
    duration: '24h',
    withDriver: false,
    startDate: '',
    endDate: '',
    pickupLocation: ''
  });

  const setVehicle = (vehicle, duration = '24h') => {
    setBooking(prev => ({ ...prev, vehicle, duration }));
  };

  const setDuration = (duration) => {
    setBooking(prev => ({ ...prev, duration }));
  };

  const setWithDriver = (withDriver) => {
    setBooking(prev => ({ ...prev, withDriver }));
  };

  const setDates = (startDate, endDate) => {
    setBooking(prev => ({ ...prev, startDate, endDate }));
  };

  const setPickupLocation = (pickupLocation) => {
    setBooking(prev => ({ ...prev, pickupLocation }));
  };

  const clearBooking = () => {
    setBooking({
      vehicle: null,
      duration: '24h',
      withDriver: false,
      startDate: '',
      endDate: '',
      pickupLocation: ''
    });
  };

  const getTotal = () => {
    if (!booking.vehicle) return 0;
    let price = booking.vehicle.price[booking.duration] || 0;
    if (booking.withDriver && booking.vehicle.withDriver) {
      price = Math.round(price * 1.3);
    }
    return price;
  };

  const value = {
    booking,
    setVehicle,
    setDuration,
    setWithDriver,
    setDates,
    setPickupLocation,
    clearBooking,
    getTotal
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
