import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

function normalizeType(type) {
  const map = {
    'character varying': 'varchar',
    'timestamp without time zone': 'timestamp',
    'timestamp with time zone': 'timestamptz',
    'double precision': 'double',
    integer: 'int',
    bigint: 'bigint',
    boolean: 'bool',
    text: 'text',
    uuid: 'uuid',
    date: 'date',
    jsonb: 'jsonb',
  };

  return map[type] || type.replace(/\s+/g, '_');
}

async function generateERD() {
  try {
    await client.connect();

    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    let mermaid = `erDiagram\n`;

    for (const table of tables.rows) {
      const tableName = table.table_name.toUpperCase();

      const columns = await client.query(
        `
        SELECT
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `,
        [table.table_name],
      );

      mermaid += `\n    ${tableName} {\n`;

      for (const col of columns.rows) {
        const type = normalizeType(col.data_type);

        mermaid += `        ${type} ${col.column_name}\n`;
      }

      mermaid += `    }\n`;
    }

    const relations = await client.query(`
      SELECT
          tc.table_name AS child_table,
          ccu.table_name AS parent_table
      FROM
          information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
    `);

    for (const rel of relations.rows) {
      mermaid += `
    ${rel.parent_table.toUpperCase()} ||--o{ ${rel.child_table.toUpperCase()} : has
`;
    }

    const outputDir = path.join(process.cwd(), 'docs', 'erd');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, 'ERD.mmd');

    fs.writeFileSync(outputFile, mermaid);

    console.log(`✅ ERD generated at:`);
    console.log(outputFile);
  } catch (error) {
    console.error('❌ Failed to generate ERD');
    console.error(error);
  } finally {
    await client.end();
  }
}

generateERD();
