import { useMembers } from "./hooks/useMembers";
import { useMessages } from "./hooks/useMessages";
import { useTyping } from "./hooks/useTyping";
import { ChatHeader } from "./components/ChatHeader";
import { MemberList } from "./components/MemberList";
import { MessageBubble } from "./components/MessageBubble";
import { MessageInput } from "./components/MessageInput";
import { TypingIndicator } from "./components/TypingIndicator";

const currentUser = { id: "u1", name: "Its" };

export const ChatRoom = () => {
  const members = useMembers();
  const { messages, replyTo, setReplyTo } = useMessages();
  const typingUser = useTyping();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="flex flex-col flex-1">
        <ChatHeader
          name="CISLU Tech Group"
          description="A space for tech discussions, updates, and collaboration."
          memberCount={members.length}
        />
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setReplyTo(msg)}
              className="transition duration-300 ease-in-out hover:scale-[1.01]"
            >
              <MessageBubble
                message={msg}
                isOwn={msg.senderId === currentUser.id}
              />
            </div>
          ))}
          {typingUser && <TypingIndicator name={typingUser} />}
        </div>
        <MessageInput
          replyTo={replyTo}
          clearReply={() => setReplyTo(undefined)}
        />
      </div>
      <MemberList members={members} />
    </div>
  );
};
