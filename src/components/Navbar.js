import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Our Treatments', path: '/our-treatments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const isAdminRoute = location.pathname === '/admin';
  const navContainerClass = darkMode
    ? 'border-b border-slate-800 bg-slate-950/95 shadow-sm'
    : 'border-b border-slate-200 bg-white shadow-sm';
  const navLinkInactive = darkMode
    ? 'text-slate-300 hover:text-sky-300'
    : 'text-slate-900 hover:text-sky-600';
  const navLinkActive = darkMode
    ? 'text-sky-300 font-semibold'
    : 'text-sky-600 font-semibold';
  const themeButtonClass = darkMode
    ? 'p-2 rounded-lg bg-slate-700 text-white transition-all hover:scale-110 text-lg md:text-xl'
    : 'p-2 rounded-lg bg-slate-100 text-slate-900 transition-all hover:scale-110 text-lg md:text-xl';

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className={navContainerClass}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/logo.png"
                alt="MSM Dental Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-base md:text-lg text-blue-600 dark:text-blue-400">
                  MSM Dental
                </span>
                <span className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
                  Faciomaxillary Center
                </span>
              </div>
              <span className="sm:hidden font-bold text-base text-blue-600 dark:text-blue-400">
                MSM Dental
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`smooth-underline transition-colors text-sm lg:text-base ${
                    isActive(link.path) ? navLinkActive : navLinkInactive
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Theme & Admin & Hamburger */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={themeButtonClass}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>

              {/* Admin Link */}
              {!isAdminRoute && (
                <Link
                  to="/admin"
                  className="hidden sm:block gradient-btn text-sm px-3 py-2 md:px-4 md:py-2"
                >
                  Admin
                </Link>
              )}

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                  ) : (
                    <>
                      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-3 pb-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-all text-sm md:text-base ${
                    isActive(link.path)
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block gradient-btn text-center text-sm md:text-base"
              >
                Admin
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;