export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "document";
  timestamp: number;
  status?: "sent" | "delivered";
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}
