import { useState, useRef, KeyboardEvent } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Message } from "../types/Message";

export const MessageInput = ({
  replyTo,
  clearReply,
  currentUser,
  scrollToBottom,
  sendViaSocket,
  setMessages,
}: {
  replyTo?: Message;
  clearReply: () => void;
  currentUser: { id: string; name: string };
  scrollToBottom: () => void;
  sendViaSocket: (msg: Message & { localId?: string }) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = Date.now();
    const localId = `local-${now}`;
    const newMessage: Message & { localId?: string } = {
      id: localId,
      localId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: input,
      type: "text",
      timestamp: now,
      status: "sent",
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.senderName,
          }
        : undefined,
    };

    console.log("📝 Creating new message:", newMessage);

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();

    console.log("📤 Sending message via WebSocket...");
    sendViaSocket(newMessage);

    try {
      console.log("🌐 Sending message to REST API...");
      const res = await fetch(
        "https://chat-room-1e3o.onrender.com/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        }
      );

      const result = await res.json();
      console.log("✅ REST API response:", result);

      window.dispatchEvent(new Event("message-sent"));
      setInput("");
      clearReply();

      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    } catch (err) {
      console.error("❌ Failed to send message via REST:", err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📎 File selected for upload:", file.name);

    const formData = new FormData();
    formData.append("document", file);

    try {
      console.log("🌐 Uploading document to backend...");
      const res = await fetch(
        "https://chat-room-1e3o.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const { url } = await res.json();
      console.log("✅ Document uploaded. URL received:", url);

      const now = Date.now();
      const localId = `local-${now}`;
      const docMessage: Message & { localId?: string } = {
        id: localId,
        localId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: url,
        type: "document",
        timestamp: now,
        status: "sent",
        replyTo: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              senderName: replyTo.senderName,
            }
          : undefined,
      };

      console.log("📝 Creating document message:", docMessage);

      setMessages((prev) => [...prev, docMessage]);
      scrollToBottom();

      console.log("📤 Sending document message via WebSocket...");
      sendViaSocket(docMessage);

      console.log("🌐 Sending document message to REST API...");
      const postRes = await fetch(
        "https://chat-room-1e3o.onrender.com/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(docMessage),
        }
      );

      const result = await postRes.json();
      console.log("✅ REST API response for document:", result);

      window.dispatchEvent(new Event("message-sent"));
      clearReply();
    } catch (err) {
      console.error("❌ Failed to upload document:", err);
    }
  };

  return (
    <div className="relative px-4 pb-9 pt-2 bg-transparent">
      <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center gap-2 px-4 py-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInputResize}
          placeholder="Type a message"
          rows={1}
          style={{ height: "40px", maxHeight: "160px" }}
          className="flex-1 overflow-y-auto no-scrollbar resize-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
        >
          <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
          onChange={handleFileUpload}
        />
      </div>

      {replyTo && (
        <div className="absolute bottom-20 left-4 right-4 bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-200 flex justify-between items-center shadow-md">
          <span>
            Replied to <strong>{replyTo.senderName}</strong>:{" "}
            {replyTo.content.slice(0, 40)}...
          </span>
          <button onClick={clearReply}>
            <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};
