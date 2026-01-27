import React, { useState, useEffect } from 'react';
import { SiteContent, Video, PageContent, JobPosting, Article, Product, JobApplication, StaffProfile, UserRole } from '../types';
import { saveSiteContent, getArticles, saveArticle, deleteArticle, getProducts, saveProduct, deleteProduct, getJobApplications, updateApplicationStatus, getAllStaff, saveStaffMember, deleteStaffMember } from '../services/firebase';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminDashboardProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

const ARTICLE_CATEGORIES = [
  'Politics',
  'Environment',
  'Culture',
  'Technology',
  'Opinion',
  'Economy',
  'Science',
  'Health',
  'World',
  'Investigation',
  'Urbanism'
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ siteContent, setSiteContent }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'store' | 'staff' | 'lander' | 'pages' | 'careers' | 'applications'>('articles');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [fetchingVideoId, setFetchingVideoId] = useState<number | null>(null);

  // Article State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [tagsInput, setTagsInput] = useState<string>("");

  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Applications State
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Staff State
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffProfile | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'staff') loadStaff();
  }, [activeTab]);

  useEffect(() => {
    if (editingArticle) {
      setTagsInput(editingArticle.tags ? editingArticle.tags.join(', ') : "");
    }
  }, [editingArticle]);

  const loadData = async () => {
    const a = await getArticles();
    setArticles(a);
    const p = await getProducts();
    setProducts(p);
  };

  const loadApplications = async () => {
    const apps = await getJobApplications();
    setApplications(apps);
  };

  const loadStaff = async () => {
    const s = await getAllStaff();
    setStaffList(s);
  };

  // -- Handlers --

  const persistChanges = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveSiteContent(siteContent);
      setSaveMessage({ text: "Site content saved successfully.", type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error(error);
      setSaveMessage({ text: "Error saving content.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Special handler for Page Content to update timestamp
  const handleSavePageContent = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Create a copy of the content with updated timestamp for the specific page
      const updatedPages = {
        ...siteContent.pages,
        [editingPage]: {
          ...siteContent.pages[editingPage],
          lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }
      };

      const updatedSiteContent = { ...siteContent, pages: updatedPages };

      // Update local state first
      setSiteContent(updatedSiteContent);

      // Persist to DB
      await saveSiteContent(updatedSiteContent);
      setSaveMessage({ text: "Page updated with new timestamp.", type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error(error);
      setSaveMessage({ text: "Error saving page content.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- STAFF HANDLERS ---
  const handleSaveStaff = async () => {
    if (!editingStaff) return;
    setIsSaving(true);

    // Ensure ID (slug) exists
    const staffToSave = { ...editingStaff };
    if (!staffToSave.id) {
      staffToSave.id = staffToSave.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      await saveStaffMember(staffToSave);
      setEditingStaff(null);
      await loadStaff();
      setSaveMessage({ text: "Staff profile saved. Role updated.", type: 'success' });
    } catch (e) {
      setSaveMessage({ text: "Error saving staff.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm("Remove this staff member? This will delete their public profile.")) return;
    try {
      await deleteStaffMember(id);
      await loadStaff();
    } catch (e) { console.error(e); }
  };

  const createNewStaff = () => {
    setEditingStaff({
      id: '',
      name: '',
      title: '',
      department: 'Editorial',
      bio: '',
      image: '',
      email: '',
      socials: {},
      accessLevel: 'audience'
    });
  };

  // --- APPLICATION HANDLERS ---
  const handleStatusChange = async (id: string, newStatus: JobApplication['status']) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (e) {
      alert("Failed to update status");
    }
  };

  // --- ARTICLE HANDLERS ---
  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    setIsSaving(true);

    const processedTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const articleToSave = { ...editingArticle, tags: processedTags };

    try {
      const isNew = !articles.find(a => a.id === articleToSave.id);
      await saveArticle(articleToSave, isNew);
      setEditingArticle(null);
      await loadData();
      setSaveMessage({ text: "Article saved.", type: 'success' });
    } catch (e) {
      setSaveMessage({ text: "Error saving article.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const createNewArticle = () => {
    setEditingArticle({
      id: Date.now().toString(),
      title: "",
      excerpt: "",
      content: "",
      author: "Admin",
      category: "Politics", // Default
      tags: [],
      imageUrl: "https://picsum.photos/800/600",
      publishedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      featured: false
    });
  };

  // --- PRODUCT HANDLERS ---
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      const isNew = !products.find(p => p.id === editingProduct.id);
      await saveProduct(editingProduct, isNew);
      setEditingProduct(null);
      await loadData();
      setSaveMessage({ text: "Product saved.", type: 'success' });
    } catch (e) {
      setSaveMessage({ text: "Error saving product.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const createNewProduct = () => {
    setEditingProduct({
      id: Date.now().toString(),
      name: "",
      price: 0,
      image: "https://picsum.photos/400/500",
      category: "Apparel",
      description: "",
      stock: 10
    });
  };

  // --- VIDEO & PAGE HANDLERS ---
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const autoFetchVideoDetails = async (id: number, url: string) => {
    if (!url || !getYoutubeId(url)) return;
    setFetchingVideoId(id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Fetch the official title and duration of this YouTube video: ${url}.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, duration: { type: Type.STRING } },
            required: ['title', 'duration']
          }
        }
      });
      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setSiteContent(prev => ({
          ...prev,
          videos: prev.videos.map(v => v.id === id ? { ...v, title: data.title || v.title, duration: data.duration || v.duration } : v)
        }));
      }
    } catch (error) { console.error("AI fetch failed:", error); }
    finally { setFetchingVideoId(null); }
  };

  const handleVideoChange = (id: number, field: keyof Video, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      videos: prev.videos.map(v => {
        if (v.id !== id) return v;
        const updatedVideo = { ...v, [field]: value };
        if (field === 'url') {
          const ytId = getYoutubeId(value);
          if (ytId) updatedVideo.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
        return updatedVideo;
      })
    }));
  };

  const handlePageContentChange = (slug: string, field: keyof PageContent, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      pages: { ...prev.pages, [slug]: { ...prev.pages[slug], [field]: value } }
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
      shortDescription: "",
      longDescription: "",
      skills: "",
      location: "Remote",
      type: "Full-time"
    };
    setSiteContent(prev => ({ ...prev, jobs: [...prev.jobs, newJob] }));
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
    'store': 'Store',
    'staff': 'Staff & Roles',
    'lander': 'Front Page',
    'pages': 'Static Pages',
    'careers': 'Careers',
    'applications': 'Applications'
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
            <div className={`px-4 py-2 text-sm font-bold uppercase tracking-widest animate-fade-in ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {saveMessage.text}
            </div>
          )}
        </header>

        <div className="flex gap-8 mb-12 border-b border-gray-300 overflow-x-auto pb-1">
          {Object.keys(TAB_LABELS).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setSaveMessage(null); setEditingArticle(null); setEditingProduct(null); setEditingStaff(null); }}
              className={`pb-3 font-sans font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${activeTab === tab ? 'border-b-4 border-black text-black' : 'border-b-4 border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="min-h-[600px] animate-fade-in">

          {/* --- ARTICLES TAB --- */}
          {activeTab === 'articles' && (
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
                      <input className="w-full p-3 border border-gray-300 font-serif text-2xl bg-white text-black" value={editingArticle.title} onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                      <select className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingArticle.category} onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}>
                        {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author (Link to Staff Profile)</label>
                      <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingArticle.author} onChange={e => setEditingArticle({ ...editingArticle, author: e.target.value })} placeholder="Matches Staff Name exactly" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image URL</label>
                      <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingArticle.imageUrl} onChange={e => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tags</label>
                      <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Climate Change, Policy..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt</label>
                      <textarea rows={2} className="w-full p-3 border border-gray-300 font-serif bg-white text-black" value={editingArticle.excerpt} onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
                      <textarea rows={15} className="w-full p-3 border border-gray-300 font-mono text-sm bg-white text-black" value={editingArticle.content} onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- STAFF TAB --- */}
          {activeTab === 'staff' && (
            <div>
              {!editingStaff ? (
                <>
                  <div className="flex justify-between mb-8 items-center">
                    <h2 className="font-serif text-3xl">Manage Staff & Access</h2>
                    <button onClick={createNewStaff} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                      + Add Staff Member
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {staffList.map(staff => (
                      <div key={staff.id} className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={staff.image || `https://ui-avatars.com/api/?name=${staff.name}`} className="w-12 h-12 rounded-full object-cover grayscale" alt={staff.name} />
                          <div>
                            <h4 className="font-serif text-lg leading-none">{staff.name}</h4>
                            <p className="text-xs font-bold uppercase text-vakya-salmon">{staff.title}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs mb-4">
                          <span className="bg-gray-100 px-2 py-1">{staff.department}</span>
                          <span className={`px-2 py-1 ${staff.accessLevel === 'admin' ? 'bg-red-100 text-red-700' : staff.accessLevel === 'writer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {staff.accessLevel.toUpperCase()} ACCESS
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
                          <button onClick={() => setEditingStaff(staff)} className="text-xs font-bold uppercase hover:text-vakya-black">Edit Profile</button>
                          <button onClick={() => handleDeleteStaff(staff.id)} className="text-xs font-bold uppercase text-gray-400 hover:text-red-600">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white border border-gray-200 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-3xl">Staff Profile Editor</h2>
                    <div className="flex gap-4">
                      <button onClick={() => setEditingStaff(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
                      <button onClick={handleSaveStaff} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 border-b border-gray-100 pb-8 mb-8">
                      <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Core Info</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                          <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} placeholder="Jane Doe" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Job Title</label>
                          <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.title} onChange={e => setEditingStaff({ ...editingStaff, title: e.target.value })} placeholder="Senior Editor" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Department</label>
                          <select className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.department} onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value as any })}>
                            <option value="Editorial">Editorial</option>
                            <option value="Creative">Creative (Art/Video/Sound)</option>
                            <option value="Production">Production</option>
                            <option value="Tech">Tech</option>
                            <option value="Management">Management</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Profile Image URL</label>
                          <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.image} onChange={e => setEditingStaff({ ...editingStaff, image: e.target.value })} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Bio</label>
                        <textarea rows={4} className="w-full p-3 border border-gray-300 bg-white text-black font-serif" value={editingStaff.bio} onChange={e => setEditingStaff({ ...editingStaff, bio: e.target.value })} />
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 border-r border-gray-100 pr-8">
                      <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Access Control</h4>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="mb-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Account Email</label>
                          <input type="email" className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} placeholder="jane@vakyapress.com" />
                          <p className="text-xs text-gray-400 mt-1">Must match their registered login email.</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Platform Role</label>
                          <select className="w-full p-3 border border-gray-300 bg-white text-black" value={editingStaff.accessLevel} onChange={e => setEditingStaff({ ...editingStaff, accessLevel: e.target.value as UserRole })}>
                            <option value="audience">No Access (Public Profile Only)</option>
                            <option value="writer">Writer (Can Create Articles)</option>
                            <option value="admin">Admin (Full Control)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 pl-4">
                      <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Social Links</h4>
                      <div className="space-y-3">
                        <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" placeholder="Twitter URL" value={editingStaff.socials.twitter || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, twitter: e.target.value } })} />
                        <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" placeholder="LinkedIn URL" value={editingStaff.socials.linkedin || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, linkedin: e.target.value } })} />
                        <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" placeholder="Website URL" value={editingStaff.socials.website || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, website: e.target.value } })} />
                        <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" placeholder="Instagram URL" value={editingStaff.socials.instagram || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, instagram: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- STORE TAB --- */}
          {activeTab === 'store' && (
            <div>
              {!editingProduct ? (
                <div className="bg-white border border-gray-200">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="font-serif text-2xl">Products</h3>
                    <button onClick={createNewProduct} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase">+ Add Product</button>
                  </div>
                  {products.map(p => (
                    <div key={p.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
                      <span>{p.name}</span>
                      <div className="flex gap-4 items-center">
                        <span className="text-sm font-bold">${p.price}</span>
                        <button onClick={() => setEditingProduct(p)} className="text-blue-600 text-xs font-bold uppercase">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 text-xs font-bold uppercase">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 border border-gray-200">
                  <h3 className="font-serif text-2xl mb-4">Edit Product</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input className="block w-full p-2 border border-gray-300 bg-white text-black" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="Name" />
                    <input className="block w-full p-2 border border-gray-300 bg-white text-black" type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} placeholder="Price" />
                    <input className="block w-full p-2 border border-gray-300 bg-white text-black" value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="Image URL" />
                    <input className="block w-full p-2 border border-gray-300 bg-white text-black" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} placeholder="Category" />
                    <textarea className="col-span-2 block w-full p-2 border border-gray-300 bg-white text-black" rows={4} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} placeholder="Description" />
                    <div className="col-span-2">
                      <label className="text-xs uppercase font-bold text-gray-500">Stock</label>
                      <input className="block w-full p-2 border border-gray-300 bg-white text-black" type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleSaveProduct} className="bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest">Save</button>
                    <button onClick={() => setEditingProduct(null)} className="text-gray-500 uppercase font-bold text-xs">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- LANDER TAB --- */}
          {activeTab === 'lander' && (
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
                          <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" value={video.url} onChange={e => handleVideoChange(video.id, 'url', e.target.value)} />
                          <button onClick={() => autoFetchVideoDetails(video.id, video.url)} className="bg-gray-100 p-2 hover:bg-gray-200" title="Auto-fill details">
                            {fetchingVideoId === video.id ? '...' : 'AI'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Title</label>
                        <input className="w-full p-2 border border-gray-300 text-sm font-bold bg-white text-black" value={video.title} onChange={e => handleVideoChange(video.id, 'title', e.target.value)} />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Duration</label>
                          <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" value={video.duration} onChange={e => handleVideoChange(video.id, 'duration', e.target.value)} />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
                          <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black" value={video.type} onChange={e => handleVideoChange(video.id, 'type', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- PAGES TAB --- */}
          {activeTab === 'pages' && (
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
                        className="w-full p-3 border border-gray-300 font-serif text-2xl bg-white text-black"
                        value={siteContent.pages[editingPage].title}
                        onChange={e => handlePageContentChange(editingPage, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
                      <textarea
                        className="w-full p-4 border border-gray-300 font-mono text-sm h-[500px] bg-white text-black"
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
          )}

          {/* --- CAREERS TAB --- */}
          {activeTab === 'careers' && (
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
                        <input className="w-full p-2 border border-gray-300 font-serif text-xl bg-white text-black" value={job.title} onChange={e => handleJobChange(job.id, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Location</label>
                        <input className="w-full p-2 border border-gray-300 bg-white text-black" value={job.location} onChange={e => handleJobChange(job.id, 'location', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
                        <select className="w-full p-2 border border-gray-300 bg-white text-black" value={job.type} onChange={e => handleJobChange(job.id, 'type', e.target.value as any)}>
                          <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Short Description</label>
                        <input className="w-full p-2 border border-gray-300 bg-white text-black" value={job.shortDescription} onChange={e => handleJobChange(job.id, 'shortDescription', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Required Skills (Comma separated)</label>
                        <input className="w-full p-2 border border-gray-300 bg-white text-black" value={job.skills} onChange={e => handleJobChange(job.id, 'skills', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Description (Markdown)</label>
                        <textarea rows={6} className="w-full p-2 border border-gray-300 font-mono text-sm bg-white text-black" value={job.longDescription} onChange={e => handleJobChange(job.id, 'longDescription', e.target.value)} />
                      </div>
                    </div>
                    <button onClick={() => setSiteContent(prev => ({ ...prev, jobs: prev.jobs.filter(j => j.id !== job.id) }))} className="text-red-600 text-xs font-bold uppercase hover:underline">Delete Position</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- APPLICATIONS TAB --- */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="font-serif text-3xl mb-8">Job Applications</h2>
              <div className="bg-white border border-gray-200 overflow-hidden">
                {applications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No applications received yet.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {applications.map(app => (
                      <div key={app.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-serif text-xl">{app.applicantName}</h3>
                              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-green-100 text-green-800'
                                }`}>{app.status}</span>
                            </div>
                            <p className="text-sm text-gray-600">Applied for <span className="font-bold">{app.jobTitle}</span> • {new Date(app.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-sm text-gray-400">{expandedAppId === app.id ? 'Collapse' : 'Expand'}</div>
                        </div>

                        {expandedAppId === app.id && (
                          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email</p>
                                <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">LinkedIn</p>
                                <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Portfolio</p>
                                <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Portfolio</a>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Resume</p>
                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Download Resume</a>
                              </div>
                            </div>
                            <div className="mb-6">
                              <p className="text-xs font-bold uppercase text-gray-400 mb-2">The Pitch</p>
                              <p className="bg-gray-50 p-4 rounded text-sm leading-relaxed">{app.pitch}</p>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => handleStatusChange(app.id, 'shortlisted')} className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-green-600">Shortlist</button>
                              <button onClick={() => handleStatusChange(app.id, 'reviewed')} className="px-4 py-2 bg-gray-200 text-black text-xs font-bold uppercase hover:bg-gray-300">Mark Reviewed</button>
                              <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-4 py-2 bg-white border border-gray-300 text-gray-500 text-xs font-bold uppercase hover:bg-red-50 hover:text-red-600">Reject</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;