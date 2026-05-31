const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class Pool {
  static async create(name, size, depth, capacity, status = 'open', temperature = null, lastCleaned = null) {
    const id = uuidv4()
    const query = `
      INSERT INTO pools (id, name, size, depth, capacity, status, temperature, last_cleaned, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `
    const result = await db.query(query, [id, name, size, depth, capacity, status, temperature, lastCleaned])
    return result.rows[0]
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM pools ORDER BY created_at DESC')
    return result.rows
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM pools WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id, name, size, depth, capacity, status = 'open', temperature = null, lastCleaned = null) {
    const query = `
      UPDATE pools
      SET name = $2, size = $3, depth = $4, capacity = $5, status = $6, temperature = $7, last_cleaned = $8, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await db.query(query, [id, name, size, depth, capacity, status, temperature, lastCleaned])
    return result.rows[0]
  }

  static async delete(id) {
    await db.query('DELETE FROM pools WHERE id = $1', [id])
    return { deleted: true }
  }
}

module.exports = Pool