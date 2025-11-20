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
    <div className="mb-6">
      {isEditing ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills & Expertise
          </label>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Add a skill (e.g., React, Node.js, UX Design)"
            />
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FaPlus size={14} />
              Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-sm font-medium border border-gray-200"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-500 hover:text-gray-700 transition-colors ml-1"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Skills & Expertise</h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;