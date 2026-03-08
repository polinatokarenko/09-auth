/*queryclient & hydration*/
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

/*components*/
import NotePreviewClient from "./NotePreview.client";

/*api*/
import { fetchNoteById } from "@/lib/api";

type NoteDetailsProps = {
    params: Promise<{
        id: string
    }>
}

export default async function NotePreview({ params }: NoteDetailsProps) {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NotePreviewClient id={id} />
        </HydrationBoundary>
    );
}