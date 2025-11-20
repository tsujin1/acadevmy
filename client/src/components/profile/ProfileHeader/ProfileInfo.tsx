import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import type { User } from '@/services/authService';

interface ProfileInfoProps {
  user: User | null;
  formData: {
    title: string;
    company: string;
    experience: string;
    location: string;
    hourlyRate: string;
  };
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInfo = ({ user, formData, isEditing, onChange }: ProfileInfoProps) => {
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent";
  const inlineInputClasses = "bg-transparent outline-none min-w-32";
  const infoItemClass = "flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg";

  return (
    <div className="flex-1 min-w-0 space-y-3">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          {user?.firstName} {user?.lastName}
        </h1>
        
        {isEditing && user?.role === 'mentor' ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className={inputClasses}
            placeholder="e.g., Software Engineer, Product Manager"
          />
        ) : (
          <p className="text-xl text-gray-600 font-medium">{formData.title}</p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {isEditing ? (
          <>
            <div className={`${infoItemClass} border border-gray-200`}>
              <FaBriefcase size={13} className="text-gray-400" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={onChange}
                className={inlineInputClasses}
                placeholder="Company"
              />
            </div>
            <div className={`${infoItemClass} border border-gray-200`}>
              <FaCalendarAlt size={13} className="text-gray-400" />
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={onChange}
                className={inlineInputClasses}
                placeholder="Experience"
              />
            </div>
            <div className={`${infoItemClass} border border-gray-200`}>
              <FaMapMarkerAlt size={13} className="text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                className={inlineInputClasses}
                placeholder="Location"
              />
            </div>
          </>
        ) : (
          <>
            {formData.company && (
              <div className={infoItemClass}>
                <FaBriefcase size={13} className="text-gray-400" />
                <span>{formData.company}</span>
              </div>
            )}
            {formData.experience && (
              <div className={infoItemClass}>
                <FaCalendarAlt size={13} className="text-gray-400" />
                <span>{formData.experience} years experience</span>
              </div>
            )}
            {formData.location && (
              <div className={infoItemClass}>
                <FaMapMarkerAlt size={13} className="text-gray-400" />
                <span>{formData.location}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;