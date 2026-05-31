const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/pavilionBookingController')
const auth = require('../middleware/auth')

router.get('/', bookingController.getByPavilion)
router.get('/:id', bookingController.getById)

router.post('/', auth, bookingController.create)
router.put('/:id', auth, bookingController.update)
router.put('/:id/status', auth, bookingController.updateStatus)
router.delete('/:id', auth, bookingController.delete)

module.exports = router
