import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Copy, Key, Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const PassShare = () => {
  const navigate = useNavigate();
  const [passkey, setPasskey] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generatePasskey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasskey(result);
    toast.success('Passkey generated! Waiting for someone to join...');
  };

  const copyPasskey = () => {
    navigator.clipboard.writeText(passkey);
    toast.success('Copied to clipboard!');
  };

  const handleJoin = () => {
    if (isJoining) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/chat');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <FileUp size={64} className="text-blue-500" />
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-blue-500 rounded-full filter blur-lg opacity-30"
          />
        </motion.div>
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute mt-32 text-blue-500 font-medium"
        >
          Connecting to secure channel...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block p-4 bg-blue-500/20 backdrop-blur-lg rounded-full mb-4"
        >
          <FileUp className="h-12 w-12 text-blue-500" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2 text-white">Secure File Sharing</h1>
        <p className="text-gray-400">Share files securely with a generated passkey</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center"
        >
          <Send className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Send Files</h3>
          <p className="text-sm text-gray-400">Share files with others</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center"
        >
          <Download className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Receive Files</h3>
          <p className="text-sm text-gray-400">Get files from others</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center"
        >
          <FileUp className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Share History</h3>
          <p className="text-sm text-gray-400">View recent transfers</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Section */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Create Share</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={passkey}
                readOnly
                placeholder="Generated passkey"
                className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-400"
              />
              {passkey && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={copyPasskey}
                  className="p-2 text-blue-500 hover:bg-white/5 rounded-lg"
                >
                  <Copy className="h-5 w-5" />
                </motion.button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={generatePasskey}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Generate Passkey
            </motion.button>
          </div>
        </motion.div>

        {/* Join Section */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Join Share</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter passkey"
                className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                maxLength={8}
                onChange={(e) => setIsJoining(e.target.value.length === 8)}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!isJoining}
              onClick={handleJoin}
              className={`w-full py-2 rounded-lg transition-all duration-300 ${
                isJoining
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20'
                  : 'bg-white/5 text-gray-400 cursor-not-allowed'
              }`}
            >
              Join Share
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};