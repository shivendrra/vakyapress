import React from 'react';
import { VideoSource } from '../../types';

interface VideoSourcesTabProps {
  videoSources: VideoSource[];
  editingSource: VideoSource | null;
  setEditingSource: React.Dispatch<React.SetStateAction<VideoSource | null>>;
  handleSaveSource: () => Promise<void>;
  handleDeleteSource: (id: string) => Promise<void>;
  createNewSource: () => void;
  isSaving: boolean;
}

const VideoSourcesTab: React.FC<VideoSourcesTabProps> = ({
  videoSources,
  editingSource,
  setEditingSource,
  handleSaveSource,
  handleDeleteSource,
  createNewSource,
  isSaving,
}) => {
  return (
    <div>
      {!editingSource ? (
        <>
          <div className="flex justify-between mb-8 items-center">
            <h2 className="font-serif text-3xl">Manage Video Sources</h2>
            <button onClick={createNewSource} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
              + New Source
            </button>
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Title</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Date</th>
                  <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videoSources.map(source => (
                  <tr key={source.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-serif text-xl">{source.title}</td>
                    <td className="p-4 font-sans text-sm text-gray-600">{new Date(source.date).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setEditingSource(source)} className="text-black font-bold text-xs uppercase hover:text-vakya-salmon mr-4 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteSource(source.id)} className="text-gray-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {videoSources.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 font-sans">No video sources added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl">Video Source Editor</h2>
            <div className="flex gap-4">
              <button onClick={() => setEditingSource(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
              <button onClick={handleSaveSource} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                {isSaving ? 'Saving...' : 'Save Source'}
              </button>
            </div>
          </div>
          {/* Source Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
              <input className="w-full p-3 border border-gray-300 font-sans text-xl font-bold bg-white text-black" value={editingSource.title} onChange={e => setEditingSource({ ...editingSource, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Publish Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 bg-white text-black font-sans"
                value={editingSource.date.split('T')[0]}
                onChange={e => setEditingSource({ ...editingSource, date: new Date(e.target.value).toISOString() })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Video URL (Optional)</label>
              <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingSource.videoUrl} onChange={e => setEditingSource({ ...editingSource, videoUrl: e.target.value })} placeholder="e.g. https://youtube.com/watch?v=..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
              <textarea rows={15} className="w-full p-3 border border-gray-300 font-sans text-sm bg-white text-black" value={editingSource.content} onChange={e => setEditingSource({ ...editingSource, content: e.target.value })} placeholder="List your sources, links, and descriptions here..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSourcesTab;
