import React, { useState, useEffect } from 'react';
import { SiteContent, Video, PageContent, JobPosting, Article, Product } from '../types';
import { saveSiteContent, getArticles, saveArticle, deleteArticle, getProducts, saveProduct, deleteProduct } from '../services/firebase';
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
    const [activeTab, setActiveTab] = useState<'articles' | 'store' | 'writers' | 'lander' | 'pages' | 'careers'>('articles');
    const [editingPage, setEditingPage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [fetchingVideoId, setFetchingVideoId] = useState<number | null>(null);

    // Article State
    const [articles, setArticles] = useState<Article[]>([]);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    // Local state for tags input string to handle typing before converting to array
    const [tagsInput, setTagsInput] = useState<string>("");

    // Product State
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    // Sync tags input when editing article changes
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

    // -- Handlers --

    // General Save for Site Content (Landing, Pages, Careers)
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

    // --- ARTICLE HANDLERS ---
    const handleSaveArticle = async () => {
        if (!editingArticle) return;
        setIsSaving(true);
        
        // Process tags from input string before saving
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
        if(!window.confirm("Delete this product?")) return;
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

    // --- VIDEO HANDLERS ---
    // Helper to extract YouTube ID
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
            
            // Using responseSchema for strict JSON output ensuring we get exactly what we need
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Fetch the official title and duration of this YouTube video: ${url}. The duration should be formatted nicely (e.g. 10:25).`,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            duration: { type: Type.STRING }
                        },
                        required: ['title', 'duration']
                    }
                }
            });
            
            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                setSiteContent(prev => ({
                    ...prev,
                    videos: prev.videos.map(v => v.id === id ? { 
                        ...v, 
                        title: data.title || v.title, 
                        duration: data.duration || v.duration 
                    } : v)
                }));
            }
        } catch (error) { 
            console.error("AI fetch failed:", error); 
        } 
        finally { setFetchingVideoId(null); }
    };

    const handleVideoChange = (id: number, field: keyof Video, value: string) => {
        setSiteContent(prev => ({
            ...prev,
            videos: prev.videos.map(v => {
                if (v.id !== id) return v;
                const updatedVideo = { ...v, [field]: value };
                
                // Automatically update thumbnail when URL changes
                if (field === 'url') {
                    const ytId = getYoutubeId(value);
                    if (ytId) updatedVideo.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                }
                return updatedVideo;
            })
        }));
    };

    // --- OTHER HANDLERS ---
    const handlePageContentChange = (slug: string, field: keyof PageContent, value: string) => {
        setSiteContent(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                [slug]: { ...prev.pages[slug], [field]: value }
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

                <div className="flex gap-8 mb-12 border-b border-gray-300 overflow-x-auto pb-1">
                    {Object.keys(TAB_LABELS).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab as any); setSaveMessage(null); setEditingArticle(null); setEditingProduct(null); }}
                            className={`pb-3 font-sans font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${
                                activeTab === tab ? 'border-b-4 border-black text-black' : 'border-b-4 border-transparent text-gray-400 hover:text-gray-600'
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
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Date</th>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {articles.map(article => (
                                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4 font-serif text-xl">{article.title}</td>
                                                        <td className="p-4 font-sans text-sm text-gray-600">{article.category}</td>
                                                        <td className="p-4 font-sans text-sm text-gray-500">{article.publishedAt}</td>
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
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                            <input className="w-full p-3 border border-gray-300 font-serif text-2xl bg-white text-black" value={editingArticle.title} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category (Domain)</label>
                                            <select 
                                                className="w-full p-3 border border-gray-300 bg-white text-black font-sans" 
                                                value={editingArticle.category} 
                                                onChange={e => setEditingArticle({...editingArticle, category: e.target.value})}
                                            >
                                                {ARTICLE_CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                         <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image URL</label>
                                            <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingArticle.imageUrl} onChange={e => setEditingArticle({...editingArticle, imageUrl: e.target.value})} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tags (Comma Separated)</label>
                                            <input 
                                                className="w-full p-3 border border-gray-300 bg-white text-black font-sans" 
                                                value={tagsInput} 
                                                onChange={e => setTagsInput(e.target.value)}
                                                placeholder="e.g. Climate Change, Policy, Local News"
                                            />
                                        </div>
                                         <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt (Subtitle)</label>
                                            <textarea rows={2} className="w-full p-3 border border-gray-300 font-serif bg-white text-black" value={editingArticle.excerpt} onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown supported)</label>
                                            <textarea rows={15} className="w-full p-3 border border-gray-300 font-mono text-sm bg-white text-black" value={editingArticle.content} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} />
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
                                <>
                                    <div className="flex justify-between mb-8 items-center">
                                        <h2 className="font-serif text-3xl">Manage Store</h2>
                                        <button onClick={createNewProduct} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                                            + New Product
                                        </button>
                                    </div>
                                    <div className="bg-white border border-gray-200 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Product</th>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Category</th>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Price</th>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider">Stock</th>
                                                    <th className="p-4 font-sans text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {products.map(product => (
                                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4 flex items-center gap-4">
                                                            <img src={product.image} className="w-10 h-10 object-cover border border-gray-200" alt="prod" />
                                                            <span className="font-serif text-lg">{product.name}</span>
                                                        </td>
                                                        <td className="p-4 font-sans text-sm text-gray-600">{product.category}</td>
                                                        <td className="p-4 font-sans text-sm font-bold">${product.price}</td>
                                                        <td className="p-4 font-sans text-sm">{product.stock}</td>
                                                        <td className="p-4 text-right">
                                                            <button onClick={() => setEditingProduct(product)} className="text-black font-bold text-xs uppercase hover:text-vakya-salmon mr-4 transition-colors">Edit</button>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Delete</button>
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
                                        <h2 className="font-serif text-3xl">Product Editor</h2>
                                        <div className="flex gap-4">
                                            <button onClick={() => setEditingProduct(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
                                            <button onClick={handleSaveProduct} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                                                {isSaving ? 'Saving...' : 'Save Product'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name</label>
                                            <input className="w-full p-3 border border-gray-300 font-serif text-xl bg-white text-black" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                        </div>
                                         <div className="col-span-2 md:col-span-1">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image URL</label>
                                            <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price ($)</label>
                                            <input type="number" className="w-full p-3 border border-gray-300 bg-white text-black" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                                        </div>
                                         <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Stock Qty</label>
                                            <input type="number" className="w-full p-3 border border-gray-300 bg-white text-black" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                                        </div>
                                        <div className="col-span-2">
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                                             <input className="w-full p-3 border border-gray-300 bg-white text-black" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                                            <textarea rows={5} className="w-full p-3 border border-gray-300 font-sans bg-white text-black" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                                        </div>
                                    </div>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* --- LANDER TAB (VIDEOS) --- */}
                    {activeTab === 'lander' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-serif text-3xl">Front Page Media</h2>
                                <button onClick={persistChanges} disabled={isSaving} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50">
                                    {isSaving ? 'Saving...' : 'Save All Changes'}
                                </button>
                            </div>
                            <div className="space-y-8">
                                {siteContent.videos.map((video, idx) => (
                                    <div key={video.id} className="bg-white p-6 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-vakya-black text-white w-6 h-6 flex items-center justify-center font-mono text-xs rounded-full">{idx + 1}</span>
                                            <span className="font-sans text-xs font-bold uppercase text-gray-400 tracking-widest">Video Slot</span>
                                        </div>
                                        <div className="grid md:grid-cols-12 gap-8">
                                            <div className="md:col-span-4 aspect-video bg-black relative group overflow-hidden border border-gray-100">
                                                <img src={video.thumbnail} alt="preview" className="w-full h-full object-cover opacity-90" />
                                                {fetchingVideoId === video.id && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div></div>}
                                            </div>
                                            <div className="md:col-span-8 grid grid-cols-2 gap-6">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">YouTube URL</label>
                                                    <input type="text" value={video.url} onChange={(e) => handleVideoChange(video.id, 'url', e.target.value)} onBlur={(e) => autoFetchVideoDetails(video.id, e.target.value)} className="w-full p-3 border border-gray-300 bg-white text-black" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Headline</label>
                                                    <input type="text" value={video.title} onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)} className="w-full p-3 border border-gray-300 bg-white text-black font-serif text-xl" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Duration</label>
                                                    <input type="text" value={video.duration} onChange={(e) => handleVideoChange(video.id, 'duration', e.target.value)} className="w-full p-3 border border-gray-300 bg-white text-black" />
                                                </div>
                                                 <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                                                    <input type="text" value={video.type} onChange={(e) => handleVideoChange(video.id, 'type', e.target.value)} className="w-full p-3 border border-gray-300 bg-white text-black" />
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
                             <div className="md:col-span-1 bg-white border border-gray-200 p-2 h-fit">
                                 {Object.keys(pageLabels).map(slug => (
                                     <button key={slug} onClick={() => setEditingPage(slug)} className={`block w-full text-left px-4 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors mb-1 ${editingPage === slug ? 'bg-vakya-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}>{pageLabels[slug]}</button>
                                 ))}
                             </div>
                             <div className="md:col-span-3">
                                 {editingPage && siteContent.pages?.[editingPage] ? (
                                     <div className="bg-white border border-gray-200 p-8">
                                         <div className="mb-6">
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Page Title</label>
                                             <input type="text" value={siteContent.pages[editingPage].title} onChange={(e) => handlePageContentChange(editingPage, 'title', e.target.value)} className="w-full p-4 border border-gray-300 font-serif text-3xl bg-white text-black" />
                                         </div>
                                         <div>
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
                                             <textarea rows={20} value={siteContent.pages[editingPage].content} onChange={(e) => handlePageContentChange(editingPage, 'content', e.target.value)} className="w-full p-4 border border-gray-300 font-mono text-sm leading-relaxed bg-white text-black" />
                                         </div>
                                         <div className="mt-6 flex justify-end">
                                             <button onClick={persistChanges} disabled={isSaving} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                                         </div>
                                     </div>
                                 ) : <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">Select a page.</div>}
                             </div>
                        </div>
                    )}

                    {/* --- CAREERS TAB --- */}
                    {activeTab === 'careers' && (
                        <div>
                             <div className="flex justify-between mb-8 items-center">
                                <h2 className="font-serif text-3xl">Open Positions</h2>
                                <div className="flex gap-4">
                                    <button onClick={persistChanges} disabled={isSaving} className="bg-vakya-black text-white px-6 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save All'}</button>
                                    <button onClick={addNewJob} className="border border-black text-black px-6 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">+ Post Job</button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {siteContent.jobs.map(job => (
                                    <div key={job.id} className="bg-white border border-gray-200 p-8 relative hover:border-black transition-colors">
                                         <button onClick={() => setSiteContent(prev => ({...prev, jobs: prev.jobs.filter(j => j.id !== job.id)}))} className="absolute top-8 right-8 text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest">Remove</button>
                                         <div className="grid grid-cols-2 gap-6">
                                             <div className="col-span-2 md:col-span-1">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Job Title</label>
                                                 <input value={job.title} onChange={(e) => handleJobChange(job.id, 'title', e.target.value)} className="w-full p-3 border border-gray-300 font-serif text-xl bg-white text-black" />
                                             </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Type</label>
                                                    <select value={job.type} onChange={(e) => handleJobChange(job.id, 'type', e.target.value as any)} className="w-full p-3 border border-gray-300 text-sm bg-white text-black">
                                                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Location</label>
                                                    <input value={job.location} onChange={(e) => handleJobChange(job.id, 'location', e.target.value)} className="w-full p-3 border border-gray-300 text-sm bg-white text-black" />
                                                </div>
                                             </div>
                                             <div className="col-span-2">
                                                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description (Markdown)</label>
                                                 <textarea rows={6} value={job.longDescription} onChange={(e) => handleJobChange(job.id, 'longDescription', e.target.value)} className="w-full p-3 border border-gray-300 font-mono text-sm bg-white text-black" />
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