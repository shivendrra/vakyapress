import React from 'react';
import { Product } from '../types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: "The 'Truthseeker' Hoodie",
    price: 65,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: "Vakya Moleskine",
    price: 24,
    category: 'Stationery',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: "Public Good Tote",
    price: 30,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: "Coffee & Context Mug",
    price: 18,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: "Investigative Unit Cap",
    price: 35,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: "The Vakya Annual 2023",
    price: 45,
    category: 'Print',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
  }
];

const Store: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* Store Hero */}
      <section className="bg-vakya-paper py-20 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-6xl mb-6">Vakya Goods</h1>
          <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
            High-quality essentials for the thoughtful reader. 100% of profits fund our investigative reporting.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                <button className="absolute bottom-6 left-6 right-6 bg-white text-black py-3 font-sans font-bold uppercase tracking-widest text-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Add to Cart
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-sans text-xs text-gray-500 uppercase tracking-widest mb-1 block">{product.category}</span>
                  <h3 className="font-serif text-2xl group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                </div>
                <span className="font-sans font-bold">${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Store Trust Banner */}
      <section className="bg-vakya-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center font-sans text-sm tracking-widest uppercase">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Worldwide Shipping
          </div>
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ethically Sourced
          </div>
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Supports Journalism
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;