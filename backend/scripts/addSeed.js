import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { pool } from './db.js';

dotenv.config();

const CONFIG = {
  email: process.env.email || 'test@example.com',
  username: process.env.username || 'testuser',
  password: process.env.password || 'password123',
};

async function createUser() {
  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    CONFIG.email,
  ]);

  if (existing.rows.length) {
    return existing.rows[0];
  }

  const hashed = await bcrypt.hash(CONFIG.password, 10);

  const result = await pool.query(
    `
    INSERT INTO users
    (
      id,
      username,
      avatar,
      email,
      password,
      role,
      impulsive_ratio
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      crypto.randomUUID(),
      CONFIG.username,
      null,
      CONFIG.email,
      hashed,
      'user',
      0.3,
    ],
  );

  return result.rows[0];
}

async function createSettings(userId) {
  const existing = await pool.query(
    `SELECT * FROM settings WHERE user_id = $1`,
    [userId],
  );

  if (existing.rows.length) {
    return;
  }

  await pool.query(
    `
    INSERT INTO settings
    (
      id,
      user_id,
      monthly_income,
      weekly_budget,
      segment,
      segment_label
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    `,
    [crypto.randomUUID(), userId, 12000000, 2500000, 2, 'Moderate Spender'],
  );
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomTransactionDate(start, end) {
  const date = randomDate(start, end);

  const hour = Math.floor(Math.random() * 15) + 7;
  const minute = Math.floor(Math.random() * 60);

  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(Math.floor(Math.random() * 60));

  return date;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedTransactions(userId, startDate, endDate) {
  const CATEGORIES = {
    bills: 'category-1',
    entertainment: 'category-2',
    food: 'category-3',
    hobby: 'category-4',
    subscriptions: 'category-5',
    shopping: 'category-6',
    transport: 'category-7',
  };

  const TITLES = {
    food: [
      'Makan Pagi',
      'Makan Siang',
      'Makan Malam',
      'Ngopi',
      'GoFood',
      'GrabFood',
      'Warung',
      'Restoran',
    ],

    transport: ['Grab', 'Gojek', 'Bensin', 'Parkir', 'Tol'],

    shopping: [
      'Shopee',
      'Tokopedia',
      'Belanja Online',
      'Aksesoris',
      'Beli Baju',
    ],

    bills: ['PLN', 'PDAM', 'Internet', 'Pulsa', 'BPJS'],

    entertainment: ['Netflix', 'Cinema', 'Game', 'Nongkrong', 'Karaoke'],

    subscriptions: [
      'Netflix Premium',
      'Spotify Premium',
      'YouTube Premium',
      'ChatGPT Plus',
      'Canva Pro',
    ],

    hobby: ['Gaming', 'Fotografi', 'Sepeda', 'Koleksi'],
  };

  const values = [];
  const placeholders = [];

  let p = 1;

  let expense = 0;
  let impulsive = 0;
  let expenseAmount = 0;

  function addTransaction(categoryKey, amount, date) {
    const weekend = date.getDay() === 0 || date.getDay() === 6;

    let impulsiveRate = 0.15;

    if (
      categoryKey === 'shopping' ||
      categoryKey === 'entertainment' ||
      categoryKey === 'hobby'
    ) {
      impulsiveRate = 0.45;
    }

    if (weekend) {
      impulsiveRate += 0.1;
    }

    if (date.getHours() >= 19) {
      impulsiveRate += 0.1;
    }

    const isImpulsive = Math.random() < impulsiveRate;

    const title =
      TITLES[categoryKey][
        Math.floor(Math.random() * TITLES[categoryKey].length)
      ];

    expense++;
    expenseAmount += amount;

    if (isImpulsive) {
      impulsive++;
    }

    values.push(
      crypto.randomUUID(),
      userId,
      CATEGORIES[categoryKey],
      title,
      'expense',
      amount,
      isImpulsive,
      date.toISOString(),
    );

    placeholders.push(
      `($${p},$${p + 1},$${p + 2},$${p + 3},$${p + 4},$${p + 5},$${p + 6},$${p + 7})`,
    );

    p += 8;
  }

  const current = new Date(startDate);

  while (current <= endDate) {
    const dayStart = new Date(current);

    const dayEnd = new Date(current);
    dayEnd.setHours(23, 59, 59, 999);

    const weekend = current.getDay() === 0 || current.getDay() === 6;

    // MAKAN 2-3 KALI PER HARI
    const mealCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < mealCount; i++) {
      addTransaction(
        'food',
        10000 + Math.floor(Math.random() * 25000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // NGOPI
    if (Math.random() < 0.45) {
      addTransaction(
        'food',
        10000 + Math.floor(Math.random() * 15000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // TRANSPORT BERANGKAT
    if (Math.random() < 0.8) {
      addTransaction(
        'transport',
        5000 + Math.floor(Math.random() * 15000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // TRANSPORT PULANG
    if (Math.random() < 0.4) {
      addTransaction(
        'transport',
        5000 + Math.floor(Math.random() * 15000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // SHOPPING
    if (Math.random() < 0.12) {
      addTransaction(
        'shopping',
        20000 + Math.floor(Math.random() * 30000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // ENTERTAINMENT WEEKEND
    if (weekend && Math.random() < 0.35) {
      addTransaction(
        'entertainment',
        20000 + Math.floor(Math.random() * 30000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // HOBBY
    if (Math.random() < 0.05) {
      addTransaction(
        'hobby',
        25000 + Math.floor(Math.random() * 25000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    // BILLS
    if ([1, 5, 10, 15, 20, 25].includes(current.getDate())) {
      if (Math.random() < 0.3) {
        addTransaction(
          'bills',
          25000 + Math.floor(Math.random() * 25000),
          randomTransactionDate(dayStart, dayEnd),
        );
      }
    }

    // SUBSCRIPTION BULANAN
    if (current.getDate() === 1) {
      addTransaction(
        'subscriptions',
        30000 + Math.floor(Math.random() * 10000),
        randomTransactionDate(dayStart, dayEnd),
      );
    }

    current.setDate(current.getDate() + 1);
  }

  await pool.query(
    `
    INSERT INTO transactions
    (
      id,
      user_id,
      category_id,
      title,
      type,
      amount,
      is_impulsive,
      transaction_date
    )
    VALUES ${placeholders.join(',')}
    `,
    values,
  );

  return {
    total: expense,
    expense,
    income: 0,
    impulsive,
    expenseAmount,
    incomeAmount: 0,
  };
}

function printStats(user, stats, startDate, endDate) {
  console.log('\n==============================');
  console.log('[-] SEED REPORT');
  console.log('==============================\n');

  console.log('[8] USER INFO');
  console.log(`Username : ${user.username}`);
  console.log(`Email    : ${user.email}`);
  console.log(`Password : ${CONFIG.password}`);

  console.log('\n[+] DATE RANGE');
  console.log(`From : ${startDate.toISOString().split('T')[0]}`);
  console.log(`To   : ${endDate.toISOString().split('T')[0]}`);

  console.log('\n[=] TRANSACTION');
  console.log(`Total     : ${stats.total}`);
  console.log(`Expense   : ${stats.expense}`);
  console.log(`Income    : ${stats.income}`);
  console.log(`Impulsive : ${stats.impulsive}`);

  console.log('\n[$] NOMINAL');
  console.log(`Expense : Rp ${stats.expenseAmount.toLocaleString('id-ID')}`);
  console.log(`Income  : Rp ${stats.incomeAmount.toLocaleString('id-ID')}`);

  console.log('\n==============================\n');
}

async function main() {
  console.log('[o] Generating realistic expense seed...\n');

  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-06-10');

  const user = await createUser();

  await createSettings(user.id);

  // const stats = await seedTransactions(user.id, 600, startDate, endDate);
  const stats = await seedTransactions(user.id, startDate, endDate);

  printStats(user, stats, startDate, endDate);

  console.log('[v] Done');

  await pool.end();
}

main().catch(async (err) => {
  console.error(err);

  await pool.end();
});
