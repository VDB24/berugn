
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';

const UserNav = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
          <Button variant="outline" className="font-medium">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button>Sign up</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/browse" className="font-medium text-foreground hover:text-primary transition-colors">
        Browse
      </Link>
      <Link to="/matches" className="font-medium text-foreground hover:text-primary transition-colors">
        Matches
      </Link>
      <Link to="/preferences" className="font-medium text-foreground hover:text-primary transition-colors">
        Preferences
      </Link>
      <NotificationsPopover />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback>{currentUser.name?.[0] || currentUser.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserNav;
