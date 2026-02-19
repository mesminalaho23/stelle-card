import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiArrowRight, FiShield, FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import VehicleCard from '../components/VehicleCard';
import { getFeaturedVehicles, categories } from '../services/vehicleService';
import logoImg from '../assets/Logo Stelle Card.png';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    category: ''
  });

  const featuredVehicles = getFeaturedVehicles(6);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.set('search', searchData.location);
    if (searchData.startDate) params.set('startDate', searchData.startDate);
    if (searchData.endDate) params.set('endDate', searchData.endDate);
    if (searchData.category) params.set('category', searchData.category);
    navigate(`/vehicles?${params.toString()}`);
  };

  const features = [
    {
      icon: <FiShield />,
      title: t('features.fleet'),
      desc: t('features.fleetDesc')
    },
    {
      icon: <FiDollarSign />,
      title: t('features.pricing'),
      desc: t('features.pricingDesc')
    },
    {
      icon: <FiClock />,
      title: t('features.support'),
      desc: t('features.supportDesc')
    },
    {
      icon: <FiCheckCircle />,
      title: t('features.easyBook'),
      desc: t('features.easyBookDesc')
    }
  ];

  return (
    <div className="home-page">
      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <img src={logoImg} alt="Stelle Card" className="hero-logo-img" />
            <p className="hero-title">
              {t('home.title')}
            </p>
            <p className="hero-subtitle">
              {t('home.subtitle')}
            </p>

            {/* Search Form */}
            <motion.form
              className="hero-search-form"
              onSubmit={handleSearch}
              variants={fadeUp}
              custom={1}
            >
              <div className="search-field">
                <FiMapPin className="field-icon" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                />
              </div>

              <div className="search-field">
                <FiCalendar className="field-icon" />
                <input
                  type="date"
                  placeholder="Date de début"
                  value={searchData.startDate}
                  onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                />
              </div>

              <div className="search-field">
                <FiCalendar className="field-icon" />
                <input
                  type="date"
                  placeholder="Date de fin"
                  value={searchData.endDate}
                  onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                />
              </div>

              <button type="submit" className="search-btn">
                <FiSearch />
                <span>{t('home.search')}</span>
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="categories-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {t('home.categories')}
          </motion.h2>

          <div className="categories-grid">
            {categories.filter(cat => cat.id !== 'all').map((category, index) => (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <Link
                  to={`/vehicles?category=${category.id}`}
                  className="category-card"
                >
                  <span className="category-icon">{category.icon}</span>
                  <h3 className="category-label">{category.label}</h3>
                  <FiArrowRight className="category-arrow" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles ── */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="section-header">
              <div>
                <h2 className="section-title section-title--left">{t('home.featured')}</h2>
                <p className="section-subtitle">{t('home.featuredSub')}</p>
              </div>
              <Link to="/vehicles" className="see-all-btn">
                {t('home.seeAll')}
                <FiArrowRight />
              </Link>
            </div>

            <div className="vehicles-grid">
              {featuredVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features / Why Choose Us ── */}
      <section className="features-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {t('home.whyUs')}
          </motion.h2>

          <div className="features-grid">
            {features.map((feat, index) => (
              <motion.div
                className="feature-card"
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
