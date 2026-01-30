import React, { useState, useEffect } from 'react';
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

const Articles: React.FC<ArticlesProps> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "The Feed | Vakya";
  }, []);

  // Top 3 articles for the Hero Section
  const featuredArticles = articles.slice(0, 3);

  // Filter logic for the main feed
  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  // Helper component for the overlay card style
  const FeaturedCard = ({ article, className, titleClass }: { article: Article, className?: string, titleClass?: string }) => (
    <div
        onClick={() => navigate(`/articles/${article.id}`)}
        className={`relative overflow-hidden group cursor-pointer rounded-xl ${className}`}
    >
        <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
            <span className="inline-block bg-vakya-salmon text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 rounded-sm">
                {article.category}
            </span>
            <h2 className={`font-serif text-white leading-tight mb-2 group-hover:underline decoration-1 underline-offset-4 ${titleClass}`}>
                {article.title}
            </h2>
            <div className="flex items-center gap-2 text-gray-300 text-[10px] md:text-xs font-sans font-bold uppercase tracking-widest">
                <span>{article.author}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. HERO SECTION (Top 3) - Untouched Layout */}
        {featuredArticles.length > 0 && (
            <div className="mb-20">
                <h1 className="font-serif text-6xl md:text-8xl mb-12 tracking-tight text-vakya-black">The Feed</h1>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
                    {/* Main Feature (Left) */}
                    <div className="md:col-span-8 h-full">
                         <FeaturedCard
                            article={featuredArticles[0]}
                            className="h-[400px] md:h-full shadow-md"
                            titleClass="text-3xl md:text-5xl"
                         />
                    </div>

                    {/* Secondary Features (Right Column) */}
                    <div className="md:col-span-4 flex flex-col gap-4 h-full">
                        {featuredArticles[1] && (
                            <FeaturedCard
                                article={featuredArticles[1]}
                                className="flex-1 h-[300px] md:h-auto shadow-md"
                                titleClass="text-xl md:text-2xl"
                            />
                        )}
                        {featuredArticles[2] && (
                            <FeaturedCard
                                article={featuredArticles[2]}
                                className="flex-1 h-[300px] md:h-auto shadow-md"
                                titleClass="text-xl md:text-2xl"
                            />
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* 2. FILTERS - Left Aligned */}
        {/* Adjusted top position to match Navbar height exactly (h-20 mobile, h-24 desktop) to remove scroll gap */}
        <div className="sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-sm py-6 mb-12 border-b border-black/5">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-start">
                {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`font-sans text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all ${
                    activeCategory === cat
                    ? 'bg-vakya-black text-white border-vakya-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>

        {/* 3. REGULAR POSTS GRID - Reverted to cleaner, borderless style */}
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {filteredArticles.map((article) => (
            <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)} className="cursor-pointer group flex flex-col h-full">
                <div className="overflow-hidden mb-5 aspect-[4/3] bg-gray-100">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-sans text-xs font-bold text-vakya-salmon uppercase tracking-widest">{article.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                            {formatDate(article.publishedAt)}
                        </span>
                    </div>
                    <h3 className="font-serif text-3xl mb-3 leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h3>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed mb-0 line-clamp-3">{article.excerpt}</p>
                </div>
            </div>
            ))}

            {filteredArticles.length === 0 && (
                <div className="col-span-3 text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                    <h3 className="font-serif text-3xl text-gray-400 mb-2">Quiet on this front.</h3>
                    <p className="font-sans text-gray-500">No stories found in this category yet.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Articles;