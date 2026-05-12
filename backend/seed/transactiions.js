import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dotenv.config();

const TOTAL_TRANSACTIONS = 1000;

const START_DATE = '2025-01-01';
const END_DATE = '2025-12-31';

const TEST_USER = {
  username: process.env.username || 'testuser',
  email: process.env.email || 'test@example.com',
  password: process.env.password || 'password123',
};

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'finance_app',
  password: process.env.PGPASSWORD || 'password',
  port: process.env.PGPORT || 5432,
});

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const expenseTitles = [
  'Makan Bakso',
  'Ngopi',
  'Top Up Game',
  'Belanja Shopee',
  'Naik Gojek',
  'Isi Bensin',
  'Bayar Netflix',
  'Beli Baju',
  'Jajan Online',
  'Checkout Tokopedia',
  'Beli Keyboard',
  'Beli Mouse',
  'Makan Sushi',
  'Healing Cafe',
  'Ngopi Estetik',
  'Laundry',
  'Bayar Listrik',
  'Bayar Air',
  'Beli Kuota',
  'Beli Skincare',
];

const incomeTitles = [
  'Gaji Freelance',
  'Bonus Proyek',
  'THR',
  'Cashback',
  'Refund',
  'Bonus Kantor',
  'Transfer Orang Tua',
  'Bayaran Client',
  'Komisi Affiliate',
  'Profit Crypto',
  'Investasi Cair',
];

const expenseRanges = [
  [5000, 25000],
  [25000, 75000],
  [75000, 200000],
  [200000, 500000],
  [500000, 2000000],
];

const incomeRanges = [
  [50000, 300000],
  [300000, 1000000],
  [1000000, 5000000],
  [5000000, 15000000],
];

async function createTestUser() {
  console.log('\n==============================');
  console.log('CREATE TEST USER');
  console.log('==============================\n');

  const existingUser = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
    `,
    [TEST_USER.email],
  );

  // kalau user sudah ada
  if (existingUser.rows.length > 0) {
    console.log('User sudah ada');

    return existingUser.rows[0];
  }

  const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

  const userId = crypto.randomUUID();

  const result = await pool.query(
    `
      INSERT INTO users (
        id,
        username,
        avatar,
        email,
        password,
        role,
        impulsive_ratio
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING *
    `,
    [
      userId,
      TEST_USER.username,
      null,
      TEST_USER.email,
      hashedPassword,
      'user',
      0.3,
    ],
  );

  console.log('User berhasil dibuat');

  return result.rows[0];
}

async function getCategories() {
  const result = await pool.query(`
    SELECT id
    FROM categories
  `);

  return result.rows.map((row) => row.id);
}

async function createSettings(userId) {
  console.log('\n==============================');
  console.log('CREATE SETTINGS');
  console.log('==============================\n');

  const existing = await pool.query(
    `
      SELECT *
      FROM settings
      WHERE user_id = $1
    `,
    [userId],
  );

  // kalau setting sudah ada
  if (existing.rows.length > 0) {
    console.log('Settings sudah ada');

    return;
  }

  await pool.query(
    `
      INSERT INTO settings (
        id,
        user_id,
        monthly_income,
        weekly_budget,
        segment,
        segment_label
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
    `,
    [crypto.randomUUID(), userId, 12000000, 2500000, 2, 'Moderate Spender'],
  );

  console.log('Settings berhasil dibuat');
}

async function seedTransactions(userId) {
  console.log('\n==============================');
  console.log('START RANDOM TRANSACTIONS');
  console.log('==============================\n');

  const categories = await getCategories();

  console.log('Loaded categories:');
  console.log(categories);

  const values = [];
  const valuePlaceholders = [];

  let paramIndex = 1;

  let totalExpense = 0;
  let totalIncome = 0;
  let totalImpulsive = 0;

  const startDate = new Date(START_DATE);
  const endDate = new Date(END_DATE);

  for (let i = 0; i < TOTAL_TRANSACTIONS; i++) {
    const id = crypto.randomUUID();

    const isExpense = Math.random() < 0.8;

    const type = isExpense ? 'expense' : 'income';

    if (isExpense) {
      totalExpense++;
    } else {
      totalIncome++;
    }

    const title = isExpense
      ? getRandomItem(expenseTitles)
      : getRandomItem(incomeTitles);

    const categoryId = getRandomItem(categories);

    const selectedRange = isExpense
      ? getRandomItem(expenseRanges)
      : getRandomItem(incomeRanges);

    const amount = getRandomInt(selectedRange[0], selectedRange[1]);

    const isImpulsive = isExpense ? Math.random() < 0.4 : false;

    if (isImpulsive) {
      totalImpulsive++;
    }

    const trxDate = getRandomDate(startDate, endDate);

    const transactionDate = trxDate.toISOString();

    values.push(
      id,
      userId,
      categoryId,
      title,
      type,
      amount,
      isImpulsive,
      transactionDate,
    );

    valuePlaceholders.push(`
      (
        $${paramIndex},
        $${paramIndex + 1},
        $${paramIndex + 2},
        $${paramIndex + 3},
        $${paramIndex + 4},
        $${paramIndex + 5},
        $${paramIndex + 6},
        $${paramIndex + 7}
      )
    `);

    paramIndex += 8;

    if ((i + 1) % 100 === 0) {
      console.log(`${i + 1} transaksi dibuat...`);
    }
  }

  const query = `
    INSERT INTO transactions (
      id,
      user_id,
      category_id,
      title,
      type,
      amount,
      is_impulsive,
      transaction_date
    )
    VALUES
    ${valuePlaceholders.join(',')}
  `;

  await pool.query(query, values);

  console.log('\n==============================');
  console.log('TRANSACTION SUCCESS 🌱');
  console.log('==============================');

  console.log(`Total transaksi : ${TOTAL_TRANSACTIONS}`);

  console.log(`Expense          : ${totalExpense}`);

  console.log(`Income           : ${totalIncome}`);

  console.log(`Impulsive        : ${totalImpulsive}`);

  console.log('==============================\n');
}

async function main() {
  try {
    console.log('\n==============================');
    console.log('START FULL SEED');
    console.log('==============================\n');

    const user = await createTestUser();

    console.log('\nUSER INFO');
    console.log('ID       :', user.id);
    console.log('Email    :', user.email);
    console.log('Username :', user.username);
    console.log('Password :', TEST_USER.password);

    await createSettings(user.id);

    await seedTransactions(user.id);

    console.log('\n==============================');
    console.log('ALL DONE ✅');
    console.log('==============================\n');
  } catch (err) {
    console.log('\n==============================');
    console.log('SEED FAILED ❌');
    console.log('==============================\n');

    console.log(err);
  } finally {
    await pool.end();

    console.log('\nDatabase connection closed\n');
  }
}

main();
