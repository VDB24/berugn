
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  MessageSquare, 
  Sliders, 
  Info, 
  Sparkles 
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-lg py-4 px-6 border-b animate-fade-in">
      <nav className="flex flex-col space-y-4">
        {currentUser ? (
          <>
            <Link 
              to="/browse" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Home size={18} className="text-muted-foreground" />
              Browse
            </Link>
            <Link 
              to="/matches" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Users size={18} className="text-muted-foreground" />
              Matches
            </Link>
            <Link 
              to="/preferences" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Sliders size={18} className="text-muted-foreground" />
              Preferences
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <User size={18} className="text-muted-foreground" />
              Profile
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Settings size={18} className="text-muted-foreground" />
              Settings
            </Link>
            
            <div className="pt-2 mt-2 border-t">
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="flex items-center w-full justify-start px-0 py-3 gap-3 text-foreground/80 hover:text-destructive font-medium"
              >
                <LogOut size={18} className="text-muted-foreground" />
                Log out
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/features" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Sparkles size={18} className="text-muted-foreground" />
              Features
            </Link>
            <Link 
              to="/about" 
              className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
              onClick={onClose}
            >
              <Info size={18} className="text-muted-foreground" />
              About
            </Link>
            <div className="pt-4 mt-4 border-t space-y-4">
              <Link 
                to="/login" 
                className="flex items-center font-medium text-foreground py-3 hover:text-primary transition-colors gap-3"
                onClick={onClose}
              >
                <User size={18} className="text-muted-foreground" />
                Log in
              </Link>
              <Link 
                to="/register" 
                onClick={onClose}
              >
                <Button className="w-full gap-2">
                  <MessageSquare size={16} />
                  Sign up
                </Button>
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
