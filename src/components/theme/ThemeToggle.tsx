
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="relative overflow-hidden group"
    >
      <span className="absolute inset-0 transform transition-transform duration-500 ease-in-out group-hover:scale-110">
        {theme === 'light' ? (
          <Moon className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 opacity-100" />
        ) : (
          <Sun className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 opacity-100" />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
