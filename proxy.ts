import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/notes", "/profile"];
const authorizedRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthorizedRoute = authorizedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthorizedRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile", "/sign-in", "/sign-up"],
};