import { motion } from 'framer-motion';
import { memo } from 'react';

interface SkillCheckboxProps {
  skill: string;
  isChecked: boolean;
  onToggle: (skill: string) => void;
  index: number;
}

const SkillCheckbox = memo(({ 
  skill, 
  isChecked, 
  onToggle,
  index 
}: SkillCheckboxProps) => (
  <motion.label
    className="flex items-center space-x-3 cursor-pointer group"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onToggle(skill)}
      className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
    />
    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
      {skill}
    </span>
  </motion.label>
));

SkillCheckbox.displayName = 'SkillCheckbox';

export default SkillCheckbox;