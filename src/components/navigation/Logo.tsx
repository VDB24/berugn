
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Logo = () => {
  const { theme } = useTheme();
  
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <div className="relative transition-all duration-300 group-hover:scale-105">
        {theme === 'dark' ? (
          <img 
            src="/lovable-uploads/dd549a30-bc8f-43b0-92ed-805c735d311a.png" 
            alt="Berugn Logo" 
            className="h-7 w-7"
          />
        ) : (
          <img 
            src="/lovable-uploads/33711422-1b29-4369-b58c-e13edeeffacd.png" 
            alt="Berugn Logo" 
            className="h-7 w-7"
          />
        )}
        <div className="absolute -inset-1.5 blur-md bg-primary/30 rounded-full -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Berugn</span>
    </Link>
  );
};

export default Logo;
