import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authorizedRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthorizedRoute = authorizedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    const res = await checkSession();
    
    const setCookie = res.headers["set-cookie"];
    if (setCookie && setCookie.length > 0) {
      const response = NextResponse.next();
      response.headers.set("set-cookie", setCookie.join("; "));
      return response;
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthorizedRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};