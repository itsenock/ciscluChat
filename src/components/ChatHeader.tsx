import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

export const ChatHeader = ({
  name,
  description,
  memberCount,
}: {
  name: string;
  description: string;
  memberCount: number;
}) => {
  const { darkMode, toggleDarkMode } = useTheme();

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
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};
