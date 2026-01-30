import React from 'react';
import { ViewState, PageContent } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface StaticPageProps {
  type: ViewState;
  content?: PageContent;
}

const formatDate = (dateInput: string | Date): string => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return String(dateInput);
    }
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
};

const StaticPage: React.FC<StaticPageProps> = ({ type, content }) => {
  // If content is provided via props (from Admin state), render it
  if (content) {
      return (
        <div className="min-h-screen bg-white pb-24 pt-40 md:pt-48">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-5xl md:text-6xl mb-16 pb-8 border-b border-black leading-tight">{content.title}</h1>
                <div className="font-sans text-lg leading-relaxed text-gray-800">
                    <MarkdownRenderer content={content.content} />
                </div>
                <p className="mt-24 text-xs text-gray-400 font-sans font-bold uppercase tracking-widest border-t border-gray-100 pt-8">
                    Last updated: {formatDate(content.lastUpdated || new Date())} • Vakya Press LLC
                </p>
            </div>
        </div>
      );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-white py-24 flex items-center justify-center pt-40">
        <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 capitalize text-gray-300">{type.replace('_', ' ')}</h1>
            <p className="font-sans text-sm font-bold uppercase tracking-widest text-gray-400">Content pending update</p>
        </div>
    </div>
  );
};

export default StaticPage;