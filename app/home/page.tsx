"use client";

import { Navbar } from "./client-component";
import { makeRoom } from "./actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";

export default function Home() {
  const [state, dispatch] = useFormState(makeRoom, null);
  return (
    <div className="h-screen flex flex-col items-center pt-24">
      <Navbar />
      <form action={dispatch} className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <div>
            <input type="radio" name="ban-pick-type" value="normal" />
            <label htmlFor="normal">Normal</label>
          </div>
          <div>
            <input type="radio" name="ban-pick-type" value="hardFearless" />
            <label htmlFor="hard fearless">Hard fearless</label>
          </div>
          <div>
            <input type="radio" name="ban-pick-type" value="softFearless" />
            <label htmlFor="soft fearless">Soft fearless</label>
          </div>
        </div>
        <button type="submit">make room</button>
        {state?.fieldErrors?.banPickType?.map((error, index) => (
          <span key={index} className="text-red-500">
            {error}
          </span>
        ))}
      </form>
    </div>
  );
}
