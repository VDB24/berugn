
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
// Removed OTPVerification import
import Browse from '@/pages/Browse';
import Matches from '@/pages/Matches';
import Preferences from '@/pages/Preferences';
import CreateProfile from '@/pages/CreateProfile';
import About from '@/pages/About';
import Features from '@/pages/Features';
import NotFound from '@/pages/NotFound';
import './App.css';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <NotificationsProvider>
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* Removed OTP verification route */}
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/preferences" element={<Preferences />} />
                  <Route path="/create-profile" element={<CreateProfile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Toaster />
            </NotificationsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
