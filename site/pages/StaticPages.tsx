import React from 'react';
import { ViewState, PageContent } from '../types';

interface StaticPageProps {
  type: ViewState;
  content?: PageContent;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, content }) => {
  // If content is provided via props (from Admin state), render it
  // Otherwise, fall back to "Page not found" or default structure
  
  if (content) {
      return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-5xl mb-8">{content.title}</h1>
                <div className="prose prose-lg prose-headings:font-serif prose-a:text-vakya-salmon prose-p:font-sans font-sans text-gray-800 whitespace-pre-line">
                    {content.content}
                </div>
                 <p className="mt-12 text-sm text-gray-400 font-sans italic border-t border-gray-100 pt-4">Last updated: Oct 2024 • Vakya Press LLC</p>
            </div>
        </div>
      );
  }

  // Fallback for pages not in the dynamic state list (like 'pitch' if not added to App state yet)
  // For the purpose of this demo, we assume important pages are in App state.
  return (
    <div className="min-h-screen bg-white py-24 flex items-center justify-center">
        <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 capitalize">{type.replace('_', ' ')}</h1>
            <p className="font-sans text-gray-500">Content is being updated by the editorial team.</p>
        </div>
    </div>
  );
};

export default StaticPage;