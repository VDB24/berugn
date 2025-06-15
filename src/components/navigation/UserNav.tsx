
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Users, Sliders } from 'lucide-react';

const UserNav = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <>
        <Link to="/features" className="font-medium text-foreground hover:text-primary transition-colors">
          Features
        </Link>
        <Link to="/about" className="font-medium text-foreground hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/login">
          <Button variant="outline" className="font-medium shadow-sm hover:shadow-md transition-all">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button className="shadow-md hover:shadow-lg transition-all">Sign up</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/browse" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors relative group">
        <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        <span>Browse</span>
      </Link>
      <Link to="/matches" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors relative group">
        <Users size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        <span>Matches</span>
      </Link>
      <Link to="/preferences" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors relative group">
        <Sliders size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        <span>Preferences</span>
      </Link>
    </>
  );
};

export default UserNav;
