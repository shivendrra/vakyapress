import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  logoPlaceholder: string;
  accentColor: string; // Tailwind class for the haze
}

const PROJECTS: Project[] = [
  {
    id: 'spectacle',
    title: 'Spectacle',
    description: '(Planned) A quarterly magazine exploring society, photography, art, and culture. Centered on the human experience in nature and travel—akin to the spirit of National Geographic but with a raw, indie soul. Curated and run entirely by contributions from independent photographers around the world and designers at Vakya. Fully hand-crafted, with zero AI involvement.',
    link: '#',
    logoPlaceholder: 'https://raw.githubusercontent.com/shivendrra/vakyapress/dev/assets/IndieSpectacleLogo.png',
    accentColor: 'bg-vakya-salmon'
  },
  {
    id: 'draft-four',
    title: 'Draft-Four',
    description: '(Planned) A film production collective that began as an independent passion project to produce a single short film. Today, it stands as a home for experimental storytellers, producing visual narratives that challenge the conventional structures of cinema and documentary filmmaking.',
    link: '#',
    logoPlaceholder: 'https://raw.githubusercontent.com/shivendrra/vakyapress/dev/assets/DraftFour.png',
    accentColor: 'bg-vakya-accent'
  },
  {
    id: 'vyakul',
    title: 'Vyakul',
    description: '(Planned) An educational outreach program dedicated to bridging the opportunity gap. Vyakul works directly with rural schools to provide quality education resources, mentorship, and digital literacy tools to underprivileged children, ensuring that talent is not lost to circumstance.',
    link: '#',
    logoPlaceholder: 'https://raw.githubusercontent.com/shivendrra/vakyapress/dev/assets/Vyakul.png',
    accentColor: 'bg-vakya-lavender'
  }
];

const Projects: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Projects | Vakya";
  }, []);

  return (
    <div className="min-h-screen bg-vakya-paper">

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 animate-fade-in-up">
            Vakya Productions
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-8 text-vakya-black animate-fade-in-up delay-100">
            Our Ecosystem
          </h1>
          <p className="font-sans text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Beyond the newsroom. Exploring culture, cinema, and community through our independent ventures.
          </p>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {PROJECTS.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={project.id}
                  className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Visual Side */}
                  <div className="w-full md:w-1/2 flex justify-center relative group">
                    {/* The Hazy Gradient/Shadow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${project.accentColor} rounded-full blur-[80px] opacity-60 group-hover:opacity-80 transition-opacity duration-700`}></div>

                    {/* Logo */}
                    <img
                      src={project.logoPlaceholder}
                      alt={project.title}
                      className="relative z-10 w-128 h-128 object-contain drop-shadow-sm transform group-hover:scale-100 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Side */}
                  <div className={`w-full md:w-1/2 text-center ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <h2 className="font-serif text-5xl md:text-6xl mb-6 text-vakya-black leading-tight">
                      {project.title}
                    </h2>
                    <div className={`w-16 h-1 bg-black mb-8 ${isEven ? 'mr-auto mx-auto md:mx-0' : 'ml-auto mx-auto md:mx-0'}`}></div>
                    <p className="font-sans text-lg text-gray-600 leading-relaxed mb-8">
                      {project.description}
                    </p>

                    <a
                      href={project.link}
                      className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-vakya-black border-b-2 border-transparent hover:border-vakya-salmon hover:text-gray-600 transition-all pb-1"
                    >
                      Visit {project.title}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="py-24 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="font-serif text-4xl mb-6">Have an idea for a collaboration?</h3>
          <p className="font-sans text-gray-500 mb-8">We are always looking to partner with creators on new projects.</p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors"
          >
            Get in Touch
          </button>
        </div>
      </section>

    </div>
  );
};

export default Projects;