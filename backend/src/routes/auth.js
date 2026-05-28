const express = require('express');
const router = express.Router();
const auth = require('../controllers/authControllers');

//register and login route
router.post('/register', auth.register);
router.post('/login', auth.login);

module.exports = router;