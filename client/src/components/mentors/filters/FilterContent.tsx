import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import type { MentorFilters as MentorFiltersType } from '@/hooks/useMentorFilters';
import { PRICE_RANGE, RATING_OPTIONS } from '@/constants/filters';
import FilterSection from './FilterSection';
import SkillCheckbox from './SkillCheckbox';
import { filterContentVariants } from './variants';

interface FilterContentProps {
  filters: MentorFiltersType;
  allSkills: string[];
  onToggleSkill: (skill: string) => void;
  onClearFilters: () => void;
  onPriceChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}

const formatPriceDisplay = (price: number): string => 
  price >= PRICE_RANGE.MAX ? 'Any price' : `Up to $${price}`;

const getSliderValue = (priceRange: [number, number]): number =>
  Math.min(priceRange[1], PRICE_RANGE.MAX);

const FilterContent = memo(({
  filters,
  allSkills,
  onToggleSkill,
  onClearFilters,
  onPriceChange,
  onRatingChange,
}: FilterContentProps) => {
  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceChange(e.target.value);
  }, [onPriceChange]);

  const handleRatingSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onRatingChange(e.target.value);
  }, [onRatingChange]);

  const currentPriceLabel = formatPriceDisplay(filters.priceRange[1]);

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
          {allSkills.map((skill, index) => (
            <SkillCheckbox
              key={skill}
              skill={skill}
              isChecked={filters.selectedSkills.includes(skill)}
              onToggle={onToggleSkill}
              index={index}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Hourly Rate">
        <div className="space-y-3">
          <input
            type="range"
            min={PRICE_RANGE.MIN}
            max={PRICE_RANGE.MAX}
            step={PRICE_RANGE.STEP}
            value={getSliderValue(filters.priceRange)}
            onChange={handlePriceInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">$0</span>
            <span className="font-medium text-gray-900">
              {currentPriceLabel}
            </span>
          </div>
          {filters.priceRange[1] >= PRICE_RANGE.MAX && (
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