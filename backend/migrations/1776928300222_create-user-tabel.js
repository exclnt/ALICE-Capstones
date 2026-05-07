/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/** "migrate": "node-pg-migrate"
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
    },
    avatar: {
      type: 'TEXT',
    },
    email: {
      type: 'TEXT',
      notNull: true,
    },
    password: {
      type: 'TEXT',
    },
    role: {
      type: 'TEXT',
      notNull: true,
      default: 'user',
    },
    // eslint-disable-next-line camelcase
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    // eslint-disable-next-line camelcase
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users');
};
