export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-300">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
    <p className="text-sm">Loading messages...</p>
  </div>
);
