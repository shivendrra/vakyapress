import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '../types';
import { getRelatedArticles, getArticleById } from '../services/firebase';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-2xl">Loading...</div>;
  if (!article) return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-2xl">Article not found.</div>;

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 bg-white pt-10 rounded-t-lg">
        {/* Meta */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <img src={article.authorImage} className="w-12 h-12 rounded-full border border-gray-200" alt="Author" />
            <div>
              <p className="font-sans font-bold text-gray-900">By {article.author}</p>
              <p className="font-sans text-sm text-gray-500">{article.publishedAt} • 5 min read</p>
            </div>
          </div>
          <button onClick={() => navigate('/articles')} className="text-gray-400 hover:text-black font-sans text-sm font-bold uppercase">Back to Feed</button>
        </div>

        {/* Content Body */}
        <div className="prose prose-lg prose-headings:font-serif prose-p:font-sans prose-a:text-vakya-salmon hover:prose-a:text-red-500 max-w-none text-gray-800">
          <p className="lead text-xl font-serif italic text-gray-600 mb-8 border-l-4 border-vakya-accent pl-4">
            {article.subtitle || article.excerpt}
          </p>

          <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="mb-6">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>
          <h2 className="text-3xl mt-12 mb-6">A Shift in Perspective</h2>
          <p className="mb-6">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
          </p>
          <blockquote className="my-8 pl-8 border-l-2 border-black font-serif text-2xl italic text-gray-800">
            "The truth is rarely pure and never simple. But that's exactly why we must pursue it."
          </blockquote>
          <p className="mb-6">
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
          </p>
        </div>

        {/* Footer of article */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="font-sans font-bold uppercase text-sm text-gray-400 mb-4">Tags</h3>
          <div className="flex gap-2">
            {['Journalism', 'Feature', 'Deep Dive'].map(tag => (
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