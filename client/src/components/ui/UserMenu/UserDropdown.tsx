import { PiUser, PiGear, PiSignOut } from 'react-icons/pi';
import Avatar from './Avatar';
import MenuItem from './MenuItem';

interface UserDropdownProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: { url?: string };
  };
  onProfileClick: () => void;
  onLogout: () => void;
}

const UserDropdown = ({
  user,
  onProfileClick,
  onLogout,
}: UserDropdownProps) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <Avatar 
            size="lg" 
            name={`${user?.firstName} ${user?.lastName}`}
            avatarUrl={user?.avatar?.url}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="py-1">
        <MenuItem to="/profile" icon={PiUser} onClick={onProfileClick}>
          My Profile
        </MenuItem>
        <MenuItem to="/settings" icon={PiGear} onClick={onProfileClick}>
          Settings
        </MenuItem>
      </div>

      <div className="border-t border-gray-100 py-1">
        <MenuItem icon={PiSignOut} onClick={onLogout}>
          Sign Out
        </MenuItem>
      </div>
    </div>
  );
};

export default UserDropdown;