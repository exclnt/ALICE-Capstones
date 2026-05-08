import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class SettingRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async getSettingByUserId(userid) {
    const query = {
      text: 'SELECT monthly_income, weekly_budget, updated_at FROM settings WHERE user_id = $1',
      values: [userid],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async updateSettingByUserId(userid, setting) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE settings SET monthly_income = $1, weekly_budget = $2, updated_at = $4 WHERE user_id = $3 RETURNING monthly_income, weekly_budget,updated_at',
      values: [setting.monthly_income, setting.weekly_budget, userid, updateAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async createSetting(userid, setting) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO settings (id, user_id, monthly_income, weekly_budget, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING monthly_income, weekly_budget, updated_at',
      values: [
        id,
        userid,
        setting.monthly_income,
        setting.weekly_budget,
        createdAt,
        createdAt,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

export default new SettingRepositories();
