export const ChatHeader = ({
  name,
  description,
  memberCount,
}: {
  name: string;
  description: string;
  memberCount: number;
}) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 shadow-sm z-10 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {description}
          </p>
          <p className="text-xs text-gray-400">{memberCount} members</p>
        </div>
      </div>
    </div>
  );
};
