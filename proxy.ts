import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authorizedRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthorizedRoute = authorizedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      const setCookie = res.headers["set-cookie"];

      if (setCookie && setCookie.length > 0) {
        const response = NextResponse.next();

        setCookie.forEach((c) => {
          response.headers.append("set-cookie", c);
        });

        const getCookieFromSet = (name: string): string | undefined => {
          for (const sc of setCookie) {
            const firstPart = sc.split(";")[0].trim();
            const [k, ...rest] = firstPart.split("=");
            if (k === name) return rest.join("=");
          }
          return undefined;
        };

        const newAccess = getCookieFromSet("accessToken");
        if (newAccess) {
          accessToken = newAccess;
        }

        if (isPrivateRoute && !accessToken) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        return response;
      } else {
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
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