import { motion } from 'framer-motion';
import { useState } from 'react';
import { Camera, Mail, Lock, Bell, Shield, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const stats = [
    { icon: Upload, label: 'Uploaded', value: '2.5 GB' },
    { icon: Download, label: 'Downloaded', value: '1.8 GB' },
    { icon: Shield, label: 'Protected Files', value: '28' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white mb-2">{userData.name}</h1>
            <p className="text-gray-400">{userData.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
              <stat.icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white mt-4"
                >
                  Save Changes
                </motion.button>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
              >
                Update Password
              </motion.button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive email updates about your activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">File Share Notifications</h3>
                  <p className="text-sm text-gray-400">Get notified when someone shares files with you</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Profile Visibility</h3>
                  <p className="text-sm text-gray-400">Control who can see your profile</p>
                </div>
                <select className="bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-500 rounded-lg"
                >
                  Enable
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};