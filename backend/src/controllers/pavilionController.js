const Pavilion = require('../models/Pavilion');

const toDTO = (p) => ({
  id: p.id,
  name: p.name,
  capacity: Number(p.capacity),
  location: p.location,
  hourlyRate: p.hourly_rate !== undefined && p.hourly_rate !== null ? Number(p.hourly_rate) : null,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
})

exports.getAll = async (req, res, next) => {
  try {
    const pavilions = await Pavilion.getAll();
    return res.json((pavilions || []).map(toDTO));
  } catch (err) {
    next(err);
  }
}

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params
    const p = await Pavilion.getById(id)
    if (!p) return res.status(404).json({ error: 'Pavilion not found' })
    return res.json(toDTO(p))
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const { name, capacity, location, hourlyRate } = req.body
    if (!name || capacity == null) return res.status(400).json({ error: 'Name and capacity required' })
    const capNum = Number(capacity)
    if (Number.isNaN(capNum) || capNum <= 0) return res.status(400).json({ error: 'Invalid capacity' })
    const hr = hourlyRate != null ? Number(hourlyRate) : null
    if (hourlyRate != null && Number.isNaN(hr)) return res.status(400).json({ error: 'Invalid hourlyRate' })

    const created = await Pavilion.create(name, capNum, location || null, hr)
    return res.status(201).json(toDTO(created))
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, capacity, location, hourlyRate } = req.body
    const capNum = capacity != null ? Number(capacity) : null
    const hr = hourlyRate != null ? Number(hourlyRate) : null
    const updated = await Pavilion.update(id, name, capNum, location, hr)
    if (!updated) return res.status(404).json({ error: 'Pavilion not found' })
    return res.json(toDTO(updated))
  } catch (err) { next(err) }
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    await Pavilion.delete(id)
    return res.json({ deleted: true })
  } catch (err) { next(err) }
}