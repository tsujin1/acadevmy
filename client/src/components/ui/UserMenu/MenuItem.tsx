import { Link } from 'react-router-dom';

interface MenuItemProps {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuItem = ({ to, icon: Icon, children, onClick }: MenuItemProps) => {
  const className = "flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left";
  
  return to ? (
    <Link to={to} className={className} onClick={onClick}>
      <Icon className="h-4 w-4 mr-3 text-gray-500" />
      {children}
    </Link>
  ) : (
    <button className={className} onClick={onClick}>
      <Icon className="h-4 w-4 mr-3 text-gray-500" />
      {children}
    </button>
  );
};

export default MenuItem;