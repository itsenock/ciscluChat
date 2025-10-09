export const ChatHeader = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
          {name}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>

      {/* Optional: Add a subtle icon or status */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
        <span>Active</span>
      </div>
    </div>
  );
};
