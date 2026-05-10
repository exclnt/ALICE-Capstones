import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class TransactionRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async addTransaction({ userId, amount, category, type, title, date }) {
    const id = `INV-${Date.now()}-${nanoid(6)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO transactions (id, user_id, amount, category_id, type, title, transaction_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        userId,
        amount,
        category,
        type,
        title,
        date,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getTransactionsByUserId(
    userId,
    { startDate, endDate, page = 1, limit = 10 } = {},
  ) {
    const offset = (page - 1) * limit;

    const dataQuery = {
      text: `
      SELECT
        t.id,
        t.amount,
        c.name AS category,
        t.type,
        t.title,
        t.transaction_date
      FROM transactions t
      JOIN categories c
        ON t.category_id = c.id
      WHERE
        t.user_id = $1
        AND t.transaction_date BETWEEN $2 AND $3
      ORDER BY t.transaction_date DESC
      LIMIT $4 OFFSET $5
    `,
      values: [userId, startDate, endDate, limit, offset],
    };

    const countQuery = {
      text: `
      SELECT COUNT(*) AS total
      FROM transactions
      WHERE
        user_id = $1
        AND transaction_date BETWEEN $2 AND $3
    `,
      values: [userId, startDate, endDate],
    };

    const [dataResult, countResult] = await Promise.all([
      this._pool.query(dataQuery),
      this._pool.query(countQuery),
    ]);

    const total = Number(countResult.rows[0].total);

    return {
      data: dataResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(userId, transactionId) {
    const query = {
      text: `
      SELECT
        t.id,
        t.amount,
        c.name AS category,
        t.type,
        t.title,
        t.transaction_date
      FROM transactions t
      JOIN categories c
        ON t.category_id = c.id
      WHERE
        t.user_id = $1
        AND t.id = $2
    `,
      values: [userId, transactionId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }

  async deleteTransactionById(userId, transactionId) {
    const query = {
      text: 'DELETE FROM transactions WHERE user_id = $1 AND id = $2 RETURNING id',
      values: [userId, transactionId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }

  async updateTransactionById(
    userId,
    transactionId,
    { amount, category, type, title, date },
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
      UPDATE transactions
      SET amount = $1, category_id = $2, type = $3, title = $4, transaction_date = $5, updated_at = $6
      WHERE user_id = $7 AND id = $8
      RETURNING id
    `,
      values: [
        amount,
        category,
        type,
        title,
        date,
        updatedAt,
        userId,
        transactionId,
      ],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }
}

export default new TransactionRepositories();
