import { Message } from '../types/Message';
import dayjs from 'dayjs';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

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
    ? 'bg-blue-100 dark:bg-blue-900'
    : 'bg-white dark:bg-gray-700';
  const alignment = isOwn ? 'items-end' : 'items-start';
  const textAlign = isOwn ? 'text-right' : 'text-left';

  return (
    <div className={`flex flex-col ${alignment} group`}>
      <div className={`text-xs text-gray-500 dark:text-gray-400 ${textAlign}`}>
        {message.senderName}
      </div>

      <div className={`relative max-w-[90%] md:max-w-[80%] px-4 py-3 rounded-xl shadow-md ${bubbleColor}`}>
        {message.replyTo && (
          <div className="text-xs text-gray-400 italic border-l-2 border-gray-300 pl-3 mb-2">
            Replying to <strong>{message.replyTo.senderName}</strong>: {message.replyTo.content.slice(0, 40)}...
          </div>
        )}

        {message.type === 'document' ? (
          <a href={message.content} target="_blank" className="text-blue-600 underline text-sm">📄 View Document</a>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">{message.content}</p>
        )}

        <button
          onClick={() => onReply(message)}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowUturnLeftIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      <div className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
        {dayjs(message.timestamp).format('HH:mm')}
        {isOwn && (message.status === 'delivered' || !message.status) && <span>✔️</span>}
      </div>
    </div>
  );
};
