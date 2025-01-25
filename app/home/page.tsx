"use client";

import { Navbar } from "./client-component";
import { makeRoom } from "./actions";
import { useFormState } from "react-dom";

export default function Home() {
  const [state, dispatch] = useFormState(makeRoom, null);
  return (
    <div className="h-screen flex flex-col items-center pt-24">
      <Navbar />
      <form action={dispatch} className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <input
              type="radio"
              id="normal"
              name="ban-pick-type"
              value="normal"
              className="peer hidden"
            />
            <label
              htmlFor="normal"
              className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500"
            >
              일반 밴픽
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="hardFearless"
              name="ban-pick-type"
              value="hardFearless"
              className="peer hidden"
            />
            <label
              htmlFor="hardFearless"
              className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500"
            >
              하드 피어리스
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="softFearless"
              name="ban-pick-type"
              value="softFearless"
              className="peer hidden"
            />
            <label
              htmlFor="softFearless"
              className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500"
            >
              소프트 피어리스
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          방 만들기
        </button>
        {state?.fieldErrors?.banPickType?.map((error, index) => (
          <span key={index} className="text-red-500">
            {error}
          </span>
        ))}
      </form>
    </div>
  );
}
