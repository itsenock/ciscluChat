import { useState, useRef, useEffect } from "react";
import { Message } from "../types/Message";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";

export const MessageInput = ({
  replyTo,
  clearReply,
  currentUser,
}: {
  replyTo?: Message;
  clearReply: () => void;
  currentUser: { id: string; name: string };
}) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: text,
      type: "text",
      timestamp: Date.now(),
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.senderName,
          }
        : null,
    };

    try {
      await fetch("https://your-backend.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setText("");
      clearReply();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://your-backend.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();

      const payload = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: url,
        type: "document",
        timestamp: Date.now(),
        replyTo: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              senderName: replyTo.senderName,
            }
          : null,
      };

      await fetch("https://your-backend.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearReply();
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-800 transition-colors duration-300">
      {replyTo && (
        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center">
          <span>Replying to: {replyTo.content}</span>
          <button onClick={clearReply} className="text-red-500 text-sm ml-2">
            ✖
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <PaperClipIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          rows={1}
          className="flex-1 border px-4 py-2 rounded-xl resize-none dark:bg-gray-900 dark:text-white text-sm leading-snug max-h-40 overflow-hidden focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
        </button>
      </div>
    </div>
  );
};
