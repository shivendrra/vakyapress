import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffProfile, Article } from '../types';
import { getStaffBySlug, getArticlesByAuthor } from '../services/firebase';

const StaffProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        const profile = await getStaffBySlug(slug);
        if (profile) {
          setStaff(profile);
          // Fetch articles where author matches name. 
          const authorArticles = await getArticlesByAuthor(profile.name);
          setArticles(authorArticles);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Loading Profile...</div>;

  if (!staff) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-4xl mb-4">Staff Member Not Found</h2>
        <button onClick={() => navigate('/about')} className="text-sm font-bold uppercase underline">Return to About Us</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vakya-paper pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-6">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-10 items-start border-b border-black/10 pb-12 mb-16">
          {/* Image */}
          <div className="w-48 h-48 flex-shrink-0">
            <img
              src={staff.image || `https://ui-avatars.com/api/?name=${staff.name}&size=256`}
              alt={staff.name}
              className="w-full h-full object-cover rounded-full grayscale border border-gray-200"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-serif text-5xl md:text-6xl mb-4 text-vakya-black leading-tight">
              {staff.name}
            </h1>
            <p className="font-sans text-lg font-bold uppercase tracking-widest text-gray-500 mb-6">
              {staff.title}
            </p>

            <div className="font-serif text-xl text-gray-800 leading-relaxed mb-8 whitespace-pre-wrap">
              {staff.bio}
            </div>

            {/* Socials / Contact */}
            <div className="flex flex-wrap gap-6 text-sm font-sans font-bold uppercase tracking-widest">
              {staff.email && (
                <a href={`mailto:${staff.email}`} className="flex items-center gap-2 hover:text-vakya-salmon transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email
                </a>
              )}
              {staff.socials.twitter && (
                <a href={staff.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-vakya-salmon transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  X (Twitter)
                </a>
              )}
              {staff.socials.linkedin && (
                <a href={staff.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-vakya-salmon transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  LinkedIn
                </a>
              )}
              {staff.socials.website && (
                <a href={staff.socials.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-vakya-salmon transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Articles Section */}
        {articles.length > 0 ? (
          <div>
            <h2 className="font-serif text-3xl mb-8 border-l-4 border-vakya-accent pl-4">Stories by {staff.name}</h2>
            <div className="grid gap-12">
              {articles.map(article => (
                <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)} className="group grid md:grid-cols-4 gap-6 items-start cursor-pointer hover:bg-white transition-colors p-4 -mx-4 rounded">
                  <div className="md:col-span-1 aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-sans text-xs font-bold text-vakya-salmon uppercase tracking-widest">{article.category}</span>
                      <span className="font-sans text-xs text-gray-400">{article.publishedAt}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">{article.title}</h3>
                    <p className="font-sans text-gray-600 mb-0 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 font-sans text-sm uppercase tracking-widest">
            No articles published yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfilePage;