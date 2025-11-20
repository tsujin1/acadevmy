const NoMentorsFound = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-12 text-center">
      <svg 
        className="w-16 h-16 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-600 text-lg">
        No mentors found matching your criteria
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Try adjusting your filters or search query
      </p>
    </div>
  );
};

export default NoMentorsFound;