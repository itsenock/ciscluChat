import { useEffect, useState, useRef } from "react";
import { Message } from "../types/Message";
import { io } from "socket.io-client";

const socket = io("https://chat-room-1e3o.onrender.com");

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("https://chat-room-1e3o.onrender.com/api/messages");
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    const handleRefresh = () => {
      fetchMessages();
    };

    window.addEventListener("message-sent", handleRefresh);

    return () => {
      socket.off("new-message");
      window.removeEventListener("message-sent", handleRefresh);
    };
  }, []);

  return {
    messages,
    setMessages,
    replyTo,
    setReplyTo,
    loading,
    bottomRef,
    scrollToBottom,
  };
};
