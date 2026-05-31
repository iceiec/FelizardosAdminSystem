const express = require('express')
const router = express.Router()
const controller = require('../controllers/poolBookingController')
const auth = require('../middleware/auth')

router.get('/', controller.getByPool)
router.get('/:id', controller.getById)
router.post('/', auth, controller.create)
router.put('/:id', auth, controller.update)
router.put('/:id/status', auth, controller.updateStatus)
router.delete('/:id', auth, controller.delete)

module.exports = router
