import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

      const setMeta = (name: string, content: string, isProperty = false) => {
          const attr = isProperty ? 'property' : 'name';
          let element = document.querySelector(`meta[${attr}="${name}"]`);
          if (!element) {
              element = document.createElement('meta');
              element.setAttribute(attr, name);
              document.head.appendChild(element);
          }
          element.setAttribute('content', content);
      };

      setMeta('description', article.excerpt || article.subtitle || 'Read this article on Vakya.');
      setMeta('og:title', article.title, true);
      setMeta('og:description', article.excerpt || article.subtitle || 'Read this article on Vakya.', true);
      setMeta('og:image', article.imageUrl, true);
      setMeta('og:url', window.location.href, true);
      setMeta('og:type', 'article', true);
    }
    
    // Cleanup to reset title when unmounting
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

              {/* Reader Content */}
              <div className={`max-w-2xl mx-auto pt-32 pb-24 px-6 animate-fade-in-up ${getFontSizeClass()}`}>
                  <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">{article.title}</h1>
                  <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest opacity-50 mb-12 border-b border-current pb-6">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
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
    <article className="min-h-screen bg-white pb-24">
      {/* Article Header Image */}
      <div className="w-full h-[60vh] relative">
        <img src={article.imageUrl} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-3xl mx-auto text-white">
            <span className="bg-vakya-accent text-vakya-black px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              {article.category}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-4">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 bg-white pt-10 rounded-t-lg shadow-sm">
        {/* Meta & Actions */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
           <div className="flex items-center gap-4">
              <img src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author}`} className="w-12 h-12 rounded-full border border-gray-200" alt="Author" />
              <div>
                <p className="font-sans font-bold text-gray-900">By {article.author}</p>
                <p className="font-sans text-sm text-gray-500">{article.publishedAt}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsReaderMode(true)}
                 className="flex items-center gap-2 bg-gray-100 hover:bg-black hover:text-white px-4 py-2 rounded-full transition-colors font-sans text-xs font-bold uppercase tracking-widest group"
               >
                   <svg className="w-4 h-4 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                   Reader Mode
               </button>
               <button onClick={() => navigate('/articles')} className="text-gray-400 hover:text-black font-sans text-sm font-bold uppercase">Back</button>
           </div>
        </div>

        {/* Content Body */}
        <div className="text-gray-800">
          <p className="lead text-xl md:text-2xl font-serif italic text-gray-600 mb-8 border-l-4 border-vakya-accent pl-6 py-1 leading-relaxed">
            {article.subtitle || article.excerpt}
          </p>
          
          <MarkdownRenderer content={article.content} />
        </div>
        
        {/* Footer of article */}
        <div className="mt-16 pt-8 border-t border-gray-200">
           <h3 className="font-sans font-bold uppercase text-sm text-gray-400 mb-4">Tags</h3>
           <div className="flex flex-wrap gap-2">
             {/* If article has tags, display them. Otherwise fallback to just Journalism + Category */}
             {(article.tags && article.tags.length > 0 ? article.tags : ['Journalism', article.category]).map(tag => (
               <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-sans uppercase hover:bg-gray-200 cursor-pointer">{tag}</span>
             ))}
           </div>
        </div>
      </div>

      {/* Related Articles */}
      <section className="bg-vakya-gray/30 mt-24 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif text-3xl mb-8">Read Next</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map(related => (
                    <div key={related.id} onClick={() => navigate(`/articles/${related.id}`)} className="group cursor-pointer bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video overflow-hidden mb-4 bg-gray-200">
                            <img src={related.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={related.title} />
                        </div>
                        <span className="text-xs font-bold font-sans text-vakya-salmon uppercase tracking-widest">{related.category}</span>
                        <h4 className="font-serif text-xl mt-2 leading-tight group-hover:underline decoration-1 underline-offset-4">{related.title}</h4>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </article>
  );
};

export default ArticleDetail;