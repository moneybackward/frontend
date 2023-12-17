import { api } from 'src/boot/axios';

export interface ICreateNote {
  name: string;
}

export interface INote {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function getNotesList({ jwt_token }: { jwt_token?: string }) {
  const headers = {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  const resp = await api.get('/notes', headers);
  return (resp.data.data as INote[]) || [];
}

export async function createNote(
  note: ICreateNote,
  { jwt_token }: { jwt_token?: string }
) {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  return await api.post('/notes', note, headers);
}

export async function getNoteDetail(
  { noteId }: { noteId: string },
  { jwt_token }: { jwt_token?: string }
) {
  const headers = {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  const resp = await api.get(`/notes/${noteId}`, headers);
  return resp.data.data as INote;
}
