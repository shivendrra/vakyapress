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
    document.title = "Store | Vakya";
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
    <div className="w-full bg-white pt-20 md:pt-24">
      {/* Store Hero - Snaps to navbar */}
      <section className="bg-vakya-paper py-24 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto text-center">
           <h1 className="font-serif text-7xl md:text-8xl mb-8 text-vakya-black leading-tight">Vakya Goods</h1>
           <p className="font-sans text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
             High-quality essentials for the thoughtful reader.<br className="hidden md:block" /> 
             100% of profits fund our investigative reporting.
           </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {products.length > 0 ? products.map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                    <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                         <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button className="w-full bg-white text-black py-3 font-sans font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-black hover:text-white transition-colors">
                                View Details
                            </button>
                         </div>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">{product.category}</span>
                            <h3 className="font-serif text-2xl leading-tight group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                        </div>
                        <span className="font-sans font-bold text-lg">${product.price}</span>
                    </div>
                </div>
            )) : (
                <div className="col-span-3 text-center py-24 border border-dashed border-gray-200 rounded-lg">
                    <p className="font-serif text-2xl text-gray-400 mb-2">Inventory Updating</p>
                    <p className="font-sans text-sm text-gray-500 uppercase tracking-widest">Check back soon for new arrivals.</p>
                </div>
            )}
         </div>
      </section>
      
       {/* Store Trust Banner */}
       <section className="bg-vakya-black text-white py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center font-sans text-xs font-bold tracking-widest uppercase">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-vakya-accent">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span>Worldwide Shipping</span>
                </div>
                 <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-vakya-accent">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span>Ethically Sourced</span>
                </div>
                 <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-vakya-accent">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span>Supports Journalism</span>
                </div>
            </div>
       </section>

       {/* PRODUCT DETAIL MODAL */}
       {selectedProduct && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProduct}></div>
               
               <div className="bg-white w-full max-w-6xl h-[90vh] md:h-[80vh] relative z-10 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
                   <button onClick={closeProduct} className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-colors backdrop-blur-sm">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>

                   {/* Left: Image */}
                   <div className="w-full md:w-3/5 h-1/2 md:h-full bg-gray-100 relative group cursor-zoom-in" onClick={() => setIsFullScreenImage(true)}>
                       <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                       <div className="absolute bottom-6 left-6 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           Click to Expand
                       </div>
                   </div>

                   {/* Right: Details */}
                   <div className="w-full md:w-2/5 p-8 md:p-16 overflow-y-auto flex flex-col bg-white">
                       <span className="font-sans text-xs font-bold text-vakya-salmon uppercase tracking-widest mb-3">{selectedProduct.category}</span>
                       <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-none">{selectedProduct.name}</h2>
                       <div className="text-3xl font-sans font-light mb-8 text-gray-900">${selectedProduct.price}</div>

                       <div className="prose prose-sm font-sans text-gray-600 mb-10 leading-relaxed">
                           <p>{selectedProduct.description || "No description available."}</p>
                       </div>

                       <div className="mt-auto border-t border-gray-100 pt-8 space-y-8">
                           <div className="flex items-center justify-between">
                               <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400">Quantity</span>
                               <div className="flex items-center border border-gray-200">
                                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">-</button>
                                   <span className="px-4 font-sans font-bold w-12 text-center">{quantity}</span>
                                   <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">+</button>
                               </div>
                           </div>

                            <button className="w-full bg-vakya-black text-white py-5 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={selectedProduct.stock <= 0}>
                                {selectedProduct.stock > 0 ? `Add to Cart — $${(selectedProduct.price * quantity).toFixed(2)}` : 'Out of Stock'}
                            </button>
                            
                            {selectedProduct.stock < 5 && selectedProduct.stock > 0 && (
                                <p className="text-center text-xs text-red-500 font-bold uppercase tracking-widest animate-pulse">Low Stock: Only {selectedProduct.stock} left</p>
                            )}
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* FULL SCREEN IMAGE OVERLAY */}
       {isFullScreenImage && selectedProduct && (
           <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4" onClick={() => setIsFullScreenImage(false)}>
               <img src={selectedProduct.image} className="max-w-full max-h-full object-contain cursor-zoom-out shadow-2xl" alt={selectedProduct.name} />
               <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           </div>
       )}
    </div>
  );
};

export default Store;