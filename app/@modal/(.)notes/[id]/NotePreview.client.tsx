"use client"

/*css*/
import css from "./NotePreview.module.css";

/*hooks*/
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/*api*/
import { fetchNoteById } from "@/lib/api";

/*types*/
import type { Note } from "@/types/note";

/*modal*/
import Modal from "@/components/Modal/Modal";

interface NotePreviewClientProps {
    id: string,
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
    const router = useRouter();

    const { data: note, isLoading, error } = useQuery<Note>({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    })

    if (isLoading) {
        return (<p>Loading, please wait...</p>);
    }

    if (!note || error) {
        return (<p>Something went wrong.</p>);
    }

    return (
        <Modal onClose={() => router.back()}>
            <div className={css.container}>
            <div className={css.item}>
                <div className={css.header}>
                    <h2>{note.title}</h2>
                </div>
                <p className={css.tag}>{note?.tag}</p>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>{note.createdAt}</p>
            </div>
        </div>
        </Modal>
    );
}