import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../services/firebase';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  useEffect(() => {
    getProducts().then((data) => {
        setProducts(data);
        setLoading(false);
    });
  }, []);

  const openProduct = (p: Product) => {
      setSelectedProduct(p);
      setQuantity(1);
  };

  const closeProduct = () => {
      setSelectedProduct(null);
      setIsFullScreenImage(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Loading Store...</div>;

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
            {products.length > 0 ? products.map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                    <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                         <button className="absolute bottom-6 left-6 right-6 bg-white text-black py-3 font-sans font-bold uppercase tracking-widest text-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                           View Details
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
            )) : (
                <div className="col-span-3 text-center text-gray-400 py-12 font-serif text-xl">
                    Store items coming soon.
                </div>
            )}
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

       {/* PRODUCT DETAIL MODAL */}
       {selectedProduct && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProduct}></div>
               
               <div className="bg-white w-full max-w-5xl h-[85vh] relative z-10 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
                   <button onClick={closeProduct} className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>

                   {/* Left: Image */}
                   <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100 relative group cursor-zoom-in" onClick={() => setIsFullScreenImage(true)}>
                       <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                       <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</div>
                   </div>

                   {/* Right: Details */}
                   <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                       <span className="font-sans text-xs font-bold text-vakya-salmon uppercase tracking-widest mb-2">{selectedProduct.category}</span>
                       <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{selectedProduct.name}</h2>
                       <div className="text-2xl font-sans font-bold mb-8">${selectedProduct.price}</div>

                       <div className="prose prose-sm font-sans text-gray-600 mb-8">
                           <p>{selectedProduct.description || "No description available."}</p>
                       </div>

                       <div className="mt-auto border-t border-gray-100 pt-8 space-y-6">
                           <div className="flex items-center justify-between">
                               <span className="font-sans text-sm font-bold uppercase tracking-widest text-gray-500">Quantity</span>
                               <div className="flex items-center border border-gray-300">
                                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                                   <span className="px-4 font-sans font-bold">{quantity}</span>
                                   <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} className="px-4 py-2 hover:bg-gray-100">+</button>
                               </div>
                           </div>

                            <button className="w-full bg-vakya-black text-white py-4 font-sans font-bold uppercase tracking-widest hover:bg-vakya-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={selectedProduct.stock <= 0}>
                                {selectedProduct.stock > 0 ? `Add to Cart - $${selectedProduct.price * quantity}` : 'Out of Stock'}
                            </button>
                            
                            {selectedProduct.stock < 5 && selectedProduct.stock > 0 && (
                                <p className="text-center text-xs text-red-500 font-bold uppercase tracking-widest">Only {selectedProduct.stock} left in stock!</p>
                            )}
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* FULL SCREEN IMAGE OVERLAY */}
       {isFullScreenImage && selectedProduct && (
           <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center" onClick={() => setIsFullScreenImage(false)}>
               <img src={selectedProduct.image} className="max-w-full max-h-full object-contain cursor-zoom-out" alt={selectedProduct.name} />
               <button className="absolute top-4 right-4 text-white p-2">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           </div>
       )}
    </div>
  );
};

export default Store;