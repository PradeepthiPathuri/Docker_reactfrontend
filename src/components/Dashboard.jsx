import { motion } from 'framer-motion';
import { FileUp, Users, FolderOpen, Clock, Star, ChevronRight, BarChart2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const stats = [
    { title: 'Total Storage', value: '45.5 GB', change: '+2.5%', trend: 'up' },
    { title: 'Files Shared', value: '1,234', change: '+12%', trend: 'up' },
    { title: 'Active Groups', value: '8', change: '+1', trend: 'up' },
    { title: 'Storage Used', value: '75%', change: '-5%', trend: 'down' }
  ];

  const recentFiles = [
    { name: 'Project Presentation.pptx', type: 'file', date: '2 hours ago' },
    { name: 'Design Assets', type: 'folder', date: '5 hours ago' },
    { name: 'Meeting Notes.pdf', type: 'file', date: 'Yesterday' }
  ];

  const quickActions = [
    { icon: FileUp, label: 'Upload File', path: '/drive' },
    { icon: Users, label: 'Share Files', path: '/pass-share' },
    { icon: FolderOpen, label: 'My Files', path: '/drive' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-20 pb-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`px-2 py-1 rounded text-sm ${
                stat.trend === 'up' ? 'text-green-500 bg-green-500/20' : 'text-red-500 bg-red-500/20'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <BarChart2 className="h-16 w-full text-blue-500 opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <action.icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-white">{action.label}</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Files */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Files</h2>
            <Link to="/drive" className="text-blue-500 hover:text-blue-400 text-sm">View All</Link>
          </div>
          <div className="space-y-4">
            {recentFiles.map((file, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {file.type === 'folder' ? (
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileUp className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-white">{file.name}</p>
                    <p className="text-sm text-gray-400">{file.date}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Storage Overview */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Storage Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: '75%' }}
              />
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-400">0 GB</span>
              <span className="text-blue-500">45.5 GB used</span>
              <span className="text-gray-400">60 GB</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-400">Documents</span>
              </div>
              <span className="text-white">25 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-gray-400">Media</span>
              </div>
              <span className="text-white">15 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-400">Other</span>
              </div>
              <span className="text-white">5.5 GB</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};