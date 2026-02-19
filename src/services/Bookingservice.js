import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const BOOKINGS_COL = 'bookings';

export const bookingService = {
  // Get bookings for current user
  getBookings: async (userId) => {
    try {
      const q = query(collection(db, BOOKINGS_COL), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      // Fallback si pas d'index
      const snap = await getDocs(collection(db, BOOKINGS_COL));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.userId === userId);
    }
  },

  // Get ALL bookings (admin)
  getAllBookings: async () => {
    try {
      const snap = await getDocs(collection(db, BOOKINGS_COL));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const newBooking = {
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, BOOKINGS_COL), newBooking);
    return { id: docRef.id, ...newBooking };
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    await updateDoc(doc(db, BOOKINGS_COL, id), { status });
  },

  // Alias for admin
  updateAllBookingStatus: async (id, status) => {
    await updateDoc(doc(db, BOOKINGS_COL, id), { status });
  },

  // Delete booking
  deleteBooking: async (id) => {
    await deleteDoc(doc(db, BOOKINGS_COL, id));
  },

  // Calculate total price (pas besoin de Firebase, calcul local)
  calculatePrice: (vehiclePrice, duration, withDriver = false) => {
    let price = vehiclePrice[duration];
    if (withDriver) price = price * 1.3;
    return Math.round(price);
  },

  getDurationLabel: (duration) => {
    const labels = {
      '24h': '24 heures',
      '48h': '48 heures',
      '1week': '1 semaine',
      '1month': '1 mois'
    };
    return labels[duration] || duration;
  },

  getStatusInfo: (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: 'warning' },
      confirmed: { label: 'Confirmée', color: 'success' },
      active: { label: 'En cours', color: 'primary' },
      completed: { label: 'Terminée', color: 'success' },
      cancelled: { label: 'Annulée', color: 'danger' }
    };
    return statusMap[status] || { label: status, color: 'secondary' };
  }
};
