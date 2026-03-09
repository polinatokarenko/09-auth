"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

const privateRoutes = ["/notes", "/profile"];

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (!isPrivateRoute) {
        setLoading(false);
        return;
      }

      try {
        const isValid = await checkSession();
        
        if (!isValid) {
          clearIsAuthenticated();
          router.push("/sign-in");
          return;
        }

        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, clearIsAuthenticated, setUser, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}