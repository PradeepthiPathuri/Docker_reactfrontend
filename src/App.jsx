import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Settings } from './components/Settings';
import { PassShare } from './components/PassShare';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { NearbyShare } from './components/NearbyShare';
import { ChatRoom } from './components/ChatRoom';
import { Groups } from './components/Groups';
import { Drive } from './components/Drive';
import { Profile } from './components/Profile';
import { Dashboard } from './components/Dashboard';
import { themes } from './lib/themes';

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const currentTheme = themes[theme] || themes.default;

  return (
    <Router>
      <div className={`min-h-screen ${currentTheme.background} flex flex-col`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/*"
            element={
              <div className="flex flex-col h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto px-4 container mx-auto py-2">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/pass-share" element={<PassShare />} />
                    <Route path="/nearby" element={<NearbyShare />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/drive" element={<Drive />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<ChatRoom />} />
                    <Route path="/settings" element={<Settings setTheme={setTheme} theme={theme} />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;