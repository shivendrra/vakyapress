import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../types';
import { getRelatedArticles, getArticleById } from '../services/firebase';
import MarkdownRenderer from '../components/MarkdownRenderer';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Reader Mode State
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  // Helper to slugify author name for linking
  const getAuthorSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Helper to format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (id) {
        setLoading(true);
        getArticleById(id).then(fetchedArticle => {
            setArticle(fetchedArticle);
            if (fetchedArticle) {
                getRelatedArticles(fetchedArticle.id, fetchedArticle.category).then(setRelatedArticles);
            }
            setLoading(false);
        });
    }
  }, [id]);

  // SEO & Meta Tags Update
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Vakya`;

      const metaTags = [
        { name: 'description', content: article.excerpt || article.subtitle || 'Read this article on Vakya.' },
        { property: 'og:title', content: article.title },
        { property: 'og:description', content: article.excerpt || article.subtitle || 'Read this article on Vakya.' },
        { property: 'og:image', content: article.imageUrl },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: article.title },
        { name: 'twitter:description', content: article.excerpt || article.subtitle || '' },
        { name: 'twitter:image', content: article.imageUrl }
      ];

      metaTags.forEach(tag => {
          const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
          let element = document.querySelector(selector);
          if (!element) {
              element = document.createElement('meta');
              if (tag.name) element.setAttribute('name', tag.name);
              if (tag.property) element.setAttribute('property', tag.property);
              document.head.appendChild(element);
          }
          element.setAttribute('content', tag.content || '');
      });
    }
    
    // Cleanup to reset title when unmounting (optional, but good practice)
    return () => {
        document.title = 'Vakya | Journalism for the People';
    };
  }, [article]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-2xl">Loading...</div>;
  if (!article) return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-2xl">Article not found.</div>;

  // Reader Mode Styles
  const getThemeClasses = () => {
      switch(theme) {
          case 'dark': return 'bg-[#1a1a1a] text-gray-300';
          case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636]';
          default: return 'bg-white text-gray-900';
      }
  };

  const getFontSizeClass = () => {
      switch(fontSize) {
          case 'small': return 'text-base';
          case 'large': return 'text-xl md:text-2xl leading-relaxed';
          default: return 'text-lg md:text-xl leading-relaxed';
      }
  };

  const getMarkdownThemeOverrides = () => {
      switch(theme) {
          case 'dark':
              return '[&_blockquote]:bg-white/5 [&_blockquote]:border-gray-500 [&_blockquote]:text-gray-400 [&_pre]:bg-white/5 [&_code]:bg-white/10 [&_code]:text-gray-200 [&_a]:text-blue-300 [&_img]:opacity-80 [&_hr]:border-gray-700';
          case 'sepia':
              return '[&_blockquote]:bg-[#e8dec5] [&_blockquote]:border-[#8b7355] [&_pre]:bg-[#e8dec5] [&_code]:bg-[#e8dec5] [&_code]:text-[#4a3b2a] [&_a]:text-[#8b5a2b] [&_hr]:border-[#dcd0b8]';
          default:
              return ''; // Default uses styles defined in MarkdownRenderer
      }
  };

  // READER MODE OVERLAY
  if (isReaderMode) {
      return (
          <div className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${getThemeClasses()} z-[100]`}>
              {/* Reader Controls */}
              <div className={`fixed top-0 left-0 right-0 p-4 border-b flex justify-between items-center z-[101] ${theme === 'dark' ? 'border-gray-800 bg-[#1a1a1a]/95' : theme === 'sepia' ? 'border-[#e3d8c0] bg-[#f4ecd8]/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm transition-colors duration-300`}>
                  <button 
                    onClick={() => setIsReaderMode(false)}
                    className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
                  >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      Exit Reader
                  </button>

                  <div className="flex items-center gap-6">
                      {/* Font Size */}
                      <div className={`flex items-center gap-3 border-r pr-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                          <button onClick={() => setFontSize('small')} className={`text-sm font-serif hover:opacity-100 transition-opacity ${fontSize === 'small' ? 'font-bold opacity-100 underline' : 'opacity-50'}`}>A</button>
                          <button onClick={() => setFontSize('medium')} className={`text-lg font-serif hover:opacity-100 transition-opacity ${fontSize === 'medium' ? 'font-bold opacity-100 underline' : 'opacity-50'}`}>A</button>
                          <button onClick={() => setFontSize('large')} className={`text-2xl font-serif hover:opacity-100 transition-opacity ${fontSize === 'large' ? 'font-bold opacity-100 underline' : 'opacity-50'}`}>A</button>
                      </div>
                      
                      {/* Theme */}
                      <div className="flex gap-2">
                          <button onClick={() => setTheme('light')} className={`w-6 h-6 rounded-full border border-gray-300 bg-white shadow-sm transition-transform hover:scale-110 ${theme === 'light' ? 'ring-2 ring-blue-500 scale-110' : ''}`} title="Light"></button>
                          <button onClick={() => setTheme('sepia')} className={`w-6 h-6 rounded-full border border-[#dcd0b8] bg-[#f4ecd8] shadow-sm transition-transform hover:scale-110 ${theme === 'sepia' ? 'ring-2 ring-blue-500 scale-110' : ''}`} title="Sepia"></button>
                          <button onClick={() => setTheme('dark')} className={`w-6 h-6 rounded-full border border-gray-600 bg-[#1a1a1a] shadow-sm transition-transform hover:scale-110 ${theme === 'dark' ? 'ring-2 ring-blue-500 scale-110' : ''}`} title="Dark"></button>
                      </div>
                  </div>
              </div>

              {/* Reader Content - Widened to max-w-3xl */}
              <div className={`max-w-3xl mx-auto pt-32 pb-24 px-6 animate-fade-in-up ${getFontSizeClass()}`}>
                  <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">{article.title}</h1>
                  <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest opacity-50 mb-12 border-b border-current pb-6">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <div className={getMarkdownThemeOverrides()}>
                      <p className="font-serif italic text-2xl mb-12 opacity-90 leading-relaxed">
                          {article.subtitle || article.excerpt}
                      </p>
                       <MarkdownRenderer content={article.content} />
                  </div>
              </div>
          </div>
      );
  }

  // STANDARD LAYOUT
  return (
    <article className="min-h-screen bg-white pt-20 md:pt-24">
      {/* 1. Hero with Overlay */}
      <div className="relative w-full h-[70vh] flex items-end pb-12">
        <div className="absolute inset-0">
             <img src={article.imageUrl} className="w-full h-full object-cover" alt="Cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="bg-vakya-accent text-vakya-black px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest">
                    {article.category}
                    </span>
                    <span className="text-white/80 font-sans text-xs font-bold uppercase tracking-widest">
                        Updated {formatDate(article.publishedAt)}
                    </span>
                 </div>
                 <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6 drop-shadow-lg">
                    {article.title}
                 </h1>
                 <p className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                    {article.subtitle || article.excerpt}
                 </p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT: Main Content (8 cols) */}
            <div className="lg:col-span-8">
                 <div className="font-serif text-lg text-gray-800 leading-relaxed">
                    <MarkdownRenderer content={article.content} />
                 </div>
                 
                 {/* Article Footer (Tags etc) */}
                 <div className="mt-12 pt-8 border-t border-gray-100">
                     <div className="flex flex-wrap gap-2">
                         {(article.tags || [article.category]).map(tag => (
                             <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold uppercase hover:bg-gray-200 cursor-pointer">{tag}</span>
                         ))}
                     </div>
                 </div>
            </div>

            {/* RIGHT: Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-12">
                
                {/* Author Card */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 sticky top-32">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-vakya-accent rounded-full blur opacity-20"></div>
                             <Link to={`/staff/${getAuthorSlug(article.author)}`}>
                                <img src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author}`} className="w-16 h-16 rounded-full object-cover relative border-2 border-white shadow-sm" alt={article.author} />
                            </Link>
                        </div>
                        <div>
                             <h3 className="font-serif text-xl leading-none mb-1">
                                <Link to={`/staff/${getAuthorSlug(article.author)}`} className="hover:underline">{article.author}</Link>
                             </h3>
                             <p className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">Writer at Vakya</p>
                        </div>
                    </div>
                    
                    <p className="font-sans text-sm text-gray-600 mb-6 leading-relaxed">
                        Journalist covering {article.category.toLowerCase()} and human interest stories. Believes in the power of unhurried reporting.
                    </p>
                    
                    <div className="flex gap-3 mb-8">
                        <button className="flex-1 bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Follow</button>
                         <button onClick={() => navigate(`/staff/${getAuthorSlug(article.author)}`)} className="flex-1 border border-black text-black py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">Profile</button>
                    </div>

                    {/* Reader Settings in Sidebar */}
                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-sans text-xs font-bold uppercase text-gray-400 mb-4">Reading Options</h4>
                        <button 
                            onClick={() => setIsReaderMode(true)}
                            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 hover:border-black transition-colors group"
                        >
                            <span className="text-sm font-bold">Reader View</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </button>
                    </div>
                </div>

                {/* Related Articles List (Sidebar Style) */}
                <div>
                    <h3 className="font-serif text-2xl mb-6">Related Stories</h3>
                    <div className="space-y-6">
                        {relatedArticles.map(related => (
                            <div key={related.id} onClick={() => navigate(`/articles/${related.id}`)} className="flex gap-4 cursor-pointer group">
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 overflow-hidden rounded-md">
                                    <img src={related.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={related.title} />
                                </div>
                                <div>
                                    <span className="font-sans text-[10px] font-bold text-vakya-salmon uppercase tracking-widest mb-1 block">{related.category}</span>
                                    <h4 className="font-serif text-lg leading-tight group-hover:underline decoration-1 underline-offset-4 line-clamp-2">{related.title}</h4>
                                </div>
                            </div>
                        ))}
                        {relatedArticles.length === 0 && <p className="text-gray-400 text-sm">No related stories found.</p>}
                    </div>
                    <Link to="/articles" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:text-vakya-salmon">
                        View All Archives &rarr;
                    </Link>
                </div>

            </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;