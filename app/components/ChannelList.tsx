"use client";
import React, { useEffect, useState } from 'react';

interface Channel {
  id: number;
  name: string;
}

interface ChannelListProps {
  onSelect: (channel: Channel) => void;
  selectedChannelId?: number;
}
export default function ChannelList({ onSelect, selectedChannelId }: ChannelListProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/channels');
      const data = await res.json();
      if (res.ok) setChannels(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewName('');
      setShowInput(false);
      fetchChannels();
    } else {
      setError(data.error || 'Error adding channel');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this channel?')) return;
    setLoading(true);
    const res = await fetch(`/api/channels/${id}`, { method: 'DELETE' });
    if (res.ok) fetchChannels();
    setLoading(false);
  };

  return (
    <div>
      <h3 className="px-2 text-xs uppercase text-gray-400 mb-2">Channels</h3>
      <ul className="space-y-1 mb-2">
        {channels.map((ch) => (
          <li
            key={ch.id}
            className={
              `flex items-center justify-between px-2 py-1 rounded-md ` +
              (ch.id === selectedChannelId ? 'bg-slate-700' : 'hover:bg-slate-700')
            }
          >
            <div
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => onSelect(ch)}
            >
              <span className="mr-2 text-gray-400">#</span>
              {ch.name}
            </div>
            <button
              className="text-red-400 hover:text-red-600"
              onClick={() => handleDelete(ch.id)}
              disabled={loading}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {showInput ? (
        <div className="px-2">
          <input
            type="text"
            className="w-full p-1 rounded bg-slate-700 text-white"
            placeholder="new channel"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={loading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <button
          className="flex items-center px-2 py-1 text-sm text-green-400 hover:text-green-500"
          onClick={() => setShowInput(true)}
        >
          + Add Channel
        </button>
      )}
    </div>
  );
}