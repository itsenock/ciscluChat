import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { toggleTheme } from "../utils/theme";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleToggle}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-500" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
};
