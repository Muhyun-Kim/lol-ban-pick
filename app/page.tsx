"use client";

import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center h-screen pt-20">
      <span className="text-4xl">WELCOM TO BAN-PICK</span>
      <div className="flex gap-4">
        <button onClick={() => router.push("/login")}>login</button>
        <button onClick={() => router.push("/sign-up")}>signup</button>
      </div>
    </div>
  );
}
