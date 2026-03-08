"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfile.module.css";

type User = {
  email: string;
  username: string;
  avatarUrl?: string;
};

export default function EditProfile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user) as User | null;

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

  const updateUsername = async (value: string) => {
    const res = await fetch("/api/user", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: value }),
    });

    if (!res.ok) {
      throw new Error("Failed to update username");
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (username === initialUsername) {
      router.push("/profile");
      return;
    }

    setLoading(true);

    try {
      await updateUsername(username);
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
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
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