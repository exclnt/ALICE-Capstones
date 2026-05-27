import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class SettingRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async getSettingByUserId(userid) {
    const query = {
      text: 'SELECT monthly_income, weekly_budget, created_at, updated_at, segment,segment_label FROM settings WHERE user_id = $1',
      values: [userid],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async updateSettingByUserId(userid, setting) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE settings SET monthly_income = $1, weekly_budget = $2, updated_at = $4 WHERE user_id = $3 RETURNING monthly_income, weekly_budget, segment, segment_label, updated_at, created_at',
      values: [setting.monthly_income, setting.weekly_budget, userid, updateAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async createSetting(userid, setting) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO settings (id, user_id, monthly_income, weekly_budget, created_at, updated_at, segment_label) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING monthly_income, weekly_budget,segment, segment_label, updated_at, created_at',
      values: [
        id,
        userid,
        setting.monthly_income,
        setting.weekly_budget,
        createdAt,
        createdAt,
        'Konsisten Hemat',
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  // eslint-disable-next-line camelcase
  async updateSegmentByUserId(userid, segment = 0, segment_label) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE settings SET segment = $1 , segment_label = $4, updated_at = $3 WHERE user_id = $2 RETURNING segment, updated_at',
      // eslint-disable-next-line camelcase
      values: [segment, userid, updateAt, segment_label],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

export default new SettingRepositories();
