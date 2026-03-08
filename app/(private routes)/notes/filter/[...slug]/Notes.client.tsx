"use client"

/*css*/
import css from "./Notes.module.css";

/*hooks*/
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";

/*components*/
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

/*services*/
import { fetchNotes } from "@/lib/api/clientApi";

/*types*/
import type { Note } from "@/types/note";

/*message*/
import toast, { Toaster } from 'react-hot-toast';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
};

type NotesClientProps = {
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping" | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
    const [page, setPage] = useState<number>(1);
    const perPage: number = 6;
    
    const [search, setSearch] = useState<string>("");
    
    const { data, isSuccess, isFetching, isFetched } = useQuery<FetchNotesResponse>({
        queryKey: ["notes", search, page, tag],
        queryFn: () => fetchNotes({ search, page, perPage, tag }),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });
    
    useEffect(() => {
        if (!isFetching && isFetched && isSuccess && (data?.notes.length ?? 0) === 0 && search.length > 0) {
            toast.error('No notes were found :(', {
                style: { fontFamily: 'Montserrat' },
            });
        }
    }, [isFetching, isFetched, isSuccess, data?.notes?.length, search.length]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        debouncedSearch(value);
    };
    
    const debouncedSearch = useDebouncedCallback((value) => {
        setSearch(value);
        setPage(1);
    }, 500);
    
    const router = useRouter();

    return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <button className={css.button} onClick={() => router.push('/notes/action/create')}>
          Create note +
        </button>
      </header>
      
      {(data?.notes.length ?? 0) > 0 && <NoteList notes={data?.notes ?? []} />}
      {(data?.totalPages ?? 0) > 1 && data?.notes !== undefined && data?.notes.length > 0 && <Pagination page={page} setPage={setPage} totalPages={data?.totalPages ?? 0} />}
    </div>
  );
}