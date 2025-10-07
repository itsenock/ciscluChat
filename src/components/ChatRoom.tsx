import { useMembers } from '../hooks/useMembers';
import { useMessages } from '../hooks/useMessages';
import { ChatHeader } from './ChatHeader';
import { MemberList } from './MemberList';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useState, useEffect, useRef } from 'react';
import { HomeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('chat-user');
    if (!raw) return { id: 'unknown', name: 'Anonymous' };
    const parsed = JSON.parse(raw);
    if (!parsed.id || !parsed.name) throw new Error('Invalid user');
    return parsed;
  } catch {
    return { id: 'unknown', name: 'Anonymous' };
  }
};

export const ChatRoom = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const members = useMembers();
  const { messages, replyTo, setReplyTo } = useMessages();
  const [showMembersMobile, setShowMembersMobile] = useState(false);
  const [expandMembersDesktop, setExpandMembersDesktop] = useState(false);
  const mobilePopupRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser.id === 'unknown') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMembersMobile]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f0f8ff] dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col flex-1">
        <ChatHeader
          name="CISLU Tech Group"
          description="A space for tech discussions, updates, and collaboration."
          memberCount={members.length}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f8ff] dark:bg-gray-900 transition-colors duration-300">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === currentUser.id}
              onReply={setReplyTo}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        <MessageInput
          replyTo={replyTo}
          clearReply={() => setReplyTo(undefined)}
          currentUser={currentUser}
        />
      </div>

      <div
        className={`hidden md:block transition-all duration-300 ease-in-out ${
          expandMembersDesktop ? 'w-80' : 'w-64'
        } bg-white dark:bg-gray-800 border-l dark:border-gray-700 p-4 overflow-y-auto`}
      >
        <MemberList members={members} />
      </div>

      <div className="fixed md:top-4 md:right-4 bottom-20 right-4 flex flex-col gap-3 z-50">
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

        <a href="/" className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700">
          <HomeIcon className="w-5 h-5" />
        </a>
      </div>

      {showMembersMobile && (
        <div
          ref={mobilePopupRef}
          className="absolute bottom-24 right-4 w-64 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 animate-slide-up z-40"
        >
          <MemberList members={members} />
          <button onClick={() => setShowMembersMobile(false)} className="mt-2 text-red-500 text-sm">Close</button>
        </div>
      )}
    </div>
  );
};
