import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

class UserRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async registerUser({ username, email, password, role }) {
    const id = nanoid(16);
    const hashPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users (id, username, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, username, email, hashPassword, role, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyNewUserEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0;
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const user = await this._pool.query(query);
    if (!user.rows.length) {
      return null;
    }

    console.log(`user repo id ${user.rows[0].id}`);
    const { id, password: hashedPassword } = user.rows[0];
    const isPasswordNatch = await bcrypt.compare(password, hashedPassword);
    console.log(id);
    console.log(isPasswordNatch);

    if (!isPasswordNatch) {
      return null;
    }
    return id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, created_at FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getUserLogged(id) {
    const query = {
      text: 'SELECT id, username,avatar, email, impulsive_ratio, created_at, updated_at FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getAllUsers() {
    const query = {
      text: 'SELECT id, username, created_at FROM users',
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

export default new UserRepositories();
