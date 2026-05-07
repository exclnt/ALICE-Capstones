import { Pool } from 'pg';
import bcrypt from 'bcrypt';

class AuthentificationRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO sessions VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM sessions WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM sessions WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return false;
    }

    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const user = await this._pool.query(query);
    if (!user) {
      return null;
    }

    const { id, password: hashedPassword } = user.rows[0];
    const isPasswordNatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordNatch) {
      return null;
    }
    return id;
  }
}

export default new AuthentificationRepositories();
