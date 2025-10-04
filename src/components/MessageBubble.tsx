import { Message } from "../types/Message";
import dayjs from "dayjs";

export const MessageBubble = ({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) => {
  const bubbleColor = isOwn ? "bg-[#dcf8c6]" : "bg-white";
  const alignment = isOwn ? "items-end" : "items-start";
  const textAlign = isOwn ? "text-right" : "text-left";

  return (
    <div className={`flex flex-col ${alignment} mb-2`}>
      <div className={`text-xs text-gray-500 ${textAlign}`}>
        {message.senderName}
      </div>
      <div
        className={`relative max-w-[80%] px-3 py-2 rounded-xl shadow-sm ${bubbleColor}`}
      >
        {message.replyTo && (
          <div className="text-xs text-gray-400 italic border-l-2 border-gray-300 pl-2 mb-1">
            Replying to: {message.replyTo.content.slice(0, 40)}...
          </div>
        )}
        {message.type === "document" ? (
          <a
            href={message.content}
            target="_blank"
            className="text-blue-600 underline text-sm"
          >
            📄 View Document
          </a>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
        <div className="absolute bottom-1 right-2 text-[10px] text-gray-400 flex items-center gap-1">
          {dayjs(message.timestamp).format("HH:mm")}
          {isOwn && message.status === "delivered" && <span>✔️</span>}
        </div>
      </div>
    </div>
  );
};
