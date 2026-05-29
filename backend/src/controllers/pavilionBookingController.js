const PavilionBooking = require('../models/PavilionBooking')
const { validate: validateUuid } = require('uuid')

const toDateOnly = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value.slice(0, 10)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

exports.create = async (req, res, next) => {
  try {
    const {
      pavilionId,
      eventName,
      date,
      startDate,
      endDate,
      clientName,
      clientContact,
      clientFacebook,
      capacity,
      depositAmount,
      totalAmount,
      extras,
    } = req.body
    if (!pavilionId || !eventName || !(date || (startDate && endDate)) || !clientName)
      return res.status(400).json({ error: 'Missing required fields' })

    const normalizedDate = toDateOnly(date)
    const normalizedStartDate = startDate ? new Date(startDate).toISOString() : null
    const normalizedEndDate = endDate ? new Date(endDate).toISOString() : null

    const available = await PavilionBooking.isAvailable(pavilionId, normalizedDate, normalizedStartDate, normalizedEndDate)
    if (!available) return res.status(409).json({ error: 'Pavilion not available on selected date/range' })

    const created = await PavilionBooking.create(
      pavilionId,
      eventName,
      clientName,
      clientContact,
      clientFacebook,
      normalizedDate,
      normalizedStartDate,
      normalizedEndDate,
      capacity || 0,
      depositAmount || 0,
      totalAmount || 0,
      extras || []
    )
    return res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

exports.getByPavilion = async (req, res, next) => {
  try {
    const { pavilionId } = req.query
    if (!pavilionId) return res.status(400).json({ error: 'pavilionId query param required' })
    if (!validateUuid(pavilionId)) return res.status(400).json({ error: 'Invalid pavilionId' })
    const rows = await PavilionBooking.getAllByPavilion(pavilionId)
    return res.json(rows)
  } catch (err) { next(err) }
}

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params
    const b = await PavilionBooking.getById(id)
    if (!b) return res.status(404).json({ error: 'Booking not found' })
    return res.json(b)
  } catch (err) { next(err) }
}

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const updated = await PavilionBooking.updateStatus(id, status)
    return res.json(updated)
  } catch (err) { next(err) }
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    await PavilionBooking.delete(id)
    return res.json({ deleted: true })
  } catch (err) { next(err) }
}
