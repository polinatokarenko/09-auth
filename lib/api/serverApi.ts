import nextServer from "./api";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";

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

export async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function fetchNotes(params: FetchNotesProps): Promise<FetchNotesResponse> {
  const cookieHeader = await buildCookieHeader();
  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await buildCookieHeader();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await buildCookieHeader();
  const res = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieHeader = await buildCookieHeader();
  const res = await nextServer.get<User | null>("/auth/session/", {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res;
}