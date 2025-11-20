interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  onClick?: () => void;
  isActive?: boolean;
}

const IconButton = ({ 
  icon: Icon, 
  badgeCount, 
  onClick, 
  isActive = false 
}: IconButtonProps) => (
  <button 
    onClick={onClick}
    className={`relative h-10 w-10 flex items-center justify-center rounded-full transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-600'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
    }`}
  >
    <Icon className="h-5 w-5" />
    
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold border-2 border-white">
        {badgeCount > 9 ? '9+' : badgeCount}
      </span>
    )}
  </button>
);

export default IconButton;