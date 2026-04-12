import React from 'react';
import { Article, StaffProfile } from '../../types';

interface ArticlesTabProps {
  articles: Article[];
  editingArticle: Article | null;
  setEditingArticle: React.Dispatch<React.SetStateAction<Article | null>>;
  tagsInput: string;
  setTagsInput: React.Dispatch<React.SetStateAction<string>>;
  handleSaveArticle: () => Promise<void>;
  handleDeleteArticle: (id: string) => Promise<void>;
  createNewArticle: () => void;
  isSaving: boolean;
  dateToInputString: (dateString: string) => string;
  ARTICLE_CATEGORIES: string[];
  staffList: StaffProfile[];
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  editingArticle,
  setEditingArticle,
  tagsInput,
  setTagsInput,
  handleSaveArticle,
  handleDeleteArticle,
  createNewArticle,
  isSaving,
  dateToInputString,
  ARTICLE_CATEGORIES,
  staffList
}) => {
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStaffName = e.target.value;
    const staff = staffList.find(s => s.name === selectedStaffName);
    if (staff && editingArticle) {
      setEditingArticle({
        ...editingArticle,
        author: staff.name,
        imageUrl: staff.image || `https://ui-avatars.com/api/?name=${staff.name}`
      });
    } else if (editingArticle) {
      setEditingArticle({ ...editingArticle, author: selectedStaffName });
    }
  };
  return (
    <div>
      {!editingArticle ? (
        <>
          <div className="flex justify-between mb-8 items-center">
            <h2 className="font-serif text-3xl">Manage Articles</h2>
            <button onClick={createNewArticle} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
              + New Article
            </button>
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Title</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Category</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-serif text-xl">{article.title}</td>
                    <td className="p-4 font-sans text-sm text-gray-600">{article.category}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setEditingArticle(article)} className="text-black font-bold text-xs uppercase hover:text-vakya-salmon mr-4 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="text-gray-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl">Editor</h2>
            <div className="flex gap-4">
              <button onClick={() => setEditingArticle(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
              <button onClick={handleSaveArticle} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                {isSaving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
          {/* Article Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
              <input className="w-full p-3 border border-gray-300 font-sans text-xl font-bold bg-white text-black" value={editingArticle.title} onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
              <select className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingArticle.category} onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}>
                {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Publish Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 bg-white text-black font-sans"
                value={dateToInputString(editingArticle.publishedAt)}
                onChange={e => setEditingArticle({ ...editingArticle, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author (Link to Staff Profile)</label>
              <input
                list="staff-authors-articles"
                className="w-full p-3 border border-gray-300 bg-white text-black font-sans"
                value={editingArticle.author}
                onChange={handleAuthorChange}
                placeholder="Start typing author name..."
              />
              <datalist id="staff-authors-articles">
                {staffList.map(staff => <option key={staff.id} value={staff.name} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image URL</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingArticle.imageUrl} onChange={e => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tags</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Climate Change, Policy..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt</label>
              <textarea rows={2} className="w-full p-3 border border-gray-300 font-sans bg-white text-black" value={editingArticle.excerpt} onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
              <textarea rows={15} className="w-full p-3 border border-gray-300 font-sans text-sm bg-white text-black" value={editingArticle.content} onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesTab;
