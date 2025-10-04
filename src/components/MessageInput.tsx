import { useState } from "react";
import { Message } from "../types/Message";

export const MessageInput = ({
  replyTo,
  clearReply,
}: {
  replyTo?: Message;
  clearReply: () => void;
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    console.log("Send:", text);
    setText("");
    clearReply();
  };

  return (
    <div className="p-4 border-t bg-white">
      {replyTo && (
        <div className="bg-gray-200 p-2 rounded text-sm mb-2">
          Replying to: {replyTo.content}
          <button onClick={clearReply} className="ml-2 text-red-500">
            ✖
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};
