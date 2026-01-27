import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vakya-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Logo & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-gray-800 pb-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="cursor-pointer block mb-6">
              <div className="w-20 h-20 relative">
                <img
                  src="https://raw.githubusercontent.com/shivendrra/vakypress/dev/assets/VakyaLogo1.png"
                  alt="Vakya"
                  className="w-26 h-26 object-contain"
                />
              </div>
            </Link>
            {/* <p className="font-sans text-sm text-gray-400 max-w-xs leading-relaxed">
              A modern, simple journalism website focused on storytelling and public good. Unfiltered, unbiased, and unapologetic.
            </p> */}
          </div>

          <div className="flex gap-4 self-start md:self-center">
            <a href="https://www.youtube.com/@vakyapress" target="_blank" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vakya-black transition-colors group" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            <a href="https://www.instagram.com/vakyapress/" target="_blank" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vakya-black transition-colors group" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
            </a>
            <a href="https://www.x.com/vakyapress/" target="_blank" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vakya-black transition-colors group" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.patreon.com/cw/vakya" target="_blank" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vakya-black transition-colors group" aria-label="Patreon">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 .48c0 5.635 5.635 5.635 5.635 5.635V.48zM14.137 0c-5.48 0-9.893 4.414-9.893 9.893 0 5.48 4.414 9.893 9.893 9.893 5.48 0 9.893-4.414 9.893-9.893C24.03 4.414 19.616 0 14.137 0z" /></svg>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans font-bold text-sm uppercase tracking-widest mb-12 text-gray-300">
          <Link to="/about" className="hover:text-white hover:underline decoration-2 underline-offset-4">About Us</Link>
          <span className="text-gray-700">|</span>
          <Link to="/masthead" className="hover:text-white hover:underline decoration-2 underline-offset-4">Masthead</Link>
          <span className="text-gray-700">|</span>
          {/* <Link to="/projects" className="hover:text-white hover:underline decoration-2 underline-offset-4">Projects</Link>
          <span className="text-gray-700">|</span> */}
          <Link to="/ethics" className="hover:text-white hover:underline decoration-2 underline-offset-4">Ethics & Guidelines</Link>
          <span className="text-gray-700">|</span>
          <Link to="/financials" className="hover:text-white hover:underline decoration-2 underline-offset-4">How we make money</Link>
          <span className="text-gray-700">|</span>
          <Link to="/contact" className="hover:text-white hover:underline decoration-2 underline-offset-4">Contact Us</Link>
          <span className="text-gray-700">|</span>
          <Link to="/pitch" className="hover:text-white hover:underline decoration-2 underline-offset-4">How to pitch Vakya</Link>
          <span className="text-gray-700">|</span>
          <Link to="/articles" className="hover:text-white hover:underline decoration-2 underline-offset-4">Archives</Link>
        </div>

        {/* Legal & Secondary Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-dotted border-gray-800">
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-white hover:underline">Privacy Notice</Link>
            <Link to="/terms" className="hover:text-white hover:underline">Terms of Use</Link>
            <Link to="/cookie-policy" className="hover:text-white hover:underline">Cookie Policy</Link>
            <Link to="/privacy-settings" className="hover:text-white hover:underline">Manage Privacy Settings</Link>
            <Link to="/licensing" className="hover:text-white hover:underline">Licensing</Link>
            <Link to="/accessibility" className="hover:text-white hover:underline">Accessibility</Link>
            <Link to="/careers" className="hover:text-white hover:underline">Careers</Link>
          </div>

          <div className="md:text-right font-sans text-xs text-gray-500">
            <p className="mb-2">© 2026 VAKYA PRESS LLC. ALL RIGHTS RESERVED</p>
            <p>Designed for the people, by the people.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;