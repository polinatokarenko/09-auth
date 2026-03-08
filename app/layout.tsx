/*css*/
import "./globals.css";

/*metadata*/
import type { Metadata } from "next";

/*roboto font*/
import { Roboto } from "next/font/google";

/*components*/
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

/*queryclientprovider*/
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap',
})

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Modern application for dynamic note creation",
  icons: {
    icon: "/notes-icon.svg",
  },
  openGraph: {
    title: "NoteHub",
    description: "Modern application for dynamic note creation",
    url: "https://08-zustand-one-pied.vercel.app/",
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

export default function RootLayout({
  children, modal
}: Readonly<{
  children: React.ReactNode; modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
