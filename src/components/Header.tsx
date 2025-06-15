
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, Briefcase, FileText } from 'lucide-react';
import MobileMenu from './navigation/MobileMenu';
import { TubelightNavBar } from '@/components/ui/tubelight-navbar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation items for the tubelight navbar
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'About', url: '/about', icon: User },
    { name: 'Features', url: '/features', icon: Briefcase },
    { name: 'Browse', url: '/browse', icon: FileText }
  ];

  return (
    <>
      {/* Main Tubelight Navigation Bar with integrated functionality */}
      <TubelightNavBar items={navItems} />
      
      {/* Mobile Menu Button - positioned separately for mobile */}
      <div className="fixed top-6 right-4 z-50 md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="transition-all duration-300 bg-background/80 backdrop-blur-lg border border-border/20" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} className="text-secondary" /> : <Menu size={24} className="text-secondary" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
