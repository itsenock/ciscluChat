import { useEffect, useState, useRef } from "react";
import { Message } from "../types/Message";

let socket: WebSocket | null = null;

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const connectWebSocket = () => {
    socket = new WebSocket("wss://chat-room-1e3o.onrender.com/ws/chat");

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const msg: Message = JSON.parse(event.data);

        if (
          typeof msg === "object" &&
          msg !== null &&
          typeof msg.content === "string" &&
          typeof msg.senderName === "string"
        ) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed. Reconnecting in 3s...");
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      socket?.close();
    };
  };

  useEffect(() => {
    fetchMessages();
    connectWebSocket();

    const handleRefresh = () => {
      fetchMessages();
    };

    window.addEventListener("message-sent", handleRefresh);

    return () => {
      socket?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      window.removeEventListener("message-sent", handleRefresh);
    };
  }, []);

  const sendViaSocket = (msg: Message) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not open. Message not sent.");
    }
  };

  return {
    messages,
    setMessages,
    replyTo,
    setReplyTo,
    loading,
    bottomRef,
    scrollToBottom,
    sendViaSocket,
  };
};
