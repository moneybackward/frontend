import { api } from 'src/boot/axios';

export interface IBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ICategory extends IBase {
  name: string;
  budget?: number;
  priority: number;
  is_expense: boolean;
  color: string;
}

export interface ICreateCategory {
  name: string;
  budget?: number;
  priority: number;
  is_expense: boolean;
  color: string;
}

export interface IUpdateCategory extends ICreateCategory {
  id: string;
}

export interface ICategoryStatistic extends ICategory {
  total: number;
  count: number;
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
  if (isExpense !== undefined) {
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
  noteId: string,
  category: ICreateCategory,
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

export async function editCategory(
  noteId: string,
  category: IUpdateCategory,
  { jwt_token }: { jwt_token?: string }
) {
  const resp = await api.put(
    `/notes/${noteId}/categories/${category.id}`,
    category,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt_token}`,
      },
    }
  );
  return resp.data.data as ICategory;
}

export async function deleteCategory(
  noteId: string,
  categoryId: string,
  { jwt_token }: { jwt_token?: string }
) {
  const resp = await api.delete(`/notes/${noteId}/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  });
  return resp.data.data as ICategory;
}

export interface ICategoryStatisticOptions {
  isExpense?: boolean;
  dateFilter?: { start?: string; end?: string };
}

export async function getStatistics(
  noteId: string,
  { jwt_token }: { jwt_token?: string },
  { isExpense, dateFilter }: ICategoryStatisticOptions
) {
  let url = `/notes/${noteId}/statistics/categories`;
  const urlParams = new URLSearchParams();
  if (isExpense !== undefined) {
    urlParams.append('is_expense', isExpense.toString());
  }

  if (dateFilter) {
    if (dateFilter.start) {
      urlParams.append('date_start', dateFilter.start);
    }
    if (dateFilter.end) {
      urlParams.append('date_end', dateFilter.end);
    }
  }

  if (urlParams.toString()) {
    url += `?${urlParams.toString()}`;
  }

  const resp = await api.get(url, {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  });

  return resp.data.data as ICategoryStatistic[];
}
