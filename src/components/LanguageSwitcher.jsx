import { useState, useRef, useEffect } from 'react';
import { LuGlobe } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button className="lang-switcher-btn" onClick={() => setOpen(!open)} aria-label="Language">
        <span className="lang-switcher-flag">{currentLang.flag}</span>
      </button>
      {open && (
        <div className="lang-switcher-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-switcher-option ${i18n.language === lang.code ? 'lang-switcher-option--active' : ''}`}
              onClick={() => handleChange(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
