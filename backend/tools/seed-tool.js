import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

dotenv.config();

const DEFAULT_CONFIG = {
  email: process.env.email || 'test@example.com',
  username: process.env.username || 'testuser',
  password: process.env.password || 'password123',
};

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'finance_app',
  password: process.env.PGPASSWORD || 'password',
  port: process.env.PGPORT || 5432,
});

const clearScreen = () => console.clear();

async function confirm(rl, msg) {
  while (true) {
    const ans = (await rl.question(`${msg} (y/n): `)).toLowerCase();
    if (ans === 'y') return true;
    if (ans === 'n') return false;
    console.log('[!] hanya y / n');
  }
}

async function askNumber(rl, msg, defaultVal) {
  while (true) {
    const ans = await rl.question(`${msg} (default ${defaultVal}): `);

    if (ans.trim() === '') return defaultVal;

    const num = Number(ans);
    if (!isNaN(num) && num > 0) return num;

    console.log('[!] harus angka valid');
  }
}

async function askDate(rl, msg, defaultVal) {
  while (true) {
    const ans = await rl.question(
      `${msg} (YYYY-MM-DD | default ${defaultVal}): `,
    );

    if (ans.trim() === '') return new Date(defaultVal);

    const date = new Date(ans);
    if (!isNaN(date.getTime())) return date;

    console.log('[!] format tanggal salah');
  }
}

async function createTestUser() {
  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    DEFAULT_CONFIG.email,
  ]);

  if (existing.rows.length > 0) return existing.rows[0];

  const hashed = await bcrypt.hash(DEFAULT_CONFIG.password, 10);
  const id = crypto.randomUUID();

  const result = await pool.query(
    `
      INSERT INTO users (
        id, username, avatar, email, password, role, impulsive_ratio
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `,
    [
      id,
      DEFAULT_CONFIG.username,
      null,
      DEFAULT_CONFIG.email,
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

  if (exist.rows.length > 0) return;

  await pool.query(
    `
      INSERT INTO settings (
        id,user_id,monthly_income,weekly_budget,segment,segment_label
      )
      VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [crypto.randomUUID(), userId, 12000000, 2500000, 2, 'Moderate Spender'],
  );
}

async function seedTransactions(userId, total, startDate, endDate) {
  const categories = await pool.query(`SELECT id FROM categories`);
  const categoryIds = categories.rows.map((r) => r.id);

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
      categoryIds[Math.floor(Math.random() * categoryIds.length)],
      'transaction',
      isExpense ? 'expense' : 'income',
      amount,
      isImp,
      new Date(
        startDate.getTime() + Math.random() * (endDate - startDate),
      ).toISOString(),
    );

    placeholders.push(
      `($${p},$${p + 1},$${p + 2},$${p + 3},$${p + 4},$${p + 5},$${p + 6},$${p + 7})`,
    );

    p += 8;
  }

  await pool.query(
    `
      INSERT INTO transactions (
        id,user_id,category_id,title,type,amount,is_impulsive,transaction_date
      )
      VALUES ${placeholders.join(',')}
    `,
    values,
  );

  clearScreen();
  console.log('[+] SEED STATISTICS');
  console.log('==============================');
  console.log(`Total        : ${total}`);
  console.log(`Expense      : ${expense}`);
  console.log(`Income       : ${income}`);
  console.log(`Impulsive    : ${impulsive}`);

  console.log('\n[$] NOMINAL');
  console.log(`Expense      : Rp ${expenseAmount.toLocaleString('id-ID')}`);
  console.log(`Income       : Rp ${incomeAmount.toLocaleString('id-ID')}`);

  console.log('\n[=] AVG');
  console.log(
    `Avg Expense  : Rp ${Math.floor(expenseAmount / expense).toLocaleString('id-ID')}`,
  );
  console.log(
    `Avg Income   : Rp ${Math.floor(incomeAmount / income).toLocaleString('id-ID')}`,
  );

  console.log('==============================\n');
}

async function deleteSeed(email) {
  const user = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);

  if (!user.rows.length) {
    console.log('User tidak ditemukan');
    return;
  }

  const userId = user.rows[0].id;

  await pool.query(`DELETE FROM transactions WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM settings WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

  console.log('✔ Seed dihapus');
}

async function main() {
  const rl = readline.createInterface({ input, output });

  let running = true;

  try {
    while (running) {
      clearScreen();

      console.log('===== SEED CONTROL PANEL =====\n');

      console.log('[#] CONFIG:');
      console.log(`Email    : ${DEFAULT_CONFIG.email}`);
      console.log(`Username : ${DEFAULT_CONFIG.username}`);
      console.log(`Password : ${DEFAULT_CONFIG.password}`);
      console.log('\n==============================');
      console.log('1. Add Seed');
      console.log('2. Delete Seed');
      console.log('3. Exit');
      console.log('==============================\n');

      const choice = await rl.question('Pilih menu: ');

      if (!['1', '2', '3'].includes(choice)) {
        console.log('\n❌ Menu tidak valid');
        await rl.question('Enter...');
        continue;
      }

      if (choice === '3') {
        clearScreen();
        console.log('Quit');
        running = false;
        break;
      }

      if (choice === '1') {
        const ok = await confirm(rl, 'Generate seed data?');

        if (!ok) continue;

        const total = await askNumber(rl, 'Jumlah transaksi', 1000);

        const startDate = await askDate(rl, 'Start date', '2025-01-01');
        const endDate = await askDate(rl, 'End date', '2025-12-31');

        const user = await createTestUser();
        await createSettings(user.id);

        await seedTransactions(user.id, total, startDate, endDate);

        await rl.question('Enter untuk kembali...');
        continue;
      }

      if (choice === '2') {
        const ok = await confirm(rl, 'Hapus semua seed data?');

        if (!ok) continue;

        clearScreen();
        console.log('[o] deleting...\n');

        await deleteSeed(DEFAULT_CONFIG.email);

        await rl.question('[?] Enter untuk kembali...');
        continue;
      }
    }
  } finally {
    rl.close();
    await pool.end();
    console.log('\nConnection closed');
  }
}

main();
