import { Member } from "../types/Member";

export const MemberList = ({ members }: { members: Member[] }) => (
  <div>
    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
      Group Members
    </h2>
    <ul className="space-y-3">
      {members.map((member) => (
        <li key={member.id} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            {member.name[0]}
          </div>
          <div className="text-gray-700 dark:text-gray-300">{member.name}</div>
        </li>
      ))}
    </ul>
  </div>
);
