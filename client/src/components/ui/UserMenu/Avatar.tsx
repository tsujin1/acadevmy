import { useState } from 'react';
import { getInitials } from '@/utils/mentorUtils';

interface AvatarProps {
  size?: 'md' | 'lg';
  showChevron?: boolean;
  name?: string;
  avatarUrl?: string;
}

const Avatar = ({ 
  size = 'md', 
  showChevron = false, 
  name = 'User',
  avatarUrl 
}: AvatarProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  
  const sizeClasses = {
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const initials = getInitials(name);
  const shouldShowImage = avatarUrl && !imageFailed;

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {shouldShowImage ? (
        <img 
          src={avatarUrl} 
          alt={name}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-linear-to-br from-gray-950 to-gray-800 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      )}

      {showChevron && (
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
          <svg className="h-2.5 w-2.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;