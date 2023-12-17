import { api } from 'src/boot/axios';

export interface ICategory {
  id: string;
  name: string;
  budget: number;
  priority: number;
  is_expense: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreateCategory {
  name: string;
  budget: number;
  priority: number;
  is_expense: boolean;
}

export async function getCategoriesList(
  { noteId, isExpense }: { noteId: string; isExpense?: boolean },
  {
    jwt_token,
  }: {
    jwt_token?: string;
  }
) {
  let url = `/notes/${noteId}/categories`;
  if (isExpense) {
    url += `?is_expense=${isExpense}`;
  }
  const resp = await api.get(url, {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  });
  return (resp.data.data as ICategory[]) || [];
}

export async function createCategory(
  category: ICreateCategory,
  noteId: string,
  { jwt_token }: { jwt_token?: string }
) {
  const resp = await api.post(`/notes/${noteId}/categories`, category, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt_token}`,
    },
  });
  return resp.data.data as ICategory;
}
