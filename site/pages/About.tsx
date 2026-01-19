import React, { useState } from 'react';

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
    name: "Elena Fisher",
    role: "Founder & Editor-in-Chief",
    bio: "Former conflict reporter turned media entrepreneur.",
    fullBio: "Elena spent 15 years reporting from conflict zones across the Middle East and Eastern Europe before founding Vakya. She believes that slow, methodical journalism is the only antidote to the chaos of modern information warfare. Her work has appeared in The Guardian, The New York Times, and Le Monde.",
    email: "elena@vakyapress.com",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", 
    bgColor: "bg-vakya-accent" // Yellow
  },
  {
    name: "Raj Patel",
    role: "Senior Political Editor",
    bio: "Covering the corridors of power with unblinking focus.",
    fullBio: "Raj brings a decade of experience covering parliamentary proceedings and grassroots political movements. His focus is on the intersection of policy and real lives, stripping away the jargon to reveal the human cost of legislation.",
    email: "raj@vakyapress.com",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop",
    bgColor: "bg-vakya-salmon" // Pinkish
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Investigative Unit",
    bio: "Data wizard and document hunter.",
    fullBio: "Sarah leads our OSINT (Open Source Intelligence) team. She specializes in following the money, using public records and leaks to expose corruption in high places. She formerly worked with the ICIJ.",
    email: "sarah@vakyapress.com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    bgColor: "bg-blue-200"
  },
  {
    name: "David Okafor",
    role: "Visual Director",
    bio: "Telling stories through lenses and pixels.",
    fullBio: "David believes that a photograph can change the world. He oversees all visual output at Vakya, ensuring that our aesthetic matches the gravity of our reporting. He is an award-winning documentary photographer.",
    email: "david@vakyapress.com",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    bgColor: "bg-green-200"
  },
  {
    name: "Mei Lin",
    role: "Culture Critic",
    bio: "Deconstructing pop culture and ancient traditions.",
    fullBio: "Mei writes about how we live today. From the impact of AI on art to the resurgence of traditional crafts, she finds the deep cultural currents that shape our daily lives.",
    email: "mei@vakyapress.com",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    bgColor: "bg-orange-200"
  },
  {
    name: "Marcus Thorne",
    role: "Tech & Future",
    bio: "Exploring the intersection of humanity and machines.",
    fullBio: "Marcus covers the silicon frontier. He is less interested in the latest gadget and more interested in how technology is rewriting the social contract.",
    email: "marcus@vakyapress.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    bgColor: "bg-vakya-lavender"
  }
];

const About: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="w-full bg-vakya-paper">
        {/* Founder Note */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center">
            <h1 className="font-serif text-6xl mb-12 animate-fade-in-up">From the Editor's Desk</h1>
            <div className="font-serif text-2xl leading-relaxed text-gray-800 space-y-8 animate-fade-in-up delay-100">
                <p>"We started Vakya with a simple premise: that the truth is not a commodity. In an era of clickbait and 24-hour cycles, we wanted to build a sanctuary for deep, thoughtful storytelling."</p>
                <p>"Our team is a collective of misfits, dreamers, and dogged investigators who believe that journalism is the immune system of democracy. We don't just report the news; we try to understand it."</p>
            </div>
            <div className="mt-16 flex flex-col items-center justify-center animate-fade-in-up delay-200">
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" className="w-20 h-20 rounded-full grayscale mb-4 object-cover" alt="Founder"/>
                 <div className="text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" className="h-8 mx-auto mb-2 opacity-60" />
                    <div className="font-sans font-bold uppercase tracking-widest text-sm">Elena Fisher</div>
                    <div className="font-sans text-gray-500 text-xs">Founder, Vakya</div>
                 </div>
            </div>
        </section>

        {/* Team Grid */}
        <section className="bg-white py-24 border-t border-black">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 grid md:grid-cols-2 gap-8 items-end">
                    <div>
                        <h2 className="font-serif text-6xl leading-none mb-4">The<br/>Collective</h2>
                    </div>
                    <div className="md:text-right">
                        <p className="font-sans text-lg text-gray-600 max-w-md ml-auto">
                            Click on a team member to read their full bio and get in touch.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-0 border-l border-t border-black">
                    {TEAM.map((member, index) => (
                        <div 
                            key={index} 
                            className="group border-r border-b border-black p-0 relative overflow-hidden bg-white cursor-pointer"
                            onClick={() => setSelectedMember(member)}
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
                <button className="bg-white text-vakya-black px-8 py-3 font-sans uppercase tracking-widest font-bold hover:bg-vakya-accent transition-colors">
                    Join the Team
                </button>
            </div>
        </section>
    </div>
  );
}
export default About;