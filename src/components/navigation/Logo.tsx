
import { Link } from 'react-router-dom';
import { Infinity } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <div className="relative transition-all duration-300 group-hover:scale-105">
        <Infinity className="h-7 w-7 text-primary" />
        <div className="absolute -inset-1.5 blur-md bg-primary/30 rounded-full -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <span className="text-2xl font-bold text-gradient">SyncIn</span>
    </Link>
  );
};

export default Logo;
