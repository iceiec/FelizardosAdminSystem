const db = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class MaintenanceTask {
  static async create(title, location, priority, status, assignee, dueDate, description = null) {
    const id = uuidv4()
    const query = `
      INSERT INTO maintenance_tasks (id, title, location, priority, status, assignee, due_date, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `
    const result = await db.query(query, [id, title, location, priority, status, assignee, dueDate, description])
    return result.rows[0]
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM maintenance_tasks ORDER BY created_at DESC')
    return result.rows
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM maintenance_tasks WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id, title, location, priority, status, assignee, dueDate, description = null) {
    const query = `
      UPDATE maintenance_tasks
      SET title = $2, location = $3, priority = $4, status = $5, assignee = $6, due_date = $7, description = $8, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await db.query(query, [id, title, location, priority, status, assignee, dueDate, description])
    return result.rows[0]
  }

  static async delete(id) {
    await db.query('DELETE FROM maintenance_tasks WHERE id = $1', [id])
    return { deleted: true }
  }
}

module.exports = MaintenanceTask