import { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { userService } from '../../../services/userService';
import type { User } from '../../../services/authService';

interface AboutTabProps {
  user: User | null;
  onUpdate?: (updatedUser: User) => void;
  isEditable?: boolean;
}

const AboutTab = ({ 
  user, 
  onUpdate, 
  isEditable = false 
}: AboutTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    setAboutText(user?.about || '');
  }, [user]);

  const handleSave = async () => {
    if (!user || !onUpdate) return;

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await userService.updateProfile({
        about: aboutText,
      });

      onUpdate(updatedUser);
      setIsEditing(false);
    } catch {
      setError('Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAboutText(user?.about || '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
          About {user?.firstName}
        </h2>

        {isEditable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
          >
            <FaEdit size={14} />
            Edit About
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      <div className="max-w-4xl">
        {isEditing ? (
          <div className="space-y-4 sm:space-y-5">
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={10}
              disabled={loading}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none text-slate-900 leading-relaxed text-base sm:text-lg bg-white placeholder-slate-400 transition-all"
              placeholder="Tell your story... Share your background, experience, and what makes you unique."
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto shadow-sm"
              >
                <FaSave size={14} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2.5 sm:py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <FaTimes size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-700 whitespace-pre-line leading-relaxed space-y-4 text-base sm:text-lg">
            {aboutText ? (
              aboutText
            ) : (
              <p className="text-slate-500 italic">
                {isEditable 
                  ? "You haven't written a bio yet. Click 'Edit About' to add one." 
                  : "No about information provided."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;