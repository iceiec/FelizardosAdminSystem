const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class CourtSchedule {
  static async create(courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount) {
    const id = uuidv4()
    const query = `
      INSERT INTO court_schedules
      (id, court_id, date, time_slot, client_name, client_contact, deposit_amount, total_amount, status, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending', NOW(), NOW())
      RETURNING *
    `
    const result = await db.query(query, [
      id,
      courtId,
      date,
      timeSlot,
      clientName,
      clientContact,
      depositAmount || 0,
      totalAmount || 0,
    ])
    return result.rows[0]
  }

  static async getAllByCourt(courtId) {
    const result = await db.query('SELECT * FROM court_schedules WHERE court_id = $1 ORDER BY date DESC, created_at DESC', [courtId])
    return result.rows
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM court_schedules WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id, courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount, status) {
    const result = await db.query(
      `UPDATE court_schedules
       SET court_id = $2, date = $3, time_slot = $4, client_name = $5, client_contact = $6, deposit_amount = $7, total_amount = $8, status = $9, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, courtId, date, timeSlot, clientName, clientContact, depositAmount || 0, totalAmount || 0, status || 'pending']
    )
    return result.rows[0]
  }

  static async delete(id) {
    await db.query('DELETE FROM court_schedules WHERE id = $1', [id])
    return { deleted: true }
  }
}

module.exports = CourtSchedule
