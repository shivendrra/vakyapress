import React from 'react';
import { SiteContent, JobPosting } from '../../types';

interface CareersTabProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  handleJobChange: (id: string, field: keyof JobPosting, value: string) => void;
  addNewJob: () => void;
  persistChanges: () => Promise<void>;
  isSaving: boolean;
}

const CareersTab: React.FC<CareersTabProps> = ({
  siteContent,
  setSiteContent,
  handleJobChange,
  addNewJob,
  persistChanges,
  isSaving
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl">Open Positions</h2>
        <div className="flex gap-4">
          <button onClick={addNewJob} className="bg-gray-100 text-black px-4 py-2 font-bold uppercase text-xs hover:bg-gray-200">+ Add Job</button>
          <button onClick={persistChanges} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      <div className="space-y-8">
        {siteContent.jobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Job Title</label>
                <input className="w-full p-2 border border-gray-300 font-sans text-lg bg-white text-black" value={job.title} onChange={e => handleJobChange(job.id, 'title', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Location</label>
                <input className="w-full p-2 border border-gray-300 bg-white text-black font-sans" value={job.location} onChange={e => handleJobChange(job.id, 'location', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
                <select className="w-full p-2 border border-gray-300 bg-white text-black font-sans" value={job.type} onChange={e => handleJobChange(job.id, 'type', e.target.value as any)}>
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Short Description</label>
                <input className="w-full p-2 border border-gray-300 bg-white text-black font-sans" value={job.shortDescription} onChange={e => handleJobChange(job.id, 'shortDescription', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Required Skills (Comma separated)</label>
                <input className="w-full p-2 border border-gray-300 bg-white text-black font-sans" value={job.skills} onChange={e => handleJobChange(job.id, 'skills', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Description (Markdown)</label>
                <textarea rows={6} className="w-full p-2 border border-gray-300 font-sans text-sm bg-white text-black" value={job.longDescription} onChange={e => handleJobChange(job.id, 'longDescription', e.target.value)} />
              </div>
            </div>
            <button onClick={() => setSiteContent(prev => ({ ...prev, jobs: prev.jobs.filter(j => j.id !== job.id) }))} className="text-red-600 text-xs font-bold uppercase hover:underline">Delete Position</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareersTab;
