import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const EMAIL = process.env.email || 'test@example.com';

async function reset() {
  console.log('🧹 ==============================');
  console.log('   RESET SEED PROCESS STARTED');
  console.log('==============================\n');

  const user = await pool.query(
    `SELECT id, username, email FROM users WHERE email = $1`,
    [EMAIL],
  );

  if (!user.rows.length) {
    console.log('❌ User tidak ditemukan');
    console.log('👉 Tidak ada data yang dihapus\n');
    await pool.end();
    return;
  }

  const userId = user.rows[0].id;

  // 🔍 HITUNG DATA SEBELUM DIHAPUS
  const txCount = await pool.query(
    `SELECT COUNT(*) FROM transactions WHERE user_id = $1`,
    [userId],
  );

  const settingsCount = await pool.query(
    `SELECT COUNT(*) FROM settings WHERE user_id = $1`,
    [userId],
  );

  console.log('[8] TARGET USER');
  console.log(`Username : ${user.rows[0].username}`);
  console.log(`Email    : ${user.rows[0].email}`);

  console.log('\n[-] DATA YANG AKAN DIHAPUS');
  console.log(`Transactions : ${txCount.rows[0].count}`);
  console.log(`Settings     : ${settingsCount.rows[0].count}`);

  console.log('\n[o] Deleting...\n');

  await pool.query(`DELETE FROM transactions WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM settings WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

  console.log('==============================');
  console.log('[v] RESET SEED SUCCESS');
  console.log('==============================\n');

  console.log('[@] SUMMARY');
  console.log(`User deleted        : 1`);
  console.log(`Transactions removed: ${txCount.rows[0].count}`);
  console.log(`Settings removed    : ${settingsCount.rows[0].count}`);

  console.log('\n[v] Database is now clean like nothing ever happened...');

  await pool.end();
}

reset();
