"use client"

/*css*/
import css from "./AuthNavigation.module.css"

/*link component*/
import Link from "next/link";

/*hooks*/
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";


export default function AuthNavigation() {
    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await logout();
            
            if (res !== 200) throw new Error("Logout failed");

            clearIsAuthenticated();

            router.push("/sign-in");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isAuthenticated && <li className={css.navigationItem}>
                <Link href="/profile" prefetch={false} className={css.navigationLink}>
                    Profile
                </Link>
            </li>}
            <li className={css.navigationItem}>
                <p className={css.userEmail}>{user?.email ?? "User email"}</p>
                {isAuthenticated && <button type="button" onClick={handleLogout} disabled={loading} className={css.logoutButton}>
                    Logout
                </button>}
            </li>
            {!isAuthenticated && <li className={css.navigationItem}>
                <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
                    Login
                </Link>
            </li>}
            <li className={css.navigationItem}>
                {!isAuthenticated && <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
                    Sign up
                </Link>}
            </li>
        </>
    );
}