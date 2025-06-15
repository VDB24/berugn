
import { Home, User, Briefcase, FileText, Users, Settings } from 'lucide-react';
import { TubelightNavBar } from '@/components/ui/tubelight-navbar';

const Header = () => {
  // Navigation items for the tubelight navbar including all main sections
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'About', url: '/about', icon: User },
    { name: 'Features', url: '/features', icon: Briefcase },
    { name: 'Browse', url: '/browse', icon: FileText },
    { name: 'Matches', url: '/matches', icon: Users },
    { name: 'Preferences', url: '/preferences', icon: Settings }
  ];

  return <TubelightNavBar items={navItems} />;
};

export default Header;
