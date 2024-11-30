import { LoginBtn } from "@/component/btn";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="px-4 flex flex-col space-y-4">
        <input name="account" placeholder="id" className="px-4 py-1" />
        <input name="password" placeholder="password" className="px-4 py-1" />
        <button>login</button>
      </div>
    </div>
  );
}
