import React from 'react';
import { ViewState, PageContent } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface StaticPageProps {
  type: ViewState;
  content?: PageContent;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, content }) => {
  // If content is provided via props (from Admin state), render it
  if (content) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl mb-12 pb-8 border-b border-black">{content.title}</h1>
          <MarkdownRenderer content={content.content} />
          <p className="mt-16 text-sm text-gray-400 font-sans italic border-t border-gray-100 pt-6">Last updated: Oct 2024 • Vakya Press LLC</p>
        </div>
      </div>
    );
  }

  // Fallback
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