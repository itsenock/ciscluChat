import { useEffect, useState } from "react";
import { Message } from "../types/Message";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://chat-room-1e3o.onrender.com/api/messages"
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, replyTo, setReplyTo, loading };
};
