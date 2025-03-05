
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Browse from '@/pages/Browse';
import Matches from '@/pages/Matches';
import Preferences from '@/pages/Preferences';
import CreateProfile from '@/pages/CreateProfile';
import NotFound from '@/pages/NotFound';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <NotificationsProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </NotificationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
