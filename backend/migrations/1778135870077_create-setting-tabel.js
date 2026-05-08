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
  pgm.createTable('settings', {
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
      unique: true,
    },

    // eslint-disable-next-line camelcase
    monthly_income: {
      type: 'NUMERIC(12,2)',
      notNull: true,
    },

    // eslint-disable-next-line camelcase
    weekly_budget: {
      type: 'NUMERIC(12,2)',
      notNull: true,
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

export const down = (pgm) => {
  pgm.dropTable('settings');
};
