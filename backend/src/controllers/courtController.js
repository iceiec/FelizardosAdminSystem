const Court = require('../models/Court')

const toDTO = (court) => ({
  id: court.id,
  name: court.name,
  surface: court.surface,
  status: court.status || 'available',
  nextBooking: court.next_booking || null,
  createdAt: court.created_at,
  updatedAt: court.updated_at,
})

exports.getAll = async (req, res, next) => {
  try {
    const courts = await Court.getAll()
    return res.json((courts || []).map(toDTO))
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const court = await Court.getById(req.params.id)
    if (!court) return res.status(404).json({ error: 'Court not found' })
    return res.json(toDTO(court))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, surface, status, nextBooking } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    // Use default surface if not provided
    const surfaceValue = surface || 'Court'
    const created = await Court.create(name, surfaceValue, status || 'available', nextBooking || null)
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { name, surface, status, nextBooking } = req.body
    // Get existing court to fill in unspecified fields
    const existing = await Court.getById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Court not found' })
    
    const updated = await Court.update(
      req.params.id,
      name || existing.name,
      surface || existing.surface,
      status || existing.status,
      nextBooking || existing.next_booking
    )
    if (!updated) return res.status(404).json({ error: 'Court not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await Court.delete(req.params.id)
    return res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}