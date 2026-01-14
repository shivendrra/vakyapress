import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-vakya-paper text-center px-4">
      {/* Abstract Background Element */}
      <div className="absolute font-serif text-[15rem] text-gray-200/50 leading-none select-none pointer-events-none z-0 blur-sm">
        404
      </div>
      
      <div className="relative z-10">
        <h2 className="font-serif text-5xl mb-6 text-vakya-black">Page Not Found</h2>
        <div className="w-16 h-1 bg-vakya-salmon mx-auto mb-8"></div>
        <p className="font-sans text-gray-600 max-w-md mb-10 text-lg leading-relaxed">
          The story you are looking for hasn't been written yet, has been redacted, or never existed in the first place.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-vakya-black text-white px-8 py-4 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors border border-transparent hover:border-black"
        >
          Return to Front Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;