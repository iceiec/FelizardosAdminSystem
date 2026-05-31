const express = require('express')
const router = express.Router()
const controller = require('../controllers/courtScheduleController')
const auth = require('../middleware/auth')

router.get('/', controller.getByCourt)
router.get('/:id', controller.getById)
router.post('/', auth, controller.create)
router.put('/:id', auth, controller.update)
router.delete('/:id', auth, controller.delete)

module.exports = router
