/*css*/
import css from "./ProfilePage.module.css";

/*link component*/
import Link from "next/link";

/*image component*/
import Image from "next/image";

/*metadata*/
import { Metadata } from "next";

export default function Profile() {
    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href={"/profile/edit"} className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>
                <div className={css.avatarWrapper}>
                    <Image
                        src="Avatar"
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>
                        Username: your_username
                    </p>
                    <p>
                        Email: your_email@example.com
                    </p>
                </div>
            </div>
        </main>
    );
};

export const metadata: Metadata = {
  title: "Profile Page",
  description: "The page where you can see your profile",
  icons: {
    icon: "/notes-icon.svg",
  },
  openGraph: {
    title: "Profile Page",
    description: "The page where you can see your profile",
    url: "https://08-zustand-one-pied.vercel.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "An icon of a note with a completed task, with the application name Notehub displayed next to it.",
      },
    ]
  }
};

