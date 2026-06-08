const PavilionBooking = require('../models/PavilionBooking')

const toDateOnly = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value.slice(0, 10)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

const toDTO = (booking) => ({
  id: booking.id,
  pavilionId: booking.pavilion_id,
  eventName: booking.event_name,
  clientName: booking.client_name,
  clientContact: booking.client_contact,
  clientFacebook: booking.client_facebook,
  eventDate: booking.event_date,
  startDate: booking.start_date,
  endDate: booking.end_date,
  capacity: Number(booking.capacity || 0),
  depositAmount: Number(booking.deposit_amount || 0),
  totalAmount: Number(booking.total_amount || 0),
  extras: Array.isArray(booking.extras) ? booking.extras : booking.extras ? JSON.parse(booking.extras) : [],
  status: booking.status || 'pending',
  createdAt: booking.created_at,
  updatedAt: booking.updated_at,
})

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
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.getByPavilion = async (req, res, next) => {
  try {
    const { pavilionId } = req.query
    if (!pavilionId) return res.status(400).json({ error: 'pavilionId query param required' })
    const rows = await PavilionBooking.getAllByPavilion(pavilionId)
    return res.json(rows.map(toDTO))
  } catch (err) { next(err) }
}

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params
    const b = await PavilionBooking.getById(id)
    if (!b) return res.status(404).json({ error: 'Booking not found' })
    return res.json(toDTO(b))
  } catch (err) { next(err) }
}

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const updated = await PavilionBooking.updateStatus(id, status)
    return res.json(toDTO(updated))
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
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
      status,
    } = req.body

    if (!pavilionId || !eventName || !clientName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const normalizedDate = toDateOnly(date)
    const normalizedStartDate = startDate ? new Date(startDate).toISOString() : null
    const normalizedEndDate = endDate ? new Date(endDate).toISOString() : null

    const updated = await PavilionBooking.update(
      req.params.id,
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
      extras || [],
      status || 'pending'
    )

    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    await PavilionBooking.delete(id)
    return res.json({ deleted: true })
  } catch (err) { next(err) }
}
