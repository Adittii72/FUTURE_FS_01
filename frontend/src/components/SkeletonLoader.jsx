const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        );
      
      case 'project':
        return (
          <div className="glass-card overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        );
      
      case 'skill':
        return (
          <div className="glass-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
            <div className="h-2 bg-gray-700 rounded w-full"></div>
          </div>
        );
      
      default:
        return (
          <div className="h-20 bg-gray-700 rounded animate-pulse"></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;
