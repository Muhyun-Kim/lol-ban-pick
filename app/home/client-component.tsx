"use client";

import { useEffect, useState } from "react";
import { getUser, logout } from "./actions";

interface User {
  id: number;
  account: string;
  password: string;
  email: string;
  riot_account_id: string;
  created_at: Date;
  updated_at: Date;
}

export function Navbar() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const handleLogout = async () => {
    await logout();
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser();
      setUser(res);
    };
    fetchUser();
  }, []);
  return (
    <div className="w-full h-10 bg-zinc-600 fixed top-0 flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <h6>{user?.account}</h6>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
}
