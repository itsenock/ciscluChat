export const ChatHeader = ({
  name,
  description,
  memberCount,
}: {
  name: string;
  description: string;
  memberCount: number;
}) => (
  <div className="sticky top-0 bg-white p-4 border-b shadow-sm z-10">
    <h1 className="text-xl font-bold">{name}</h1>
    <p className="text-sm text-gray-500">{description}</p>
    <p className="text-xs text-gray-400">{memberCount} members</p>
  </div>
);
