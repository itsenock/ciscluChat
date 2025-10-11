import { useMembers } from "../hooks/useMembers";
import { useMessages } from "../hooks/useMessages";
import { ChatHeader } from "./ChatHeader";
import { MemberList } from "./MemberList";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { LoadingSpinner } from "./LoadingSpinner";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("chat-user");
    if (!raw) return { id: "unknown", name: "Anonymous" };
    const parsed = JSON.parse(raw);
    if (!parsed.id || !parsed.name) throw new Error("Invalid user");
    return parsed;
  } catch {
    return { id: "unknown", name: "Anonymous" };
  }
};

export const ChatRoom = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const members = useMembers();
  const {
    messages,
    replyTo,
    setReplyTo,
    loading,
    setMessages,
    bottomRef,
    scrollToBottom,
    sendViaSocket,
  } = useMessages();

  const [showMembersMobile, setShowMembersMobile] = useState(false);
  const [expandMembersDesktop, setExpandMembersDesktop] = useState(false);
  const mobilePopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser.id === "unknown") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMembersMobile &&
        mobilePopupRef.current &&
        !mobilePopupRef.current.contains(event.target as Node)
      ) {
        setShowMembersMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMembersMobile]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f0f8ff] dark:bg-gray-900 transition-colors duration-300">
      {/* Main Chat Column */}
      <div className="flex flex-col flex-1">
        <ChatHeader
          name="CISLU Tech Group"
          description="A space for tech discussions, updates, and collaboration."
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f8ff] dark:bg-gray-900 transition-colors duration-300 custom-scroll">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id || `${msg.senderId}-${msg.timestamp}-${index}`} // ✅ Unique fallback key
                  message={msg}
                  isOwn={msg.senderId === currentUser.id}
                  onReply={setReplyTo}
                />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <MessageInput
          replyTo={replyTo}
          clearReply={() => setReplyTo(undefined)}
          currentUser={currentUser}
          setMessages={setMessages}
          scrollToBottom={scrollToBottom}
          sendViaSocket={sendViaSocket}
        />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out ${
          expandMembersDesktop ? "w-80" : "w-64"
        } bg-white dark:bg-gray-800 border-l dark:border-gray-700 p-4 overflow-y-auto custom-scroll`}
      >
        <MemberList members={members} />
      </div>

      {/* Floating Buttons */}
      <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
        <ThemeToggle />
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setShowMembersMobile(!showMembersMobile);
            } else {
              setExpandMembersDesktop(!expandMembersDesktop);
            }
          }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <UsersIcon className="w-5 h-5" />
        </button>

        <a
          href="/"
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        >
          <HomeIcon className="w-5 h-5" />
        </a>
      </div>

      {/* Mobile Popup */}
      {showMembersMobile && (
        <div
          ref={mobilePopupRef}
          className="fixed top-20 right-4 w-[260px] max-h-[70vh] bg-white dark:bg-gray-800 border rounded-xl shadow-2xl p-4 z-40 overflow-hidden animate-slide-up"
        >
          <div className="overflow-y-auto max-h-[55vh] pr-1 custom-scroll">
            <MemberList members={members} />
          </div>
          <button
            onClick={() => setShowMembersMobile(false)}
            className="mt-3 text-red-500 text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
