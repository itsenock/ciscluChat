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
      const res = await fetch("https://chat-room-1e3o.onrender.com/api/messages");
      const data = await res.json();
      console.log("✅ Messages fetched from backend:", data);

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
        const serverMsg: Message = JSON.parse(event.data);
        console.log("🔍 Parsed WebSocket message:", serverMsg);

        if (!serverMsg.id || !serverMsg.content || !serverMsg.senderName) {
          console.warn("⚠️ Ignored malformed message:", serverMsg);
          return;
        }

        setMessages((prev) => {
          const match = prev.find(
            (m) => m.id === serverMsg.localId || m.localId === serverMsg.localId
          );

          if (match) {
            console.log("🔁 Replacing local message with confirmed:", serverMsg);
            return prev.map((m) =>
              m.id === match.id ? { ...serverMsg, status: "delivered" } : m
            );
          }

          const alreadyExists = prev.some((m) => m.id === serverMsg.id);
          if (alreadyExists) {
            console.log("🔁 Duplicate confirmed message ignored:", serverMsg.id);
            return prev;
          }

          console.log("🆕 Appending new message from backend:", serverMsg);
          return [...prev, serverMsg];
        });

        scrollToBottom();
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", err);
      }
    };

    socket.onclose = (event) => {
      console.warn(`⚠️ WebSocket closed (code ${event.code}). Reconnecting in 3s...`);
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
    if (socket?.readyState === WebSocket.OPEN) {
      console.log("📤 Sending message via WebSocket:", msg);
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
