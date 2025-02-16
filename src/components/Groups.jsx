import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Plus, Link as LinkIcon, Users, Copy, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const Groups = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [groups] = useState([
    { id: 1, name: 'Project Alpha', members: 5, lastActive: '2 hours ago' },
    { id: 2, name: 'Design Team', members: 8, lastActive: '5 mins ago' },
    { id: 3, name: 'Marketing', members: 12, lastActive: 'Just now' }
  ]);

  const createGroup = () => {
    if (groupName) {
      toast.success('Group created successfully!');
      setShowCreateModal(false);
      setGroupName('');
    }
  };

  const joinGroup = () => {
    if (groupLink) {
      toast.success('Joined group successfully!');
      setShowJoinModal(false);
      setGroupLink('');
      navigate('/chat');
    }
  };

  const copyInviteLink = (groupId) => {
    navigator.clipboard.writeText(`https://fileshare.app/group/${groupId}`);
    toast.success('Invite link copied to clipboard!');
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Groups</h1>
          <p className="text-gray-400">Create or join groups to share files</p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
          >
            <Plus className="h-5 w-5" />
            <span>Create Group</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg text-white"
          >
            <LinkIcon className="h-5 w-5" />
            <span>Join Group</span>
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ y: -2 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Group className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{group.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{group.members} members</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyInviteLink(group.id)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Copy className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">Active {group.lastActive}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="px-4 py-1 bg-blue-500/20 rounded-full text-blue-500 text-sm font-medium hover:bg-blue-500/30"
              >
                Open Chat
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0A0A0A] rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Group</h2>
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createGroup}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0A0A0A] rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Join Group</h2>
            <input
              type="text"
              placeholder="Paste group invite link"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={joinGroup}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
              >
                Join
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};