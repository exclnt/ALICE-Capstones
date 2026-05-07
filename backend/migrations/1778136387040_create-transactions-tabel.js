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
  pgm.createTable('transactions', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },

    // eslint-disable-next-line camelcase
    user_id: {
      type: 'TEXT',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },

    // eslint-disable-next-line camelcase
    category_id: {
      type: 'TEXT',
      notNull: true,
      references: 'categories',
      onDelete: 'CASCADE',
    },

    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },

    type: {
      type: 'VARCHAR(20)',
      notNull: true,
      check: "type IN ('income', 'expense')",
    },

    amount: {
      type: 'NUMERIC(12,2)',
      notNull: true,
      check: 'amount >= 0',
    },

    // eslint-disable-next-line camelcase
    is_impulsive: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },

    // eslint-disable-next-line camelcase
    transaction_date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    // eslint-disable-next-line camelcase
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    // eslint-disable-next-line camelcase
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('transactions');
};
