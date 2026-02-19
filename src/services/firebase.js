import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ REMPLACE ces valeurs par celles de ta console Firebase
// Console Firebase → Paramètres du projet → Vos applications → Config
const firebaseConfig = {
  apiKey: "AIzaSyCprMU58EsE4gtpuz3QZpZ-QXCi2zXkbjs",
  authDomain: "stelle-card.firebaseapp.com",
  projectId: "stelle-card",
  storageBucket: "stelle-card.firebasestorage.app",
  messagingSenderId: "858596518755",
  appId: "1:858596518755:web:c9d483465632f3d8b68156"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
