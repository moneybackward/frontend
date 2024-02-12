import { api } from 'src/boot/axios';
import { IBase, ICategory } from './categories';

export interface ICreateTransaction {
  label: string;
  amount: number;
  category_id: string;
  is_expense: boolean;
  date: string;
}

export interface IUpdateTransaction extends ICreateTransaction {
  id: string;
}

export interface ITransaction extends IBase {
  id: string;
  label: string;
  amount: number;
  date: string;
  is_expense: boolean;
  note_id: string;
  category_id: string;
  category?: ICategory;
}

export interface ITransactionFilter {
  isExpense?: boolean;
  dateFilter?: { start?: string; end?: string };
}

export async function getTransactionsList(
  noteId: string,
  { jwt_token }: { jwt_token?: string },
  { isExpense, dateFilter }: ITransactionFilter
) {
  let url = `/notes/${noteId}/transactions`;
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
  return (resp.data.data as ITransaction[]) || [];
}

export async function createTransaction(
  noteId: string,
  transaction: ICreateTransaction,
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

export async function editTransaction(
  noteId: string,
  transaction: IUpdateTransaction,
  { jwt_token }: { jwt_token?: string }
) {
  const resp = await api.put(
    `/notes/${noteId}/transactions/${transaction.id}`,
    transaction,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt_token}`,
      },
    }
  );
  return resp.data.data as ITransaction;
}

export async function deleteTransaction(
  noteId: string,
  transactionId: string,
  { jwt_token }: { jwt_token?: string }
) {
  const resp = await api.delete(
    `/notes/${noteId}/transactions/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    }
  );
  return resp.data.data as ITransaction;
}
