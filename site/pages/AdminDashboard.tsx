import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../services/mockData';
import { SiteContent, Video, PageContent, JobPosting } from '../types';
import { saveSiteContent } from '../services/firebase';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
    siteContent: SiteContent;
    setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ siteContent, setSiteContent }) => {
    const [activeTab, setActiveTab] = useState<'articles' | 'writers' | 'lander' | 'pages' | 'careers'>('articles');
    const [editingPage, setEditingPage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [fetchingVideoId, setFetchingVideoId] = useState<number | null>(null);

    // -- Handlers --

    // Save to Database
    const persistChanges = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            await saveSiteContent(siteContent);
            setSaveMessage({ text: "Changes saved successfully.", type: 'success' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'permission-denied') {
                setSaveMessage({ text: "Permission denied. Admin access required.", type: 'error' });
            } else {
                setSaveMessage({ text: "Error saving content.", type: 'error' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Auto-fetch video details using Gemini
    const autoFetchVideoDetails = async (id: number, url: string) => {
        if (!url || !getYoutubeId(url)) return;
        
        setFetchingVideoId(id);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Analyze this YouTube URL: ${url}. 
            Return a JSON object with two keys: "title" (the exact video title) and "duration" (video duration in MM:SS or HH:MM:SS format). 
            Do not include any other text in the response, just the JSON.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    tools: [{ googleSearch: {} }]
                }
            });
            
            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                setSiteContent(prev => ({
                    ...prev,
                    videos: prev.videos.map(v => {
                        if (v.id === id) {
                            return {
                                ...v,
                                title: data.title || v.title,
                                duration: data.duration || v.duration
                            };
                        }
                        return v;
                    })
                }));
            }
        } catch (error) {
            console.error("AI fetch failed:", error);
        } finally {
            setFetchingVideoId(null);
        }
    };

    const handleVideoChange = (id: number, field: keyof Video, value: string) => {
        setSiteContent(prev => ({
            ...prev,
            videos: prev.videos.map(v => {
                if (v.id !== id) return v;
                
                const updatedVideo = { ...v, [field]: value };
                
                // If URL changed, auto-update thumbnail
                if (field === 'url') {
                    const ytId = getYoutubeId(value);
                    if (ytId) {
                        updatedVideo.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                    }
                }
                return updatedVideo;
            })
        }));
    };

    const handlePageContentChange = (slug: string, field: keyof PageContent, value: string) => {
        setSiteContent(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                [slug]: {
                    ...prev.pages[slug],
                    [field]: value
                }
            }
        }));
    };

    const handleJobChange = (id: string, field: keyof JobPosting, value: string) => {
        setSiteContent(prev => ({
            ...prev,
            jobs: prev.jobs.map(j => j.id === id ? { ...j, [field]: value } : j)
        }));
    };

    const addNewJob = () => {
        const newJob: JobPosting = {
            id: Date.now().toString(),
            title: "New Position",
            shortDescription: "Short summary...",
            longDescription: "Detailed description...",
            skills: "Skills...",
            location: "Remote",
            type: "Full-time"
        };
        setSiteContent(prev => ({ ...prev, jobs: [...prev.jobs, newJob] }));
    };

    const deleteJob = (id: string) => {
        setSiteContent(prev => ({ ...prev, jobs: prev.jobs.filter(j => j.id !== id) }));
    };

    const pageLabels: Record<string, string> = {
        'privacy': 'Privacy Notice',
        'terms': 'Terms of Use',
        'cookie_policy': 'Cookie Policy',
        'privacy_settings': 'Privacy Settings',
        'licensing': 'Licensing',
        'accessibility': 'Accessibility',
        'ethics': 'Ethics & Guidelines',
        'financials': 'Financials',
        'pitch': 'Pitch Guidelines'
    };

    const TAB_LABELS: Record<string, string> = {
        'articles': 'Editorial',
        'writers': 'Staff',
        'lander': 'Front Page',
        'pages': 'Static Pages',
        'careers': 'Careers'
    };

    return (
        <div className="min-h-screen bg-vakya-paper py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b-2 border-black pb-6">
                    <div>
                        <h6 className="font-sans font-bold text-xs tracking-widest uppercase text-gray-500 mb-2">Vakya Press Internal</h6>
                        <h1 className="font-serif text-5xl text-vakya-black">Newsroom Dashboard</h1>
                    </div>
                    {saveMessage && (
                        <div className={`px-4 py-2 text-sm font-bold uppercase tracking-widest animate-fade-in ${
                            saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {saveMessage.text}
                        </div>
                    )}
                </header>

                {/* Navigation Tabs */}
                <div className="flex gap-8 mb-12 border-b border-gray-300 overflow-x-auto pb-1">
                    {Object.keys(TAB_LABELS).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab as any); setSaveMessage(null); }}
                            className={`pb-3 font-sans font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'border-b-4 border-black text-black' 
                                : 'border-b-4 border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>

                {/* Content Container */}
                <div className="min-h-[600px] animate-fade-in">
                    
                    {/* --- ARTICLES TAB --- */}
                    {activeTab === 'articles' && (
                        <div>
                            <div className="flex justify-between mb-8 items-center">
                                <h2 className="font-serif text-3xl">Manage Articles</h2>
                                <button className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                                    + New Article
                                </button>
                            </div>
                            <div className="bg-white border border-gray-200 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Title</th>
                                            <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Author</th>
                                            <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Date</th>
                                            <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Status</th>
                                            <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_ARTICLES.map(article => (
                                            <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="p-4 font-serif text-xl">{article.title}</td>
                                                <td className="p-4 font-sans text-sm text-gray-600">{article.author}</td>
                                                <td className="p-4 font-sans text-sm text-gray-500">{article.publishedAt}</td>
                                                <td className="p-4">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-green-200">Published</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-black font-bold text-xs uppercase hover:text-vakya-salmon mr-4 transition-colors">Edit</button>
                                                    <button className="text-gray-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- WRITERS TAB --- */}
                    {activeTab === 'writers' && (
                        <div>
                            <h2 className="font-serif text-3xl mb-8">Staff Directory</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['Pradyumn', 'Aakash'].map((name, i) => (
                                    <div key={name} className="p-8 bg-white border border-gray-200 flex items-center gap-6 hover:border-black transition-colors group">
                                        <div className="w-16 h-16 bg-vakya-gray text-vakya-black border border-black rounded-full flex items-center justify-center font-serif text-2xl group-hover:bg-vakya-accent transition-colors">{name[0]}</div>
                                        <div>
                                            <h3 className="font-serif text-2xl">{name}</h3>
                                            <p className="text-sm font-sans text-gray-500 mb-2">{name.toLowerCase()}@vakyapress.com</p>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-200">{i === 0 ? 'Admin' : 'Writer'}</span>
                                        </div>
                                        <button className="ml-auto text-xs font-bold uppercase border-b border-black pb-1 hover:text-vakya-salmon hover:border-vakya-salmon transition-colors">Manage</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* --- LANDER TAB (VIDEOS) --- */}
                    {activeTab === 'lander' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-serif text-3xl">Front Page Media</h2>
                                    <p className="font-sans text-sm text-gray-500 mt-1">Manage the featured videos on the landing page.</p>
                                </div>
                                <button 
                                    onClick={persistChanges} 
                                    disabled={isSaving}
                                    className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save All Changes'}
                                </button>
                            </div>
                            
                            <div className="space-y-8">
                                {siteContent.videos.map((video, idx) => (
                                    <div key={video.id} className="bg-white p-6 border border-gray-200 hover:border-black transition-colors">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-vakya-black text-white w-6 h-6 flex items-center justify-center font-mono text-xs rounded-full">{idx + 1}</span>
                                            <span className="font-sans text-xs font-bold uppercase text-gray-400 tracking-widest">Video Slot</span>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-12 gap-8">
                                            {/* Thumbnail Preview */}
                                            <div className="md:col-span-4 aspect-video bg-black relative group overflow-hidden border border-gray-100">
                                                <img src={video.thumbnail} alt="preview" className="w-full h-full object-cover opacity-90" />
                                                {fetchingVideoId === video.id && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-sans font-bold">
                                                    {video.duration}
                                                </div>
                                            </div>
                                            
                                            {/* Edit Fields */}
                                            <div className="md:col-span-8 grid grid-cols-2 gap-6">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">YouTube URL</label>
                                                    <input 
                                                        type="text" 
                                                        value={video.url} 
                                                        onChange={(e) => handleVideoChange(video.id, 'url', e.target.value)}
                                                        onBlur={(e) => autoFetchVideoDetails(video.id, e.target.value)}
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                        className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    />
                                                    <p className="text-[10px] text-gray-400 mt-2 italic">Paste a YouTube link and click away to auto-fetch title & duration.</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Headline</label>
                                                    <input 
                                                        type="text" 
                                                        value={video.title} 
                                                        onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 font-serif text-xl focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Duration</label>
                                                    <input 
                                                        type="text" 
                                                        value={video.duration} 
                                                        onChange={(e) => handleVideoChange(video.id, 'duration', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    />
                                                </div>
                                                 <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Category</label>
                                                    <input 
                                                        type="text" 
                                                        value={video.type} 
                                                        onChange={(e) => handleVideoChange(video.id, 'type', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- STATIC PAGES TAB --- */}
                    {activeTab === 'pages' && (
                        <div className="grid md:grid-cols-4 gap-8">
                             {/* Sidebar Select */}
                             <div className="md:col-span-1 bg-white border border-gray-200 p-2 h-fit">
                                 {Object.keys(pageLabels).map(slug => (
                                     <button 
                                        key={slug}
                                        onClick={() => setEditingPage(slug)}
                                        className={`block w-full text-left px-4 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors mb-1 ${
                                            editingPage === slug 
                                            ? 'bg-vakya-black text-white' 
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                        }`}
                                     >
                                         {pageLabels[slug]}
                                     </button>
                                 ))}
                             </div>

                             {/* Editor Area */}
                             <div className="md:col-span-3">
                                 {editingPage && siteContent.pages[editingPage] ? (
                                     <div className="bg-white border border-gray-200 p-8 animate-fade-in">
                                         <div className="mb-6">
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Page Title</label>
                                             <input 
                                                type="text" 
                                                value={siteContent.pages[editingPage].title}
                                                onChange={(e) => handlePageContentChange(editingPage, 'title', e.target.value)}
                                                className="w-full p-4 border border-gray-300 font-serif text-3xl focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Content (Markdown)</label>
                                             <textarea 
                                                rows={20}
                                                value={siteContent.pages[editingPage].content}
                                                onChange={(e) => handlePageContentChange(editingPage, 'content', e.target.value)}
                                                className="w-full p-4 border border-gray-300 font-mono text-sm leading-relaxed focus:border-black focus:outline-none resize-y bg-gray-50 text-gray-900 transition-colors"
                                             ></textarea>
                                         </div>
                                         <div className="mt-6 flex justify-end">
                                             <button 
                                                onClick={persistChanges}
                                                disabled={isSaving}
                                                className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50"
                                             >
                                                 {isSaving ? 'Saving...' : 'Save Changes'}
                                             </button>
                                         </div>
                                     </div>
                                 ) : (
                                     <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                                         <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                         <span className="font-serif text-xl">Select a page to edit content.</span>
                                     </div>
                                 )}
                             </div>
                        </div>
                    )}

                    {/* --- CAREERS TAB --- */}
                    {activeTab === 'careers' && (
                        <div>
                             <div className="flex justify-between mb-8 items-center">
                                <h2 className="font-serif text-3xl">Open Positions</h2>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={persistChanges}
                                        disabled={isSaving}
                                        className="bg-vakya-black text-white px-6 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save All'}
                                    </button>
                                    <button onClick={addNewJob} className="border border-black text-black px-6 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">
                                        + Post Job
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {siteContent.jobs.map(job => (
                                    <div key={job.id} className="bg-white border border-gray-200 p-8 relative hover:border-black transition-colors">
                                         <button onClick={() => deleteJob(job.id)} className="absolute top-8 right-8 text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors">Remove</button>
                                         
                                         <div className="grid grid-cols-2 gap-6">
                                             <div className="col-span-2 md:col-span-1">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Job Title</label>
                                                 <input 
                                                    value={job.title}
                                                    onChange={(e) => handleJobChange(job.id, 'title', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 font-serif text-xl focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                 />
                                             </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Type</label>
                                                    <select 
                                                        value={job.type}
                                                        onChange={(e) => handleJobChange(job.id, 'type', e.target.value as any)}
                                                        className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    >
                                                        <option>Full-time</option>
                                                        <option>Part-time</option>
                                                        <option>Contract</option>
                                                        <option>Remote</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Location</label>
                                                    <input 
                                                        value={job.location}
                                                        onChange={(e) => handleJobChange(job.id, 'location', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                    />
                                                </div>
                                             </div>
                                             <div className="col-span-2">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Skills (comma separated)</label>
                                                 <input 
                                                    value={job.skills}
                                                    onChange={(e) => handleJobChange(job.id, 'skills', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                 />
                                             </div>
                                              <div className="col-span-2">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Short Description</label>
                                                 <input 
                                                    value={job.shortDescription}
                                                    onChange={(e) => handleJobChange(job.id, 'shortDescription', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 font-sans text-sm focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
                                                 />
                                             </div>
                                              <div className="col-span-2">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Long Description (Markdown)</label>
                                                 <textarea 
                                                    rows={6}
                                                    value={job.longDescription}
                                                    onChange={(e) => handleJobChange(job.id, 'longDescription', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 font-mono text-sm focus:border-black focus:outline-none bg-gray-50 text-gray-900 transition-colors"
                                                 />
                                             </div>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;