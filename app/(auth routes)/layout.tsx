"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

type Props = {
  children: ReactNode;
};

export default function AuthRoutesLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <AuthProvider>{children}</AuthProvider>;
}