import { useEffect, useState, useRef } from "react";
import { Message } from "../types/Message";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading && messages.length === 0) setLoading(true); // only show spinner on first load
      const res = await fetch("https://chat-room-1e3o.onrender.com/api/messages");
      const data = await res.json();

      if (JSON.stringify(data) !== JSON.stringify(messages)) {
        setMessages(data);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true); // initial load with spinner

    const handleRefresh = () => fetchMessages(true); // manual refresh with spinner
    window.addEventListener("message-sent", handleRefresh);

    const interval = setInterval(() => {
      fetchMessages(false); // silent refresh
    }, 1500);

    return () => {
      window.removeEventListener("message-sent", handleRefresh);
      clearInterval(interval);
    };
  }, [messages]);

  return { messages, replyTo, setReplyTo, loading, setMessages, bottomRef };
};
