import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Store from './pages/Store';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import WriterProfile from './pages/WriterProfile';
import UserProfilePage from './pages/UserProfile';
import StaticPage from './pages/StaticPages';
import Careers from './pages/Careers';
import NotFound from './pages/NotFound';

import { Article, UserProfile, SiteContent } from './types';
import { getArticles, auth, getUserProfile, getSiteContent } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Initial Default Content (Fallback) - Only used if DB is completely empty first time
const INITIAL_CONTENT: SiteContent = {
  videos: [],
  jobs: [],
  pages: {}
};

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Site Content State (Lifted up for Admin Editing)
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_CONTENT);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);

        const storedContent = await getSiteContent();
        if (storedContent) {
            setSiteContent(storedContent);
        }
    };
    fetchData();
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom profile to get role
        const profile = await getUserProfile(firebaseUser.uid, firebaseUser.email);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingUser) {
      return <div className="min-h-screen flex items-center justify-center bg-vakya-paper font-serif text-2xl">Loading Vakya...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-vakya-paper">
      <ScrollToTop />
      <Navbar user={user} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing articles={articles} videos={siteContent.videos} />} />
          <Route path="/articles" element={<Articles articles={articles} />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<Store />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/careers" element={<Careers jobs={siteContent.jobs} />} />
          
          {/* Static Pages - handle safely if content doesn't exist yet */}
          <Route path="/privacy" element={<StaticPage type="privacy" content={siteContent.pages?.privacy} />} />
          <Route path="/terms" element={<StaticPage type="terms" content={siteContent.pages?.terms} />} />
          <Route path="/cookie-policy" element={<StaticPage type="cookie_policy" content={siteContent.pages?.cookie_policy} />} />
          <Route path="/privacy-settings" element={<StaticPage type="privacy_settings" content={siteContent.pages?.privacy_settings} />} />
          <Route path="/licensing" element={<StaticPage type="licensing" content={siteContent.pages?.licensing} />} />
          <Route path="/accessibility" element={<StaticPage type="accessibility" content={siteContent.pages?.accessibility} />} />
          <Route path="/ethics" element={<StaticPage type="ethics" content={siteContent.pages?.ethics} />} />
          <Route path="/financials" element={<StaticPage type="financials" content={siteContent.pages?.financials} />} />
          <Route path="/pitch" element={<StaticPage type="pitch" content={siteContent.pages?.pitch} />} />

          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard siteContent={siteContent} setSiteContent={setSiteContent} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/writer" 
            element={user?.role === 'writer' ? <WriterProfile user={user} /> : <Navigate to="/auth" />} 
          />
           <Route 
            path="/profile" 
            element={user ? <UserProfilePage user={user} /> : <Navigate to="/auth" />} 
          />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;