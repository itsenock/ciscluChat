import { Message } from "../types/Message";
import dayjs from "dayjs";

export const MessageBubble = ({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) => {
  const bubbleColor = isOwn
    ? "bg-[#e6f7ff] dark:bg-[#2a3b2e]"
    : "bg-white dark:bg-gray-700";
  const alignment = isOwn ? "items-end" : "items-start";
  const textAlign = isOwn ? "text-right" : "text-left";

  return (
    <div className={`flex flex-col ${alignment} mb-6`}>
      <div className={`text-xs text-gray-500 dark:text-gray-400 ${textAlign}`}>
        {message.senderName}
      </div>
      <div
        className={`relative max-w-[90%] md:max-w-[80%] px-3 py-2 rounded-xl shadow-sm ${bubbleColor} hover:scale-[1.01] transition-transform duration-200 ease-in-out`}
      >
        {message.replyTo && (
          <div className="text-xs text-gray-400 italic border-l-2 border-gray-300 pl-2 mb-1">
            Replying to <strong>{message.replyTo.senderName}</strong>:{" "}
            {message.replyTo.content.slice(0, 40)}...
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
          <p className="text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
            {message.content}
          </p>
        )}
      </div>
      <div className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
        {dayjs(message.timestamp).format("HH:mm")}
        {isOwn && message.status === "delivered" && <span>✔️</span>}
      </div>
    </div>
  );
};
