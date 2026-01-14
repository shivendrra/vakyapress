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

// Initial Default Content (Fallback)
const INITIAL_CONTENT: SiteContent = {
  videos: [
    {
      id: 1,
      title: "The Cost of Fast Fashion in Rural India",
      url: "https://www.youtube.com/watch?v=BiLYO8n9h4A",
      thumbnail: "https://img.youtube.com/vi/BiLYO8n9h4A/hqdefault.jpg",
      duration: "12:34",
      type: "Documentary"
    },
    {
      id: 2,
      title: "Silence in the Alps: Glacial Retreat",
      url: "https://www.youtube.com/watch?v=qJ5h5tD6vCk",
      thumbnail: "https://img.youtube.com/vi/qJ5h5tD6vCk/hqdefault.jpg",
      duration: "08:45",
      type: "Reportage"
    },
    {
      id: 3,
      title: "Urban Farming Revolution",
      url: "https://www.youtube.com/watch?v=1F56g401f8k",
      thumbnail: "https://img.youtube.com/vi/1F56g401f8k/hqdefault.jpg",
      duration: "15:20",
      type: "Feature"
    }
  ],
  jobs: [
    {
      id: '1',
      title: "Senior Data Editor",
      shortDescription: "Lead our data journalism unit to uncover hidden stories in public records.",
      location: "Remote",
      type: "Full-time",
      skills: "Python, SQL, D3.js, Pandas",
      longDescription: "As a Senior Data Editor, you will be responsible for scraping, cleaning, and analyzing large datasets. You will work closely with investigative reporters to find the story in the numbers."
    },
    {
      id: '2',
      title: "Investigative Fellow",
      shortDescription: "A 12-month fellowship for early-career journalists focusing on civic issues.",
      location: "Mumbai",
      type: "Contract",
      skills: "Writing, Interviewing, Research, Marathi (Preferred)",
      longDescription: "The Vakya Fellowship is designed to mentor the next generation of journalists. You will be paired with a senior editor and expected to produce 3 long-form stories during your tenure."
    }
  ],
  pages: {
    privacy: {
      title: "Privacy Notice",
      content: "We collect minimal data necessary to provide our services. We do not sell your personal information to third parties."
    },
    terms: {
      title: "Terms of Use",
      content: "By accessing Vakya, you agree to respect intellectual property rights and engage in civil discourse."
    },
    cookie_policy: {
      title: "Cookie Policy",
      content: "We use cookies to improve your experience. You can opt-out of non-essential cookies."
    },
    privacy_settings: {
      title: "Manage Privacy Settings",
      content: "Use this page to request data deletion or export your data."
    },
    licensing: {
      title: "Licensing",
      content: "Our content is available for republication under specific Creative Commons licenses. Contact us for commercial use."
    },
    accessibility: {
      title: "Accessibility",
      content: "Vakya is committed to ensuring digital accessibility for people with disabilities."
    },
    ethics: {
      title: "Ethics & Guidelines",
      content: `### 1. Verification\nWe do not publish rumors. Every fact is double-checked.\n\n### 2. Independence\nAdvertisers have no say in our coverage.`
    },
    financials: {
      title: "How we make money",
      content: "We are funded by reader subscriptions, grants, and merchandise sales. We do not accept sponsored content."
    },
    pitch: {
      title: "How to pitch Vakya",
      content: "Send us a 200-word abstract. Focus on the human angle. We pay competitive rates."
    }
  }
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
    getArticles().then(setArticles);

    // Load Site Content from Firestore
    const loadContent = async () => {
      const storedContent = await getSiteContent();
      if (storedContent) {
        setSiteContent(storedContent);
      }
    };
    loadContent();
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

          {/* Static Pages */}
          <Route path="/privacy" element={<StaticPage type="privacy" content={siteContent.pages.privacy} />} />
          <Route path="/terms" element={<StaticPage type="terms" content={siteContent.pages.terms} />} />
          <Route path="/cookie-policy" element={<StaticPage type="cookie_policy" content={siteContent.pages.cookie_policy} />} />
          <Route path="/privacy-settings" element={<StaticPage type="privacy_settings" content={siteContent.pages.privacy_settings} />} />
          <Route path="/licensing" element={<StaticPage type="licensing" content={siteContent.pages.licensing} />} />
          <Route path="/accessibility" element={<StaticPage type="accessibility" content={siteContent.pages.accessibility} />} />
          <Route path="/ethics" element={<StaticPage type="ethics" content={siteContent.pages.ethics} />} />
          <Route path="/financials" element={<StaticPage type="financials" content={siteContent.pages.financials} />} />
          <Route path="/pitch" element={<StaticPage type="pitch" content={siteContent.pages.pitch} />} />

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