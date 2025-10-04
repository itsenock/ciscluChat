export type MessageStatus = "sending" | "delivered";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  type: "text" | "document" | "reply";
  content: string;
  replyTo?: Message;
  timestamp: number;
  status: MessageStatus;
}
