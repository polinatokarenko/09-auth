/*api*/
import nextServer from "./api";

/*types*/
import type { Note } from "@/types/note";
import type { User } from "@/types/user"

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

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: TagType;
}

export async function createNote(data: CreateNoteProps): Promise<Note> {
  const res = await nextServer.post<Note>("/notes", data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}

export interface RegisterProps {
    email: string,
    password: string,
}

export async function register(data: RegisterProps): Promise<User> {
  const res = await nextServer.post<User>("/auth/register/", data);
  return res.data;
}

export async function login(data: RegisterProps): Promise<User> {
  const res = await nextServer.post<User>("/auth/login/", data);
  return res.data;
}

export async function logout(): Promise<number> {
  const res = await nextServer.post("/auth/logout/");
  return res.status;
}

export async function checkSession(): Promise<number> {
  const res = await nextServer.get<User>("/auth/session/");
  return res.status;
}

export async function getMe(): Promise<User> {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}

interface UpdateProfileProps {
    email: string,
    username: string,
}

export async function updateMe(data: UpdateProfileProps): Promise<User> {
  const res = await nextServer.patch<User>("/users/me/", data);
  return res.data;
}