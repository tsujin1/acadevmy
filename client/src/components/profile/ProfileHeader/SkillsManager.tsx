import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface SkillsManagerProps {
  skills: string[];
  isEditing: boolean;
  onSkillsChange: (skills: string[]) => void;
  readOnly?: boolean;
}

const SkillsManager = ({ skills, isEditing, onSkillsChange }: SkillsManagerProps) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      {isEditing ? (
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
            Skills & Expertise
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400 transition-all text-sm"
              placeholder="Add a skill (e.g., React, Node.js)"
            />
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="px-4 sm:px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
            >
              <FaPlus size={14} />
              Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-900 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-slate-700 transition-colors p-0.5 rounded hover:bg-slate-200"
                    aria-label={`Remove ${skill}`}
                  >
                    <FaTimes size={11} className="sm:w-3 sm:h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 sm:mb-3">Skills & Expertise</h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-900 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs sm:text-sm">No skills added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;