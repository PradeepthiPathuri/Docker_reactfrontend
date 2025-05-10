import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Camera, Mail, Lock, Bell, Shield, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import config from '../config.js';


const initializeAuthSession = () => {
  const authSession = {
    user: {
      id: 4,
      username: 'Rohith',
      email: 'rohithvema09@gmail.com',
    },
  };
  localStorage.setItem('authSession', JSON.stringify(authSession));
};

initializeAuthSession();

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    avatar: null,
    userId: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const authSession = localStorage.getItem('authSession');
  const userId = authSession ? JSON.parse(authSession)?.user?.id : null;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('No user session found');
        return;
      }

      try {
        const userResponse = await fetch(`${config.url}/api/users/view/${userId}`, {
          credentials: 'include',
        });

        console.log('API Response Status:', userResponse.status);
        console.log('API Response Headers:', userResponse.headers.get('Content-Type'));

        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`HTTP error: ${userResponse.status} ${userResponse.statusText} - ${errorText}`);
        }

        const contentType = userResponse.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await userResponse.text();
          throw new Error(`Expected JSON, got ${contentType}: ${text}`);
        }

        const text = await userResponse.text();
        if (!text) {
          throw new Error('Empty response from server');
        }

        let user;
        try {
          user = JSON.parse(text);
        } catch (jsonError) {
          throw new Error(`Invalid JSON: ${jsonError.message} - Response: ${text}`);
        }

        let avatar = null;
        const pictureResponse = await fetch(`${config.url}/api/users/profile-picture/${userId}`, {
          credentials: 'include',
        });
        if (pictureResponse.ok) {
          const blob = await pictureResponse.blob();
          avatar = URL.createObjectURL(blob);
        } else if (pictureResponse.status !== 404) {
          console.warn('Error fetching profile picture:', pictureResponse.status);
        }

        setUserData({
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          avatar,
          userId,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);

        try {
          const session = JSON.parse(authSession);
          setUserData({
            username: session.user.username || 'N/A',
            email: session.user.email || 'N/A',
            avatar: null,
            userId,
          });
          console.log('Using local session data due to API failure');
        } catch (fallbackError) {
          console.error('Error parsing localStorage:', fallbackError);
        }
      }
    };

    fetchUserData();

    return () => {
      if (userData.avatar) {
        URL.revokeObjectURL(userData.avatar);
      }
    };
  }, [userId, authSession]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      console.error('Please upload a valid image (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error('Profile picture must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${config.url}/api/users/update-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload profile picture');
      }

      const pictureResponse = await fetch(`${config.url}/api/users/profile-picture/${userId}`, {
        credentials: 'include',
      });
      if (!pictureResponse.ok) {
        throw new Error('Failed to fetch updated profile picture');
      }

      if (userData.avatar) {
        URL.revokeObjectURL(userData.avatar);
      }

      const blob = await pictureResponse.blob();
      const newAvatar = URL.createObjectURL(blob);

      setUserData((prev) => ({
        ...prev,
        avatar: newAvatar,
      }));
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${config.url}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          username: userData.username,
          email: userData.email,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 409) {
          if (errorText.includes('Username')) {
            throw new Error('Username already taken');
          } else if (errorText.includes('Email')) {
            throw new Error('Email already taken');
          }
        }
        throw new Error(errorText || 'Failed to update profile');
      }

      const updatedSession = JSON.parse(authSession);
      updatedSession.user.username = userData.username;
      updatedSession.user.email = userData.email;
      localStorage.setItem('authSession', JSON.stringify(updatedSession));

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      console.error('New password and confirmation do not match');
      return;
    }

    try {
      const response = await fetch(`${config.url}/api/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update password');
      }

      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const stats = [
    { icon: Upload, label: 'Uploaded', value: '-' },
    { icon: Download, label: 'Downloaded', value: '-' },
    { icon: Shield, label: 'Protected Files', value: '-' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={userData.avatar || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-pic-upload"
            />
            <label
              htmlFor="profile-pic-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </label>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white mb-2">{userData.username || 'N/A'}</h1>
            <p className="text-gray-400">{userData.email || 'N/A'}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </motion.button>
        </div>

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
                  Username
                </label>
                <input
                  type="text"
                  value={userData.username || ''}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
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
                  value={userData.email || ''}
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
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordUpdate}
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
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};