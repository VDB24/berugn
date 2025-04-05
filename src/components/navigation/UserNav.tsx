
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import { LogOut, User, Settings, Search, Users, Sliders } from 'lucide-react';

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
      <NotificationsPopover />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all p-0">
            <Avatar className="h-full w-full">
              <AvatarImage src={currentUser.profileImage || undefined} alt={currentUser.name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentUser.name?.[0] || currentUser.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 overflow-hidden p-1">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserNav;
