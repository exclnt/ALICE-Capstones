/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    INSERT INTO categories (id, name, type)
    VALUES
      ('category-1', 'Bills', 'expense'),
      ('category-2', 'Entertainment', 'expense'),
      ('category-3', 'Food', 'expense'),
      ('category-4', 'Hobby', 'expense'),
      ('category-5', 'Investment', 'expense'),
      ('category-6', 'Shopping', 'expense'),
      ('category-7', 'Transport', 'expense');
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM categories
    WHERE id IN (
      'category-1',
      'category-2',
      'category-3',
      'category-4',
      'category-5',
      'category-6',
      'category-7'
    );
  `);
};
