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
  const inputClasses = "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400 transition-all";
  const inlineInputClasses = "bg-transparent outline-none min-w-32 text-slate-900 placeholder-slate-400";
  const infoItemClass = "flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200";

  return (
    <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">
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
          <p className="text-lg sm:text-xl text-slate-700 font-medium">{formData.title}</p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        {isEditing ? (
          <>
            <div className={infoItemClass}>
              <FaBriefcase size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={onChange}
                className={inlineInputClasses}
                placeholder="Company"
              />
            </div>
            <div className={infoItemClass}>
              <FaCalendarAlt size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={onChange}
                className={inlineInputClasses}
                placeholder="Experience"
              />
            </div>
            <div className={infoItemClass}>
              <FaMapMarkerAlt size={14} className="text-slate-500 shrink-0" />
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
              <div className={`${infoItemClass} hover:bg-slate-100 transition-colors`}>
                <FaBriefcase size={14} className="text-slate-500 shrink-0" />
                <span className="text-slate-700">{formData.company}</span>
              </div>
            )}
            {formData.experience && (
              <div className={`${infoItemClass} hover:bg-slate-100 transition-colors`}>
                <FaCalendarAlt size={14} className="text-slate-500 shrink-0" />
                <span className="text-slate-700">{formData.experience} years experience</span>
              </div>
            )}
            {formData.location && (
              <div className={`${infoItemClass} hover:bg-slate-100 transition-colors`}>
                <FaMapMarkerAlt size={14} className="text-slate-500 shrink-0" />
                <span className="text-slate-700">{formData.location}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;