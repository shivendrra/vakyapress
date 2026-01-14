import React from 'react';
import { MOCK_ARTICLES } from '../services/mockData';
import { UserProfile } from '../types';

interface WriterProfileProps {
  user: UserProfile;
}

const WriterProfile: React.FC<WriterProfileProps> = ({ user }) => {
  // Filter articles for "My Articles" (mocked)
  const myArticles = MOCK_ARTICLES.slice(0, 2);

  return (
    <div className="min-h-screen bg-vakya-paper">
      {/* Profile Header */}
      <div className="bg-white border-b border-black/10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-48 h-48 bg-vakya-gray border border-gray-200 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <img src={`https://ui-avatars.com/api/?name=${user.displayName}&background=random&size=256`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-vakya-accent text-vakya-black px-4 py-1 font-sans font-bold text-xs uppercase tracking-widest border border-black">
                Staff Writer
              </div>
            </div>

            {/* Bio & Details */}
            <div className="flex-1">
              <h1 className="font-serif text-6xl mb-4 text-vakya-black">{user.displayName}</h1>
              <p className="font-serif text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Investigative journalist focusing on public policy and environmental justice. Formerly with The Guardian. Believes in the power of slow news.
              </p>

              <div className="flex flex-wrap gap-8 border-t border-gray-100 pt-6">
                <div>
                  <span className="block font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</span>
                  <span className="font-serif text-lg">{user.email}</span>
                </div>
                <div>
                  <span className="block font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Location</span>
                  <span className="font-serif text-lg">Mumbai, India</span>
                </div>
                <div>
                  <span className="block font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Joined</span>
                  <span className="font-serif text-lg">Oct 2023</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="bg-vakya-black text-white px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors border border-transparent hover:border-black">
                Edit Profile
              </button>
              <button className="bg-white text-black border border-black px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-vakya-gray transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
          <h2 className="font-serif text-4xl">Published Stories</h2>
          <button className="bg-vakya-accent text-black px-6 py-2 font-sans text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 flex items-center gap-2">
            <span>+</span> New Draft
          </button>
        </div>

        <div className="grid gap-12">
          {myArticles.map(article => (
            <div key={article.id} className="group grid md:grid-cols-4 gap-6 items-start cursor-pointer">
              <div className="md:col-span-1 aspect-[4/3] bg-gray-200 overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="md:col-span-3 flex flex-col h-full border-b border-gray-200 pb-8 md:border-none md:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-sans text-xs font-bold text-vakya-salmon uppercase tracking-widest">{article.category}</span>
                  <span className="font-sans text-xs text-gray-400">{article.publishedAt}</span>
                </div>
                <h3 className="font-serif text-3xl mb-3 group-hover:underline decoration-1 underline-offset-4 leading-tight">{article.title}</h3>
                <p className="font-sans text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>

                <div className="mt-auto flex gap-6">
                  <div className="flex items-center gap-2 font-sans text-xs font-bold text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    1.2k Views
                  </div>
                  <div className="flex items-center gap-2 font-sans text-xs font-bold text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    45 Comments
                  </div>
                  <button className="ml-auto text-xs font-bold uppercase tracking-widest text-black border-b border-black hover:text-vakya-salmon hover:border-vakya-salmon transition-colors">
                    Edit Article
                  </button>
                </div>
              </div>
            </div>
          ))}

          {myArticles.length === 0 && (
            <div className="text-center py-24 bg-white border border-dashed border-gray-300">
              <p className="font-serif text-2xl text-gray-400 mb-4">No stories published yet.</p>
              <button className="text-vakya-salmon font-sans font-bold uppercase tracking-widest text-sm hover:underline">Start writing</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriterProfile;