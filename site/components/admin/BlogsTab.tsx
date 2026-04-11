import React from 'react';
import { Blog } from '../../types';

interface BlogsTabProps {
  blogs: Blog[];
  editingBlog: Blog | null;
  setEditingBlog: React.Dispatch<React.SetStateAction<Blog | null>>;
  handleSaveBlog: () => Promise<void>;
  handleDeleteBlog: (id: string) => Promise<void>;
  createNewBlog: () => void;
  isSaving: boolean;
  dateToInputString: (dateString: string) => string;
}

const BlogsTab: React.FC<BlogsTabProps> = ({
  blogs,
  editingBlog,
  setEditingBlog,
  handleSaveBlog,
  handleDeleteBlog,
  createNewBlog,
  isSaving,
  dateToInputString
}) => {
  return (
    <div>
      {!editingBlog ? (
        <>
          <div className="flex justify-between mb-8 items-center">
            <h2 className="font-serif text-3xl">Manage Blogs</h2>
            <button onClick={createNewBlog} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
              + New Blog
            </button>
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Title</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Domain</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-serif text-xl">{blog.title}</td>
                    <td className="p-4 font-sans text-sm text-gray-600">{blog.domain}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setEditingBlog(blog)} className="text-black font-bold text-xs uppercase hover:text-vakya-salmon mr-4 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="text-gray-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Delete</button>
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
            <h2 className="font-serif text-3xl">Blog Editor</h2>
            <div className="flex gap-4">
              <button onClick={() => setEditingBlog(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
              <button onClick={handleSaveBlog} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                {isSaving ? 'Saving...' : 'Save Blog'}
              </button>
            </div>
          </div>
          {/* Blog Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
              <input className="w-full p-3 border border-gray-300 font-sans text-xl font-bold bg-white text-black" value={editingBlog.title} onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Domain</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingBlog.domain} onChange={e => setEditingBlog({ ...editingBlog, domain: e.target.value })} placeholder="e.g. Tech, Inspiration" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Publish Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 bg-white text-black font-sans"
                value={dateToInputString(editingBlog.publishedAt)}
                onChange={e => setEditingBlog({ ...editingBlog, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author Name</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingBlog.author} onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author Role / Company</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingBlog.authorRole || ''} onChange={e => setEditingBlog({ ...editingBlog, authorRole: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author Image URL</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingBlog.authorImage || ''} onChange={e => setEditingBlog({ ...editingBlog, authorImage: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Cover Image URL (16:9)</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingBlog.coverImage} onChange={e => setEditingBlog({ ...editingBlog, coverImage: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt</label>
              <textarea rows={2} className="w-full p-3 border border-gray-300 font-sans bg-white text-black" value={editingBlog.excerpt} onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
              <textarea rows={15} className="w-full p-3 border border-gray-300 font-sans text-sm bg-white text-black" value={editingBlog.content} onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsTab;
