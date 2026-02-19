import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import toast from 'react-hot-toast';

const ADMIN_EMAILS = ['mesminalaho23@gmail.com'];

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Écouter les changements d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer le profil depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = userDoc.exists() ? userDoc.data() : {};
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: profile.name || firebaseUser.displayName || '',
          phone: profile.phone || '',
          avatar: profile.avatar || null,
          drivingLicense: profile.drivingLicense || null
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      const msg = error.code === 'auth/invalid-credential'
        ? 'Email ou mot de passe incorrect'
        : error.code === 'auth/too-many-requests'
          ? 'Trop de tentatives, réessayez plus tard'
          : 'Erreur de connexion';
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      // Sauvegarder le profil dans Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        avatar: null,
        drivingLicense: null,
        createdAt: new Date().toISOString()
      });
      toast.success('Inscription réussie !');
      return true;
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'Cet email est déjà utilisé'
        : error.code === 'auth/weak-password'
          ? 'Mot de passe trop faible (6 caractères min.)'
          : "Erreur lors de l'inscription";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), updates);
      setUser(prev => ({ ...prev, ...updates }));
      toast.success('Profil mis à jour');
    } catch {
      toast.error('Erreur de mise à jour');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Mot de passe modifié avec succès');
      return true;
    } catch (error) {
      const msg = error.code === 'auth/wrong-password'
        ? 'Mot de passe actuel incorrect'
        : 'Erreur lors du changement de mot de passe';
      toast.error(msg);
      return false;
    }
  };

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
