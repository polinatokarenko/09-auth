/*metadata*/
import { Metadata } from "next";

/*client component*/
import CreateNote from "./CreateNote.client";

export default function CreateNoteComponent() {
    return <CreateNote />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create Note",
    description: "Here you can create your own note and not forget to complete the necessary tasks!",
    openGraph: {
      title: "Create Note",
      description: "Here you can create your own note and not forget to complete the necessary tasks!",
      url: "https://08-zustand-one-pied.vercel.app/notes/action/create",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "An icon of a note with a completed task, with the application name Notehub displayed next to it.",
        },
      ],
    },
  }
}