import React, { useState, useEffect } from 'react';
import { SiteContent, Video, PageContent, JobPosting, Article, Blog, Product, JobApplication, StaffProfile, UserRole } from '../types';
import { saveSiteContent, getArticles, saveArticle, deleteArticle, getBlogs, saveBlog, deleteBlog, getProducts, saveProduct, deleteProduct, getJobApplications, updateApplicationStatus, getAllStaff, saveStaffMember, deleteStaffMember } from '../services/firebase';
import { GoogleGenAI, Type } from "@google/genai";
import ArticlesTab from '../components/admin/ArticlesTab';
import BlogsTab from '../components/admin/BlogsTab';
import StaffTab from '../components/admin/StaffTab';
import StoreTab from '../components/admin/StoreTab';
import LanderTab from '../components/admin/LanderTab';
import PagesTab from '../components/admin/PagesTab';
import CareersTab from '../components/admin/CareersTab';
import ApplicationsTab from '../components/admin/ApplicationsTab';

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

export const BLOG_DOMAINS = [
  'Tech',
  'Inspiration',
  'Engineering',
  'Product',
  'Design',
  'Company',
  'Culture'
];

const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Helper to convert stored date string to YYYY-MM-DD for input[type="date"]
const dateToInputString = (dateString: string) => {
  if (!dateString) return new Date().toISOString().split('T')[0];

  // Handle DD/MM/YYYY legacy format
  const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(ddmmyyyyRegex);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return '';
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ siteContent, setSiteContent }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'blogs' | 'store' | 'staff' | 'lander' | 'pages' | 'careers' | 'applications'>('articles');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [fetchingVideoId, setFetchingVideoId] = useState<number | null>(null);

  // Article State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [tagsInput, setTagsInput] = useState<string>("");

  // Blog State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

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
    const b = await getBlogs();
    setBlogs(b);
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
          lastUpdated: formatDate(new Date())
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

  // --- BLOG HANDLERS ---
  const handleSaveBlog = async () => {
    if (!editingBlog) return;
    setIsSaving(true);

    try {
      const isNew = !blogs.find(b => b.id === editingBlog.id);
      await saveBlog(editingBlog, isNew);
      setEditingBlog(null);
      await loadData();
      setSaveMessage({ text: "Blog saved.", type: 'success' });
    } catch (e) {
      setSaveMessage({ text: "Error saving blog.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const createNewBlog = () => {
    setEditingBlog({
      id: Date.now().toString(),
      title: "",
      excerpt: "",
      content: "",
      author: staffList.length > 0 ? staffList[0].name : "Admin",
      authorImage: staffList.length > 0 ? (staffList[0].image || `https://ui-avatars.com/api/?name=${staffList[0].name}`) : "https://picsum.photos/100/100",
      authorRole: staffList.length > 0 ? staffList[0].title : "Editor",
      domain: BLOG_DOMAINS[0],
      coverImage: "https://picsum.photos/seed/blog/1600/900",
      publishedAt: new Date().toISOString(),
    });
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
      author: staffList.length > 0 ? staffList[0].name : "Admin",
      category: ARTICLE_CATEGORIES[0], // Default
      tags: [],
      imageUrl: "https://picsum.photos/800/600",
      publishedAt: new Date().toISOString().split('T')[0], // Use standard ISO YYYY-MM-DD
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
    'blogs': 'Blogs',
    'store': 'Store',
    'staff': 'Staff & Roles',
    'lander': 'Front Page',
    'pages': 'Static Pages',
    'careers': 'Careers',
    'applications': 'Applications'
  };

  return (
    <div className="min-h-screen bg-vakya-paper pb-12 pt-32 px-6">
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

          {/* --- TABS CONTENT --- */}
          {activeTab === 'articles' && (
            <ArticlesTab
              articles={articles}
              editingArticle={editingArticle}
              setEditingArticle={setEditingArticle}
              tagsInput={tagsInput}
              setTagsInput={setTagsInput}
              handleSaveArticle={handleSaveArticle}
              handleDeleteArticle={handleDeleteArticle}
              createNewArticle={createNewArticle}
              isSaving={isSaving}
              dateToInputString={dateToInputString}
              ARTICLE_CATEGORIES={ARTICLE_CATEGORIES}
              staffList={staffList}
            />
          )}

          {activeTab === 'blogs' && (
            <BlogsTab
              blogs={blogs}
              editingBlog={editingBlog}
              setEditingBlog={setEditingBlog}
              handleSaveBlog={handleSaveBlog}
              handleDeleteBlog={handleDeleteBlog}
              createNewBlog={createNewBlog}
              isSaving={isSaving}
              dateToInputString={dateToInputString}
              BLOG_DOMAINS={BLOG_DOMAINS}
              staffList={staffList}
            />
          )}

          {activeTab === 'staff' && (
            <StaffTab
              staffList={staffList}
              editingStaff={editingStaff}
              setEditingStaff={setEditingStaff}
              handleSaveStaff={handleSaveStaff}
              handleDeleteStaff={handleDeleteStaff}
              createNewStaff={createNewStaff}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'store' && (
            <StoreTab
              products={products}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              handleSaveProduct={handleSaveProduct}
              handleDeleteProduct={handleDeleteProduct}
              createNewProduct={createNewProduct}
            />
          )}

          {activeTab === 'lander' && (
            <LanderTab
              siteContent={siteContent}
              handleVideoChange={handleVideoChange}
              autoFetchVideoDetails={autoFetchVideoDetails}
              fetchingVideoId={fetchingVideoId}
              persistChanges={persistChanges}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'pages' && (
            <PagesTab
              siteContent={siteContent}
              editingPage={editingPage}
              setEditingPage={setEditingPage}
              handlePageContentChange={handlePageContentChange}
              handleSavePageContent={handleSavePageContent}
              pageLabels={pageLabels}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'careers' && (
            <CareersTab
              siteContent={siteContent}
              setSiteContent={setSiteContent}
              handleJobChange={handleJobChange}
              addNewJob={addNewJob}
              persistChanges={persistChanges}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsTab
              applications={applications}
              expandedAppId={expandedAppId}
              setExpandedAppId={setExpandedAppId}
              handleStatusChange={handleStatusChange}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;