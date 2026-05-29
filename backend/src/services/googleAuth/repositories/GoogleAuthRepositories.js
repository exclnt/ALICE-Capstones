import { Pool } from 'pg';

class GoogleAuthRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async loginGoogle(account) {
    const { email } = account;

    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0].id;
  }

  async registerGoogle(account) {
    const { email, name, picture, googleId } = account;

    const query = {
      text: 'INSERT INTO users (email, username, avatar, id) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [email, name, picture, googleId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}

export default new GoogleAuthRepositories();
