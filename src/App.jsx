import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Splash from './components/Splash';
import Onboarding from './components/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import './styles/global.css';
import './App.css';

// Lazy load pages
const VehicleList = lazy(() => import('./pages/VehicleList'));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'));
const Booking = lazy(() => import('./pages/Booking'));
const Payment = lazy(() => import('./pages/Payment'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Compare = lazy(() => import('./pages/Compare'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Agencies = lazy(() => import('./pages/Agencies'));
const Legal = lazy(() => import('./pages/Legal'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex-center" style={{ minHeight: '60vh' }}>
    <div className="spinner"></div>
  </div>
);

function App() {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_done')
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <FavoritesProvider>
            {showSplash && <Splash onFinish={handleSplashFinish} />}
            {!showSplash && showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
            <Router>
              <div className="app">
                <Navbar />

                <main className="main-content">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/vehicles" element={<VehicleList />} />
                      <Route path="/vehicles/:id" element={<VehicleDetails />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/agencies" element={<Agencies />} />
                      <Route path="/legal" element={<Legal />} />

                      {/* Protected Routes */}
                      <Route path="/booking" element={
                        <ProtectedRoute><Booking /></ProtectedRoute>
                      } />
                      <Route path="/payment" element={
                        <ProtectedRoute><Payment /></ProtectedRoute>
                      } />
                      <Route path="/my-rentals" element={
                        <ProtectedRoute><MyBookings /></ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute><Settings /></ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
                      } />

                      {/* 404 */}
                      <Route path="*" element={
                        <div className="not-found">
                          <h1 className="not-found__code">404</h1>
                          <p className="not-found__text">Page not found</p>
                        </div>
                      } />
                    </Routes>
                  </Suspense>
                </main>

                {/* Footer */}
                <footer className="app-footer">
                  <div className="footer-links">
                    <a href="/agencies">{t('footer.agencies')}</a>
                    <a href="/legal">{t('footer.legal')}</a>
                  </div>
                  <p>&copy; 2025 STELLE CARD. Premium Mobility.</p>
                </footer>

                {/* Bottom Navigation — Mobile */}
                <BottomNav />

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1A1D23',
                      color: '#F1F1F1',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                    },
                    success: {
                      iconTheme: { primary: '#C9A84C', secondary: '#0F1014' },
                    },
                    error: {
                      iconTheme: { primary: '#E53E3E', secondary: '#0F1014' },
                    },
                  }}
                />
              </div>
            </Router>
          </FavoritesProvider>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
