/*queryclient & hydration*/
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

/*client component*/
import NotesClient from "./Notes.client";

/*fetch function*/
import { fetchNotes } from "@/lib/api/serverApi";

/*types*/
import type { TagType } from "@/lib/api/serverApi";

/*metadata*/
import { Metadata } from "next";

type NotesProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Notes({ params }: NotesProps) {
  const firstTag = (await params).slug[0];
  const tag = firstTag !== "all" && (firstTag as TagType);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: tag ? () => fetchNotes({ tag }) : () => fetchNotes({}),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag ? tag : undefined} />
    </HydrationBoundary>
  );
};

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const firstTag = (await params).slug[0];
  const tag = firstTag !== "all" && (firstTag as TagType);

  return {
    title: `All ${tag} Notes`,
    description: `All notes sorted by tag ${tag}`,
    openGraph: {
      title: `All ${tag} Notes`,
      description: `All notes sorted by tag ${tag}`,
      url: `https://08-zustand-one-pied.vercel.app/notes/filter/${tag}`,
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