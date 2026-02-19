import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const AGENCIES_COL = 'agencies';

const DEFAULT_AGENCIES = [
  { id: 'agency_1', name: 'Stelle Card Paris', address: '45 Avenue des Champs-Élysées, 75008 Paris', phone: '+33 1 42 56 78 90', hours: 'Lun-Sam: 8h-20h, Dim: 10h-18h', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { id: 'agency_2', name: 'Stelle Card Lyon', address: '12 Rue de la République, 69002 Lyon', phone: '+33 4 72 34 56 78', hours: 'Lun-Sam: 8h-19h', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600' },
  { id: 'agency_3', name: 'Stelle Card Marseille', address: '88 La Canebière, 13001 Marseille', phone: '+33 4 91 23 45 67', hours: 'Lun-Sam: 8h-20h, Dim: 9h-17h', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600' },
  { id: 'agency_4', name: 'Stelle Card Nice', address: '25 Promenade des Anglais, 06000 Nice', phone: '+33 4 93 45 67 89', hours: 'Lun-Sam: 9h-19h', image: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=600' }
];

// Initialiser les agences par défaut si la collection est vide
const initDefaults = async () => {
  const snap = await getDocs(collection(db, AGENCIES_COL));
  if (snap.empty) {
    for (const a of DEFAULT_AGENCIES) {
      await setDoc(doc(db, AGENCIES_COL, a.id), { name: a.name, address: a.address, phone: a.phone, hours: a.hours, image: a.image });
    }
  }
};
initDefaults();

export const agencyService = {
  getAll: async () => {
    try {
      const snap = await getDocs(collection(db, AGENCIES_COL));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      return DEFAULT_AGENCIES;
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, AGENCIES_COL), data);
    return { id: docRef.id, ...data };
  },

  update: async (id, updates) => {
    await updateDoc(doc(db, AGENCIES_COL, id), updates);
    return { id, ...updates };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, AGENCIES_COL, id));
  },
};
