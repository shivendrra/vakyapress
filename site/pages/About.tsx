import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  fullBio: string;
  email: string;
  image: string;
  bgColor: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Prasoon Singh",
    role: "Host & Producer",
    bio: "MBA grad interested in crafting compelling stories.",
    fullBio: "Prasoon, an MBA graduate passionate about unraveling mysteries and crafting compelling stories, previously excelled in the SaaS industry with strong data analytics and business acumen. In 2022, he co-founded Vakya with Shivendra, leading research, content writing, and production.",
    email: "prasson@vakyapress.com",
    image: "https://raw.githubusercontent.com/shivendrra/vakyapress/main/assets/prasoon.jpg",
    bgColor: "bg-vakya-salmon"
  },
  {
    name: "Shivendra Singh",
    // role: "Co-Founder & Head of Operations",
    role: "Direction & Operations",
    bio: "Computer Programer, Engineer & Designer.",
    fullBio: "Shivendra, an engineer and designer, has ideated and developed innovative solutions for real-world challenges. He collaborated with the Government of India to deploy Cattlesense among rural communities, showcasing deep technical business expertise. He co-founded Vakya with Prasoon Singh during his final year of school.",
    email: "shivendrra@vakyapress.com",
    image: "https://raw.githubusercontent.com/shivendrra/vakyapress/main/assets/shiv.jpg",
    bgColor: "bg-blue-200"
  },
  {
    name: "Praduymna Kumar",
    role: "Writing & Research",
    // bio: "Law-Apprentice, Writer proficient with legal aspect of business helping building startups.",
    bio: "Law-Apprentice, writer & passionate researcher.",
    fullBio: "Pradyumna, a Law undergraduate from Delhi University, harbors a keen interest in law and order. With work experience at the Supreme Court honing his expertise, he heads Vakya's research and writing division while serving as business liaison.",
    email: "pradyumn@vakyapress.com",
    image: "https://raw.githubusercontent.com/shivendrra/vakyapress/main/assets/pradyumn.jpg",
    bgColor: "bg-vakya-accent"
  },
  {
    name: "Aakash Prakhar",
    role: "Creative Lead & Animator",
    bio: "Product Designer and passionate animator shaping the frames that matter.",
    fullBio: "A product designer turned animator, Aakash is an artist at heart, renowned for his exceptional sense of color and aesthetics. As creative lead, he spearheads animation, design, and editing. He has also given back to the community through gigs painting interiors for primary schools & teaching kids.",
    email: "aakash@vakyapress.com",
    image: "https://raw.githubusercontent.com/shivendrra/vakyapress/main/assets/akash.png",
    bgColor: "bg-green-200"
  },
];

const About: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    document.title = "About Us | Vakya";
  }, []);

  return (
    <div className="w-full bg-vakya-paper pt-24">
      {/* Founder Note */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-serif text-6xl mb-12 animate-fade-in-up">From the Founder's Desk</h1>
        <div className="font-serif text-2xl leading-relaxed text-gray-800 space-y-8 animate-fade-in-up delay-100">
          <p>"We started Vakya with a simple premise: that the truth is not a commodity. In an era of clickbait and 24-hour cycles, we wanted to build a sanctuary for deep, thoughtful storytelling."</p>
          <p>"Our team is a collective of misfits, dreamers, and dogged investigators who believe that journalism is the immune system of democracy. We don't just report the story; we try to understand it."</p>
        </div>
        {/* <div className="mt-16 flex flex-col items-center justify-center animate-fade-in-up delay-200">
          <img src="https://2.gravatar.com/avatar/a5fa5ebfdaa5c691a8a186aa09151aec1307f02fb476ffb60241dd6ae009e05b?size=512&d=initials" className="w-20 h-20 rounded-full grayscale mb-4 object-cover" alt="Founder" />
          <div className="text-center">
            <div className="font-sans font-bold uppercase tracking-widest text-sm">Shivendra Singh</div>
            <div className="font-sans text-gray-500 text-xs">Co-Founder, Vakya</div>
          </div>
        </div> */}
      </section>

      {/* Team Grid */}
      <section className="bg-white py-24 border-t border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid md:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="font-serif text-5xl leading-none mb-4">The<br />Collective</h2>
            </div>
            {/* <div className="md:text-right">
              <p className="font-sans text-lg text-gray-600 max-w-sm ml-auto">
                Click on a team member to read their full bio and get in touch.
              </p>
            </div> */}
          </div>

          <div className="grid md:grid-cols-4 gap-0 border-l border-t border-black">
            {TEAM.map((member, index) => (
              // <div   // uncomment this for the detail functionality
              //   key={index}
              //   className="group border-r border-b border-black p-0 relative overflow-hidden bg-white cursor-pointer"
              //   onClick={() => setSelectedMember(member)}
              // >
                <div
                key={index}
                className="group border-r border-b border-black p-0 relative overflow-hidden bg-white cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  <div className={`aspect-[3/4] w-full ${member.bgColor} relative overflow-hidden`}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col justify-between bg-white group-hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{member.role}</div>
                      <h3 className="font-serif text-3xl leading-tight mb-4">{member.name}</h3>
                      <p className="font-sans text-sm text-gray-600 leading-relaxed line-clamp-3">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Team Member Details */}
      {selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}></div>
          <div className="bg-white w-full max-w-2xl relative z-10 shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className={`w-full md:w-1/3 aspect-[3/4] md:aspect-auto ${selectedMember.bgColor}`}>
                <img src={selectedMember.image} className="w-full h-full object-cover mix-blend-multiply grayscale" alt={selectedMember.name} />
              </div>
              <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{selectedMember.role}</span>
                <h3 className="font-serif text-4xl mb-6">{selectedMember.name}</h3>
                <p className="font-sans text-gray-600 leading-relaxed mb-8">{selectedMember.fullBio}</p>

                <div className="mt-auto border-t border-gray-100 pt-6">
                  <p className="font-sans text-sm text-gray-500 mb-1">Contact</p>
                  <a href={`mailto:${selectedMember.email}`} className="font-serif text-xl hover:text-vakya-salmon transition-colors underline decoration-1 underline-offset-4">
                    {selectedMember.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Us CTA */}
      <section className="py-24 bg-vakya-black text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-4xl mb-6">Be Part of the Story</h2>
          <p className="font-sans text-gray-400 mb-8">We are always looking for new voices. If you have a story to tell, we want to hear it.</p>
          <Link to="/careers" className="bg-white text-vakya-black px-8 py-3 font-sans uppercase tracking-widest font-bold hover:bg-vakya-accent transition-colors">
            Join the Team
          </Link>
        </div>
      </section>
    </div>
  );
}
export default About;