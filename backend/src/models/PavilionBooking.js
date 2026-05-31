const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class PavilionBooking {
  // eventDate can be a single date string, or use startDate/endDate for ranges
  static async isAvailable(pavilionId, eventDate, startDate = null, endDate = null) {
    if (startDate && endDate) {
      // check for overlapping ranges
      const query = `SELECT COUNT(*)::int as count FROM pavilion_bookings WHERE pavilion_id = $1 AND NOT ($3 <= start_date OR $2 >= end_date) AND status != 'cancelled'`;
      const result = await db.query(query, [pavilionId, startDate, endDate])
      return result.rows[0].count === 0
    }
    const query = `SELECT COUNT(*)::int as count FROM pavilion_bookings WHERE pavilion_id = $1 AND event_date = $2 AND status != 'cancelled'`;
    const result = await db.query(query, [pavilionId, eventDate])
    return result.rows[0].count === 0
  }

  static async create(pavilionId, eventName, clientName, clientContact, clientFacebook, eventDate, startDate, endDate, capacity, depositAmount, totalAmount, extras) {
    const id = uuidv4()
    const query = `
      INSERT INTO pavilion_bookings
      (id, pavilion_id, event_name, client_name, client_contact, client_facebook, event_date, start_date, end_date, capacity, deposit_amount, total_amount, extras, status, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending', NOW())
      RETURNING *;
    `
    const result = await db.query(query, [
      id,
      pavilionId,
      eventName,
      clientName,
      clientContact,
      clientFacebook || null,
      eventDate || null,
      startDate || null,
      endDate || null,
      capacity || 0,
      depositAmount || 0,
      totalAmount || 0,
      JSON.stringify(extras || []),
    ])
    return result.rows[0]
  }

  static async getAllByPavilion(pavilionId) {
    const query = 'SELECT * FROM pavilion_bookings WHERE pavilion_id = $1 ORDER BY created_at DESC'
    const result = await db.query(query, [pavilionId])
    return result.rows
  }

  static async getById(id) {
    const query = 'SELECT * FROM pavilion_bookings WHERE id = $1'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE pavilion_bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id, status])
    return result.rows[0]
  }

  static async update(id, pavilionId, eventName, clientName, clientContact, clientFacebook, eventDate, startDate, endDate, capacity, depositAmount, totalAmount, extras, status) {
    const query = `
      UPDATE pavilion_bookings
      SET pavilion_id = $2,
          event_name = $3,
          client_name = $4,
          client_contact = $5,
          client_facebook = $6,
          event_date = $7,
          start_date = $8,
          end_date = $9,
          capacity = $10,
          deposit_amount = $11,
          total_amount = $12,
          extras = $13,
          status = $14,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `
    const result = await db.query(query, [
      id,
      pavilionId,
      eventName,
      clientName,
      clientContact,
      clientFacebook || null,
      eventDate || null,
      startDate || null,
      endDate || null,
      capacity || 0,
      depositAmount || 0,
      totalAmount || 0,
      JSON.stringify(extras || []),
      status || 'pending',
    ])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM pavilion_bookings WHERE id = $1'
    await db.query(query, [id])
    return { deleted: true }
  }
}

module.exports = PavilionBooking
