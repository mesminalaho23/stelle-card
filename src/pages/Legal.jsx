import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './Legal.css';

const faqItems = [
  { q: 'Comment réserver un véhicule ?', a: 'Choisissez un véhicule, sélectionnez la durée et les dates, puis validez votre réservation.' },
  { q: 'Puis-je annuler ma réservation ?', a: 'Oui, annulation gratuite jusqu\'à 24h avant la prise en charge depuis "Mes Réservations".' },
  { q: 'Le chauffeur est-il inclus ?', a: 'Le chauffeur est une option avec un supplément de 30% sur le tarif de base.' },
  { q: 'Quels documents sont nécessaires ?', a: 'Un permis de conduire valide, une pièce d\'identité et une carte bancaire au nom du conducteur.' },
  { q: 'Y a-t-il une caution ?', a: 'Une empreinte de carte bancaire est requise. Montant : 500€ à 3000€ selon le véhicule.' },
  { q: 'Comment contacter le support ?', a: 'Par téléphone au +33 1 42 56 78 90 (24/7), par email à support@stellecard.com, ou via le chat.' }
];

const Legal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}><FiArrowLeft /></button>
          <h1 className="legal-title">Informations légales</h1>
        </div>
        <div className="legal-tabs slide-up">
          {[{id:'cgu',label:'CGU'},{id:'privacy',label:'Confidentialité'},{id:'faq',label:'FAQ'}].map(tab => (
            <button key={tab.id} className={`legal-tab ${activeTab === tab.id ? 'legal-tab--active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        <div className="legal-content slide-up">
          {activeTab === 'cgu' && (
            <div className="legal-text">
              <h2>Conditions Générales d'Utilisation</h2>
              <p>Bienvenue sur Stelle Card. En utilisant notre service, vous acceptez les présentes conditions.</p>
              <h3>1. Objet</h3><p>Stelle Card propose un service de location de véhicules avec ou sans chauffeur.</p>
              <h3>2. Conditions de location</h3><p>Le locataire doit être âgé d'au moins 21 ans et titulaire d'un permis valide depuis 2 ans minimum. Un dépôt de garantie sera demandé.</p>
              <h3>3. Tarification</h3><p>Les prix incluent l'assurance de base, le kilométrage illimité et l'assistance 24/7.</p>
              <h3>4. Annulation</h3><p>Annulation gratuite plus de 24h avant. En deçà, frais de 50%.</p>
              <h3>5. Responsabilité</h3><p>Le locataire est responsable du véhicule pendant toute la durée de la location.</p>
            </div>
          )}
          {activeTab === 'privacy' && (
            <div className="legal-text">
              <h2>Politique de Confidentialité</h2>
              <p>Stelle Card s'engage à protéger vos données personnelles conformément au RGPD.</p>
              <h3>Données collectées</h3><p>Nom, email, téléphone, permis de conduire et informations de paiement.</p>
              <h3>Utilisation</h3><p>Gestion des réservations, communication et amélioration de la plateforme.</p>
              <h3>Vos droits</h3><p>Accès, rectification, suppression et portabilité. Contact : privacy@stellecard.com.</p>
            </div>
          )}
          {activeTab === 'faq' && (
            <div className="faq-list">
              <h2>Questions fréquentes</h2>
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
