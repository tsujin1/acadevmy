import { FaEdit, FaSave, FaTimes, FaDollarSign } from 'react-icons/fa';
import type { User } from '@/services/authService';

interface ProfileActionsProps {
  user: User | null;
  isEditing: boolean;
  loading: boolean;
  hourlyRate: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onHourlyRateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  showEditButton?: boolean;
}

const ProfileActions = ({
  user,
  isEditing,
  loading,
  hourlyRate,
  onEdit,
  onSave,
  onCancel,
  onHourlyRateChange,
  readOnly = false,
  showEditButton = true
}: ProfileActionsProps) => {
  const isMentor = user?.role === 'mentor';
  const roleBadgeClass = `inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold ${
    isMentor ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
  }`;

  if (readOnly && !isEditing) {
    return (
      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto">
        <span className={roleBadgeClass}>
          {isMentor ? 'Mentor' : 'Student'}
        </span>

        {isMentor && (
          <div className="bg-slate-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-sm">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">${hourlyRate || '0'}</span>
            <span className="text-xs sm:text-sm text-slate-600">/hr</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto">
      {showEditButton && (
        <>
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={loading}
                className="px-4 sm:px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
              >
                <FaSave size={14} />
                <span className="hidden sm:inline">{loading ? 'Saving...' : 'Save Changes'}</span>
                <span className="sm:hidden">{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 sm:px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FaTimes size={14} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="px-4 sm:px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <FaEdit size={14} />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          )}
        </>
      )}

      <div className="flex items-center gap-3 sm:gap-0 sm:flex-col lg:flex-col lg:items-end lg:gap-3">
        <span className={roleBadgeClass}>
          {isMentor ? 'Mentor' : 'Student'}
        </span>

        {isMentor && (
          isEditing ? (
            <div className="bg-slate-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
              <FaDollarSign size={14} className="text-slate-500 shrink-0" />
              <input
                type="number"
                name="hourlyRate"
                value={hourlyRate}
                onChange={onHourlyRateChange}
                className="bg-transparent outline-none w-16 sm:w-20 text-center font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 rounded px-2 text-lg sm:text-xl"
                placeholder="75"
                min="0"
              />
              <span className="text-slate-600 text-xs sm:text-sm">/hr</span>
            </div>
          ) : (
            <div className="bg-slate-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-sm">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">${hourlyRate || '0'}</span>
              <span className="text-xs sm:text-sm text-slate-600">/hr</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileActions;