interface MentorSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MentorSearch = ({
  searchQuery,
  onSearchChange,
}: MentorSearchProps) => {
  return (
    <div className="max-w-2xl">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, title, or expertise..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-lg text-gray-900 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
    </div>
  );
};

export default MentorSearch;