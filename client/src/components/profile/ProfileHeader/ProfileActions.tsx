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
  readOnly = false
}: ProfileActionsProps) => {
  const isMentor = user?.role === 'mentor';
  const roleBadgeClass = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
    isMentor ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }`;

  if (readOnly && !isEditing) {
    return (
      <div className="flex flex-col items-end gap-3">
        <span className={roleBadgeClass}>
          {isMentor ? 'Mentor' : 'Student'}
        </span>

        {isMentor && (
          <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900">${hourlyRate || '0'}</span>
            <span className="text-sm text-gray-500">/hr</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-3">
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaSave size={14} />
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <FaTimes size={14} />
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <FaEdit size={14} />
          Edit Profile
        </button>
      )}

      <span className={roleBadgeClass}>
        {isMentor ? 'Mentor' : 'Student'}
      </span>

      {isMentor && (
        isEditing ? (
          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
            <FaDollarSign size={14} className="text-gray-400" />
            <input
              type="number"
              name="hourlyRate"
              value={hourlyRate}
              onChange={onHourlyRateChange}
              className="bg-transparent outline-none w-16 text-center font-bold text-gray-900"
              placeholder="75"
              min="0"
            />
            <span className="text-gray-500 text-sm">/hr</span>
          </div>
        ) : (
          <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900">${hourlyRate || '0'}</span>
            <span className="text-sm text-gray-500">/hr</span>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileActions;