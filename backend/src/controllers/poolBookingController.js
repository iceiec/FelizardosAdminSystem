const PoolBooking = require('../models/PoolBooking')

const toDTO = (booking) => ({
  id: booking.id,
  poolId: booking.pool_id,
  eventName: booking.event_name,
  clientName: booking.client_name,
  clientContact: booking.client_contact,
  clientFacebook: booking.client_facebook,
  eventDate: booking.event_date,
  capacity: Number(booking.capacity || 0),
  depositAmount: Number(booking.deposit_amount || 0),
  totalAmount: Number(booking.total_amount || 0),
  extras: Array.isArray(booking.extras) ? booking.extras : booking.extras ? JSON.parse(booking.extras) : [],
  status: booking.status || 'pending',
  createdAt: booking.created_at,
  updatedAt: booking.updated_at,
})

exports.getByPool = async (req, res, next) => {
  try {
    const { poolId } = req.query
    if (!poolId) return res.status(400).json({ error: 'poolId query param required' })
    const rows = await PoolBooking.getAllByPool(poolId)
    return res.json(rows.map(toDTO))
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const booking = await PoolBooking.getById(req.params.id)
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    return res.json(toDTO(booking))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras } = req.body
    if (!poolId || !eventName || !eventDate || !clientName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const created = await PoolBooking.create(poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras)
    return res.status(201).json(toDTO(created))
  } catch (err) {
    next(err)
  }
}

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const updated = await PoolBooking.updateStatus(req.params.id, status)
    if (!updated) return res.status(404).json({ error: 'Booking not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras, status } = req.body
    if (!poolId || !eventName || !eventDate || !clientName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const updated = await PoolBooking.update(req.params.id, poolId, eventName, clientName, clientContact, clientFacebook, eventDate, capacity, depositAmount, totalAmount, extras, status)
    if (!updated) return res.status(404).json({ error: 'Booking not found' })
    return res.json(toDTO(updated))
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await PoolBooking.delete(req.params.id)
    return res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}
