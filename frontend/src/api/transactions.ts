import {
  PostTransactionSchema,
  type PostTransaction,
  TransactionItemSchema,
  type TransactionItemType,
  type TotalExpenseType,
  TotalExpenseSchema,
} from '../validator/TransactionSchema';
import apiClient, { type ApiResponse } from './apiClient';
import {
  format,
  startOfWeek,
  endOfWeek,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

export const postTransaction = async (payload: PostTransaction) => {
  const parsedPayload = PostTransactionSchema.parse(payload);

  const response = await apiClient.post<ApiResponse<{ transactionId: string }>>(
    '/transactions',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    transactionId: response.data.data.transactionId,
  };
};

const getWeekRange = (date = new Date()) => {
  return {
    startDate: format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    endDate: format(endOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
  };
};

export const getThisWeekTotalExpense = async () => {
  const { startDate, endDate } = getWeekRange();
  const response = await apiClient.get<ApiResponse<TotalExpenseType>>('/transactions/expense', {
    params: {
      startDate,
      endDate,
    },
  });

  return {
    status: response.data.status,
    message: response.data.message,
    totalExpense: TotalExpenseSchema.parse(response.data.data).totalExpense,
    statusCode: response.status,
  };
};

const getMonthRange = (date = new Date()) => {
  return {
    startDate: format(startOfMonth(date), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
};

export const getThisMonthTotalExpense = async () => {
  const { startDate, endDate } = getMonthRange();
  const response = await apiClient.get<ApiResponse<TotalExpenseType>>('/transactions/expense', {
    params: {
      startDate,
      endDate,
    },
  });

  return {
    status: response.data.status,
    message: response.data.message,
    totalExpense: TotalExpenseSchema.parse(response.data.data).totalExpense,
    statusCode: response.status,
  };
};

const getDayRange = (date = new Date()) => {
  const dayStart = format(startOfDay(date), 'yyyy-MM-dd');
  const dayEnd = format(endOfDay(date), 'yyyy-MM-dd');
  return { dayStart, dayEnd };
};

export const getThisDayTransactions = async () => {
  const { dayStart, dayEnd } = getDayRange();
  const response = await apiClient.get<ApiResponse<{ transaction: TransactionItemType[] }>>(
    '/transactions',
    {
      params: {
        startDate: dayStart,
        endDate: dayEnd,
      },
    }
  );

  return {
    status: response.data.status,
    message: response.data.message,
    transactions: response.data.data.transaction.map((transaction) =>
      TransactionItemSchema.parse(transaction)
    ),
    statusCode: response.status,
  };
};

export const getThisMonthTransactions = async () => {
  const { startDate, endDate } = getMonthRange();
  const response = await apiClient.get<ApiResponse<{ transaction: TransactionItemType[] }>>(
    '/transactions',
    {
      params: {
        startDate,
        endDate,
      },
    }
  );

  return {
    status: response.data.status,
    message: response.data.message,
    transactions: response.data.data.transaction.map((transaction) =>
      TransactionItemSchema.parse(transaction)
    ),
    statusCode: response.status,
  };
};

export const getTransactionsById = async (id: null | string) => {
  const response = await apiClient.get<ApiResponse<{ transaction: TransactionItemType }>>(
    `/transactions/${id}`
  );

  return {
    status: response.data.status,
    message: response.data.message,
    transaction: TransactionItemSchema.parse(response.data.data.transaction),
    statusCode: response.status,
  };
};

export const putTransactionsById = async (id: null | string, payload: PostTransaction) => {
  const parsedPayload = PostTransactionSchema.parse(payload);
  console.log(parsedPayload);

  const response = await apiClient.put<ApiResponse<{ transactionId: string }>>(
    `/transactions/${id}`,
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    transactionId: response.data.data.transactionId,
    statusCode: response.status,
  };
};

export const deleteTransactionsById = async (id: null | string) => {
  const response = await apiClient.delete<ApiResponse<unknown>>(`/transactions/${id}`);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
  };
};
