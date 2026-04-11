import React from 'react';
import { StaffProfile, UserRole } from '../../types';

interface StaffTabProps {
  staffList: StaffProfile[];
  editingStaff: StaffProfile | null;
  setEditingStaff: React.Dispatch<React.SetStateAction<StaffProfile | null>>;
  handleSaveStaff: () => Promise<void>;
  handleDeleteStaff: (id: string) => Promise<void>;
  createNewStaff: () => void;
  isSaving: boolean;
}

const StaffTab: React.FC<StaffTabProps> = ({
  staffList,
  editingStaff,
  setEditingStaff,
  handleSaveStaff,
  handleDeleteStaff,
  createNewStaff,
  isSaving
}) => {
  return (
    <div>
      {!editingStaff ? (
        <>
          <div className="flex justify-between mb-8 items-center">
            <h2 className="font-serif text-3xl">Manage Staff & Access</h2>
            <button onClick={createNewStaff} className="bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
              + Add Staff Member
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {staffList.map(staff => (
              <div key={staff.id} className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img src={staff.image || `https://ui-avatars.com/api/?name=${staff.name}`} className="w-12 h-12 rounded-full object-cover grayscale" alt={staff.name} />
                  <div>
                    <h4 className="font-serif text-lg leading-none">{staff.name}</h4>
                    <p className="text-xs font-bold uppercase text-vakya-salmon">{staff.title}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs mb-4">
                  <span className="bg-gray-100 px-2 py-1">{staff.department}</span>
                  <span className={`px-2 py-1 ${staff.accessLevel === 'admin' ? 'bg-red-100 text-red-700' : staff.accessLevel === 'writer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {staff.accessLevel.toUpperCase()} ACCESS
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
                  <button onClick={() => setEditingStaff(staff)} className="text-xs font-bold uppercase hover:text-vakya-black">Edit Profile</button>
                  <button onClick={() => handleDeleteStaff(staff.id)} className="text-xs font-bold uppercase text-gray-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl">Staff Profile Editor</h2>
            <div className="flex gap-4">
              <button onClick={() => setEditingStaff(null)} className="text-gray-500 font-bold text-xs uppercase hover:text-black">Cancel</button>
              <button onClick={handleSaveStaff} disabled={isSaving} className="bg-vakya-black text-white px-6 py-2 font-bold text-xs uppercase tracking-widest hover:bg-vakya-salmon hover:text-black transition-colors">
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 border-b border-gray-100 pb-8 mb-8">
              <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Core Info</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                  <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Job Title</label>
                  <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.title} onChange={e => setEditingStaff({ ...editingStaff, title: e.target.value })} placeholder="Senior Editor" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Department</label>
                  <select className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.department} onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value as any })}>
                    <option value="Editorial">Editorial</option>
                    <option value="Creative">Creative (Art/Video/Sound)</option>
                    <option value="Production">Production</option>
                    <option value="Tech">Tech</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Profile Image URL</label>
                  <input className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.image} onChange={e => setEditingStaff({ ...editingStaff, image: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Bio</label>
                <textarea rows={4} className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.bio} onChange={e => setEditingStaff({ ...editingStaff, bio: e.target.value })} />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 border-r border-gray-100 pr-8">
              <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Access Control</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Account Email</label>
                  <input type="email" className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} placeholder="jane@vakyapress.com" />
                  <p className="text-xs text-gray-400 mt-1">Must match their registered login email.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Platform Role</label>
                  <select className="w-full p-3 border border-gray-300 bg-white text-black font-sans" value={editingStaff.accessLevel} onChange={e => setEditingStaff({ ...editingStaff, accessLevel: e.target.value as UserRole })}>
                    <option value="audience">No Access (Public Profile Only)</option>
                    <option value="writer">Writer (Can Create Articles)</option>
                    <option value="admin">Admin (Full Control)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 pl-4">
              <h4 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Social Links</h4>
              <div className="space-y-3">
                <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" placeholder="Twitter URL" value={editingStaff.socials.twitter || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, twitter: e.target.value } })} />
                <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" placeholder="LinkedIn URL" value={editingStaff.socials.linkedin || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, linkedin: e.target.value } })} />
                <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" placeholder="Website URL" value={editingStaff.socials.website || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, website: e.target.value } })} />
                <input className="w-full p-2 border border-gray-300 text-sm bg-white text-black font-sans" placeholder="Instagram URL" value={editingStaff.socials.instagram || ''} onChange={e => setEditingStaff({ ...editingStaff, socials: { ...editingStaff.socials, instagram: e.target.value } })} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTab;
