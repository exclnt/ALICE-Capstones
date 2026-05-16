import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class TransactionRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async addTransaction({
    userId,
    amount,
    category,
    type,
    title,
    date,
    // eslint-disable-next-line
    is_impulsive = false,
  }) {
    const id = `INV-${Date.now()}-${nanoid(6)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO transactions (id, user_id, amount, category_id, type, title, transaction_date, created_at, updated_at, is_impulsive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
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
        // eslint-disable-next-line
        is_impulsive,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getTransactionsByUserId(
    userId,
    {
      startDate,
      endDate,
      category,
      title,
      type = 'expense',
      page = 1,
      limit,
    } = {},
  ) {
    const filters = [`t.user_id = $1`];
    const values = [userId];

    let paramIndex = 2;

    if (type && type !== 'all') {
      filters.push(`t.type = $${paramIndex}`);

      values.push(type);

      paramIndex++;
    }

    if (startDate && endDate) {
      filters.push(
        `DATE(t.transaction_date)
       BETWEEN $${paramIndex}
       AND $${paramIndex + 1}`,
      );

      values.push(startDate, endDate);

      paramIndex += 2;
    }

    if (category) {
      filters.push(`LOWER(c.name) LIKE LOWER($${paramIndex})`);

      values.push(`%${category}%`);

      paramIndex++;
    }

    if (title) {
      filters.push(`LOWER(t.title) LIKE LOWER($${paramIndex})`);

      values.push(`%${title}%`);

      paramIndex++;
    }

    const whereClause = filters.join('\nAND ');

    let paginationQuery = '';

    if (limit) {
      const parsedLimit = Number(limit);
      const parsedPage = Number(page);

      const offset = (parsedPage - 1) * parsedLimit;

      paginationQuery = `
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;

      values.push(parsedLimit, offset);
    }

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

      WHERE ${whereClause}

      ORDER BY t.transaction_date DESC

      ${paginationQuery}
    `,
      values,
    };

    const countValues = limit ? values.slice(0, -2) : values;

    const countQuery = {
      text: `
      SELECT COUNT(*) AS total

      FROM transactions t

      JOIN categories c
        ON t.category_id = c.id

      WHERE ${whereClause}
    `,
      values: countValues,
    };

    const [dataResult, countResult] = await Promise.all([
      this._pool.query(dataQuery),
      this._pool.query(countQuery),
    ]);

    const total = Number(countResult.rows[0].total);

    return {
      data: dataResult.rows,

      meta: {
        total,

        paginated: Boolean(limit),

        ...(limit && {
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        }),

        filters: {
          type,
          startDate,
          endDate,
          category,
          title,
        },
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

  async getDailySpending(userId, { startDate, endDate }) {
    const query = {
      text: `
      WITH dates AS (
        SELECT generate_series(
          $2::date,
          $3::date,
          interval '1 day'
        )::date AS transaction_date
      )

      SELECT
        dates.transaction_date AS date,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'expense'
              THEN t.amount
              ELSE 0
            END
          ),
          0
        ) AS total_expense,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'income'
              THEN t.amount
              ELSE 0
            END
          ),
          0
        ) AS total_income

      FROM dates

      LEFT JOIN transactions t
        ON DATE(t.transaction_date) =
           dates.transaction_date
        AND t.user_id = $1

      GROUP BY dates.transaction_date

      ORDER BY dates.transaction_date ASC
    `,
      values: [userId, startDate, endDate],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getDailyNet(userId, { startDate, endDate }) {
    const query = {
      text: `
      WITH dates AS (
        SELECT generate_series(
          $2::date,
          $3::date,
          interval '1 day'
        )::date AS transaction_date
      )

      SELECT
        dates.transaction_date AS date,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'expense'
              THEN t.amount
              ELSE 0
            END
          ),
          0
        ) AS total_expense,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'income'
              THEN t.amount
              ELSE 0
            END
          ),
          0
        ) AS total_income,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'income'
              THEN t.amount
              ELSE -t.amount
            END
          ),
          0
        ) AS net

      FROM dates

      LEFT JOIN transactions t
        ON DATE(t.transaction_date) =
           dates.transaction_date
        AND t.user_id = $1

      GROUP BY dates.transaction_date

      ORDER BY dates.transaction_date ASC
    `,
      values: [userId, startDate, endDate],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getBalance(userId, { startDate, endDate }) {
    const query = {
      text: `
      WITH dates AS (
        SELECT generate_series(
          $2::date,
          $3::date,
          interval '1 day'
        )::date AS transaction_date
      ),

      daily_expense AS (
        SELECT
          DATE(t.transaction_date) AS transaction_date,
          SUM(t.amount) AS daily_expense
        FROM transactions t
        WHERE t.user_id = $1
          AND t.type = 'expense'
          AND DATE(t.transaction_date)
              BETWEEN $2 AND $3
        GROUP BY DATE(t.transaction_date)
      )

      SELECT
        dates.transaction_date,

        s.monthly_income -
        SUM(
          COALESCE(
            daily_expense.daily_expense,
            0
          )
        ) OVER (
          ORDER BY dates.transaction_date
        ) AS balance

      FROM dates

      LEFT JOIN daily_expense
        ON dates.transaction_date =
           daily_expense.transaction_date

      JOIN settings s
        ON s.user_id = $1

      ORDER BY dates.transaction_date
    `,
      values: [userId, startDate, endDate],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      transactionDate: row.transaction_date,
      balance: Number(row.balance),
    }));
  }

  async getAvgSpendingAndCV(userId) {
    const query = `
      SELECT 
        COALESCE(AVG(amount), 0) AS avg_spending,
        COALESCE(STDDEV_SAMP(amount) / NULLIF(AVG(amount), 0), 0) AS spending_cv
      FROM 
        transactions
      WHERE 
        user_id = $1 
        AND type = 'expense';
    `;

    const result = await this._pool.query(query, [userId]);
    return result.rows[0];
  }

  async getImpulsiveRatio(userId) {
    const query = `
    SELECT 
        COALESCE(
          (COUNT(*) FILTER (WHERE is_impulsive = true) * 1.0) / NULLIF(COUNT(*), 0), 
          0
        ) AS impulsive_ratio
      FROM 
        transactions
      WHERE 
        user_id = $1 
        AND type = 'expense';
    `;
    const result = await this._pool.query(query, [userId]);
    return result.rows[0].impulsive_ratio;
  }

  async getEndMonthRatio(userId) {
    // Query PostgreSQL:
    // EXTRACT(DAY FROM transaction_date) mengambil angka tanggalnya saja (1-31)
    // SUM(...) FILTER menghitung total 'amount' khusus untuk tanggal 25 ke atas
    const query = `
      SELECT 
        COALESCE(
          SUM(amount) FILTER (WHERE EXTRACT(DAY FROM transaction_date) >= 25) / NULLIF(SUM(amount), 0), 
          0
        ) AS end_month_ratio
      FROM 
        transactions
      WHERE 
        user_id = $1 
        AND type = 'expense';
    `;

    const result = await this._pool.query(query, [userId]);
    return parseFloat(result.rows[0].end_month_ratio);
  }

  async getOverbudgetFreq(userId) {
    // Query PostgreSQL:
    // 1. CTE 'weekly_expenses' mengelompokkan total pengeluaran per tahun dan per minggu
    // 2. CTE 'user_setting' mengambil batas weekly_budget dari tabel settings
    // 3. Main query menghitung rasio minggu yang overbudget dibandingkan total minggu aktif
    const query = `
      WITH weekly_expenses AS (
        SELECT 
          EXTRACT(YEAR FROM transaction_date) AS yr,
          EXTRACT(WEEK FROM transaction_date) AS wk,
          SUM(amount) AS total_spent
        FROM transactions
        WHERE user_id = $1 AND type = 'expense'
        GROUP BY yr, wk
      ),
      user_setting AS (
        SELECT weekly_budget FROM settings WHERE user_id = $1 LIMIT 1
      )
      SELECT 
        COALESCE(
          (COUNT(*) FILTER (WHERE w.total_spent > s.weekly_budget) * 1.0) / NULLIF(COUNT(w.*), 0),
          0
        ) AS overbudget_freq
      FROM weekly_expenses w
      CROSS JOIN user_setting s;
    `;

    const result = await this._pool.query(query, [userId]);

    // Jika user belum punya data settings atau belum ada transaksi, tangani error-nya
    if (result.rows.length === 0) return 0;

    return parseFloat(result.rows[0].overbudget_freq);
  }
}

export default new TransactionRepositories();
