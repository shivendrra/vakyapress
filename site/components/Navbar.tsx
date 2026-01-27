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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    // { label: 'Projects', path: '/projects' },
    { label: 'Store', path: '/store' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-vakya-paper/95 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-28 h-28 relative">
              <img
                src="https://raw.githubusercontent.com/shivendrra/vakypress/dev/assets/VakyaLogo7.png"
                alt="Vakya"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`font-sans text-sm uppercase tracking-widest hover:text-gray-600 transition-colors ${isActive(link.path) ? 'font-bold border-b-2 border-black' : 'text-gray-800'}`}
              >
                {link.label}
              </Link>
            ))}

            {/* User Dropdown or Login Button */}
            <div className="ml-4 border-l border-gray-200 pl-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 font-sans font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-vakya-black text-white rounded-full flex items-center justify-center">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <span>{user.displayName}</span>
                    <svg className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 rounded-md py-1 animate-fade-in z-50">
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-sans">
                          Dashboard
                        </Link>
                      )}
                      {user.role === 'writer' && (
                        <Link to="/writer" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-sans">
                          Author Profile
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-sans">
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
                  className="bg-vakya-black text-white px-5 py-2 font-sans text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
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
              className="text-gray-800 hover:text-black focus:outline-none"
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
        <div className="md:hidden bg-vakya-paper border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 font-sans"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-vakya-black font-sans bg-vakya-gray"
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