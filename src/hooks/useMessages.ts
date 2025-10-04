import { useEffect, useState } from "react";
import { Message } from "../types/Message";
import { fetchMessages } from "../utils/api";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();

  useEffect(() => {
    fetchMessages().then(setMessages);
  }, []);

  return { messages, replyTo, setReplyTo };
};
