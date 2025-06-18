import { Moon, Sun} from 'lucide-react';
import { useTheme } from '../context/theme-provider';
import { useLanguage } from '../context/language-provider';
import { Link } from 'react-router-dom';
import { CitySearch } from './city-search';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Only two options: light and dark, default is dark
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "kn" : "en");
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2  supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link to="/">
          <img src={theme === 'dark' ? '/logo.png' : 'logo2.png'} alt="climate logo" className='h-14' />
        </Link>
        <div className='flex items-center gap-2 sm:gap-4 w-auto'>
          {/* Search  */}
          <div className="max-w-[140px] sm:max-w-xs flex-shrink">
            <CitySearch />
          </div>
          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="px-2 py-1 rounded border text-xs font-semibold bg-background hover:bg-muted transition"
            aria-label="Toggle language"
          >
            {language === "en" ? "ಕನ್ನಡ" : "English"}
          </button>
          {/* Theme Toggle */}
          <div
            onClick={handleThemeToggle}
            className={`flex items-center cursor-pointer ml-2 sm:ml-4 transition-transform duration-500`}
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? (
              <Sun className='h-6 w-6 text-yellow-500' />
            ) : (
              <Moon className='h-6 w-6 text-blue-500' />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;