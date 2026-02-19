import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { agencyService } from '../services/AgencyService';
import './Agencies.css';

const Agencies = () => {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    agencyService.getAll().then(setAgencies);
  }, []);

  return (
    <div className="agencies-page">
      <div className="container">
        <div className="agencies-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}><FiArrowLeft /></button>
          <div>
            <h1 className="agencies-title">Nos Agences</h1>
            <p className="agencies-subtitle">{agencies.length} agences en France</p>
          </div>
        </div>
        <div className="agencies-grid">
          {agencies.map((a, i) => (
            <div key={a.id} className="agency-card slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <img src={a.image} alt={a.name} className="agency-img" />
              <div className="agency-body">
                <h3 className="agency-name">{a.name}</h3>
                <div className="agency-info-row"><FiMapPin className="agency-icon" /><span>{a.address}</span></div>
                <div className="agency-info-row"><FiPhone className="agency-icon" /><span>{a.phone}</span></div>
                <div className="agency-info-row"><FiClock className="agency-icon" /><span>{a.hours}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agencies;
