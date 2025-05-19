"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";

interface Channel {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

interface Props {
  channel: Channel;
}

export default function ChatArea({ channel }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // Track IME composition state to avoid sending on Enter during Japanese input
  const [isComposing, setIsComposing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  // Current logged-in user for avatar
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!channel) return;
    fetchMessages();
  }, [channel.id]);
  // Fetch current user for avatar
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((user: User) => setCurrentUser(user))
      .catch((err) => console.error("Failed to fetch current user:", err));
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/channels/${channel.id}/messages`);
      if (!res.ok) throw new Error();
      const data: Message[] = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/channels/${channel.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (!res.ok) throw new Error();
      setNewMessage("");
      await fetchMessages();
    } catch (e) {
      console.error("Failed to send message", e);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-semibold mr-2"># {channel.name}</span>
          <span className="text-gray-500 text-sm">members</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">i</button>
      </header>
      <div className="flex-1 p-4 px-10 overflow-y-auto space-y-6 bg-white">
        {messages.map((msg) => {
          const isOwn = currentUser?.id === msg.user.id;
          const avatar = (
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
              {msg.user.name.charAt(0).toUpperCase()}
            </div>
          );
          const content = (
            <div
              className={`flex flex-col ${
                isOwn ? "items-end" : "items-start"
              } max-w-xs`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">{msg.user.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          );
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-4 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {isOwn ? (
                <>
                  {content}
                  {avatar}
                </>
              ) : (
                <>
                  {avatar}
                  {content}
                </>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex items-center">
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white mr-3">
          {currentUser ? currentUser.name.charAt(0).toUpperCase() : ""}
        </div>
        <textarea
          placeholder="メッセージを入力"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <button
          className="ml-4 text-blue-500 hover:text-blue-600"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </>
  );
}
