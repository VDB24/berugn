
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-gradient">SwipeConnect</span>
    </Link>
  );
};

export default Logo;
