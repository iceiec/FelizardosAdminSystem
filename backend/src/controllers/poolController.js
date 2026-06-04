const Pool = require('../models/Pool')

const normalizeStatus = (status) => {
  if (!status) return 'open'
  if (status === 'operational') return 'open'
  return status
}

const toDTO = (pool) => ({
  id: pool.id,
  name: pool.name,
  size: pool.size,
  depth: pool.depth,
  capacity: Number(pool.capacity),
  status: pool.status || 'open',
  temperature: pool.temperature != null ? Number(pool.temperature) : null,
  lastCleaned: pool.last_cleaned || null,
  createdAt: pool.created_at,
  updatedAt: pool.updated_at,
})

exports.getAll = async (req, res, next) => {
  try {
    const pools = await Pool.getAll()
    return res.json((pools || []).map(toDTO))
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const pool = await Pool.getById(req.params.id)
    if (!pool) return res.status(404).json({ error: 'Pool not found' })
    return res.json(toDTO(pool))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, size, depth, capacity, status, temperature, lastCleaned } = req.body
    if (!name || !size || !depth || capacity == null) {
      return res.status(400).json({ error: 'Name, size, depth and capacity are required' })
    }

    const capacityValue = Number(capacity)
    if (Number.isNaN(capacityValue) || capacityValue <= 0) {
      return res.status(400).json({ error: 'Invalid capacity' })
    }

    const temperatureValue = temperature != null && temperature !== '' ? Number(temperature) : null
    if (temperatureValue != null && Number.isNaN(temperatureValue)) {
      return res.status(400).json({ error: 'Invalid temperature' })
    }

    const created = await Pool.create(
      name,
      size,
      depth,
      capacityValue,
      normalizeStatus(status),
      temperatureValue,
      lastCleaned || null,
    )
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { name, size, depth, capacity, status, temperature, lastCleaned } = req.body
    const capacityValue = capacity != null ? Number(capacity) : null
    const temperatureValue = temperature != null && temperature !== '' ? Number(temperature) : null
    const updated = await Pool.update(
      req.params.id,
      name,
      size,
      depth,
      capacityValue,
      normalizeStatus(status),
      temperatureValue,
      lastCleaned || null,
    )
    if (!updated) return res.status(404).json({ error: 'Pool not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await Pool.delete(req.params.id)
    return res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}