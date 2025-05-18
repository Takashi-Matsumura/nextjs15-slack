"use client";
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

export default function CurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error('Failed to fetch user:', err));
  }, []);

  if (!user) {
    return <div className="p-2 text-sm text-gray-400">Loading user...</div>;
  }

  return (
    <div className="p-2 text-sm text-gray-300 border-b border-slate-700">
      Logged in as <span className="font-semibold text-white">{user.name}</span>
    </div>
  );
}