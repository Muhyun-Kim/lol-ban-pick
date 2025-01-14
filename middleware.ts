import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}
const publicOnlyUrls: Routes = {
  "/login": true,
  "/sign-up": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      console.log("Redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (exists) {
      console.log("Redirecting to home");
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
