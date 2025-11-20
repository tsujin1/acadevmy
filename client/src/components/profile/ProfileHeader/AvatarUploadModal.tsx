import { FaUpload, FaTimes } from 'react-icons/fa';
import type { User } from '@/services/authService';

interface AvatarUploadModalProps {
  isOpen: boolean;
  user: User | null;
  previewUrl: string | null;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

const AvatarUploadModal = ({
  isOpen,
  user,
  previewUrl,
  loading,
  fileInputRef,
  onClose,
  onFileSelect,
  onUpload,
}: AvatarUploadModalProps) => {
  if (!isOpen) return null;

  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;
  const displayImage = previewUrl || user?.avatar?.url;
  const hasImage = !!displayImage;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Profile Picture</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {hasImage && (
              <img 
                src={displayImage} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            )}
            
            <div className={`w-32 h-32 rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-4xl font-bold ${hasImage ? 'hidden' : 'flex'}`}>
              {initials}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Upload a new profile picture (JPG, PNG, GIF)
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaUpload size={14} />
            Choose File
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={!previewUrl || loading}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Picture'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;