"use client";
import React, { useState } from 'react';
import CurrentUser from './CurrentUser';
import ChannelList from './ChannelList';
import ChatArea from './ChatArea';
import UserAvatarMenu from './UserAvatarMenu';

interface Channel {
  id: number;
  name: string;
}

export default function ChatWorkspace() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-800 text-gray-100 flex flex-col">
        <div className="p-4 border-b border-slate-700 text-lg font-semibold">
          Workspace
        </div>
        <CurrentUser />
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ChannelList
            onSelect={(ch) => setSelectedChannel(ch)}
            selectedChannelId={selectedChannel?.id}
          />
          <div className="mt-6">
            <h3 className="px-2 text-xs uppercase text-gray-400 mb-2">
              Direct Messages
            </h3>
            <ul className="space-y-1">
              <li className="flex items-center px-2 py-1 rounded-md hover:bg-slate-700 cursor-pointer">
                <div className="w-6 h-6 bg-slate-600 rounded-full mr-2" />
                Alice
              </li>
              <li className="flex items-center px-2 py-1 rounded-md hover:bg-slate-700 cursor-pointer">
                <div className="w-6 h-6 bg-slate-600 rounded-full mr-2" />
                Bob
              </li>
            </ul>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <UserAvatarMenu />
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-white">
        {selectedChannel ? (
          <ChatArea channel={selectedChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a channel
          </div>
        )}
      </main>
    </div>
  );
}