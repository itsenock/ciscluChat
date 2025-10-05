import { useEffect, useState } from "react";
import { Message } from "../types/Message";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();

  const fetchMessages = async () => {
    const res = await fetch("https://chat-room-1e3o.onrender.com/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  return { messages, replyTo, setReplyTo };
};
