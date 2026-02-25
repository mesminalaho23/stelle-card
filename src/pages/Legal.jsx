import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import './Legal.css';

const Legal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    { q: t('legal.faq1q'), a: t('legal.faq1a') },
    { q: t('legal.faq2q'), a: t('legal.faq2a') },
    { q: t('legal.faq3q'), a: t('legal.faq3a') },
    { q: t('legal.faq4q'), a: t('legal.faq4a') },
    { q: t('legal.faq5q'), a: t('legal.faq5a') },
    { q: t('legal.faq6q'), a: t('legal.faq6a') },
  ];

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}><LuArrowLeft /></button>
          <h1 className="legal-title">{t('legal.title')}</h1>
        </div>
        <div className="legal-tabs slide-up">
          {[{id:'cgu',label:t('legal.cgu')},{id:'privacy',label:t('legal.privacy')},{id:'faq',label:t('legal.faq')}].map(tab => (
            <button key={tab.id} className={`legal-tab ${activeTab === tab.id ? 'legal-tab--active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        <div className="legal-content slide-up">
          {activeTab === 'cgu' && (
            <div className="legal-text">
              <h2>{t('legal.cguTitle')}</h2>
              <p>{t('legal.cguIntro')}</p>
              <h3>{t('legal.cguObj')}</h3><p>{t('legal.cguObjText')}</p>
              <h3>{t('legal.cguConditions')}</h3><p>{t('legal.cguConditionsText')}</p>
              <h3>{t('legal.cguPricing')}</h3><p>{t('legal.cguPricingText')}</p>
              <h3>{t('legal.cguCancel')}</h3><p>{t('legal.cguCancelText')}</p>
              <h3>{t('legal.cguResponsibility')}</h3><p>{t('legal.cguResponsibilityText')}</p>
            </div>
          )}
          {activeTab === 'privacy' && (
            <div className="legal-text">
              <h2>{t('legal.privacyTitle')}</h2>
              <p>{t('legal.privacyIntro')}</p>
              <h3>{t('legal.privacyData')}</h3><p>{t('legal.privacyDataText')}</p>
              <h3>{t('legal.privacyUsage')}</h3><p>{t('legal.privacyUsageText')}</p>
              <h3>{t('legal.privacyRights')}</h3><p>{t('legal.privacyRightsText')}</p>
            </div>
          )}
          {activeTab === 'faq' && (
            <div className="faq-list">
              <h2>{t('legal.faqTitle')}</h2>
              {faqItems.map((item, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <p className="faq-answer">{item.a}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Legal;