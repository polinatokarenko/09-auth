"use client"

/*css*/
import css from "./CreateNote.module.css";

/*hooks*/
import { useRouter } from "next/navigation";

/*components*/
import NoteForm from "@/components/NoteForm/NoteForm"

export default function CreateNote() {
    const router = useRouter();
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                <NoteForm onClose={() => router.replace("/notes/filter/all")}/>
            </div>
        </main>
    );
}