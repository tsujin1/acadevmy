import { FaCamera } from 'react-icons/fa';
import type { User } from '@/services/authService';

interface AvatarSectionProps {
  user: User | null;
  isEditing: boolean;
  onEdit?: () => void;
  readOnly?: boolean;
}

const AvatarSection = ({ user, isEditing, onEdit, readOnly = false }: AvatarSectionProps) => {
  const initials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`;
  const avatarUrl = user?.avatar?.url;
  const hasAvatar = !!avatarUrl;

  const avatarClasses = `
    w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white overflow-hidden
    ${!readOnly && !isEditing ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
    ${hasAvatar ? 'bg-white' : 'bg-gradient-to-br from-gray-900 to-gray-700'}
  `;

  return (
    <div className="relative group">
      <div
        onClick={!readOnly && !isEditing ? onEdit : undefined}
        className={avatarClasses}
      >
        {hasAvatar && (
          <img
            src={avatarUrl}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        )}

        <div
          className={`w-full h-full rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center ${
            hasAvatar ? 'hidden' : 'flex'
          }`}
        >
          {initials}
        </div>
      </div>

      {!readOnly && (
        <button
          onClick={onEdit}
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors border-2 border-white z-10 cursor-pointer"
        >
          <FaCamera size={16} />
        </button>
      )}
    </div>
  );
};

export default AvatarSection;