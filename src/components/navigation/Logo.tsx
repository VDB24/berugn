
import { Link } from 'react-router-dom';
import { Infinity } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="relative">
        <Infinity className="h-7 w-7 text-primary" />
        <div className="absolute -inset-1 blur-sm bg-primary/30 rounded-full -z-10"></div>
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">SyncIn</span>
    </Link>
  );
};

export default Logo;
