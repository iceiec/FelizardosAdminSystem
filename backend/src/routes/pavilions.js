const express = require('express');
const router = express.Router();
const pavilionController = require('../controllers/pavilionController'); // adjust name if file renamed
const auth = require('../middleware/auth');

router.get('/', pavilionController.getAll);
router.get('/:id', pavilionController.getById);

// Protected routes
router.post('/', auth, pavilionController.create);
router.put('/:id', auth, pavilionController.update);
router.delete('/:id', auth, pavilionController.delete);

module.exports = router;