import { UserIcon } from "@heroicons/react/24/solid";

export const MemberList = ({ members }: { members: { name: string }[] }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Header with total count */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-tight">
          Members
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {members.length}
        </span>
      </div>

      {/* Member list */}
      <ul className="flex flex-col gap-2 mt-2">
        {members.map((member, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <UserIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-800 dark:text-gray-100">
              {member.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
