import { useState, KeyboardEvent } from "react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Message } from "../types/Message";

export const MessageInput = ({
  replyTo,
  clearReply,
  currentUser,
  setMessages,
}: {
  replyTo?: Message;
  clearReply: () => void;
  currentUser: { id: string; name: string };
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: `local-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: input,
      type: "text",
      timestamp: Date.now(),
      status: "delivered",
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.senderName,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]); // show instantly

    try {
      await fetch("https://chat-room-1e3o.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      window.dispatchEvent(new Event("message-sent")); // silent refresh
      setInput("");
      clearReply();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      {replyTo && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <span>
            Replied to <strong>{replyTo.senderName}</strong>:{" "}
            {replyTo.content.slice(0, 40)}...
          </span>
          <button onClick={clearReply}>
            <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter for newline, Shift+Enter to send)"
          rows={2}
          className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
        </button>
      </div>
    </div>
  );
};
