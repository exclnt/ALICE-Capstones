import pg from 'pg';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function freshMigration() {
  await client.connect();

  console.log('🧹 Dropping all tables...\n');

  const result = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  for (const row of result.rows) {
    const table = row.tablename;

    await client.query(`
      DROP TABLE IF EXISTS "${table}" CASCADE
    `);

    console.log(`❌ Dropped table: ${table}`);
  }

  console.log('\n✅ Semua tabel berhasil dihapus!\n');

  await client.end();

  console.log('🚀 Running migrations...\n');

  execSync('npx node-pg-migrate up', {
    stdio: 'inherit',
  });

  console.log('\n🎉 Fresh migration selesai!');
}

freshMigration().catch((err) => {
  console.error('❌ Error:', err);
});
