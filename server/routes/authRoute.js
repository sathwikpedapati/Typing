const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// POST route for signup
router.post('/signup', authController.signup);

// POST route for login
router.post('/login', authController.login);

module.exports = router;
