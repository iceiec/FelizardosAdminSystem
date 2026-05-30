const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class Court {
  static async create(name, surface, status = 'available', nextBooking = null) {
    const id = uuidv4()
    const query = `
      INSERT INTO courts (id, name, surface, status, next_booking, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `
    const result = await db.query(query, [id, name, surface, status, nextBooking])
    return result.rows[0]
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM courts ORDER BY created_at DESC')
    return result.rows
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM courts WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id, name, surface, status = 'available', nextBooking = null) {
    const query = `
      UPDATE courts
      SET name = $2, surface = $3, status = $4, next_booking = $5, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await db.query(query, [id, name, surface, status, nextBooking])
    return result.rows[0]
  }

  static async delete(id) {
    await db.query('DELETE FROM courts WHERE id = $1', [id])
    return { deleted: true }
  }
}

module.exports = Court