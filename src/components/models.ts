export interface ITransactionItem {
  label: string;
  type: 'income' | 'expense';
  category?: string;
  description?: string;
  amount: number;
  date: Date;
}
