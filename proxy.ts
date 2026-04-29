import { auth } from "@/auth";
  import { NextResponse } from "next/server";

  export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isProtected = req.nextUrl.pathname.startsWith("/dashboard");
    
    if (isProtected && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isAuthPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
  });

  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
  };
