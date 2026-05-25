import {
  ThisWeekTotalExpenseSchema,
  PostTransactionSchema,
  type ThisWeekTotalExpense,
  type PostTransaction,
  TransactionItemSchema,
  type TransactionItemType,
} from '../validator/TransactionSchema';
import apiClient, { type ApiResponse } from './apiClient';
import { format, startOfWeek, endOfWeek, endOfDay, startOfDay } from 'date-fns';

export const postTransaction = async (payload: PostTransaction) => {
  const parsedPayload = PostTransactionSchema.parse(payload);
  console.log(parsedPayload.amount);

  const response = await apiClient.post<ApiResponse<{ transactionId: string }>>(
    '/transactions',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
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
  const response = await apiClient.get<ApiResponse<ThisWeekTotalExpense>>('/transactions/expense', {
    params: {
      startDate,
      endDate,
    },
  });

  return {
    status: response.data.status,
    message: response.data.message,
    totalExpense: ThisWeekTotalExpenseSchema.parse(response.data.data).totalExpense,
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
