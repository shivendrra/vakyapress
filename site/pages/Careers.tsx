import React, { useState } from 'react';
import { JobPosting } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface CareersProps {
    jobs: JobPosting[];
}

const Careers: React.FC<CareersProps> = ({ jobs }) => {
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

    return (
        <div className="min-h-screen bg-vakya-paper">
            {/* Hero */}
            <div className="bg-vakya-black text-white py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-serif text-6xl mb-6">Join the Newsroom</h1>
                    <p className="font-sans text-lg text-gray-400 max-w-2xl mx-auto">
                        Vakya is looking for curious, relentless, and principled individuals to help us build the future of independent journalism.
                    </p>
                </div>
            </div>

            {/* Job Listings */}
            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="grid gap-8">
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <div key={job.id} className="bg-white border border-gray-200 p-8 hover:border-black transition-colors cursor-pointer group" onClick={() => setSelectedJob(job)}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <h3 className="font-serif text-3xl group-hover:underline decoration-1 underline-offset-4">{job.title}</h3>
                                    <div className="flex gap-3 mt-2 md:mt-0">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">{job.location}</span>
                                        <span className="bg-vakya-accent text-black px-3 py-1 text-xs font-bold uppercase tracking-widest">{job.type}</span>
                                    </div>
                                </div>
                                <p className="font-sans text-gray-600 mb-6">{job.shortDescription}</p>
                                <div className="flex items-center text-vakya-salmon font-bold text-sm uppercase tracking-widest">
                                    Read more 
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <p className="font-serif text-2xl">No open positions at the moment.</p>
                            <p className="font-sans mt-2">Check back later or email us your resume.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up flex flex-col">
                        <div className="p-8 md:p-12">
                            <button 
                                onClick={() => setSelectedJob(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div className="mb-8 border-b border-gray-100 pb-8">
                                <h2 className="font-serif text-5xl mb-4">{selectedJob.title}</h2>
                                <div className="flex flex-wrap gap-4 text-sm font-sans text-gray-500">
                                    <span>{selectedJob.location}</span>
                                    <span>•</span>
                                    <span>{selectedJob.type}</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-gray-400 mb-3">About the Role</h4>
                                    <MarkdownRenderer content={selectedJob.longDescription} />
                                </div>

                                <div>
                                    <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-gray-400 mb-3">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills.split(',').map((skill, i) => (
                                            <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <button className="w-full bg-vakya-black text-white py-4 font-sans font-bold uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                                    Apply for this Position
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Please have your resume and portfolio ready.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Careers;