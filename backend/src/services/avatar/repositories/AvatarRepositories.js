import { Pool } from 'pg';

class AvatarRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async findUserAvatarById(id) {
    const query = {
      text: `
      SELECT avatar
      FROM users
      WHERE id = $1
    `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async updateUserAvatar(id, avatar) {
    const query = {
      text: `
      UPDATE users
      SET avatar = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING avatar,id,username,email,impulsive_ratio,created_at,updated_at
    `,
      values: [avatar, id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async findUserById(id) {
    const query = {
      text: `
      SELECT
        id,
        username,
        avatar,
        email,
        impulsive_ratio,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

export default new AvatarRepositories();
