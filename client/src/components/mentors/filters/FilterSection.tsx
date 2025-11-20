import { memo } from 'react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FilterSection = memo(({ 
  title, 
  children,
  className = '' 
}: FilterSectionProps) => (
  <div className={`mb-4 pb-4 border-b border-gray-200 ${className}`}>
    <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
    {children}
  </div>
));

FilterSection.displayName = 'FilterSection';

export default FilterSection;