import { Message } from "../types/Message";
import { Member } from "../types/Member";

export const fetchMessages = async (): Promise<Message[]> => {
  return [
    {
      id: "1",
      senderId: "u1",
      senderName: "Its",
      type: "text",
      content: "Hello team!",
      timestamp: Date.now() - 60000,
      status: "delivered",
    },
    {
      id: "2",
      senderId: "u2",
      senderName: "Amina",
      type: "document",
      content: "https://example.com/report.pdf",
      timestamp: Date.now() - 30000,
      status: "delivered",
    },
  ];
};

export const fetchMembers = async (): Promise<Member[]> => {
  return [
    { id: "u1", name: "Its", joinedAt: Date.now() - 86400000 },
    { id: "u2", name: "Amina", joinedAt: Date.now() - 43200000 },
  ];
};
