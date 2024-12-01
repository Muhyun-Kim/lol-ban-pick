"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function Home() {
  const [state, dispatch] = useActionState(login, null);
  return (
    <div className="flex justify-center items-center h-screen">
      <form action={dispatch} className="px-4 flex flex-col space-y-4">
        <input name="account" placeholder="id" className="px-4 py-1" />
        <input name="password" placeholder="password" className="px-4 py-1" />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
