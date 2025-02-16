import { motion } from 'framer-motion';
import { FileUp, Users, FolderOpen, Settings, LogOut, Menu, X, UserCircle, Group, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileUp, label: 'PassShare', path: '/pass-share' },
  { icon: Users, label: 'Nearby Share', path: '/nearby' },
  { icon: Group, label: 'Groups', path: '/groups' },
  { icon: FolderOpen, label: 'My Drive', path: '/drive' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/10 z-40"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <FileUp className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">FileShare</span>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${location.pathname === item.path 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        className="md:hidden"
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-[#0A0A0A]/95 backdrop-blur-lg">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              handleSignOut();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
};