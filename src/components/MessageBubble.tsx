import { Message } from "../types/Message";
import dayjs from "dayjs";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useSwipeable } from "react-swipeable";

export const MessageBubble = ({
  message,
  isOwn,
  onReply,
}: {
  message: Message;
  isOwn: boolean;
  onReply: (msg: Message) => void;
}) => {
  const bubbleColor = isOwn
    ? "bg-[#DCF8C6] dark:bg-[#005C4B]" // WhatsApp green (light) / dark green
    : "bg-white dark:bg-[#1E1E1E]"; // white / WhatsApp dark gray

  const replyBg = isOwn
    ? "bg-[#E6F3D9] dark:bg-[#0A3D33]" // lighter green (noticeable contrast)
    : "bg-[#F5F5F5] dark:bg-[#2A2A2A]"; // soft gray (noticeable contrast)

  const replyBorder = isOwn
    ? "border-[#CDEBBE] dark:border-[#0F5C4B]"
    : "border-[#E0E0E0] dark:border-[#444]";

  const replyTextColor = "text-gray-800 dark:text-[#CCCCCC]";
  const replySenderColor = "text-gray-700 dark:text-[#B3B3B3]";

  const alignment = isOwn ? "items-end" : "items-start";
  const textAlign = isOwn ? "text-right" : "text-left";

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => onReply(message),
    delta: 40,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div {...swipeHandlers} className={`flex flex-col ${alignment} group`}>
      <div className={`text-xs text-gray-500 dark:text-gray-400 ${textAlign}`}>
        {message.senderName}
      </div>

      <div
        className={`relative max-w-[90%] md:max-w-[80%] px-4 pt-3 pb-6 rounded-xl shadow-sm ${bubbleColor}`}
      >
        {message.replyTo && (
          <div
            className={`mb-3 rounded-md px-3 py-2 text-sm italic border-l-4 ${replyBg} ${replyBorder} ${replyTextColor}`}
          >
            <span className={`font-semibold ${replySenderColor}`}>
              {message.replyTo.senderName}
            </span>
            : {message.replyTo.content.slice(0, 40)}...
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
          <p className="text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-[#EDEDED]">
            {message.content}
          </p>
        )}

        <button
          onClick={() => onReply(message)}
          className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowUturnLeftIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      <div className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
        {dayjs(message.timestamp).format("HH:mm")}
        {isOwn && (message.status === "delivered" || !message.status) && (
          <span>✔️</span>
        )}
      </div>
    </div>
  );
};
