import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../types';

interface ArticlesProps {
  articles: Article[];
}

const CATEGORIES = [
    'All', 
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

const Articles: React.FC<ArticlesProps> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-vakya-paper pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 border-b border-gray-200 pb-8">
          <h1 className="font-serif text-6xl mb-6">The Feed</h1>
          <p className="font-sans text-gray-500 mb-6 uppercase tracking-widest text-xs font-bold">Filter by Category</p>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                  activeCategory === cat 
                  ? 'bg-vakya-black text-white border-vakya-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article (First one) */}
        {filteredArticles.length > 0 && (
          <div 
            onClick={() => navigate(`/articles/${filteredArticles[0].id}`)}
            className="mb-16 grid md:grid-cols-2 gap-8 cursor-pointer group"
          >
            <div className="overflow-hidden aspect-[16/9] md:aspect-auto h-full bg-gray-200">
              <img src={filteredArticles[0].imageUrl} alt={filteredArticles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex flex-col justify-center">
               <span className="font-sans text-xs font-bold tracking-widest text-vakya-salmon uppercase mb-3">
                 {filteredArticles[0].category} • Featured
               </span>
               <h2 className="font-serif text-5xl leading-tight mb-6 group-hover:text-gray-700 transition-colors">
                 {filteredArticles[0].title}
               </h2>
               <p className="font-sans text-xl text-gray-600 mb-6 leading-relaxed">
                 {filteredArticles[0].subtitle || filteredArticles[0].excerpt}
               </p>
               <div className="flex items-center gap-3">
                 <img src={filteredArticles[0].authorImage} className="w-10 h-10 rounded-full grayscale object-cover" alt="author" />
                 <div className="font-sans text-sm">
                   <p className="font-bold">{filteredArticles[0].author}</p>
                   <p className="text-gray-500">{filteredArticles[0].publishedAt}</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Grid for rest */}
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
          {filteredArticles.slice(1).map((article) => (
            <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)} className="cursor-pointer group flex flex-col h-full">
              <div className="overflow-hidden mb-5 aspect-[3/2] bg-gray-200">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <span className="font-sans text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block">{article.category}</span>
                <h3 className="font-serif text-2xl mb-3 leading-snug group-hover:underline decoration-1 underline-offset-4">{article.title}</h3>
                <p className="font-sans text-gray-600 text-sm leading-relaxed mb-4">{article.excerpt}</p>
              </div>
              <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center font-sans text-xs text-gray-500">
                <span>{article.author}</span>
                <span>{article.publishedAt}</span>
              </div>
            </div>
          ))}
          
          {filteredArticles.length === 0 && (
             <div className="col-span-3 text-center py-24">
                 <h3 className="font-serif text-2xl text-gray-400">No stories found in this category.</h3>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Articles;