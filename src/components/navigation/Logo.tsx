
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Preload both images to prevent layout shifts
  useEffect(() => {
    const lightImg = new Image();
    const darkImg = new Image();
    
    lightImg.src = "/lovable-uploads/33711422-1b29-4369-b58c-e13edeeffacd.png";
    darkImg.src = "/lovable-uploads/dd549a30-bc8f-43b0-92ed-805c735d311a.png";
    
    Promise.all([
      new Promise(resolve => { lightImg.onload = resolve; }),
      new Promise(resolve => { darkImg.onload = resolve; })
    ]).then(() => {
      setIsLoaded(true);
    });
  }, []);
  
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative transition-all duration-300 group-hover:scale-105">
        {!isLoaded ? (
          // Placeholder while images load
          <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ) : theme === 'dark' ? (
          <img 
            src="/lovable-uploads/dd549a30-bc8f-43b0-92ed-805c735d311a.png" 
            alt="Berugn Logo" 
            className="h-20 w-20"
          />
        ) : (
          <img 
            src="/lovable-uploads/33711422-1b29-4369-b58c-e13edeeffacd.png" 
            alt="Berugn Logo" 
            className="h-20 w-20"
          />
        )}
        <div className="absolute -inset-1.5 blur-md bg-primary/30 rounded-full -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <span className="text-4xl font-bold text-gradient">Berugn</span>
    </Link>
  );
};

export default Logo;
