/*api*/
import nextServer from "./api";

/*types*/
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export const runtime = "nodejs";

export type TagType = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface FetchNotesProps {
  search?: string;
  tag?: TagType;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: FetchNotesProps): Promise<FetchNotesResponse> {
  const res = await nextServer.get<FetchNotesResponse>("/notes", { params });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}

export async function checkSession(): Promise<User | null> {
  const res = await nextServer.get<User>("/auth/session/");
  return res.data ?? null;
}