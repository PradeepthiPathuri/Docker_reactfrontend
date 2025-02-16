import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Star,
  Clock,
  FolderOpen,
  Plus,
  File,
  MoreVertical,
  ChevronRight,
  Search,
  Upload,
  Grid,
  List,
  Filter,
  Download,
  Trash2,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const sidebarItems = [
  { icon: Star, label: 'Favorites', id: 'favorites' },
  { icon: Clock, label: 'Recents', id: 'recents' },
  { icon: FolderOpen, label: 'My Files', id: 'files' }
];

export const Drive = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItem, setSelectedItem] = useState(null);

  const [files] = useState([
    { id: 1, name: 'Project Docs', type: 'folder', items: 5, date: '2024-03-15', size: '-' },
    { id: 2, name: 'Report.pdf', type: 'file', size: '2.5 MB', date: '2024-03-14' },
    { id: 3, name: 'Images', type: 'folder', items: 12, date: '2024-03-13', size: '-' },
    { id: 4, name: 'Presentation.pptx', type: 'file', size: '5.1 MB', date: '2024-03-12' }
  ]);

  const createFolder = () => {
    if (folderName) {
      toast.success('Folder created successfully!');
      setShowNewFolderModal(false);
      setFolderName('');
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      toast.success(`Uploading ${files.length} file(s)`);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleAction = (action) => {
    if (!selectedItem) return;
    
    switch (action) {
      case 'download':
        toast.success(`Downloading ${selectedItem.name}`);
        break;
      case 'share':
        toast.success(`Sharing ${selectedItem.name}`);
        break;
      case 'delete':
        toast.success(`Deleted ${selectedItem.name}`);
        break;
      default:
        break;
    }
    setSelectedItem(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-8rem)] mt-8 bg-[#0A0A0A] rounded-lg overflow-hidden"
    >
      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('file-upload').click()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white mb-6"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Files</span>
        </motion.button>
        <input
          type="file"
          id="file-upload"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
                <Filter className="h-5 w-5" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                <Plus className="h-5 w-5" />
                <span>New Folder</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1 p-6 overflow-auto">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            {files.map((file) => (
              <motion.div
                key={file.id}
                whileHover={{ y: -2 }}
                onClick={() => handleItemClick(file)}
                className={`${
                  viewMode === 'grid'
                    ? 'bg-white/10 backdrop-blur-lg rounded-lg p-4'
                    : 'flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-lg p-4'
                } ${selectedItem?.id === file.id ? 'ring-2 ring-blue-500' : ''} cursor-pointer`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          {file.type === 'folder' ? (
                            <FolderOpen className="h-6 w-6 text-blue-500" />
                          ) : (
                            <File className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{file.name}</h3>
                          <p className="text-sm text-gray-400">
                            {file.type === 'folder' ? `${file.items} items` : file.size}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <span>Modified {new Date(file.date).toLocaleDateString()}</span>
                      {file.type === 'folder' && (
                        <button className="p-1 hover:text-white rounded-full hover:bg-white/5">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        {file.type === 'folder' ? (
                          <FolderOpen className="h-6 w-6 text-blue-500" />
                        ) : (
                          <File className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{file.name}</h3>
                        <p className="text-sm text-gray-400">Modified {new Date(file.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{file.size}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('download');
                          }}
                          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('share');
                          }}
                          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('delete');
                          }}
                          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
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
            <h2 className="text-xl font-bold text-white mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-white/5 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createFolder}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white"
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};