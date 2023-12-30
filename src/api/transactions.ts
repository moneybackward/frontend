import { api } from 'src/boot/axios';
import { IBase, ICategory } from './categories';

export interface ICreateTransaction {
  label: string;
  amount: number;
  category_id: string;
  is_expense: boolean;
  date: Date;
}

export interface ITransaction extends IBase {
  label: string;
  amount: number;
  date: Date;
  is_expense: boolean;
  note_id: string;
  category_id: string;
  category?: ICategory;
}

export async function getTransactionsList(
  { noteId }: { noteId: string },
  {
    jwt_token,
  }: {
    jwt_token?: string;
  }
) {
  const headers = {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  const resp = await api.get(`/notes/${noteId}/transactions`, headers);
  return (resp.data.data as ITransaction[]) || [];
}

export async function createTransaction(
  transaction: ICreateTransaction,
  noteId: string,
  { jwt_token }: { jwt_token?: string }
) {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  return await api.post(`/notes/${noteId}/transactions`, transaction, headers);
}
