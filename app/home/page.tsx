import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "./client-component";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
    notFound();
  }
}

export default async function Home() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/login");
  };
  return (
    <div className="h-screen flex flex-col items-center pt-24">
      <Navbar />
      <h1>{user?.account}</h1>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
