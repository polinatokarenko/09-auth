/*zustand*/
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/*types*/
import type { User } from "@/types/user";

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (data: User | null) => void;
    clearIsAuthenticated: () => void;
}

export const initialValues = {
    user: null,
    isAuthenticated: false,
};


export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialValues,
            
            setUser: (data) =>
                set({
                    user: data,
                    isAuthenticated: Boolean(data),
                }),
            
            clearIsAuthenticated: () =>
                set({
                    user: initialValues.user,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);