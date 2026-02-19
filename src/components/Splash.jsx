import { useEffect, useState } from 'react';
import logoImg from '../assets/Logo Stelle Card.png';
import './Splash.css';

const Splash = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 1800);
    const timer2 = setTimeout(() => onFinish(), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <img src={logoImg} alt="Stelle Card" className="splash-logo-img" />
          <p className="splash-tagline">Premium Mobility</p>
        </div>
        <div className="splash-loading">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
