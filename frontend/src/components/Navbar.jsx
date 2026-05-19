import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LogIn, Menu, LogOut, LayoutDashboard, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { translations } from '../utils/translations';

const Navbar = () => {
  const { user, logout, language } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language] || translations.en;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glassmorphism rounded-none mx-0 px-6 py-4 flex justify-between items-center bg-white dark:bg-zinc-950 border-b border-gray-150 dark:border-zinc-900 transition-colors duration-300"
    >
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-kisan-green dark:text-kisan-green-light font-bold text-2xl leading-none">
          <Leaf size={28} className="translate-y-[-1px]" />
          KisanSetu
        </Link>
        {user && (
          <>
            <span className="text-gray-300 dark:text-zinc-700 text-lg font-light select-none">|</span>
            <Link 
              to="/dashboard" 
              className="text-xs text-gray-500 dark:text-zinc-400 hover:text-kisan-green dark:hover:text-kisan-green-light font-extrabold transition-colors flex items-center gap-1.5 uppercase tracking-wider leading-none mt-0.5"
            >
              <LayoutDashboard size={12} /> {t.dashboard}
            </Link>
          </>
        )}
      </div>
      
      {/* Mid navigation links completely removed for a sleek, focused header experience */}
      <div className="hidden md:flex gap-6 items-center font-medium" />

      <div className="hidden md:flex gap-4 items-center">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-kisan-green dark:hover:text-kisan-green-light transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-800"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user ? (
          <div className="relative profile-dropdown-container">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 border border-gray-100 dark:border-zinc-800 transition-all focus:outline-none"
            >
              {user.profileImage || user.avatar ? (
                <img 
                  src={user.profileImage || user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover border border-kisan-green/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-kisan-green text-white flex items-center justify-center font-bold border border-kisan-green/20 text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <ChevronDown size={14} className={`text-gray-500 dark:text-zinc-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl py-3 px-4 z-50"
              >
                <div className="mb-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate uppercase tracking-wider font-extrabold mt-0.5">
                    {user.role === 'admin' ? 'Govt Admin' : 'Farmer'}
                  </p>
                </div>
                <div className="h-[1px] bg-gray-100 dark:bg-zinc-800 my-2" />
                <div className="flex flex-col gap-1.5">
                  <Link 
                    to="/dashboard/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="text-xs text-gray-700 dark:text-zinc-300 hover:text-kisan-green dark:hover:text-kisan-green-light font-bold flex items-center gap-2 py-1.5 transition-colors"
                  >
                    <User size={14} /> Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-2 py-1.5 transition-colors border-t border-gray-100 dark:border-zinc-800 mt-1 pt-2 w-full text-left"
                  >
                    <LogOut size={14} /> {t.logout}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-kisan-green dark:text-kisan-green-light hover:text-kisan-green-dark font-bold text-sm flex items-center gap-1">
              <LogIn size={18} /> {t.login}
            </Link>
            <Link to="/register" className="bg-kisan-green text-white px-5 py-2.5 rounded-full hover:bg-kisan-green-dark transition-all flex items-center gap-1 font-bold text-sm">
              <User size={18} /> {t.register}
            </Link>
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center gap-3">
        {/* Mobile Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 dark:text-zinc-400"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <Menu size={28} className="text-kisan-green dark:text-kisan-green-light" />
      </div>
    </motion.nav>
  );
};

export default Navbar;
