import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCar, LuCalendarCheck, LuShieldCheck } from 'react-icons/lu';
import './Onboarding.css';

const Onboarding = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation();

  const slides = [
    { icon: <LuCar />, color: '#3b82f6', title: t('onboarding.slide1Title'), desc: t('onboarding.slide1Desc') },
    { icon: <LuCalendarCheck />, color: '#10b981', title: t('onboarding.slide2Title'), desc: t('onboarding.slide2Desc') },
    { icon: <LuShieldCheck />, color: '#f59e0b', title: t('onboarding.slide3Title'), desc: t('onboarding.slide3Desc') }
  ];

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else { localStorage.setItem('onboarding_done', 'true'); onFinish(); }
  };
  const skip = () => { localStorage.setItem('onboarding_done', 'true'); onFinish(); };

  return (
    <div className="onboarding">
      <button className="onboarding-skip" onClick={skip}>{t('onboarding.skip')}</button>
      <div className="onboarding-slide">
        <div className="onboarding-icon-wrapper" style={{ background: `${slides[current].color}15`, color: slides[current].color }}>
          {slides[current].icon}
        </div>
        <h2 className="onboarding-title">{slides[current].title}</h2>
        <p className="onboarding-desc">{slides[current].desc}</p>
      </div>
      <div className="onboarding-dots">
        {slides.map((_, i) => (<span key={i} className={`onboarding-dot ${i === current ? 'onboarding-dot--active' : ''}`} />))}
      </div>
      <button className="onboarding-next" onClick={next}>
        {current < slides.length - 1 ? t('onboarding.next') : t('onboarding.start')}
      </button>
    </div>
  );
};

export default Onboarding;