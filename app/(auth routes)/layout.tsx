"use client";

import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

type Props = {
  children: ReactNode;
};

export default function AuthRoutesLayout({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}