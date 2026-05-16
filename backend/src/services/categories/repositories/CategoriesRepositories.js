import { Pool } from 'pg';

class CategoriesRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async getCategories() {
    const query = {
      text: 'SELECT id,name FROM categories',
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return false;
    }
    return result.rows;
  }
}

export default new CategoriesRepositories();
