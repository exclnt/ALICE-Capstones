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

  if (existing.rows.length) return existing.rows[0];

  const hashed = await bcrypt.hash(CONFIG.password, 10);

  const result = await pool.query(
    `INSERT INTO users (id, username, avatar, email, password, role, impulsive_ratio)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
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
  const exist = await pool.query(`SELECT * FROM settings WHERE user_id = $1`, [
    userId,
  ]);

  if (exist.rows.length) return;

  await pool.query(
    `INSERT INTO settings (id,user_id,monthly_income,weekly_budget,segment,segment_label)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [crypto.randomUUID(), userId, 12000000, 2500000, 2, 'Moderate Spender'],
  );
}

// 🎯 RANDOM DATE DALAM RANGE
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function seedTransactions(userId, total, startDate, endDate) {
  const categories = await pool.query(`SELECT id FROM categories`);
  const ids = categories.rows.map((r) => r.id);

  const values = [];
  const placeholders = [];
  let p = 1;

  let expense = 0;
  let income = 0;
  let impulsive = 0;

  let expenseAmount = 0;
  let incomeAmount = 0;

  for (let i = 0; i < total; i++) {
    const isExpense = Math.random() < 0.8;
    const amount = Math.floor(Math.random() * 1000000);
    const isImp = isExpense ? Math.random() < 0.4 : false;

    const date = randomDate(startDate, endDate);

    if (isExpense) {
      expense++;
      expenseAmount += amount;
    } else {
      income++;
      incomeAmount += amount;
    }

    if (isImp) impulsive++;

    values.push(
      crypto.randomUUID(),
      userId,
      ids[Math.floor(Math.random() * ids.length)],
      'transaction',
      isExpense ? 'expense' : 'income',
      amount,
      isImp,
      date.toISOString(),
    );

    placeholders.push(
      `($${p},$${p + 1},$${p + 2},$${p + 3},$${p + 4},$${p + 5},$${p + 6},$${p + 7})`,
    );

    p += 8;
  }

  await pool.query(
    `INSERT INTO transactions (id,user_id,category_id,title,type,amount,is_impulsive,transaction_date)
     VALUES ${placeholders.join(',')}`,
    values,
  );

  return { total, expense, income, impulsive, expenseAmount, incomeAmount };
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
  console.log('[o] Generating seed...\n');

  // default range 1 tahun kalau tidak diubah
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-31');

  const user = await createUser();
  await createSettings(user.id);

  const stats = await seedTransactions(user.id, 1000, startDate, endDate);

  printStats(user, stats, startDate, endDate);

  console.log('[v] Done');
  await pool.end();
}

main();
