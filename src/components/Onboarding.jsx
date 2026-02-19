import { useState } from 'react';
import './Onboarding.css';

const slides = [
  { emoji: '🚗', title: 'Bienvenue sur Stelle Card', desc: 'Louez des véhicules premium en quelques clics.' },
  { emoji: '🔑', title: 'Réservation simple', desc: 'Choisissez votre véhicule, vos dates et réservez instantanément.' },
  { emoji: '⭐', title: 'Service premium', desc: 'Chauffeur disponible, support 24/7 et véhicules entretenus.' }
];

const Onboarding = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);
  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else { localStorage.setItem('onboarding_done', 'true'); onFinish(); }
  };
  const skip = () => { localStorage.setItem('onboarding_done', 'true'); onFinish(); };

  return (
    <div className="onboarding">
      <button className="onboarding-skip" onClick={skip}>Passer</button>
      <div className="onboarding-slide">
        <span className="onboarding-emoji">{slides[current].emoji}</span>
        <h2 className="onboarding-title">{slides[current].title}</h2>
        <p className="onboarding-desc">{slides[current].desc}</p>
      </div>
      <div className="onboarding-dots">
        {slides.map((_, i) => (<span key={i} className={`onboarding-dot ${i === current ? 'onboarding-dot--active' : ''}`} />))}
      </div>
      <button className="onboarding-next" onClick={next}>
        {current < slides.length - 1 ? 'Suivant' : 'Commencer'}
      </button>
    </div>
  );
};

export default Onboarding;
