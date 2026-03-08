"use client"

/*css*/
import css from "./NoteDetails.module.css";

/*hooks*/
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

/*fetch function*/
import { fetchNoteById } from "@/lib/api";

/*types*/
import type { Note } from "@/types/note";

export default  function NoteDetailsClient() {
    const { id } = useParams<{id: string}>();

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
    );
}