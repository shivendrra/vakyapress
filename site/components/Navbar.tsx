import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import { signOutUser } from '../services/firebase';

interface NavbarProps {
  user: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
    window.location.reload();
  };

  const navLinks: { label: string; path: string }[] = [
    { label: 'Articles', path: '/articles' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Store', path: '/store' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Determine styles based on state
  const isTransparent = isLandingPage && !isScrolled;
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
      ? 'bg-transparent border-transparent py-4'
      : 'bg-white/95 backdrop-blur-md border-b border-black/5 py-0 shadow-sm'
    }`;

  const textColorClass = isTransparent ? 'text-white' : 'text-gray-800';
  const logoFilter = isTransparent ? 'brightness(0) invert(1)' : 'none';
  const buttonClass = isTransparent
    ? 'bg-white text-vakya-black hover:bg-gray-200'
    : 'bg-vakya-black text-white hover:bg-gray-800';

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-24 h-24 md:w-28 md:h-28 relative flex items-center">
              <img
                src="https://raw.githubusercontent.com/shivendrra/vakypress/dev/assets/VakyaLogo7.png"
                alt="Vakya"
                className="w-full h-full object-contain transition-all duration-300"
                style={{ filter: logoFilter }}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`font-sans text-sm uppercase tracking-widest transition-colors ${isActive(link.path)
                    ? (isTransparent ? 'font-bold text-white border-b-2 border-white' : 'font-bold text-black border-b-2 border-black')
                    : (isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black')
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* User Dropdown or Login Button */}
            <div className={`ml-4 border-l pl-8 ${isTransparent ? 'border-white/30' : 'border-gray-200'}`}>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center gap-2 font-sans font-bold text-sm uppercase tracking-widest transition-colors focus:outline-none ${textColorClass}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTransparent ? 'bg-white text-vakya-black' : 'bg-vakya-black text-white'}`}>
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <span>{user.displayName}</span>
                    <svg className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 rounded-md py-1 animate-fade-in z-50 text-gray-800">
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-sans">
                          Dashboard
                        </Link>
                      )}
                      {user.role === 'writer' && (
                        <Link to="/writer" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-sans">
                          Author Profile
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-sans">
                        Account Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-sans font-bold">
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className={`px-5 py-2 font-sans text-sm uppercase tracking-widest transition-colors ${buttonClass}`}
                >
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColorClass} focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-black">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 font-sans uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-vakya-black font-sans bg-gray-50"
                >
                  Login / Signup
                </Link>
              ) : (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 font-sans">Dashboard</Link>
                  )}
                  {user.role === 'writer' && (
                    <Link to="/writer" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 font-sans">Author Profile</Link>
                  )}
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 font-sans">Settings</Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-vakya-salmon font-sans"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;