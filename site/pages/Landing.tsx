import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Article, Video } from '../types';

interface LandingProps {
  articles: Article[];
  videos: Video[];
}

const Landing: React.FC<LandingProps> = ({ articles, videos }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Vakya | Truth as it is";
  }, []);

  return (
    <div className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 bg-vakya-paper">
        <div className="max-w-4xl mx-auto z-10">
          <p className="font-sans text-sm md:text-base uppercase tracking-[0.2em] mb-4 text-gray-500 animate-fade-in-up">
            Est. 2022 — Independent Journalism
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-tight mb-8 text-vakya-black animate-fade-in-up delay-100">
            Truth in <br /> <span className="italic text-gray-700">Motion.</span>
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto text-gray-600 mb-10 leading-relaxed animate-fade-in-up delay-200">
            We are Vakya. We bring you stories that challenge perspectives and ignite conversations. Unfiltered, unbiased, and unapologetic. <em>Truth as it should be.</em>
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button
              onClick={() => navigate('/articles')}
              className="bg-vakya-black text-white px-8 py-3 font-sans uppercase tracking-widest hover:bg-gray-800 transition-all transform hover:scale-105"
            >
              Read Stories
            </button>
            <button className="border border-vakya-black text-vakya-black px-8 py-3 font-sans uppercase tracking-widest hover:bg-vakya-black hover:text-white transition-colors">
              Our Vision
            </button>
          </div>
        </div>

        {/* Abstract BG Element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-vakya-accent rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-vakya-salmon rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      </section>

      {/* VISION & TIMELINE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-5xl mb-8">Our Vision</h2>
              <p className="font-sans text-lg text-gray-700 leading-relaxed mb-6">
                In an age of noise, Vakya seeks the signal. We believe that journalism is a public service, not a product. Our mission is to empower communities with information that matters.
              </p>
              <p className="font-sans text-lg text-gray-700 leading-relaxed">
                From local governance to global climate shifts, our lens focuses on the human element of every story.
              </p>
            </div>

            {/* Timeline */}
            <div className="border-l-2 border-gray-200 pl-8 space-y-12">
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-vakya-black border-4 border-white"></span>
                <span className="font-sans font-bold text-gray-400 text-sm tracking-widest">2022</span>
                <h3 className="font-serif text-2xl mt-1">The Inception</h3>
                <p className="font-sans text-gray-600 mt-2">Started as a part-time youtube channel with bunch of friends determined to seek the truth.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-vakya-accent border-4 border-white"></span>
                <span className="font-sans font-bold text-gray-400 text-sm tracking-widest">2026</span>
                <h3 className="font-serif text-2xl mt-1">Revival</h3>
                <p className="font-sans text-gray-600 mt-2">Re-Launching with full conviction, better & bigger team and more knowledge and experience.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-gray-200 border-4 border-white"></span>
                <span className="font-sans font-bold text-gray-400 text-sm tracking-widest">FUTURE</span>
                <h3 className="font-serif text-2xl mt-1">Global Reach</h3>
                <p className="font-sans text-gray-600 mt-2">Partnering with international bureaus to bring cross-border stories.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VIDEOS (Dynamic) */}
      <section className="py-24 bg-vakya-lavender/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-5xl">Watch</h2>
            <button className="hidden md:block font-sans text-sm font-bold border-b border-black pb-1 hover:text-gray-600">VIEW ALL VIDEOS</button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => window.open(video.url, '_blank')}
              >
                <div className="relative aspect-video bg-gray-900 mb-4 overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-vakya-accent transition-colors">
                      <svg className="w-6 h-6 ml-1 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 font-sans font-bold">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-serif text-2xl leading-tight group-hover:underline decoration-1 underline-offset-4">{video.title}</h3>
                <p className="font-sans text-sm text-gray-500 mt-2">{video.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST STORIES PREVIEW */}
      <section className="py-24 bg-vakya-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl mb-4">Latest Stories</h2>
            <p className="font-sans text-gray-600 max-w-2xl mx-auto">Handpicked journalism from our editorial team.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {articles.slice(0, 3).map((article) => (
              <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)} className="cursor-pointer group">
                <div className="overflow-hidden mb-4 aspect-[4/3]">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="font-sans text-xs font-bold tracking-widest text-vakya-salmon uppercase mb-2 block">{article.category}</span>
                <h3 className="font-serif text-3xl mb-3 leading-tight group-hover:text-gray-700 transition-colors">{article.title}</h3>
                <p className="font-sans text-gray-600 line-clamp-3 leading-relaxed">{article.excerpt}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button onClick={() => navigate('/articles')} className="bg-transparent border border-gray-300 px-8 py-3 font-sans text-sm font-bold uppercase hover:border-black transition-colors">
              View All Articles
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES BANNER */}
      <section className="py-20 bg-vakya-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl mb-8">Support Independent Media</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border border-gray-800 hover:border-vakya-accent transition-colors">
              <h4 className="font-serif text-2xl mb-2 text-vakya-accent">Membership.</h4>
              <p className="font-sans text-gray-400 text-sm">Get exclusive access to behind-the-scenes content and monthly roundtables.</p>
            </div>
            <div className="p-6 border border-gray-800 hover:border-vakya-accent transition-colors">
              <h4 className="font-serif text-2xl mb-2 text-vakya-accent">Workshops.</h4>
              <p className="font-sans text-gray-400 text-sm">Learn investigative journalism techniques from our senior editors.</p>
            </div>
            <div className="p-6 border border-gray-800 hover:border-vakya-accent transition-colors">
              <h4 className="font-serif text-2xl mb-2 text-vakya-accent">The Store.</h4>
              <p className="font-sans text-gray-400 text-sm">Buy merchandise that funds our on-ground reporting.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;