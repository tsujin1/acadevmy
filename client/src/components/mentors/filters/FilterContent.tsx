import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import type { MentorFilters as MentorFiltersType } from '@/hooks/useMentorFilters';
import { RATING_OPTIONS } from '@/constants/filters'; 
import FilterSection from './FilterSection';
import SkillCheckbox from './SkillCheckbox';
import { filterContentVariants } from './variants';

interface FilterContentProps {
  filters: MentorFiltersType;
  allSkills: string[];
  globalMaxPrice: number; 
  onToggleSkill: (skill: string) => void;
  onClearFilters: () => void;
  onPriceChange: (value: number) => void; 
  onRatingChange: (value: number) => void;
}

const FilterContent = memo(({
  filters,
  allSkills,
  globalMaxPrice,
  onToggleSkill,
  onClearFilters,
  onPriceChange,
  onRatingChange,
}: FilterContentProps) => {

  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    onPriceChange(newVal);
  }, [onPriceChange]);

  const handleRatingSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    onRatingChange(value);
  }, [onRatingChange]);

  const currentPrice = filters.priceRange[1];
  const isAtMaxPrice = currentPrice >= globalMaxPrice;
  
  const currentPriceLabel = isAtMaxPrice 
    ? 'Any price' 
    : `Up to $${currentPrice}`;

  return (
    <motion.div {...filterContentVariants}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
        <motion.button
          onClick={onClearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear all
        </motion.button>
      </div>

      <FilterSection title="Skills">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allSkills.length > 0 ? (
            allSkills.map((skill, index) => (
              <SkillCheckbox
                key={skill}
                skill={skill}
                isChecked={filters.selectedSkills.includes(skill)}
                onToggle={onToggleSkill}
                index={index}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No skills available</p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Hourly Rate">
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={globalMaxPrice}
            step={5} 
            value={currentPrice}
            onChange={handlePriceInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">$0</span>
            <span className="font-medium text-gray-900">
              {currentPriceLabel}
            </span>
          </div>
          {isAtMaxPrice && (
            <p className="text-xs text-gray-500 text-center">
              Showing all mentors regardless of rate
            </p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating" className="border-b-0 pb-0">
        <select
          value={filters.minRating}
          onChange={handleRatingSelectChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>
    </motion.div>
  );
});

FilterContent.displayName = 'FilterContent';

export default FilterContent;