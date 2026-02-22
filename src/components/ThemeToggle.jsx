import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? <LuSun /> : <LuMoon />}
    </button>
  );
};

export default ThemeToggle;
