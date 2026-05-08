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
  pgm.createTable('categories', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },

    name: {
      type: 'VARCHAR(255)',
      notNull: true,
      unique: true,
    },

    type: {
      type: 'VARCHAR(20)',
      notNull: true,
      check: "type IN ('income', 'expense')",
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('categories');
};
