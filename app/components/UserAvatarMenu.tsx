"use client";
// Client-side stub user switcher
import React, { useState, useRef, useEffect } from 'react';

interface StubUser {
  key: string;
  name: string;
  email: string;
}

const stubUsers: StubUser[] = [
  { key: 'alice', name: 'Alice', email: 'alice@example.com' },
  { key: 'bob', name: 'Bob', email: 'bob@example.com' },
];

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export default function UserAvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Current stub user key, initial 'alice' to match SSR
  const [currentKey, setCurrentKey] = useState<string>('alice');
  useEffect(() => {
    const cookieUser = getCookie('user') || 'alice';
    setCurrentKey(cookieUser);
  }, []);
  const currentUser = stubUsers.find((u) => u.key === currentKey) || stubUsers[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const switchUser = (user: StubUser) => {
    if (user.key !== currentKey) {
      setCookie('user', user.key);
      window.location.reload();
    } else {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white hover:bg-slate-500 transition"
      >
        {currentUser.name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded shadow-lg z-20">
          {stubUsers.map((u) => (
            <button
              key={u.key}
              onClick={() => switchUser(u)}
              className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 transition ${
                u.key === currentKey ? 'font-semibold' : ''
              }`}
            >
              <span className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white mr-2">
                {u.name.charAt(0)}
              </span>
              {u.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}