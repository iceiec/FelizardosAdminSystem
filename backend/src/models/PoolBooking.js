const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class PoolBooking {
  static async create(poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras) {
    const id = uuidv4()
    const query = `
      INSERT INTO pool_bookings
      (id, pool_id, event_name, client_name, client_contact, client_facebook, event_date, capacity, deposit_amount, total_amount, extras, status, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending', NOW(), NOW())
      RETURNING *
    `
    const result = await db.query(query, [
      id,
      poolId,
      eventName,
      clientName,
      clientContact || null,
      clientFacebook || null,
      eventDate,
      capacity || 0,
      depositAmount || 0,
      totalAmount || 0,
      JSON.stringify(extras || []),
    ])
    return result.rows[0]
  }

  static async getAllByPool(poolId) {
    const result = await db.query('SELECT * FROM pool_bookings WHERE pool_id = $1 ORDER BY created_at DESC', [poolId])
    return result.rows
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM pool_bookings WHERE id = $1', [id])
    return result.rows[0]
  }

  static async updateStatus(id, status) {
    const result = await db.query('UPDATE pool_bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *', [id, status])
    return result.rows[0]
  }

  static async update(id, poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras, status) {
    const query = `
      UPDATE pool_bookings
      SET pool_id = $2,
          event_name = $3,
          client_name = $4,
          client_contact = $5,
          client_facebook = $6,
          event_date = $7,
          capacity = $8,
          deposit_amount = $9,
          total_amount = $10,
          extras = $11,
          status = $12,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await db.query(query, [
      id,
      poolId,
      eventName,
      clientName,
      clientContact || null,
      clientFacebook || null,
      eventDate,
      capacity || 0,
      depositAmount || 0,
      totalAmount || 0,
      JSON.stringify(extras || []),
      status || 'pending',
    ])
    return result.rows[0]
  }

  static async delete(id) {
    await db.query('DELETE FROM pool_bookings WHERE id = $1', [id])
    return { deleted: true }
  }
}

module.exports = PoolBooking
