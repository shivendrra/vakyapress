import React from 'react';
import { SiteContent, PageContent } from '../../types';

interface PagesTabProps {
  siteContent: SiteContent;
  editingPage: string | null;
  setEditingPage: React.Dispatch<React.SetStateAction<string | null>>;
  handlePageContentChange: (slug: string, field: keyof PageContent, value: string) => void;
  handleSavePageContent: () => Promise<void>;
  pageLabels: Record<string, string>;
  isSaving: boolean;
}

const PagesTab: React.FC<PagesTabProps> = ({
  siteContent,
  editingPage,
  setEditingPage,
  handlePageContentChange,
  handleSavePageContent,
  pageLabels,
  isSaving
}) => {
  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1 space-y-2 border-r border-gray-200 pr-6">
        <h3 className="font-sans font-bold uppercase text-sm text-gray-400 mb-4">Select Page</h3>
        {Object.entries(pageLabels).map(([slug, label]) => (
          <button
            key={slug}
            onClick={() => setEditingPage(slug)}
            className={`block w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-widest ${editingPage === slug ? 'bg-vakya-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="md:col-span-3">
        {editingPage && siteContent.pages[editingPage] ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-3xl">{pageLabels[editingPage]}</h2>
              <button onClick={handleSavePageContent} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black">
                {isSaving ? 'Saving...' : 'Save Page Content'}
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Page Title</label>
              <input
                className="w-full p-3 border border-gray-300 font-sans text-xl font-bold bg-white text-black"
                value={siteContent.pages[editingPage].title}
                onChange={e => handlePageContentChange(editingPage, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
              <textarea
                className="w-full p-4 border border-gray-300 font-sans text-sm h-[500px] bg-white text-black"
                value={siteContent.pages[editingPage].content}
                onChange={e => handlePageContentChange(editingPage, 'content', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a page from the sidebar to edit content.
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesTab;