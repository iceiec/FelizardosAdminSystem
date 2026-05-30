const MaintenanceTask = require('../models/MaintenanceTask')

const toDTO = (task) => ({
  id: task.id,
  title: task.title,
  location: task.location,
  priority: task.priority,
  status: task.status,
  assignee: task.assignee,
  dueDate: task.due_date,
  description: task.description,
  createdAt: task.created_at,
  updatedAt: task.updated_at,
})

exports.getAll = async (req, res, next) => {
  try {
    const tasks = await MaintenanceTask.getAll()
    return res.json((tasks || []).map(toDTO))
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const task = await MaintenanceTask.getById(req.params.id)
    if (!task) return res.status(404).json({ error: 'Maintenance task not found' })
    return res.json(toDTO(task))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { title, location, priority, status, assignee, dueDate, description } = req.body
    if (!title || !location || !priority || !status || !assignee || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const created = await MaintenanceTask.create(title, location, priority, status, assignee, dueDate, description || null)
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { title, location, priority, status, assignee, dueDate, description } = req.body
    const updated = await MaintenanceTask.update(req.params.id, title, location, priority, status, assignee, dueDate, description || null)
    if (!updated) return res.status(404).json({ error: 'Maintenance task not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await MaintenanceTask.delete(req.params.id)
    return res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}