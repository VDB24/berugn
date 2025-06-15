
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, Briefcase, FileText } from 'lucide-react';
import Logo from './navigation/Logo';
import UserNav from './navigation/UserNav';
import MobileMenu from './navigation/MobileMenu';
import ThemeToggle from './theme/ThemeToggle';
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
      {/* Main Tubelight Navigation Bar */}
      <TubelightNavBar items={navItems} />
      
      {/* Top utility bar with logo, theme toggle, and user nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg py-3 border-b border-border/10">
        <div className="container flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <UserNav />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden transition-all duration-300" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} className="text-secondary" /> : <Menu size={24} className="text-secondary" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </header>
    </>
  );
};

export default Header;
