import React from 'react';
import { SiteContent, Video } from '../../types';

interface LanderTabProps {
  siteContent: SiteContent;
  handleVideoChange: (id: number, field: keyof Video, value: string) => void;
  autoFetchVideoDetails: (id: number, url: string) => Promise<void>;
  fetchingVideoId: number | null;
  persistChanges: () => Promise<void>;
  isSaving: boolean;
}

const LanderTab: React.FC<LanderTabProps> = ({
  siteContent,
  handleVideoChange,
  autoFetchVideoDetails,
  fetchingVideoId,
  persistChanges,
  isSaving
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl">Front Page Videos</h2>
        <button onClick={persistChanges} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black">
          {isSaving ? 'Saving All Changes...' : 'Save Changes'}
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {siteContent.videos.map(video => (
          <div key={video.id} className="bg-white border border-gray-200 p-4">
            <div className="mb-4 aspect-video bg-gray-100 relative">
              <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">YouTube URL</label>
                <div className="flex gap-2">
                  <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" value={video.url} onChange={e => handleVideoChange(video.id, 'url', e.target.value)} />
                  <button onClick={() => autoFetchVideoDetails(video.id, video.url)} className="bg-gray-100 p-2 hover:bg-gray-200" title="Auto-fill details">
                    {fetchingVideoId === video.id ? '...' : 'AI'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Title</label>
                <input className="w-full p-2 border border-gray-300 text-sm font-bold bg-white text-black font-sans" value={video.title} onChange={e => handleVideoChange(video.id, 'title', e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Duration</label>
                  <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" value={video.duration} onChange={e => handleVideoChange(video.id, 'duration', e.target.value)} />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
                  <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" value={video.type} onChange={e => handleVideoChange(video.id, 'type', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanderTab;