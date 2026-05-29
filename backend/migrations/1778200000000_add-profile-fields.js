export const shorthands = undefined;

export const up = (pgm) => {
  pgm.addColumns('users', {
    age: { type: 'INTEGER' },
    occupation: { type: 'TEXT' },
  });
  pgm.addColumns('settings', {
    // eslint-disable-next-line camelcase
    financial_goal: { type: 'TEXT' },
    // eslint-disable-next-line camelcase
    financial_problem: { type: 'TEXT' },
  });
};

export const down = (pgm) => {
  pgm.dropColumns('users', ['age', 'occupation']);
  pgm.dropColumns('settings', ['financial_goal', 'financial_problem']);
};
