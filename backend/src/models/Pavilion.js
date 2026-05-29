const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Pavilion {
  // Create (INSERT)
  static async create(name, capacity, location, hourlyRate) {
    const id = uuidv4();
    const query = `
      INSERT INTO pavilions (id, name, capacity, location, hourly_rate, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, name, capacity, location, hourly_rate, created_at;
    `;
    const result = await db.query(query, [id, name, capacity, location, hourlyRate]);
    return result.rows[0];
  }

  // Read All (SELECT)
  static async getAll() {
    const query = 'SELECT * FROM pavilions ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  // Read One (SELECT WHERE)
  static async getById(id) {
    const query = 'SELECT * FROM pavilions WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Update (UPDATE)
  static async update(id, name, capacity, location, hourlyRate) {
    const query = `
      UPDATE pavilions
      SET name = $2, capacity = $3, location = $4, hourly_rate = $5, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, capacity, location, hourly_rate, created_at, updated_at;
    `;
    const result = await db.query(query, [id, name, capacity, location, hourlyRate]);
    return result.rows[0];
  }

  // Delete (DELETE)
  static async delete(id) {
    const query = 'DELETE FROM pavilions WHERE id = $1';
    await db.query(query, [id]);
    return { deleted: true };
  }
}

module.exports = Pavilion;