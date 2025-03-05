
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

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
    <div className="md:hidden bg-background py-4 px-6 animate-fade-in">
      <nav className="flex flex-col space-y-4">
        {currentUser ? (
          <>
            <Link 
              to="/browse" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Browse
            </Link>
            <Link 
              to="/matches" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Matches
            </Link>
            <Link 
              to="/preferences" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Preferences
            </Link>
            <Link 
              to="/profile" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Profile
            </Link>
            <Link 
              to="/settings" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Settings
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start px-0">
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link 
              to="/features" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              About
            </Link>
            <Link 
              to="/login" 
              className="font-medium text-foreground py-2 hover:text-primary transition-colors"
              onClick={onClose}
            >
              Log in
            </Link>
            <Link 
              to="/register" 
              onClick={onClose}
            >
              <Button className="w-full">Sign up</Button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
