export const TypingIndicator = ({ name }: { name: string }) => (
  <div className="text-sm text-gray-500 dark:text-gray-400 italic animate-pulse px-4 py-2">
    {name} is typing...
  </div>
);
