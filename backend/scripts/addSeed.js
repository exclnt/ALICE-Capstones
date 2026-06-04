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

async function seedTransactions(userId, total, startDate, endDate) {
  const CATEGORIES = {
    bills: 'category-1',
    entertainment: 'category-2',
    food: 'category-3',
    hobby: 'category-4',
    subscriptions: 'category-5',
    shopping: 'category-6',
    transport: 'category-7',
  };

  const CATEGORY_WEIGHTS = [
    ['food', 35],
    ['transport', 20],
    ['shopping', 15],
    ['bills', 10],
    ['entertainment', 8],
    ['subscriptions', 7],
    ['hobby', 5],
  ];

  const TITLES = {
    food: [
      'Makan Pagi',
      'Makan Siang',
      'Makan Malam',
      'Ngopi',
      'GoFood',
      'GrabFood',
      'Jajan',
      'Warung',
      'Restoran',
    ],

    transport: ['Grab', 'Gojek', 'Bensin', 'Parkir', 'Tol', 'Transportasi'],

    shopping: [
      'Shopee',
      'Tokopedia',
      'Beli Baju',
      'Elektronik',
      'Aksesoris',
      'Belanja Online',
    ],

    bills: ['PLN', 'PDAM', 'Internet', 'Pulsa', 'BPJS', 'Tagihan Bulanan'],

    entertainment: [
      'Netflix',
      'Spotify',
      'Cinema',
      'Game',
      'Nongkrong',
      'Karaoke',
    ],

    subscriptions: [
      'Netflix Premium',
      'Spotify Premium',
      'YouTube Premium',
      'ChatGPT Plus',
      'Canva Pro',
    ],

    hobby: ['Gaming', 'Fotografi', 'Sepeda', 'Mancing', 'Koleksi'],
  };

  function weightedCategory() {
    const rand = Math.random() * 100;

    let cumulative = 0;

    for (const [name, weight] of CATEGORY_WEIGHTS) {
      cumulative += weight;

      if (rand <= cumulative) {
        return name;
      }
    }

    return 'food';
  }

  function amountByCategory(category) {
    switch (category) {
      case 'food':
        return 15000 + Math.floor(Math.random() * 120000);

      case 'transport':
        return 5000 + Math.floor(Math.random() * 45000);

      case 'shopping':
        return 50000 + Math.floor(Math.random() * 2000000);

      case 'bills':
        return 100000 + Math.floor(Math.random() * 1000000);

      case 'entertainment':
        return 25000 + Math.floor(Math.random() * 500000);

      case 'subscriptions':
        return 50000 + Math.floor(Math.random() * 250000);

      case 'hobby':
        return 50000 + Math.floor(Math.random() * 1500000);

      default:
        return 10000 + Math.floor(Math.random() * 100000);
    }
  }

  const values = [];
  const placeholders = [];

  let p = 1;

  let expense = 0;
  let impulsive = 0;
  let expenseAmount = 0;

  for (let i = 0; i < total; i++) {
    const date = randomTransactionDate(startDate, endDate);

    const weekend = date.getDay() === 0 || date.getDay() === 6;

    let categoryKey = weightedCategory();

    // weekend lebih sering shopping dan hiburan
    if (weekend && Math.random() < 0.3) {
      categoryKey = Math.random() < 0.5 ? 'shopping' : 'entertainment';
    }

    let amount = amountByCategory(categoryKey);

    // Ramadan & Lebaran (Mar-Apr)
    if ([2, 3].includes(date.getMonth())) {
      amount = Math.floor(amount * 1.2);
    }

    // Desember lebih boros
    if (date.getMonth() === 11) {
      amount = Math.floor(amount * 1.5);
    }

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

    const title = pick(TITLES[categoryKey]);

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
    total,
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

  const stats = await seedTransactions(user.id, 1200, startDate, endDate);

  printStats(user, stats, startDate, endDate);

  console.log('[v] Done');

  await pool.end();
}

main().catch(async (err) => {
  console.error(err);

  await pool.end();
});
