"use client";
import React, { useEffect, useState, useRef } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserAvatarMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error('Failed to fetch user:', err));
  }, []);

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

  if (!user) return null;

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white hover:bg-slate-500 transition"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded shadow-lg z-20">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      )}
    </div>
  );
}