import React from 'react';
import { Product } from '../../types';

interface StoreTabProps {
  products: Product[];
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  handleSaveProduct: () => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
  createNewProduct: () => void;
}

const StoreTab: React.FC<StoreTabProps> = ({
  products,
  editingProduct,
  setEditingProduct,
  handleSaveProduct,
  handleDeleteProduct,
  createNewProduct
}) => {
  return (
    <div>
      {!editingProduct ? (
        <div className="bg-white border border-gray-200">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-serif text-2xl">Products</h3>
            <button onClick={createNewProduct} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase">+ Add Product</button>
          </div>
          {products.map(p => (
            <div key={p.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
              <span>{p.name}</span>
              <div className="flex gap-4 items-center">
                <span className="text-sm font-bold">${p.price}</span>
                <button onClick={() => setEditingProduct(p)} className="text-blue-600 text-xs font-bold uppercase">Edit</button>
                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 text-xs font-bold uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 border border-gray-200">
          <h3 className="font-serif text-2xl mb-4">Edit Product</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input className="block w-full p-2 border border-gray-300 bg-white text-black font-sans" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="Name" />
            <input className="block w-full p-2 border border-gray-300 bg-white text-black font-sans" type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} placeholder="Price" />
            <input className="block w-full p-2 border border-gray-300 bg-white text-black font-sans" value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="Image URL" />
            <input className="block w-full p-2 border border-gray-300 bg-white text-black font-sans" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} placeholder="Category" />
            <textarea className="col-span-2 block w-full p-2 border border-gray-300 bg-white text-black font-sans" rows={4} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} placeholder="Description" />
            <div className="col-span-2">
              <label className="text-xs uppercase font-bold text-gray-500">Stock</label>
              <input className="block w-full p-2 border border-gray-300 bg-white text-black font-sans" type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveProduct} className="bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest">Save</button>
            <button onClick={() => setEditingProduct(null)} className="text-gray-500 uppercase font-bold text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreTab;