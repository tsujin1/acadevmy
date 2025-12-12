import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { userService } from '../../../services/userService';
import type { User } from '../../../services/authService';
import { useProfileForm } from '../../../hooks/useProfileForm';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import AvatarSection from './AvatarSection';
import AvatarUploadModal from './AvatarUploadModal';
import ProfileInfo from './ProfileInfo';
import ProfileActions from './ProfileActions';
import SkillsManager from './SkillsManager';
import BioSection from './BioSection';

interface ProfileHeaderProps {
  user: User | null;
  onUpdate: (updatedUser: User) => void;
  onContact?: () => void;
}

const ProfileHeader = ({ user, onUpdate, onContact }: ProfileHeaderProps) => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');
  const readOnly = !isProfilePage;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, setFormData, handleChange, resetForm } = useProfileForm(user);
  const avatarUpload = useAvatarUpload(user, onUpdate);

  const handleSave = async () => {
    if (!user || readOnly) return;

    try {
      setLoading(true);
      setError(null);

      const updateData = {
        title: formData.title,
        company: formData.company,
        experience: formData.experience,
        location: formData.location,
        bio: formData.bio,
        about: formData.about,
        hourlyRate: formData.hourlyRate,
        skills: formData.skills,
        linkedin: user.linkedin || '',
        website: user.website || '',
        github: user.github || '',
        twitter: user.twitter || '',
        avatar: user.avatar,
      };

      await userService.updateProfile(updateData);

      const updatedUser: User = {
        ...user,
        ...formData,
      };

      onUpdate(updatedUser);
      window.dispatchEvent(new Event('profileUpdated'));
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (readOnly) return;
    resetForm();
    setIsEditing(false);
    setError(null);
  };

  const handleSkillsChange = (newSkills: string[]) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const safeHandler = <T extends unknown[]>(handler: (...args: T) => void): ((...args: T) => void) => {
    return (...args: T) => {
      if (!readOnly) handler(...args);
    };
  };

  return (
    <div className="relative overflow-hidden">
      {(error || avatarUpload.error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-6 mt-4">
          <p className="text-red-600 text-sm">{error || avatarUpload.error}</p>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-50" />

      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <AvatarSection 
              user={user}
              isEditing={isEditing && !readOnly}
              onEdit={safeHandler(avatarUpload.openModal)}
              readOnly={readOnly}
            />

            <div className="flex-1 min-w-0 w-full">
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-4">
                  <ProfileInfo
                    user={user}
                    formData={formData}
                    isEditing={isEditing && !readOnly}
                    onChange={safeHandler(handleChange)}
                  />

                  <ProfileActions
                    user={user}
                    isEditing={isEditing}
                    loading={loading}
                    hourlyRate={formData.hourlyRate}
                    onEdit={safeHandler(() => setIsEditing(true))}
                    onSave={safeHandler(handleSave)}
                    onCancel={safeHandler(handleCancel)}
                    onHourlyRateChange={safeHandler(handleChange)}
                    readOnly={readOnly}
                    showEditButton={false}
                  />
                </div>
              </div>

              {user?.role === 'mentor' && (
                <SkillsManager
                  skills={formData.skills}
                  isEditing={isEditing && !readOnly}
                  onSkillsChange={safeHandler(handleSkillsChange)}
                  readOnly={readOnly}
                />
              )}

              <BioSection
                bio={formData.bio}
                isEditing={isEditing && !readOnly}
                onChange={safeHandler(handleChange)}
                readOnly={readOnly}
                onContact={onContact}
              />

              {!readOnly && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={safeHandler(handleSave)}
                        disabled={loading}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                      >
                        <FaSave size={14} />
                        <span className="hidden sm:inline">{loading ? 'Saving...' : 'Save Changes'}</span>
                        <span className="sm:hidden">{loading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={safeHandler(handleCancel)}
                        disabled={loading}
                        className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        <FaTimes size={14} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={safeHandler(() => setIsEditing(true))}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <FaEdit size={14} />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!readOnly && (
        <AvatarUploadModal
          isOpen={avatarUpload.isModalOpen}
          user={user}
          previewUrl={avatarUpload.previewUrl}
          loading={avatarUpload.loading}
          fileInputRef={avatarUpload.fileInputRef as React.RefObject<HTMLInputElement>}
          onClose={avatarUpload.closeModal}
          onFileSelect={avatarUpload.handleFileSelect}
          onUpload={avatarUpload.handleUpload}
        />
      )}
    </div>
  );
};

export default ProfileHeader;