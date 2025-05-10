import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FileUp, Copy, Key, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const PassShare = () => {
  const [passkey, setPasskey] = useState('');
  const [joinPasskey, setJoinPasskey] = useState('');
  const [isInSession, setIsInSession] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const stompClientRef = useRef(null);
  const backendUrl = 'springbackend-production-93ac.up.railway.app:8080'; // Adjust if different

  // Retrieve user from localStorage
  const getUserFromLocalStorage = () => {
    const authSession = localStorage.getItem('authSession');
    if (authSession) {
      try {
        const parsed = JSON.parse(authSession);
        return parsed.user || null;
      } catch (error) {
        console.error('Error parsing authSession:', error);
        return null;
      }
    }
    return null;
  };

  const generatePasskey = async () => {
    const user = getUserFromLocalStorage();
    if (!user || !user.username) {
      toast.error('Please log in to create a session');
      return;
    }

    setIsLoading(true);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasskey(result);

    try {
      await axios.post(`${backendUrl}/api/sessions/create`, {
        passkey: result,
        username: user.username,
      });
      setIsInSession(true);
      toast.success(`Session created with passkey: ${result}`);
      connectWebSocket(result);
      fetchSessionFiles(result);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error(error.response?.data || 'Failed to create session');
      setPasskey('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPasskey = () => {
    if (passkey) {
      navigator.clipboard.writeText(passkey);
      toast.success('Passkey copied to clipboard!');
    }
  };

  const handleJoin = async () => {
    const user = getUserFromLocalStorage();
    if (!user || !user.username) {
      toast.error('Please log in to join a session');
      return;
    }

    if (!joinPasskey) {
      toast.error('Please enter a passkey');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${backendUrl}/api/sessions/join`, {
        passkey: joinPasskey,
        username: user.username,
      });
      setPasskey(joinPasskey);
      setIsInSession(true);
      toast.success('Joined session!');
      connectWebSocket(joinPasskey);
      fetchSessionFiles(joinPasskey);
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error(error.response?.data || 'Failed to join session');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (passkey) => {
    const socket = new SockJS(`${backendUrl}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/session/${passkey}`, () => {
        fetchSessionFiles(passkey);
      });
    });
    stompClientRef.current = stompClient;
  };

  const fetchSessionFiles = async (passkey) => {
    try {
      const response = await axios.get(`${backendUrl}/api/sessions/files/${passkey}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching session files:', error);
      toast.error(error.response?.data || 'Failed to fetch files');
    }
  };

  const handleFileUpload = async (file) => {
    const user = getUserFromLocalStorage();
    if (!user || !user.id) {
      toast.error('Please log in to upload files');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${backendUrl}/api/sessions/upload/${passkey}/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data || 'Failed to upload file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(handleFileUpload);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      selectedFiles.forEach(handleFileUpload);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${backendUrl}/api/file/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  useEffect(() => {
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

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
            ease: 'easeInOut',
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
              ease: 'easeInOut',
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
            ease: 'easeInOut',
          }}
          className="absolute mt-32 text-blue-500 font-medium"
        >
          Connecting to secure channel...
        </motion.p>
      </div>
    );
  }

  if (!isInSession) {
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
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-block p-4 bg-blue-500/20 backdrop-blur-lg rounded-full mb-4"
          >
            <FileUp className="h-12 w-12 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 text-white">Secure File Sharing</h1>
          <p className="text-gray-400">Share files securely with a generated passkey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center"
          >
            <Upload className="h-8 w-8 text-blue-500 mx-auto mb-3" />
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
                  value={joinPasskey}
                  onChange={(e) => setJoinPasskey(e.target.value)}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleJoin}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                Join Share
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2 text-white">File Sharing Session</h1>
        <p className="text-gray-400">Passkey: {passkey}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Upload Files</h2>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
            }`}
          >
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Drag and drop files here or click to select
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Select Files
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Shared Files</h2>
          {files.length === 0 ? (
            <p className="text-gray-400">No files shared yet</p>
          ) : (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <span className="text-white">{file.fileName}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(file.id, file.fileName)}
                    className="p-2 text-blue-500 hover:bg-white/10 rounded-lg"
                  >
                    <Download className="h-5 w-5" />
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PassShare;