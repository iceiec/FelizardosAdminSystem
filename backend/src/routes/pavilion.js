const express = require('express')
const router = express.Router()
const pavilionController = require('../controllers/pavilionController')
const auth = require('../middleware/auth')
const pavilionBookingsRouter = require('./pavilionBookings')

// Public routes
router.get('/', pavilionController.getAll)

// Booking routes first so /bookings doesn't match the :id route below
router.use('/bookings', pavilionBookingsRouter)

router.get('/:id', pavilionController.getById)

// Protected routes
router.post('/', auth, pavilionController.create)
router.put('/:id', auth, pavilionController.update)
router.delete('/:id', auth, pavilionController.delete)

module.exports = router
