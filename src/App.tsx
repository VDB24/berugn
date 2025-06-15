
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import CreateProfile from '@/pages/CreateProfile';
import Browse from '@/pages/Browse';
import Matches from '@/pages/Matches';
import ExtendedProfile from '@/pages/ExtendedProfile';
import ViewProfile from '@/pages/ViewProfile';
import Preferences from '@/pages/Preferences';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <NotificationsProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-profile" element={<CreateProfile />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/extended-profile" element={<ExtendedProfile />} />
                    <Route path="/profile/:profileId" element={<ViewProfile />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </NotificationsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
