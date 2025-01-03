import { NextResponse } from "next/server";

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.has("isLoggedIn")
    ? JSON.parse(request.cookies.get("isLoggedIn").value)
    : false;

  if (
    (pathname === "/auth/login" || pathname === "/auth/signup") &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !isLoggedIn &&
    pathname !== "/auth/login" &&
    pathname !== "/auth/signup"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/auth/signup", "/movies/:path*"],
};
