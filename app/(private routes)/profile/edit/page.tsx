"use client";

import css from "./EditProfilePage.module.css";

import React, { useEffect, useState, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";

export default function EditProfile() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setUsername(user.username);
    setInitialUsername(user.username);
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      return;
    }

    if (username === initialUsername) {
      router.push("/profile");
      return;
    }

    setLoading(true);

    try {
      const updatedUser: User = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/profile");
  };

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Edit profile</h1>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.avatarRow}>
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="User avatar"
              width={96}
              height={96}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatarPlaceholder} />
          )}

          <div className={css.info}>
            <div className={css.field}>
              <label>Email</label>
              <p className={css.plainText}>{user.email}</p>
            </div>

            <div className={css.field}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                className={css.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={loading || username === initialUsername}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}