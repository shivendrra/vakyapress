import React from 'react';
import { UserProfile } from '../types';

interface UserProfileProps {
  user: UserProfile;
}

const UserProfilePage: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-vakya-paper py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 shadow-sm">
        <h1 className="font-serif text-3xl mb-8 border-b border-gray-200 pb-4">Account Settings</h1>

        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Profile</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded">
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Email</label>
                <div className="font-serif text-lg">{user.email}</div>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded">
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Membership</label>
                <div className="font-serif text-lg text-vakya-black">Free Audience Tier</div>
              </div>
            </div>
            <button className="mt-4 text-sm font-sans font-bold text-vakya-salmon hover:underline">Change Password</button>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Reading Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-gray-700">Email Newsletter</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-black border-gray-300 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-gray-700">Breaking News Alerts</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-black border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Muted Topics */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-gray-400 mb-4">Muted Topics</h3>
            <p className="font-sans text-sm text-gray-500 mb-4">Articles with these tags will appear less frequently in your feed.</p>
            <div className="flex flex-wrap gap-2">
              {['Politics', 'Sports'].map(topic => (
                <span key={topic} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded text-sm font-sans text-gray-600">
                  {topic}
                  <button className="ml-2 text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
              <button className="text-sm text-gray-400 border border-dashed border-gray-300 px-3 py-1 rounded hover:border-gray-500">+ Add Topic</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end">
          <button className="bg-vakya-black text-white px-6 py-2 font-sans font-bold uppercase tracking-widest hover:bg-gray-800">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;