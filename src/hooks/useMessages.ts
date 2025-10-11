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
    console.log("📥 Fetching messages from REST API...");
    try {
      const res = await fetch(
        "https://chat-room-1e3o.onrender.com/api/messages"
      );
      const data = await res.json();

      console.log("✅ Messages fetched:", data);

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMessages = data.filter((m: Message) => !existingIds.has(m.id));
        console.log("🧠 Merged new messages:", newMessages);
        return [...prev, ...newMessages];
      });

      scrollToBottom();
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    console.log("🔌 Connecting to WebSocket...");
    socket = new WebSocket("wss://chat-room-1e3o.onrender.com/ws/chat");

    socket.onopen = () => {
      console.log("✅ WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("📩 WebSocket message received:", event.data);
      try {
        const msg: Message = JSON.parse(event.data);

        if (!msg || typeof msg !== "object") {
          console.warn("⚠️ Ignored non-object message:", msg);
          return;
        }

        if (!msg.id || !msg.content || !msg.senderName) {
          console.error("❌ Malformed message received from backend:");
          console.error("🔍 Parsed object:", msg);
          return;
        }

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          if (exists) {
            console.log("🔁 Duplicate message ignored:", msg.id);
            return prev;
          }
          console.log("🆕 New message added:", msg);
          return [...prev, msg];
        });

        scrollToBottom();
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:");
        console.error("🔍 Raw payload:", event.data);
        console.error("📛 Error:", err);
      }
    };

    socket.onclose = (event) => {
      console.warn(
        `⚠️ WebSocket closed (code ${event.code}). Reconnecting in 3s...`
      );
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      socket?.close();
    };
  };

  useEffect(() => {
    console.log("🚀 Initializing message hook...");
    fetchMessages();
    connectWebSocket();

    const handleRefresh = () => {
      console.log("🔄 Refresh triggered by 'message-sent' event");
      fetchMessages();
    };

    window.addEventListener("message-sent", handleRefresh);

    return () => {
      console.log("🧹 Cleaning up WebSocket and listeners...");
      socket?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      window.removeEventListener("message-sent", handleRefresh);
    };
  }, []);

  const sendViaSocket = (msg: Message) => {
    console.log("📤 Sending message via WebSocket:", msg);
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket not open. Message not sent:", msg);
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
