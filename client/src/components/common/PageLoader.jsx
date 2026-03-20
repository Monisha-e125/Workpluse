const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-dark-500 text-sm mt-3">Loading WorkPulse AI...</p>
      </div>
    </div>
  );
};

export default PageLoader;