import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send, FileUp, Download, User } from 'lucide-react';

export const ChatRoom = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Connection established securely', type: 'system' },
    { id: 2, sender: 'John', text: 'Hey, I\'m sending you some files', type: 'message' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Handle file upload logic here
    const fileNames = Array.from(files).map(file => file.name).join(', ');
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'You',
      text: `Uploading: ${fileNames}`,
      type: 'file'
    }]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'You',
        text: newMessage,
        type: 'message'
      }]);
      setNewMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-20 p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Secure Chat</h2>
              <p className="text-blue-100 text-sm">2 participants</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="h-[500px] overflow-y-auto p-4 space-y-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-center text-sm'
                    : message.sender === 'You'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                } ${message.type === 'system' ? 'w-full' : ''}`}
              >
                {message.type !== 'system' && (
                  <p className="text-xs opacity-75 mb-1">{message.sender}</p>
                )}
                {message.type === 'file' ? (
                  <div className="flex items-center space-x-2">
                    <FileUp className="h-4 w-4" />
                    <span>{message.text}</span>
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* File Drop Overlay */}
        <div className="px-4 py-2 bg-blue-50 text-sm text-blue-600 text-center">
          Drag and drop files here to share
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FileUp className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              multiple
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};