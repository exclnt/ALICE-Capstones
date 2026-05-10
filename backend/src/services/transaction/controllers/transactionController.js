import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import TransactionRepositories from '../repositories/TransactionRepositories.js';

export const createTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { amount, category, date, title, type } = req.validated;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const transaction = await TransactionRepositories.addTransaction({
    userId,
    amount,
    category,
    date,
    title,
    type,
  });

  if (!transaction) {
    return next(new InvariantError('Gagal menambahkan transaksi'));
  }

  return response(res, 201, 'Transaksi berhasil ditambahkan', {
    transactionId: transaction.id,
  });
};

export const getTransactions = async (req, res, next) => {
  const userId = req.user.id;
  const { startDate, endDate, page = 1, limit = 10 } = req.validated;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const transactions = await TransactionRepositories.getTransactionsByUserId(
    userId,
    { startDate, endDate, page, limit },
  );

  return response(res, 200, 'Transaksi berhasil diambil', {
    transaction: transactions.data,
    meta: transactions.meta,
  });
};

export const deleteTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { transactionId } = req.params;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const result = await TransactionRepositories.deleteTransactionById(
    userId,
    transactionId,
  );

  if (!result) {
    return next(new InvariantError('Gagal menghapus transaksi'));
  }

  return response(res, 200, 'Transaksi berhasil dihapus');
};

export const updateTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { transactionId } = req.params;
  const { amount, category, date, title, type } = req.validated;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const updatedTransaction =
    await TransactionRepositories.updateTransactionById(userId, transactionId, {
      amount,
      category,
      date,
      title,
      type,
    });

  if (!updatedTransaction) {
    return next(new InvariantError('Gagal memperbarui transaksi'));
  }

  return response(res, 200, 'Transaksi berhasil diperbarui', {
    transactionId: updatedTransaction.id,
  });
};

export const getTransactionById = async (req, res, next) => {
  const userId = req.user.id;
  const { transactionId } = req.params;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const transaction = await TransactionRepositories.getTransactionById(
    userId,
    transactionId,
  );

  if (!transaction) {
    return next(new InvariantError('Transaksi tidak ditemukan'));
  }

  return response(res, 200, 'Transaksi berhasil diambil', {
    transaction: transaction,
  });
};
