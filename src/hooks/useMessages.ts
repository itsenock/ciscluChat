import { useEffect, useState } from "react";
import { Message } from "../types/Message";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch(
        "https://chat-room-1e3o.onrender.com/api/messages"
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true); // initial load with spinner
    const handleRefresh = () => fetchMessages(false); // silent refresh
    window.addEventListener("message-sent", handleRefresh);
    return () => window.removeEventListener("message-sent", handleRefresh);
  }, []);

  return { messages, replyTo, setReplyTo, loading, setMessages };
};
