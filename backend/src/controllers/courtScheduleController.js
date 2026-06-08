const CourtSchedule = require('../models/CourtSchedule')
const { validate: isUUID } = require('uuid')

const toDTO = (schedule) => ({
  id: schedule.id,
  courtId: schedule.court_id,
  date: schedule.date,
  timeSlot: schedule.time_slot,
  clientName: schedule.client_name,
  clientContact: schedule.client_contact,
  depositAmount: Number(schedule.deposit_amount || 0),
  totalAmount: Number(schedule.total_amount || 0),
  status: schedule.status || 'pending',
  createdAt: schedule.created_at,
  updatedAt: schedule.updated_at,
})

exports.getByCourt = async (req, res, next) => {
  try {
    const { courtId } = req.query
    if (!courtId) return res.status(400).json({ error: 'courtId query param required' })
    if (!isUUID(courtId)) return res.status(400).json({ error: 'courtId must be a valid UUID' })
    const rows = await CourtSchedule.getAllByCourt(courtId)
    return res.json(rows.map(toDTO))
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const schedule = await CourtSchedule.getById(req.params.id)
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' })
    return res.json(toDTO(schedule))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount } = req.body
    if (!courtId || !date || !timeSlot || !clientName || !clientContact) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const created = await CourtSchedule.create(courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount)
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount, status } = req.body
    const updated = await CourtSchedule.update(req.params.id, courtId, date, timeSlot, clientName, clientContact, depositAmount, totalAmount, status)
    if (!updated) return res.status(404).json({ error: 'Schedule not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await CourtSchedule.delete(req.params.id)
    return res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}
