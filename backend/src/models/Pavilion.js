const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Pavilion {
  // Create (INSERT)
  static async create(name, capacity, location, hourlyRate, status = 'active') {
    const id = uuidv4();
    const query = `
      INSERT INTO pavilions (id, name, capacity, location, status, hourly_rate, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, capacity, location, status, hourly_rate, created_at, updated_at;
    `;
    const result = await db.query(query, [id, name, capacity, location, status, hourlyRate]);
    return result.rows[0];
  }

  // Read All (SELECT)
  static async getAll() {
    const query = `
      SELECT
        p.*,
        COALESCE(bookings.booking_count, 0)::int AS events,
        bookings.last_event_date AS last_event
      FROM pavilions p
      LEFT JOIN (
        SELECT pavilion_id, COUNT(*) AS booking_count, MAX(event_date) AS last_event_date
        FROM pavilion_bookings
        WHERE status <> 'cancelled'
        GROUP BY pavilion_id
      ) bookings ON bookings.pavilion_id = p.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Read One (SELECT WHERE)
  static async getById(id) {
    const query = `
      SELECT
        p.*,
        COALESCE(bookings.booking_count, 0)::int AS events,
        bookings.last_event_date AS last_event
      FROM pavilions p
      LEFT JOIN (
        SELECT pavilion_id, COUNT(*) AS booking_count, MAX(event_date) AS last_event_date
        FROM pavilion_bookings
        WHERE status <> 'cancelled'
        GROUP BY pavilion_id
      ) bookings ON bookings.pavilion_id = p.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Update (UPDATE)
  static async update(id, name, capacity, location, hourlyRate, status = 'active') {
    const query = `
      UPDATE pavilions
      SET name = $2, capacity = $3, location = $4, hourly_rate = $5, status = $6, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, capacity, location, status, hourly_rate, created_at, updated_at;
    `;
    const result = await db.query(query, [id, name, capacity, location, hourlyRate, status]);
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