import React, { useEffect } from 'react';

const Contact: React.FC = () => {
  useEffect(() => {
    document.title = "Contact Us | Vakya";
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div>
            <h1 className="font-serif text-6xl mb-12">Contact Us</h1>

            <div className="space-y-12">
              <div>
                <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Newsroom & HQ</h3>
                <p className="font-serif text-2xl leading-relaxed">
                  Vakya Media House<br />
                  H/1626, Awas Vikas-1, Keshwapuram, Kalyanpur<br />
                  Kanpur, UP 208017<br />
                  India
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-2">General Inquiries</h3>
                  <a href="mailto:hello@vakyapress.com" className="font-sans text-lg hover:underline">hello@vakyapress.com</a>
                </div>
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-2">Tips & Leaks</h3>
                  <a href="mailto:tips@vakyapress.com" className="font-sans text-lg hover:underline">tips@vakyapress.com</a>
                </div>
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-2">Press & Media</h3>
                  <a href="mailto:press@vakyapress.com" className="font-sans text-lg hover:underline">press@vakyapress.com</a>
                </div>
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-2">Support</h3>
                  <p className="font-sans text-lg">+91 9936954894</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-100 min-h-[500px] relative rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1601.6158108388283!2d80.25773307071483!3d26.489430131695997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sin!4v1767445416463!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          </div>
        </div>

        {/* Simple Form */}
        <div className="mt-24 max-w-2xl">
          <h2 className="font-serif text-4xl mb-8">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input type="text" className="border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-white font-serif text-lg px-2 text-gray-900" placeholder="Jane Doe" />
              </div>
              <div className="flex flex-col">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" className="border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-white font-serif text-lg px-2 text-gray-900" placeholder="jane@example.com" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
              <textarea rows={4} className="border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-white font-serif text-lg px-2 text-gray-900" placeholder="How can we help?"></textarea>
            </div>
            <button className="bg-vakya-black text-white px-8 py-4 font-sans uppercase tracking-widest text-sm font-bold hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;